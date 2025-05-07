import { FC, useEffect, useState } from "react";
import {
  Typography,
  Layout,
  Table,
  Space,
  Button,
  Form,
  Select,
  Modal,
  Input,
  Popconfirm,
  message,
  Col,
  Row,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./travelAudit.module.scss";
import {
  adminLoginService,
  adminLogoutService,
  checkAdminAuthStatus,
} from "../services/admin";
const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;
const { TextArea } = Input;
// 将时间戳格式化为"年-月-日"格式的函数
function formatDate(timestamp: string) {
  const date = new Date(+timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const TravelAudit: FC = () => {
  const columns = [
    {
      title: "状态",
      dataIndex: "status", // dataSource的键会与dataIndex匹配
      key: "status",
      filters: [
        {
          text: "待审核",
          value: "待审核",
        },
        {
          text: "已通过",
          value: "已通过",
        },
        {
          text: "未通过",
          value: "未通过",
        },
      ],
      onFilter: (value: string, record: any) => {
        return record.status === value;
      },
    },
    {
      title: "审核ID",
      dataIndex: "reviewID",
      key: "reviewID",
    },
    {
      title: "作者ID",
      dataIndex: "authorID",
      key: "authorID",
    },
    {
      title: "作者昵称",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "游记ID",
      dataIndex: "travelID",
      key: "travelID",
    },
    {
      title: "游记标题",
      dataIndex: "travelTitle",
      key: "travelTitle",
    },
    {
      title: "申请日期",
      dataIndex: "applyDate",
      key: "applyDate",
      render: (text: string) => formatDate(text),
      sorter: (a: any, b: any) => Number(a.applyDate) - Number(b.applyDate),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "游记详情以及操作",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => {
        const { travelID, travelTitle, status } = record;
        return (
          <Space>
            <Button
              color="primary"
              variant="filled"
              onClick={() => {
                setModalTitle(`审核`);
                setModalContent(
                  `这是一篇游记，游记id是${travelID}，游记标题是${travelTitle}`
                );
                showModal();
              }}
              disabled={status !== "待审核"}
            >
              进入审核
            </Button>
            {adminInfo.role === "管理员" && (
              <Button icon={<DeleteOutlined />}>删除</Button>
            )}
          </Space>
        );
      },
    },
  ];
  const dataSource = [
    {
      key: "1",
      status: "待审核",
      reviewID: 1,
      authorID: 1,
      authorName: "张三",
      travelID: 1,
      travelTitle: "西湖游记",
      travelContent: "西湖游记",
      applyDate: "1735689600000", //2025-01-01
      action: "",
    },
    {
      key: "2",
      status: "已通过",
      reviewID: 2,
      authorID: 1,
      authorName: "张三",
      travelID: 2,
      travelTitle: "西湖游记2",
      travelContent: "西湖游记2",
      applyDate: "1672531200000", //2023-01-01
      action: "",
    },
    {
      key: "3",
      status: "未通过",
      reviewID: 3,
      authorID: 1,
      authorName: "张三",
      travelID: 1,
      travelTitle: "西湖游记",
      travelContent: "西湖游记",
      applyDate: "1609459200000", //2021-01-01
      action: "",
    },
  ];
  const SearchForm: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = () => {
      console.log(form.getFieldsValue());
    };
    const [searchSelectedValues, setSearchSelectedValues] = useState([
      "待审核",
    ]);
    const handleSearchStatusChange = (values: string[]) => {
      setSearchSelectedValues(values);
      console.log("当前选中：", values);
    };
    const formItems = [
      {
        label: "状态",
        name: "status",
        element: (
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            defaultValue={["待审核"]}
            value={searchSelectedValues}
            onChange={(values) => {
              handleSearchStatusChange(values);
            }}
            options={[
              { label: "待审核", value: "待审核" },
              { label: "已通过", value: "已通过" },
              { label: "未通过", value: "未通过" },
            ]}
          />
        ),
      },
      {
        label: "审核ID",
        name: "reviewID",
        element: <Input placeholder="input placeholder" />,
      },
      {
        label: "游记ID",
        name: "travelID",
        element: <Input placeholder="input placeholder" />,
      },
      {
        label: "作者ID",
        name: "authorID",
        element: <Input placeholder="input placeholder" />,
      },
      {
        label: "作者昵称",
        name: "authorName",
        element: <Input placeholder="input placeholder" />,
      },
      {
        label: "游记标题",
        name: "travelTitle",
        element: <Input placeholder="input placeholder" />,
      },
      {
        // 标记为按钮
        isButton: true,
        element: (
          <Button type="primary" onClick={onFinish}>
            搜索
          </Button>
        ),
      },
    ];

    return (
      <Form
        layout={"horizontal"}
        form={form}
        //   onValuesChange={onFormLayoutChange}
        style={{ maxWidth: "none" }}
      >
        <Row gutter={16}>
          {formItems.map((item) => {
            if (item.isButton) {
              return (
                <Col key="submit-button">
                  <Form.Item>{item.element}</Form.Item>
                </Col>
              );
            }
            return (
              <Col key={item.name} span={6}>
                <Form.Item label={item.label} name={item.name}>
                  {item.element}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    );
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfoType>(INIT_STATE);
  const [modalTitle, setModalTitle] = useState("this is a title");
  const [modalContent, setModalContent] = useState("this is a example");
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 添加Form引用
  const [loginForm] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    // 未登录时不允许关闭模态窗
    if (!hasLoggedIn && modalContent === "loginForm") {
      return;
    }
    setIsModalOpen(false);
  };

  // 根据ModalContent字符串渲染实际内容
  const renderModalPage = () => {
    switch (modalContent) {
      case "loginForm":
        return (
          <Form
            form={loginForm}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, margin: 50 }}
            initialValues={{ remember: true }}
            autoComplete="on"
          >
            <Form.Item
              label="用户名"
              name="adminname"
              rules={[{ required: true, message: "请填写用户名" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请填写密码" }]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        );
      default:
        return modalContent;
    }
  };

  // 修改login函数，从表单获取数据
  const login = async () => {
    try {
      // 验证表单
      const values = await loginForm.validateFields();
      setLoading(true);

      try {
        const response = await adminLoginService(
          values.adminname,
          values.password
        );
        const { adminname, role } = response as unknown as AdminInfoType;
        setAdminInfo({ adminname, role });
        setHasLoggedIn(true);

        messageApi.open({
          type: "success",
          content: "已登录",
        });
        setIsModalOpen(false);
      } catch (error) {
        console.error("登录失败", error);
        messageApi.open({
          type: "error",
          content: `${error}`,
        });
      } finally {
        setLoading(false);
      }
    } catch (error) {
      // 表单验证失败
      console.error("表单验证失败", error);
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      await adminLogoutService();
      setHasLoggedIn(false);
      setAdminInfo(INIT_STATE);
      messageApi.open({
        type: "success",
        content: "已退出登录",
      });
      setModalTitle(`登录`);
      setModalContent(`loginForm`);
      showModal();
    } catch (error) {
      console.error("登出失败", error);
      messageApi.open({
        type: "error",
        content: "登出失败",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const { isAuthenticated, adminInfo } = await checkAdminAuthStatus();
      setHasLoggedIn(isAuthenticated);
      if (isAuthenticated && adminInfo) {
        setAdminInfo(adminInfo as unknown as AdminInfoType);
      } else {
        // 如果未登录，则打开登录模态窗
        setModalTitle(`登录`);
        setModalContent(`loginForm`);
        showModal();
      }
    } catch (error) {
      console.error("检查认证状态失败", error);
      // 发生错误时也打开登录模态窗
      setModalTitle(`登录`);
      setModalContent(`loginForm`);
      showModal();
    }
  };

  const acceptTravelogue = () => {
    console.log("已发送Post请求通过游记");
    setIsModalOpen(false);
    setRejectReason("");
    messageApi.open({
      type: "success",
      content: "成功提交通过",
    });
  };
  const rejectTravelogue = () => {
    console.log("已发送Post拒绝通过游记");
  };
  const confirmReject = () => {
    rejectTravelogue();
    setIsModalOpen(false);
    setRejectReason("");
    messageApi.open({
      type: "success",
      content: "成功提交拒绝",
    });
  };
  const cancelReject = () => {
    setRejectReason("");
  };

  // 检查初始登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <>
      {/* 全局提示 Message */}
      {contextHolder}

      <Layout>
        <Header className={styles.header}>
          <Title level={3} className={styles.left}>
            旅游日记平台审核管理系统
          </Title>
          {hasLoggedIn ? (
            <Space className={styles.right}>
              <span>
                {adminInfo.role}:{adminInfo.adminname}
              </span>
              <Button type="link" size="large" onClick={logout}>
                退出登录
              </Button>
            </Space>
          ) : (
            <Paragraph className={styles.right}>请登录</Paragraph>
          )}
        </Header>
        <Content className={styles.content}>
          {/* <Form
            // labelCol={{ span: 4 }}
            // wrapperCol={{ span: 14 }}
            layout="inline"
            style={{ maxWidth: "none" }}
            onFinish={onSearchFinish}
          >
            <Form.Item label="查找：" name="checkRule">
              <Select
                placeholder="选择一种条件"
                // onChange={onGenderChange}
                // allowClear
              >
                <Select.Option value="reviewID">审核ID</Select.Option>
                <Select.Option value="travelID">游记ID</Select.Option>
                <Select.Option value="authorID">作者ID</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="checkValue">
              <Input placeholder="填入信息" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form> */}
          <div className={styles.searchForm}>
            <SearchForm />
          </div>
          <div className={styles.tableContainer}>
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </Content>
      </Layout>

      <Modal
        title={modalTitle}
        open={isModalOpen}
        closable={hasLoggedIn || modalContent !== "loginForm"} // 未登录时不显示右上角关闭按钮
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={
          hasLoggedIn
            ? [
                <Button
                  key="accept"
                  type="primary"
                  loading={loading}
                  onClick={acceptTravelogue}
                >
                  通过
                </Button>,
                <Popconfirm
                  title="不通过原因"
                  description={
                    <TextArea
                      rows={6}
                      value={rejectReason}
                      onChange={(e) => {
                        setRejectReason(e.target.value);
                      }}
                    />
                  }
                  onConfirm={confirmReject}
                  onCancel={cancelReject}
                  // onOpenChange={cancelReject} //用户点击外部区域或其他方式关闭弹窗
                  okText="提交拒绝"
                  okButtonProps={{
                    disabled: !rejectReason.trim(), // 当rejectReason为空或只有空格时禁用
                  }}
                  cancelText="取消"
                >
                  <Button
                    key="reject"
                    color="danger"
                    variant="solid"
                    // loading={loading}
                  >
                    不通过
                  </Button>
                </Popconfirm>,
              ]
            : [
                <Button
                  key="login"
                  type="primary"
                  loading={loading}
                  onClick={login}
                >
                  登录
                </Button>,
              ]
        }
      >
        <div>{renderModalPage()}</div>
      </Modal>
    </>
  );
};

type AdminInfoType = {
  adminname: string;
  role: string;
};
const INIT_STATE: AdminInfoType = {
  adminname: "",
  role: "",
};
export default TravelAudit;
