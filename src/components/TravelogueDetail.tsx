import React from "react";
import { Card, Typography, Image, Space } from "antd";
import styles from "./TravelogueDetail.module.scss";

const { Title, Paragraph } = Typography;

interface TravelogueDetailProps {
  travelogue: {
    id: number;
    title: string;
    desc: string;
    author: string;
    imglist: string[];
    avatar: string;
    views: number;
    status: number;
    reason: string;
  };
}

const TravelogueDetail: React.FC<TravelogueDetailProps> = ({ travelogue }) => {
  // 处理图片路径
  const getImageUrl = (path: string) => {
    // 如果已经是完整的 URL，直接返回
    if (path.startsWith("http")) {
      return path;
    }
    // 从小程序路径转换为可访问的URL
    const imageName = path.split("/").pop(); // 获取图片文件名
    return `http://localhost:5000/api/images/${imageName}`;
  };

  return (
    <div className={styles.detailContainer}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div className={styles.header}>
            <Title level={3}>{travelogue.title}</Title>
            <div className={styles.authorInfo}>
              <Image
                src={getImageUrl(travelogue.avatar)}
                alt="作者头像"
                className={styles.avatar}
                preview={false}
              />
              <span>作者：{travelogue.author}</span>
            </div>
          </div>

          <div className={styles.imageGallery}>
            {travelogue.imglist.map((img, index) => (
              <Image
                key={index}
                src={getImageUrl(img)}
                alt={`游记图片 ${index + 1}`}
                className={styles.image}
                preview={{
                  src: getImageUrl(img),
                }}
              />
            ))}
          </div>

          <div className={styles.content}>
            <Paragraph>{travelogue.desc}</Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TravelogueDetail;
