"use client";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  HistoryOutlined,
  LinkOutlined,
  PaperClipOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import type { ProjectOperation, TenderAttachment, TenderProject } from "@/types/dashboard/tender";

const { Title, Text } = Typography;

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<TenderProject | null>(null);
  const [operations, setOperations] = useState<ProjectOperation[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<TenderProject[]>([]);

  useEffect(() => {
    // 模拟获取项目详情
    setTimeout(() => {
      const mockProject: TenderProject = {
        id: params.id as string,
        title: "某市政府办公楼建设项目",
        projectNumber: "TN2024001",
        status: "bidding",
        publishDate: "2024-01-10",
        deadline: "2024-01-25",
        budget: 5000000,
        category: "建筑工程",
        description: "新建办公楼项目，总建筑面积约8000平方米，包含主体建筑、配套设施、绿化工程等。项目位于市中心，交通便利，周边配套设施完善。",
        attachments: [
          {
            id: "1",
            name: "招标文件.pdf",
            url: "/files/tender-doc.pdf",
            size: 2048000,
            type: "application/pdf",
            uploadDate: "2024-01-10",
          },
          {
            id: "2",
            name: "技术规格书.docx",
            url: "/files/tech-spec.docx",
            size: 1024000,
            type: "application/docx",
            uploadDate: "2024-01-10",
          },
        ],
        bidCount: 12,
        createdAt: "2024-01-10",
        updatedAt: "2024-01-12",
      };

      const mockOperations: ProjectOperation[] = [
        {
          id: "1",
          action: "创建项目",
          operator: "张三",
          timestamp: "2024-01-10 09:00:00",
          description: "创建了新的招标项目",
        },
        {
          id: "2",
          action: "发布项目",
          operator: "李四",
          timestamp: "2024-01-10 14:30:00",
          description: "项目已正式发布，开始接受投标",
        },
        {
          id: "3",
          action: "更新附件",
          operator: "王五",
          timestamp: "2024-01-12 10:15:00",
          description: "上传了技术规格书",
        },
      ];

      const mockRelatedProjects: TenderProject[] = [
        {
          id: "2",
          title: "IT设备采购项目",
          projectNumber: "TN2024002",
          status: "published",
          publishDate: "2024-01-12",
          deadline: "2024-01-28",
          budget: 800000,
          category: "设备采购",
          description: "采购服务器、网络设备等IT设备",
          attachments: [],
          bidCount: 5,
          createdAt: "2024-01-12",
          updatedAt: "2024-01-12",
        },
      ];

      setProject(mockProject);
      setOperations(mockOperations);
      setRelatedProjects(mockRelatedProjects);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleDownload = (attachment: TenderAttachment) => {
    message.success(`开始下载 ${attachment.name}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const statusColors = {
    draft: "default",
    published: "blue",
    bidding: "orange",
    evaluation: "purple",
    completed: "green",
    cancelled: "red",
  };

  const statusLabels = {
    draft: "草稿",
    published: "已发布",
    bidding: "投标中",
    evaluation: "评标中",
    completed: "已完成",
    cancelled: "已取消",
  };

  const getDeadlineProgress = () => {
    const now = new Date();
    const publishDate = new Date(project?.publishDate || "");
    const deadline = new Date(project?.deadline || "");
    const total = deadline.getTime() - publishDate.getTime();
    const elapsed = now.getTime() - publishDate.getTime();
    const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    return Math.round(progress);
  };

  if (loading || !project) {
    return <Card loading={loading} />;
  }

  return (
    <div>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          >
            返回列表
          </Button>
          <Divider type="vertical" />
          <Title level={3} style={{ margin: 0 }}>{project.title}</Title>
        </Space>
      </div>

      {/* 项目概览统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="项目预算"
              value={project.budget / 10000}
              precision={1}
              suffix="万元"
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="投标数量"
              value={project.bidCount}
              suffix="家"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="项目进度"
              value={getDeadlineProgress()}
              suffix="%"
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px", color: "#666", marginBottom: 8 }}>项目状态</div>
              <Tag color={statusColors[project.status]} style={{ fontSize: "14px", padding: "4px 12px" }}>
                {statusLabels[project.status]}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 项目基本信息 */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <span>项目基本信息</span>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<PrinterOutlined />}>打印</Button>
            <Button icon={<StarOutlined />}>收藏</Button>
            <Button icon={<EditOutlined />}>编辑</Button>
            <Button icon={<ShareAltOutlined />}>分享</Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="项目编号">{project.projectNumber}</Descriptions.Item>
          <Descriptions.Item label="项目状态">
            <Tag color={statusColors[project.status]}>
              {statusLabels[project.status]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="项目类别">{project.category}</Descriptions.Item>
          <Descriptions.Item label="预算金额">{(project.budget / 10000).toFixed(1)} 万元</Descriptions.Item>
          <Descriptions.Item label="发布时间">{project.publishDate}</Descriptions.Item>
          <Descriptions.Item label="截止时间">
            <Space>
              <span>{project.deadline}</span>
              <Badge status="processing" text="进行中" />
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="投标数量">
            <Badge count={project.bidCount} style={{ backgroundColor: "#52c41a" }} />
            <span style={{ marginLeft: 8 }}>家企业投标</span>
          </Descriptions.Item>
          <Descriptions.Item label="最后更新">{project.updatedAt}</Descriptions.Item>
          <Descriptions.Item label="项目描述" span={2}>
            {project.description}
          </Descriptions.Item>
        </Descriptions>

        {/* 项目进度条 */}
        <div style={{ marginTop: 24 }}>
          <Text strong>项目时间进度</Text>
          <Progress
            percent={getDeadlineProgress()}
            status={getDeadlineProgress() > 80 ? "exception" : "active"}
            style={{ marginTop: 8 }}
          />
        </div>
      </Card>

      <Row gutter={16}>
        {/* 附件下载 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PaperClipOutlined />
                <span>项目附件</span>
                <Badge count={project.attachments.length} style={{ backgroundColor: "#1890ff" }} />
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={project.attachments}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="download"
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(item)}
                    >
                      下载
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FileTextOutlined style={{ fontSize: 24, color: "#1890ff" }} />}
                    title={item.name}
                    description={
                      <Space split={<Divider type="vertical" />}>
                        <Text type="secondary">{formatFileSize(item.size)}</Text>
                        <Text type="secondary">上传时间: {item.uploadDate}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 相关项目 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LinkOutlined />
                <span>相关项目</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={relatedProjects}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="view"
                      type="link"
                      onClick={() => router.push(`/dashboard/tender-projects/${item.id}`)}
                    >
                      查看详情
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <Space>
                        <Text type="secondary">{item.projectNumber}</Text>
                        <Tag color={statusColors[item.status]}>
                          {statusLabels[item.status]}
                        </Tag>
                        <Text type="secondary">{(item.budget / 10000).toFixed(1)}万元</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作记录 */}
      <Card
        title={
          <Space>
            <HistoryOutlined />
            <span>操作记录</span>
          </Space>
        }
      >
        <Timeline
          items={operations.map((op) => ({
            key: op.id,
            dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
            children: (
              <div>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>{op.action}</div>
                <div style={{ color: "#666", fontSize: "12px", marginBottom: 4 }}>
                  操作人: {op.operator} • 时间: {op.timestamp}
                </div>
                <div style={{ color: "#999", fontSize: "12px" }}>{op.description}</div>
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  );
};

export default ProjectDetailPage;
