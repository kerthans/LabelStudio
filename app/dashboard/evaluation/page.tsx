"use client";
import type {
  BidEvaluationResult,
  EvaluationComparison,
  EvaluationCriteria,
  ExpertEvaluation,
} from "@/types/dashboard/tender";
import {
  AuditOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  FallOutlined,
  FileTextOutlined,
  ImportOutlined,
  LineChartOutlined,
  PieChartOutlined,
  PlusOutlined,
  ReloadOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Progress,
  Rate,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const EvaluationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("criteria");
  const [criteriaModalVisible, setCriteriaModalVisible] = useState(false);
  const [evaluationModalVisible, setEvaluationModalVisible] = useState(false);
  const [comparisonModalVisible, setComparisonModalVisible] = useState(false);
  const [expertMode, setExpertMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [evaluationForm] = Form.useForm();

  // 模拟数据
  const mockCriteria: EvaluationCriteria[] = [
    {
      id: "1",
      name: "技术方案",
      description: "技术方案的完整性和可行性",
      weight: 40,
      maxScore: 100,
      subCriteria: [
        { id: "1-1", name: "技术先进性", description: "技术方案的先进程度", weight: 50, maxScore: 50 },
        { id: "1-2", name: "可行性分析", description: "方案实施的可行性", weight: 50, maxScore: 50 },
      ],
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
  ];

  const mockEvaluations: ExpertEvaluation[] = [
    {
      id: "1",
      expertId: "expert1",
      expertName: "张专家",
      projectId: "project1",
      bidId: "bid1",
      scores: [
        { criteriaId: "1", score: 85, comment: "技术方案较为完善" },
        { criteriaId: "2", score: 78, comment: "报价合理" },
        { criteriaId: "3", score: 92, comment: "资质优秀" },
        { criteriaId: "4", score: 88, comment: "管理经验丰富" },
      ],
      totalScore: 84.3,
      comments: "整体方案较好，建议采用",
      evaluationDate: "2024-01-15",
      status: "submitted",
    },
    {
      id: "2",
      expertId: "expert2",
      expertName: "李专家",
      projectId: "project1",
      bidId: "bid2",
      scores: [
        { criteriaId: "1", score: 82, comment: "技术方案可行" },
        { criteriaId: "2", score: 75, comment: "报价偏高" },
        { criteriaId: "3", score: 85, comment: "资质良好" },
        { criteriaId: "4", score: 76, comment: "管理经验一般" },
      ],
      totalScore: 79.2,
      comments: "方案基本可行，需要优化",
      evaluationDate: "2024-01-15",
      status: "draft",
    },
  ];

  const mockComparison: EvaluationComparison = {
    projectId: "project1",
    bids: [
      {
        bidId: "bid1",
        bidderName: "A公司",
        totalScore: 84.3,
        rank: 1,
        scores: { "1": 85, "2": 78, "3": 92, "4": 88 },
        expertScores: [mockEvaluations[0]],
      },
      {
        bidId: "bid2",
        bidderName: "B公司",
        totalScore: 79.2,
        rank: 2,
        scores: { "1": 82, "2": 75, "3": 85, "4": 76 },
        expertScores: [],
      },
      {
        bidId: "bid3",
        bidderName: "C公司",
        totalScore: 76.8,
        rank: 3,
        scores: { "1": 78, "2": 80, "3": 72, "4": 75 },
        expertScores: [],
      },
    ],
    criteria: mockCriteria,
    summary: {
      totalBids: 3,
      totalExperts: 5,
      averageScore: 80.1,
      recommendedBid: "bid1",
      evaluationDate: "2024-01-15",
    },
  };

  const criteriaColumns = [
    {
      title: "评分标准",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: EvaluationCriteria) => (
        <div>
          <Text strong>{text}</Text>
          {record.subCriteria && (
            <div style={{ marginTop: 4 }}>
              <Tag className="small-tag" color="blue">
                {record.subCriteria.length} 个子标准
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "权重",
      dataIndex: "weight",
      key: "weight",
      width: 100,
      render: (weight: number) => (
        <div style={{ textAlign: "center" }}>
          <Progress
            type="circle"
            size={40}
            percent={weight}
            format={() => `${weight}%`}
            strokeColor={weight >= 30 ? "#52c41a" : weight >= 20 ? "#faad14" : "#ff4d4f"}
          />
        </div>
      ),
    },
    {
      title: "满分",
      dataIndex: "maxScore",
      key: "maxScore",
      width: 80,
      render: (score: number) => (
        <Tag color="geekblue">{score}</Tag>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_: any, _record: EvaluationCriteria) => (
        <Space size="small">
          <Tooltip title="编辑标准">
            <Button type="text" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="删除标准">
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const comparisonColumns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      render: (rank: number) => {
        const icons = {
          1: <CrownOutlined style={{ color: "#faad14" }} />,
          2: <StarOutlined style={{ color: "#d9d9d9" }} />,  // 使用 StarOutlined 替换
          3: <TrophyOutlined style={{ color: "#cd7f32" }} />,
        };
        return (
          <div style={{ textAlign: "center" }}>
            {icons[rank as keyof typeof icons]}
            <div style={{ fontSize: 12, marginTop: 2 }}>第{rank}名</div>
          </div>
        );
      },
    },
    {
      title: "投标单位",
      dataIndex: "bidderName",
      key: "bidderName",
      render: (name: string, record: BidEvaluationResult) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={32}
            style={{
              backgroundColor: record.rank === 1 ? "#52c41a" : "#1890ff",
              marginRight: 8,
            }}
          >
            {name.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{name}</Text>
            {record.rank === 1 && (
              <Tag color="success" className="small-tag" style={{ marginLeft: 4 }}>
                推荐
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "总分",
      dataIndex: "totalScore",
      key: "totalScore",
      width: 100,
      render: (score: number) => {
        const getScoreColor = (score: number) => {
          if (score >= 85) return "#52c41a";
          if (score >= 75) return "#faad14";
          if (score >= 60) return "#ff7a45";
          return "#ff4d4f";
        };

        return (
          <div style={{ textAlign: "center" }}>
            <Text strong style={{ color: getScoreColor(score), fontSize: 16 }}>
              {score.toFixed(1)}
            </Text>
            <div>
              <Progress
                percent={score}
                size="small"
                strokeColor={getScoreColor(score)}
                showInfo={false}
              />
            </div>
          </div>
        );
      },
    },
    ...mockCriteria.map(criteria => ({
      title: criteria.name,
      key: criteria.id,
      width: 80,
      render: (_: any, record: BidEvaluationResult) => {
        const score = record.scores[criteria.id];
        return score ? (
          <div style={{ textAlign: "center" }}>
            <Text>{score}</Text>
          </div>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    })),
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_: any, _record: BidEvaluationResult) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="评分历史">
            <Button type="text" icon={<BarChartOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddCriteria = () => {
    setCriteriaModalVisible(true);
    form.resetFields();
  };

  const handleSaveCriteria = async (values: any) => {
    try {
      setLoading(true);
      console.log("保存评分标准:", values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("评分标准保存成功！");
      setCriteriaModalVisible(false);
    } catch (_error) {
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEvaluation = () => {
    setEvaluationModalVisible(true);
    evaluationForm.resetFields();
  };

  const handleSubmitEvaluation = async (values: any) => {
    try {
      setLoading(true);
      console.log("提交评分:", values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("评分提交成功！");
      setEvaluationModalVisible(false);
    } catch (_error) {
      message.error("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const totalWeight = mockCriteria.reduce((sum, item) => sum + item.weight, 0);
  const isWeightValid = totalWeight === 100;

  const tabItems = [
    {
      key: "criteria",
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: 6 }} />
          评分标准
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddCriteria}
                    size="large"
                  >
                    添加评分标准
                  </Button>
                  <Button icon={<SettingOutlined />} size="large">
                    权重设置
                  </Button>
                  <Button icon={<ImportOutlined />} size="large">
                    导入标准
                  </Button>
                  <Button icon={<ExportOutlined />} size="large">
                    导出标准
                  </Button>
                </Space>
              </Col>
              <Col>
                <Badge
                  count={mockCriteria.length}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  <Button icon={<ReloadOutlined />}>刷新</Button>
                </Badge>
              </Col>
            </Row>
          </div>

          <Table
            columns={criteriaColumns}
            dataSource={mockCriteria}
            rowKey="id"
            pagination={false}
            size="middle"
            bordered
          />

          <Alert
            message={isWeightValid ? "权重配置正确" : "权重配置异常"}
            description={`当前权重总计：${totalWeight}%${!isWeightValid ? "，权重总和应为100%" : ""}`}
            type={isWeightValid ? "success" : "warning"}
            showIcon
            style={{ marginTop: 16 }}
            action={
              !isWeightValid && (
                <Button size="small" type="primary">
                  自动调整
                </Button>
              )
            }
          />
        </div>
      ),
    },
    {
      key: "evaluation",
      label: (
        <span>
          <AuditOutlined style={{ marginRight: 6 }} />
          专家评分
        </span>
      ),
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={6}>
              <Card hoverable>
                <Statistic
                  title="待评标项目"
                  value={3}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<ClockCircleOutlined />}
                  suffix="个"
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card hoverable>
                <Statistic
                  title="已完成评分"
                  value={1}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<CheckCircleOutlined />}
                  suffix="个"
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card hoverable>
                <Statistic
                  title="平均评分"
                  value={84.3}
                  precision={1}
                  valueStyle={{ color: "#722ed1" }}
                  prefix={<StarOutlined />}
                  suffix="分"
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card hoverable>
                <Statistic
                  title="参与专家"
                  value={5}
                  valueStyle={{ color: "#faad14" }}
                  prefix={<TeamOutlined />}
                  suffix="人"
                />
              </Card>
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button
                    type="primary"
                    icon={<UserOutlined />}
                    onClick={handleStartEvaluation}
                    size="large"
                  >
                    开始评分
                  </Button>
                  <Button
                    icon={<BarChartOutlined />}
                    onClick={() => setComparisonModalVisible(true)}
                    size="large"
                  >
                    对比分析
                  </Button>
                  <Button
                    type={expertMode ? "primary" : "default"}
                    icon={<SafetyCertificateOutlined />}
                    onClick={() => setExpertMode(!expertMode)}
                    size="large"
                  >
                    {expertMode ? "退出专家模式" : "专家模式"}
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          {expertMode && (
            <Alert
              message="专家模式已启用"
              description="在专家模式下，您可以查看详细的评分标准和其他专家的评分情况。"
              type="info"
              showIcon
              icon={<SafetyCertificateOutlined />}
              style={{ marginBottom: 16 }}
            />
          )}

          <Card
            title={(
              <span>
                <AuditOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                评分进度
              </span>
            )}
            extra={
              <Badge count={mockEvaluations.length} style={{ backgroundColor: "#52c41a" }}>
                <Button size="small">查看全部</Button>
              </Badge>
            }
          >
            <List
              dataSource={mockEvaluations}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="text" size="small" icon={<EyeOutlined />}>查看详情</Button>,
                    <Button type="text" size="small" icon={<EditOutlined />}>修改评分</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: item.status === "submitted" ? "#52c41a" : "#faad14",
                        }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Text strong>{item.expertName} - 项目评分</Text>
                        <Tag
                          color={item.status === "submitted" ? "success" : "warning"}
                          style={{ marginLeft: 8 }}
                        >
                          {item.status === "submitted" ? "已提交" : "草稿"}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Text type="secondary">总分：</Text>
                            <Text strong style={{ color: "#1890ff" }}>{item.totalScore}</Text>
                          </Col>
                          <Col span={8}>
                            <Text type="secondary">评分时间：</Text>
                            <Text>{item.evaluationDate}</Text>
                          </Col>
                          <Col span={8}>
                            <Progress
                              percent={(item.totalScore / 100) * 100}
                              size="small"
                              strokeColor="#52c41a"
                            />
                          </Col>
                        </Row>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      ),
    },
    {
      key: "comparison",
      label: (
        <span>
          <LineChartOutlined style={{ marginRight: 6 }} />
          对比分析
        </span>
      ),
      children: (
        <div>
          <Card
            title={(
              <span>
                <TrophyOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                投标单位排名对比
              </span>
            )}
            extra={
              <Space>
                <Button icon={<ExportOutlined />} size="small">导出报告</Button>
                <Button icon={<PieChartOutlined />} size="small">图表视图</Button>
              </Space>
            }
          >
            <Table
              columns={comparisonColumns}
              dataSource={mockComparison.bids}
              rowKey="bidId"
              pagination={false}
              size="middle"
              bordered
            />
          </Card>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card
                title={(
                  <span>
                    <PieChartOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                    评分分布
                  </span>
                )}
              >
                <div style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fafafa",
                  borderRadius: 6,
                }}>
                  <div style={{ textAlign: "center" }}>
                    <BarChartOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                    <div>
                      <Text type="secondary">评分分布图表</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>需要集成图表库</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={(
                  <span>
                    <LineChartOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                    评分统计
                  </span>
                )}
              >
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="最高分"
                        value={Math.max(...mockComparison.bids.map(bid => bid.totalScore)).toFixed(1)}
                        valueStyle={{ color: "#52c41a" }}
                        prefix={<RiseOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="最低分"
                        value={Math.min(...mockComparison.bids.map(bid => bid.totalScore)).toFixed(1)}
                        valueStyle={{ color: "#ff4d4f" }}
                        prefix={<FallOutlined />}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="平均分"
                        value={mockComparison.summary.averageScore.toFixed(1)}
                        valueStyle={{ color: "#1890ff" }}
                        prefix={<BarChartOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text type="secondary">推荐中标：</Text>
                        <br />
                        <Text strong style={{ color: "#722ed1", fontSize: 16 }}>
                          <CrownOutlined style={{ marginRight: 4 }} />
                          {mockComparison.bids.find(bid => bid.bidId === mockComparison.summary.recommendedBid)?.bidderName}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <AuditOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          评标辅助系统
        </Title>
        <Text type="secondary">智能化评标流程管理，提升评标效率和公正性</Text>
      </div>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>

      {/* 添加评分标准模态框 */}
      <Modal
        title={(
          <span>
            <PlusOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            添加评分标准
          </span>
        )}
        open={criteriaModalVisible}
        onCancel={() => setCriteriaModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveCriteria}>
          <Form.Item
            name="name"
            label="标准名称"
            rules={[{ required: true, message: "请输入标准名称" }]}
          >
            <Input
              placeholder="请输入评分标准名称"
              prefix={<FileTextOutlined />}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="权重(%)"
                rules={[{ required: true, message: "请输入权重" }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxScore"
                label="满分"
                rules={[{ required: true, message: "请输入满分" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="标准描述"
            rules={[{ required: true, message: "请输入标准描述" }]}
          >
            <TextArea rows={3} placeholder="请输入评分标准的详细描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 专家评分模态框 */}
      <Modal
        title={(
          <span>
            <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            专家评分
          </span>
        )}
        open={evaluationModalVisible}
        onCancel={() => setEvaluationModalVisible(false)}
        onOk={() => evaluationForm.submit()}
        width={800}
        confirmLoading={loading}
      >
        <Form form={evaluationForm} layout="vertical" onFinish={handleSubmitEvaluation}>
          <Form.Item
            name="bidder"
            label="投标单位"
            rules={[{ required: true, message: "请选择投标单位" }]}
          >
            <Select placeholder="选择投标单位" size="large">
              <Option value="bid1">A公司</Option>
              <Option value="bid2">B公司</Option>
              <Option value="bid3">C公司</Option>
            </Select>
          </Form.Item>

          {mockCriteria.map(criteria => (
            <Card key={criteria.id} size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <div>
                    <Text strong style={{ display: "flex", alignItems: "center" }}>
                      <FileTextOutlined style={{ marginRight: 4, color: "#1890ff" }} />
                      {criteria.name}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag className="small-tag" color="blue">权重：{criteria.weight}%</Tag>
                      <Tag className="small-tag" color="green">满分：{criteria.maxScore}</Tag>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["scores", criteria.id, "score"]}
                    label="评分"
                    rules={[{ required: true, message: "请评分" }]}
                  >
                    <Rate count={10} allowHalf />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["scores", criteria.id, "comment"]}
                    label="评价"
                  >
                    <Input placeholder="评价意见" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ))}

          <Form.Item
            name="comments"
            label="总体评价"
          >
            <TextArea rows={3} placeholder="请输入总体评价意见" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 对比分析模态框 */}
      <Modal
        title={(
          <span>
            <LineChartOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            详细对比分析
          </span>
        )}
        open={comparisonModalVisible}
        onCancel={() => setComparisonModalVisible(false)}
        footer={[
          <Button key="export" icon={<ExportOutlined />}>
            导出报告
          </Button>,
          <Button key="close" onClick={() => setComparisonModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={1000}
      >
        <div style={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
          borderRadius: 6,
        }}>
          <div style={{ textAlign: "center" }}>
            <LineChartOutlined style={{ fontSize: 64, color: "#d9d9d9", marginBottom: 16 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 16 }}>详细对比分析图表</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>需要集成图表库如ECharts</Text>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EvaluationPage;
