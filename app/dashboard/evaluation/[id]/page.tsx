"use client";
import type {
  BidEvaluationResult,
  EvaluationComparison,
  ExpertEvaluation,
} from "@/types/dashboard/tender";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  LineChartOutlined,
  PieChartOutlined,
  PrinterOutlined,
  StarOutlined,
  TableOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface _EvaluationDetailProps {
  params: { id: string };
}

const EvaluationDetailPage: React.FC = () => {
  const params = useParams();
  const evaluationId = params?.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setDataLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 模拟详细评分数据
  const mockEvaluationDetail: EvaluationComparison = {
    projectId: evaluationId,
    bids: [
      {
        bidId: "bid1",
        bidderName: "A建设集团有限公司",
        totalScore: 87.5,
        rank: 1,
        scores: { "1": 88, "2": 85, "3": 92, "4": 85 },
        expertScores: [
          {
            id: "1",
            expertId: "expert1",
            expertName: "张建华",
            projectId: evaluationId,
            bidId: "bid1",
            scores: [
              { criteriaId: "1", score: 88, comment: "技术方案完整，创新性较强" },
              { criteriaId: "2", score: 85, comment: "报价合理，性价比高" },
              { criteriaId: "3", score: 92, comment: "资质齐全，业绩优秀" },
              { criteriaId: "4", score: 85, comment: "项目管理经验丰富" },
            ],
            totalScore: 87.5,
            comments: "综合实力强，推荐中标",
            evaluationDate: "2024-01-15 14:30",
            status: "submitted",
          },
          {
            id: "2",
            expertId: "expert2",
            expertName: "李明",
            projectId: evaluationId,
            bidId: "bid1",
            scores: [
              { criteriaId: "1", score: 86, comment: "技术方案可行" },
              { criteriaId: "2", score: 83, comment: "价格适中" },
              { criteriaId: "3", score: 90, comment: "企业实力雄厚" },
              { criteriaId: "4", score: 88, comment: "管理体系完善" },
            ],
            totalScore: 86.8,
            comments: "整体表现良好",
            evaluationDate: "2024-01-15 15:45",
            status: "submitted",
          },
        ],
      },
      {
        bidId: "bid2",
        bidderName: "B工程有限责任公司",
        totalScore: 82.3,
        rank: 2,
        scores: { "1": 82, "2": 88, "3": 78, "4": 81 },
        expertScores: [
          {
            id: "3",
            expertId: "expert1",
            expertName: "张建华",
            projectId: evaluationId,
            bidId: "bid2",
            scores: [
              { criteriaId: "1", score: 82, comment: "技术方案基本可行" },
              { criteriaId: "2", score: 88, comment: "报价有竞争力" },
              { criteriaId: "3", score: 78, comment: "资质符合要求" },
              { criteriaId: "4", score: 81, comment: "项目经验一般" },
            ],
            totalScore: 82.3,
            comments: "性价比较高，可以考虑",
            evaluationDate: "2024-01-15 14:45",
            status: "submitted",
          },
        ],
      },
      {
        bidId: "bid3",
        bidderName: "C建筑工程公司",
        totalScore: 78.9,
        rank: 3,
        scores: { "1": 75, "2": 82, "3": 80, "4": 78 },
        expertScores: [],
      },
    ],
    criteria: [
      {
        id: "1",
        name: "技术方案",
        description: "技术方案的完整性和可行性",
        weight: 40,
        maxScore: 100,
      },
      {
        id: "2",
        name: "商务报价",
        description: "投标报价的合理性",
        weight: 30,
        maxScore: 100,
      },
      {
        id: "3",
        name: "企业资质",
        description: "企业资质和业绩",
        weight: 20,
        maxScore: 100,
      },
      {
        id: "4",
        name: "项目管理",
        description: "项目管理能力和经验",
        weight: 10,
        maxScore: 100,
      },
    ],
    summary: {
      totalBids: 3,
      totalExperts: 5,
      averageScore: 82.9,
      recommendedBid: "bid1",
      evaluationDate: "2024-01-15",
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#52c41a";
    if (score >= 80) return "#1890ff";
    if (score >= 70) return "#faad14";
    return "#ff4d4f";
  };

  const getRankIcon = (rank: number) => {
    const config = {
      1: { color: "#faad14", text: "第一名" },
      2: { color: "#c0c0c0", text: "第二名" },
      3: { color: "#cd7f32", text: "第三名" },
    };
    return config[rank as keyof typeof config] || { color: "#999", text: `第${rank}名` };
  };

  const rankingColumns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      align: "center" as const,
      render: (rank: number) => {
        const { color, text } = getRankIcon(rank);
        return (
          <div className="text-center">
            <TrophyOutlined style={{ color, fontSize: "20px", marginBottom: "4px" }} />
            <div style={{ fontSize: "12px", color: "#666" }}>{text}</div>
          </div>
        );
      },
    },
    {
      title: "投标单位",
      dataIndex: "bidderName",
      key: "bidderName",
      render: (name: string, record: BidEvaluationResult) => (
        <div>
          <Text strong style={{ fontSize: "14px" }}>{name}</Text>
          {record.rank === 1 && (
            <Tag color="gold" style={{ marginLeft: 8, fontSize: "12px" }}>推荐中标</Tag>
          )}
        </div>
      ),
    },
    {
      title: "总分",
      dataIndex: "totalScore",
      key: "totalScore",
      width: 120,
      align: "center" as const,
      sorter: (a: BidEvaluationResult, b: BidEvaluationResult) => a.totalScore - b.totalScore,
      render: (score: number) => (
        <div style={{ textAlign: "center" }}>
          <Text strong style={{
            color: getScoreColor(score),
            fontSize: "16px",
          }}>
            {score.toFixed(1)}
          </Text>
          <Progress
            percent={score}
            size="small"
            showInfo={false}
            strokeColor={getScoreColor(score)}
            style={{ marginTop: "4px" }}
          />
        </div>
      ),
    },
    ...mockEvaluationDetail.criteria.map(criteria => ({
      title: (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 500 }}>{criteria.name}</div>
          <Text type="secondary" style={{ fontSize: "11px" }}>权重 {criteria.weight}%</Text>
        </div>
      ),
      key: criteria.id,
      width: 100,
      align: "center" as const,
      render: (_: any, record: BidEvaluationResult) => {
        const score = record.scores[criteria.id];
        return (
          <div style={{ textAlign: "center" }}>
            <Text strong style={{ color: getScoreColor(score || 0) }}>
              {score || "-"}
            </Text>
          </div>
        );
      },
    })),
    {
      title: "专家评分",
      key: "expertCount",
      width: 100,
      align: "center" as const,
      render: (_: any, record: BidEvaluationResult) => (
        <Badge count={record.expertScores.length} showZero color="#1890ff">
          <UserOutlined style={{ fontSize: "16px", color: "#666" }} />
        </Badge>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 140,
      align: "center" as const,
      render: (_: any, _record: BidEvaluationResult) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="专家评分">
            <Button type="text" icon={<StarOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="导出数据">
            <Button type="text" icon={<ExportOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expertColumns = [
    {
      title: "专家信息",
      dataIndex: "expertName",
      key: "expertName",
      render: (name: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
          <div>
            <Text strong>{name}</Text>
            <div style={{ fontSize: "12px", color: "#666" }}>评标专家</div>
          </div>
        </Space>
      ),
    },
    {
      title: "评分时间",
      dataIndex: "evaluationDate",
      key: "evaluationDate",
      sorter: (a: ExpertEvaluation, b: ExpertEvaluation) =>
        new Date(a.evaluationDate).getTime() - new Date(b.evaluationDate).getTime(),
    },
    {
      title: "总分",
      dataIndex: "totalScore",
      key: "totalScore",
      align: "center" as const,
      sorter: (a: ExpertEvaluation, b: ExpertEvaluation) => a.totalScore - b.totalScore,
      render: (score: number) => (
        <Text strong style={{ color: getScoreColor(score), fontSize: "14px" }}>
          {score.toFixed(1)}
        </Text>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      filters: [
        { text: "已提交", value: "submitted" },
        { text: "草稿", value: "draft" },
      ],
      onFilter: (value: any, record: ExpertEvaluation) => record.status === value,
      render: (status: string) => (
        <Tag
          color={status === "submitted" ? "success" : "warning"}
          icon={status === "submitted" ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status === "submitted" ? "已提交" : "草稿"}
        </Tag>
      ),
    },
    {
      title: "评价",
      dataIndex: "comments",
      key: "comments",
      ellipsis: {
        showTitle: false,
      },
      render: (comments: string) => (
        <Tooltip placement="topLeft" title={comments}>
          <Text style={{ color: "#666" }}>{comments}</Text>
        </Tooltip>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 160,
      align: "center" as const,
      render: (_: any, _record: ExpertEvaluation) => (
        <Space size="small">
          <Button type="link" size="small">查看详情</Button>
          <Button type="link" size="small">评分明细</Button>
        </Space>
      ),
    },
  ];

  const handleGenerateReport = async (_values: any) => {
    setLoading(true);
    try {
      // 模拟报告生成
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success("评标报告生成成功");
      setReportModalVisible(false);
      reportForm.resetFields();
    } catch (_error) {
      message.error("报告生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const allExpertEvaluations = mockEvaluationDetail.bids.flatMap(bid => bid.expertScores);

  if (dataLoading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" tip="正在加载评标数据..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "0", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: "8px",
        }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center">
              <BarChartOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
              <Title level={3} style={{ margin: 0, color: "#262626" }}>评标详情分析</Title>
              <Tag color="blue" style={{ fontSize: "12px" }}>项目编号: {evaluationId}</Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => setReportModalVisible(true)}
                style={{ borderRadius: "6px" }}
              >
                生成报告
              </Button>
              <Button
                icon={<DownloadOutlined />}
                style={{ borderRadius: "6px" }}
              >
                导出数据
              </Button>
              <Button
                icon={<PrinterOutlined />}
                style={{ borderRadius: "6px" }}
              >
                打印报告
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "#666", fontSize: "14px" }}>参与投标</span>}
              value={mockEvaluationDetail.summary.totalBids}
              valueStyle={{ color: "#1890ff", fontSize: "24px", fontWeight: 600 }}
              suffix="家"
              prefix={<TrophyOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "#666", fontSize: "14px" }}>评标专家</span>}
              value={mockEvaluationDetail.summary.totalExperts}
              valueStyle={{ color: "#52c41a", fontSize: "24px", fontWeight: 600 }}
              suffix="人"
              prefix={<UserOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "#666", fontSize: "14px" }}>平均得分</span>}
              value={mockEvaluationDetail.summary.averageScore}
              precision={1}
              valueStyle={{ color: "#722ed1", fontSize: "24px", fontWeight: 600 }}
              suffix="分"
              prefix={<BarChartOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "#666", fontSize: "14px" }}>最高得分</span>}
              value={Math.max(...mockEvaluationDetail.bids.map(bid => bid.totalScore))}
              precision={1}
              valueStyle={{ color: "#faad14", fontSize: "24px", fontWeight: 600 }}
              suffix="分"
              prefix={<StarOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card
        style={{
          borderRadius: "8px",
        }}
        bodyStyle={{ padding: "0" }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ padding: "0 24px" }}
          tabBarStyle={{ marginBottom: 0, borderBottom: "1px solid #f0f0f0" }}
        >
          <TabPane
            tab={
              <Space>
                <TableOutlined />
                <span>综合排名</span>
              </Space>
            }
            key="overview"
          >
            <div style={{ padding: "24px" }}>
              <Table
                columns={rankingColumns}
                dataSource={mockEvaluationDetail.bids}
                rowKey="bidId"
                pagination={false}
                scroll={{ x: 1000 }}
                style={{
                  background: "#fff",
                  borderRadius: "6px",
                }}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
              />

              <Divider style={{ margin: "32px 0", fontSize: "16px", fontWeight: 500 }}>
                得分分布分析
              </Divider>
              <Card
                style={{
                  background: "#fafafa",
                  border: "1px dashed #d9d9d9",
                  borderRadius: "8px",
                }}
                bodyStyle={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Empty
                  image={<LineChartOutlined style={{ fontSize: "48px", color: "#bfbfbf" }} />}
                  description={
                    <span style={{ color: "#999", fontSize: "14px" }}>
                      投标单位得分对比图表
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        集成 ECharts 后可显示详细图表分析
                      </Text>
                    </span>
                  }
                />
              </Card>
            </div>
          </TabPane>

          <TabPane
            tab={
              <Space>
                <UserOutlined />
                <span>专家评分</span>
              </Space>
            }
            key="experts"
          >
            <div style={{ padding: "24px" }}>
              <Table
                columns={expertColumns}
                dataSource={allExpertEvaluations}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条评分记录`,
                  style: { marginTop: "16px" },
                }}
                style={{
                  background: "#fff",
                  borderRadius: "6px",
                }}
              />
            </div>
          </TabPane>

          <TabPane
            tab={
              <Space>
                <BarChartOutlined />
                <span>评分明细</span>
              </Space>
            }
            key="details"
          >
            <div style={{ padding: "24px" }}>
              <Row gutter={[16, 16]}>
                {mockEvaluationDetail.bids.map(bid => (
                  <Col xs={24} lg={8} key={bid.bidId}>
                    <Card
                      title={
                        <Space>
                          <Text strong style={{ fontSize: "16px" }}>{bid.bidderName}</Text>
                          <Tag color={bid.rank === 1 ? "gold" : bid.rank === 2 ? "blue" : "default"}>
                            第{bid.rank}名
                          </Tag>
                        </Space>
                      }
                      extra={
                        <Text strong style={{
                          fontSize: "18px",
                          color: getScoreColor(bid.totalScore),
                        }}>
                          {bid.totalScore.toFixed(1)}分
                        </Text>
                      }
                      style={{
                        height: "100%",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }} size="middle">
                        {mockEvaluationDetail.criteria.map(criteria => (
                          <div key={criteria.id}>
                            <Row justify="space-between" align="middle" style={{ marginBottom: "8px" }}>
                              <Col>
                                <Text style={{ fontSize: "14px", fontWeight: 500 }}>{criteria.name}</Text>
                                <Text type="secondary" style={{ fontSize: "12px", marginLeft: 8 }}>
                                  权重 {criteria.weight}%
                                </Text>
                              </Col>
                              <Col>
                                <Text strong style={{
                                  color: getScoreColor(bid.scores[criteria.id] || 0),
                                  fontSize: "14px",
                                }}>
                                  {bid.scores[criteria.id] || "-"}
                                </Text>
                              </Col>
                            </Row>
                            <Progress
                              percent={bid.scores[criteria.id] || 0}
                              size="small"
                              showInfo={false}
                              strokeColor={getScoreColor(bid.scores[criteria.id] || 0)}
                              trailColor="#f5f5f5"
                            />
                          </div>
                        ))}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </TabPane>

          <TabPane
            tab={
              <Space>
                <PieChartOutlined />
                <span>统计分析</span>
              </Space>
            }
            key="statistics"
          >
            <div style={{ padding: "24px" }}>
              <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={24} lg={12}>
                  <Card
                    title="评分分布统计"
                    style={{
                      height: "380px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                    bodyStyle={{ height: "300px" }}
                  >
                    <div style={{
                      height: "100%",
                      background: "#fafafa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      border: "1px dashed #d9d9d9",
                    }}>
                      <Empty
                        image={<BarChartOutlined style={{ fontSize: "48px", color: "#bfbfbf" }} />}
                        description="评分分布柱状图"
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title="专家评分一致性"
                    style={{
                      height: "380px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                    bodyStyle={{ height: "300px" }}
                  >
                    <div style={{
                      height: "100%",
                      background: "#fafafa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      border: "1px dashed #d9d9d9",
                    }}>
                      <Empty
                        image={<PieChartOutlined style={{ fontSize: "48px", color: "#bfbfbf" }} />}
                        description="专家评分差异分析图"
                      />
                    </div>
                  </Card>
                </Col>
              </Row>

              <Card
                title="评分时间线"
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <Timeline mode="left">
                  {allExpertEvaluations.map(evaluation => (
                    <Timeline.Item
                      key={evaluation.id}
                      color="blue"
                      dot={<CheckCircleOutlined style={{ fontSize: "16px" }} />}
                    >
                      <div style={{ paddingBottom: "8px" }}>
                        <Space>
                          <Text strong style={{ fontSize: "14px" }}>{evaluation.expertName}</Text>
                          <Text>完成了对</Text>
                          <Text strong style={{ color: "#1890ff" }}>
                            {mockEvaluationDetail.bids.find(bid => bid.bidId === evaluation.bidId)?.bidderName}
                          </Text>
                          <Text>的评分</Text>
                        </Space>
                      </div>
                      <div>
                        <Space split={<Divider type="vertical" />}>
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            {evaluation.evaluationDate}
                          </Text>
                          <Text style={{ fontSize: "13px" }}>
                            得分：<Text strong style={{ color: getScoreColor(evaluation.totalScore) }}>
                              {evaluation.totalScore.toFixed(1)}
                            </Text>
                          </Text>
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            {evaluation.comments}
                          </Text>
                        </Space>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 生成报告模态框 */}
      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: "#1890ff" }} />
            <span>生成评标报告</span>
          </Space>
        }
        open={reportModalVisible}
        onCancel={() => {
          setReportModalVisible(false);
          reportForm.resetFields();
        }}
        onOk={() => reportForm.submit()}
        confirmLoading={loading}
        width={600}
        style={{ top: 100 }}
        okText="生成报告"
        cancelText="取消"
      >
        <Form
          form={reportForm}
          layout="vertical"
          onFinish={handleGenerateReport}
          style={{ marginTop: "16px" }}
        >
          <Form.Item
            name="reportType"
            label="报告类型"
            rules={[{ required: true, message: "请选择报告类型" }]}
          >
            <Select placeholder="选择报告类型" size="large">
              <Select.Option value="summary">评标总结报告</Select.Option>
              <Select.Option value="detailed">详细评分报告</Select.Option>
              <Select.Option value="comparison">对比分析报告</Select.Option>
              <Select.Option value="expert">专家评分报告</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="includeCharts"
            label="包含图表"
          >
            <Select
              mode="multiple"
              placeholder="选择要包含的图表"
              size="large"
              allowClear
            >
              <Select.Option value="ranking">排名对比图</Select.Option>
              <Select.Option value="score">得分分布图</Select.Option>
              <Select.Option value="criteria">评分标准图</Select.Option>
              <Select.Option value="expert">专家评分图</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="remarks"
            label="备注说明"
          >
            <TextArea
              rows={4}
              placeholder="请输入报告备注说明..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
        .ant-table-thead > tr > th {
          background-color: #f8f9fa;
          border-bottom: 2px solid #e8e8e8;
          font-weight: 600;
        }
        .ant-tabs-tab {
          font-weight: 500;
        }
        .ant-tabs-tab-active {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default EvaluationDetailPage;
