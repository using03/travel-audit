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
  Card,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styles from "./travelAudit.module.scss";
import {
  adminLoginService,
  adminLogoutService,
  checkAdminAuthStatus,
} from "../services/admin";
import TravelogueDetail from "../components/TravelogueDetail";
import {
  deleteTravelogue,
  getTravelogueDetail,
  getTravelogueList,
  updateTravelogueStatus,
} from "../services/travelogue";
import { ColumnsType } from "antd/es/table";
const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;
const { TextArea } = Input;
// // 将时间戳格式化为"年-月-日"格式的函数
// function formatDate(timestamp: string) {
//   const date = new Date(+timestamp);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }

const TravelAudit: FC = () => {
  const columns: ColumnsType<TableRecord> = [
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
      render: (text: string) => {
        if (text === "待审核") {
          return (
            <Space>
              <ClockCircleOutlined style={{ color: "orange" }} />
              待审核
            </Space>
          );
        } else if (text === "已通过") {
          return (
            <Space>
              <CheckCircleOutlined style={{ color: "green" }} />
              已通过
            </Space>
          );
        } else if (text === "未通过") {
          return (
            <Space>
              <CloseCircleOutlined style={{ color: "red" }} />
              未通过
            </Space>
          );
        }
        return text;
      },
      onFilter: (value: string, record: TableRecord) => {
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
    // {
    //   title: "申请日期",
    //   dataIndex: "applyDate",
    //   key: "applyDate",
    //   render: (text: string) => formatDate(text),
    //   sorter: (a: TableRecord, b: TableRecord) =>
    //     Number(a.applyDate) - Number(b.applyDate),
    //   sortDirections: ["descend", "ascend"],
    // },
    {
      title: "游记详情以及操作",
      dataIndex: "action",
      key: "action",
      render: (_: unknown, record: TableRecord) => {
        const { travelID, status } = record;
        return (
          <Space>
            <Button
              color="primary"
              variant="filled"
              size="small"
              onClick={() => {
                setModalTitle(`审核`);

                handleReview(travelID);
                showModal();
              }}
              disabled={status !== "待审核"}
            >
              进入审核
            </Button>
            {adminInfo.role === "管理员" && (
              <Popconfirm
                title="确定要删除这篇游记吗？"
                onConfirm={() => handleDelete(travelID)}
                okText="确定"
                cancelText="取消"
              >
                <Button icon={<DeleteOutlined />} size="small">
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];
  // const dataSource = [
  //   {
  //     key: "1",
  //     status: "待审核",
  //     reviewID: 1,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 1,
  //     travelTitle: "西湖游记",
  //     travelContent: "西湖游记",
  //     applyDate: "1735689600000", //2025-01-01
  //     action: "",
  //   },
  //   {
  //     key: "2",
  //     status: "已通过",
  //     reviewID: 2,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 2,
  //     travelTitle: "西湖游记2",
  //     travelContent: "西湖游记2",
  //     applyDate: "1672531200000", //2023-01-01
  //     action: "",
  //   },

  //   {
  //     key: "3",
  //     status: "待审核",
  //     reviewID: 3,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 3,
  //     travelTitle: "西湖游记",
  //     travelContent: "西湖游记",
  //     applyDate: "1735689600000", //2025-01-01
  //     action: "",
  //   },
  //   {
  //     key: "4",
  //     status: "已通过",
  //     reviewID: 4,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 4,
  //     travelTitle: "西湖游记2",
  //     travelContent: "西湖游记2",
  //     applyDate: "1672531200000", //2023-01-01
  //     action: "",
  //   },
  //   {
  //     key: "5",
  //     status: "未通过",
  //     reviewID: 5,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 5,
  //     travelTitle: "西湖游记",
  //     travelContent: "西湖游记",
  //     applyDate: "1609459200000", //2021-01-01
  //     action: "",
  //   },
  //   {
  //     key: "6",
  //     status: "待审核",
  //     reviewID: 6,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 6,
  //     travelTitle: "西湖游记",
  //     travelContent: "西湖游记",
  //     applyDate: "1735689600000", //2025-01-01
  //     action: "",
  //   },
  //   {
  //     key: "7",
  //     status: "已通过",
  //     reviewID: 7,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 7,
  //     travelTitle: "西湖游记2",
  //     travelContent: "西湖游记2",
  //     applyDate: "1672531200000", //2023-01-01
  //     action: "",
  //   },
  //   {
  //     key: "8",
  //     status: "未通过",
  //     reviewID: 8,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 8,
  //     travelTitle: "西湖游记",
  //     travelContent: "西湖游记",
  //     applyDate: "1609459200000", //2021-01-01
  //     action: "",
  //   },
  //   {
  //     key: "9",
  //     status: "待审核",
  //     reviewID: 9,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 9,
  //     travelTitle: "西湖游记",
  //     travelContent: "西湖游记",
  //     applyDate: "1735689600000", //2025-01-01
  //     action: "",
  //   },
  //   {
  //     key: "10",
  //     status: "已通过",
  //     reviewID: 10,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 10,
  //     travelTitle: "西湖游记2",
  //     travelContent: "西湖游记2",
  //     applyDate: "1672531200000", //2023-01-01
  //     action: "",
  //   },
  //   {
  //     key: "11",
  //     status: "未通过",
  //     reviewID: 11,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 11,
  //     travelTitle: "西湖游记",
  //     travelContent: "西湖游记",
  //     applyDate: "1609459200000", //2021-01-01
  //     action: "",
  //   },
  //   {
  //     key: "12",
  //     status: "未通过",
  //     reviewID: 12,
  //     authorID: 1,
  //     authorName: "张三",
  //     travelID: 12,
  //     travelTitle: "西湖游记",
  //     travelContent: "西湖游记",
  //     applyDate: "1609459200000", //2021-01-01
  //     action: "",
  //   },
  // ];
  const SearchForm: React.FC = () => {
    const [form] = Form.useForm();

    const onSearchSubmit = () => {
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
        element: <Input />,
      },
      {
        label: "游记ID",
        name: "travelID",
        element: <Input />,
      },
      {
        label: "作者ID",
        name: "authorID",
        element: <Input />,
      },
      {
        label: "作者昵称",
        name: "authorName",
        element: <Input />,
      },
      {
        label: "游记标题",
        name: "travelTitle",
        element: <Input />,
      },
      {
        // 标记为按钮
        isButton: true,
        element: (
          <Button type="primary" onClick={onSearchSubmit}>
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
              <Col key={item.name} span={item.name === "status" ? 6 : 3}>
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
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfoType>(INIT_STATE);
  const [modalTitle, setModalTitle] = useState<string>("this is a title");
  const [modalContent, setModalContent] = useState<string>("显示失败");
  const [rejectReason, setRejectReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [currentTravelogue, setCurrentTravelogue] = useState<Travelogue>();
  const [dataSource, setDataSource] = useState<TableRecord[]>([]);

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

  // 进入审核按钮的点击事件
  const handleReview = async (travelID: number) => {
    try {
      const data = await getTravelogueDetail(travelID);
      console.log("游记详情", data);
      setCurrentTravelogue(data);
      setModalTitle("审核游记");
      setModalContent("detail");
      showModal();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "获取游记详情失败",
      });
      console.log("获取游记详情失败", error);
    }
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
            className={styles.centeredForm}
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
      case "detail":
        return currentTravelogue ? (
          <TravelogueDetail travelogue={currentTravelogue} />
        ) : (
          <div>加载中...</div>
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
        const { adminInfo } = response as unknown as {
          adminInfo: {
            adminname: string;
            role: string;
          };
        };
        setAdminInfo({
          adminname: adminInfo.adminname,
          role: adminInfo.role,
        });
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

  const acceptTravelogue = async () => {
    if (!currentTravelogue) return;

    setLoading(true);
    try {
      await updateTravelogueStatus(currentTravelogue.id, 1);
      setIsModalOpen(false);
      setRejectReason("");
      messageApi.open({
        type: "success",
        content: "成功通过游记",
      });
      // 刷新列表
      fetchTravelogues();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "操作失败",
      });
      console.log("操作失败, error:", error);
    } finally {
      setLoading(false);
    }
  };
  const rejectTravelogue = async () => {
    if (!currentTravelogue) return;

    setLoading(true);
    try {
      await updateTravelogueStatus(currentTravelogue.id, 2, rejectReason);
      setIsModalOpen(false);
      setRejectReason("");
      messageApi.open({
        type: "success",
        content: "成功拒绝游记",
      });
      // 刷新列表
      fetchTravelogues();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "操作失败",
      });
      console.log("操作失败, error:", error);
    } finally {
      setLoading(false);
    }
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

  // 添加删除处理函数
  const handleDelete = async (travelID: number) => {
    setLoading(true);
    try {
      await deleteTravelogue(travelID);
      messageApi.open({
        type: "success",
        content: "删除成功",
      });
      // 刷新列表
      fetchTravelogues();
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "删除失败",
      });
      console.log("删除失败, error:", error);
    } finally {
      setLoading(false);
    }
  };
  // 获取游记列表
  const fetchTravelogues = async () => {
    setLoading(true);
    try {
      const data = await getTravelogueList();
      // console.log("游记列表", data);
      setDataSource(
        data.map((item: Travelogue) => ({
          key: item.id,
          status:
            item.status === 0
              ? "待审核"
              : item.status === 1
              ? "已通过"
              : "未通过",
          reviewID: item.id,
          authorID: item.author,
          authorName: item.author,
          travelID: item.id,
          travelTitle: item.title,
          travelContent: item.desc,
          applyDate: item.applyDate || new Date().getTime(),
          action: "",
        }))
      );
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "获取游记列表失败",
      });
      console.log("获取游记列表失败", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 检查初始登录状态
    checkAuthStatus();
    // 获取游记列表
    fetchTravelogues();
    document.title = "旅游日记平台审核管理系统";
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
          <div className={styles.searchForm}>
            <Card variant="borderless" styles={{ body: { padding: "10px" } }}>
              <SearchForm />
            </Card>
          </div>
          <div className={styles.tableContainer}>
            <Card>
              <Table dataSource={dataSource} columns={columns} sticky={true} />
            </Card>
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
                  title="不通过原因(必填）"
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
        <div className={styles.modalBody}>{renderModalPage()}</div>
      </Modal>
    </>
  );
};

//原始的游记数据
interface Travelogue {
  id: number;
  title: string;
  desc: string;
  author: string;
  imglist: string[];
  avatar: string;
  views: number;
  status: number;
  reason: string;
  isdeleted: boolean;
  applyDate?: Date;
}

//表格中每一行的数据结构
interface TableRecord {
  key: number;
  status: string;
  reviewID: number;
  authorID: string;
  authorName: string;
  travelID: number;
  travelTitle: string;
  travelContent: string;
  action: string;
  applyDate?: number;
}
type AdminInfoType = {
  adminname: string;
  role: string;
};
const INIT_STATE: AdminInfoType = {
  adminname: "",
  role: "",
};
export default TravelAudit;
