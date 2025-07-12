"use client";
import type {
  BidDefect,
  ComplianceItem,
  DetailedBidAnalysis,
  RiskItem,
  ScoreCategory,
} from "@/types/dashboard/tender";
import {
  ArrowLeftOutlined,
  BarChartOutlined,
  BugOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
  ShareAltOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
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
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

const BidAnalysisDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<DetailedBidAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  useEffect(() => {
    // 模拟获取分析详情
    setTimeout(() => {
      const mockAnalysis: DetailedBidAnalysis = {
        id: params.id as string,
        fileName: "北京市某医院综合楼建设工程投标书.pdf",
        fileSize: 15728640,
        uploadDate: "2024-01-15 10:30:00",
        analysisStatus: "completed",
        progress: 100,
        score: 94,
        defects: [
          {
            id: "1",
            type: "major",
            description: "技术方案中缺少BIM技术应用的详细说明和实施计划",
            location: "第15页 技术方案章节 3.2节",
            suggestion: "建议补充BIM技术在设计、施工、运维全生命周期的具体应用方案，包括软件选型、人员配置、协同流程等",
          },
          {
            id: "2",
            type: "minor",
            description: "部分主要材料品牌规格表述不够详细，缺少技术参数",
            location: "第23页 材料清单 表4.1",
            suggestion: "建议使用国家标准规格型号，并注明品牌等级、技术参数、质量认证等信息",
          },
          {
            id: "3",
            type: "critical",
            description: "缺少医疗建筑专项安全措施和应急预案",
            location: "第8页 安全方案章节",
            suggestion: "必须补充医疗建筑特殊环境下的安全防护措施，包括洁净区施工、医疗设备保护、患者安全等专项方案",
          },
          {
            id: "4",
            type: "minor",
            description: "绿色建筑技术应用说明不够充分",
            location: "第18页 绿色建筑章节",
            suggestion: "建议详细说明绿色建筑技术的具体应用，包括节能、节水、环保材料等措施",
          },
          {
            id: "5",
            type: "major",
            description: "项目进度计划缺少关键节点的风险控制措施",
            location: "第12页 进度计划章节",
            suggestion: "建议增加关键节点的风险识别、评估和应对措施，确保项目按期完成",
          },
        ],
        suggestions: [
          "建议增加智能化系统集成方案，提升医院信息化水平",
          "优化施工进度计划，充分考虑医院运营期间的施工限制",
          "完善质量控制体系，增加第三方检测和专业监理",
          "补充详细的成本控制措施和风险管控方案",
          "增加医疗建筑专业技术人员配置说明",
          "完善竣工后的运维服务和技术支持方案",
          "加强与医院方的沟通协调机制建设",
          "建立完善的应急响应和处置预案",
        ],
        analysisReport: {
          id: "1",
          summary: "该投标书整体质量优秀，技术方案基本完整，项目管理体系健全，但在医疗建筑专项技术、BIM应用和安全措施方面需要进一步完善和细化。建议重点关注医疗建筑的特殊要求，加强专项技术方案的深度和可操作性。",
          strengths: [
            "项目管理方案详细完整，组织架构清晰合理",
            "成本控制措施科学有效，预算编制准确详实",
            "质量保证体系健全，检测手段先进可靠",
            "人员配置符合要求，专业技术力量雄厚",
            "施工工艺先进，技术方案可行性强",
            "环保措施得当，符合绿色建筑要求",
            "企业资质齐全，具备丰富的同类项目经验",
            "财务状况良好，具备充足的履约能力",
          ],
          weaknesses: [
            "医疗建筑专项安全措施描述不够详细",
            "BIM技术应用方案缺少具体实施计划",
            "部分材料规格表述不够准确规范",
            "智能化系统集成方案有待完善",
            "风险评估覆盖面不够全面",
            "应急预案针对性不够强",
            "与医院方的协调机制不够明确",
            "后期运维服务方案需要细化",
          ],
          recommendations: [
            "补充医疗建筑专项安全防护措施和应急预案",
            "完善BIM技术应用的详细实施方案",
            "规范材料规格表述，增加技术参数说明",
            "增加智能化系统集成和运维方案",
            "完善项目风险评估和管控措施",
            "加强与医院方的沟通协调机制",
            "细化竣工后的运维服务和技术支持",
            "建立完善的质量追溯和责任体系",
          ],
          riskAssessment: [
            {
              id: "1",
              level: "high",
              description: "医疗建筑专项安全措施不完善",
              impact: "可能导致医疗环境污染，影响患者安全和医院正常运营，存在重大安全隐患",
              mitigation: "立即补充医疗建筑专项安全方案，包括洁净区保护、医疗设备防护、感染控制等措施",
            },
            {
              id: "2",
              level: "medium",
              description: "BIM技术应用方案缺少实施细节",
              impact: "可能影响项目协同效率和信息化管理水平，降低施工精度和质量",
              mitigation: "补充BIM技术详细实施计划，包括软件配置、人员培训、协同流程、数据标准等",
            },
            {
              id: "3",
              level: "medium",
              description: "智能化系统集成方案不够完善",
              impact: "可能影响医院信息化建设和后期运营效率，降低系统集成度",
              mitigation: "完善智能化系统设计方案，加强与医院信息系统的对接，确保系统兼容性",
            },
            {
              id: "4",
              level: "low",
              description: "部分材料规格表述不够规范",
              impact: "可能导致材料采购和质量控制出现偏差，影响工程质量",
              mitigation: "按照国家标准规范材料规格表述，增加详细技术参数和质量要求",
            },
            {
              id: "5",
              level: "medium",
              description: "项目进度风险控制措施不足",
              impact: "可能导致关键节点延误，影响整体项目进度和交付时间",
              mitigation: "建立完善的进度监控体系，制定详细的风险应对预案和资源调配方案",
            },
          ],
          complianceCheck: [
            {
              id: "1",
              requirement: "建筑施工企业安全生产许可证",
              status: "compliant",
              details: "已提供有效的安全生产许可证，证书编号：(京)JZ安许证字[2023]001234，有效期至2026年12月",
            },
            {
              id: "2",
              requirement: "建筑业企业资质证书",
              status: "compliant",
              details: "具备建筑工程施工总承包壹级资质，证书编号：A111001234，满足项目要求",
            },
            {
              id: "3",
              requirement: "医疗建筑专项施工资质",
              status: "compliant",
              details: "具备医疗建筑专项施工资质和相关业绩，已完成同类项目15个",
            },
            {
              id: "4",
              requirement: "ISO9001质量管理体系认证",
              status: "compliant",
              details: "通过ISO9001:2015质量管理体系认证，证书有效期至2025年8月",
            },
            {
              id: "5",
              requirement: "ISO14001环境管理体系认证",
              status: "compliant",
              details: "通过ISO14001:2015环境管理体系认证，证书有效期至2025年8月",
            },
            {
              id: "6",
              requirement: "ISO45001职业健康安全管理体系认证",
              status: "compliant",
              details: "通过ISO45001:2018职业健康安全管理体系认证，证书有效期至2025年8月",
            },
            {
              id: "7",
              requirement: "医疗建筑专项安全方案",
              status: "non-compliant",
              details: "安全方案不够详细，缺少医疗建筑专项措施，需要补充洁净区施工、感染控制等内容",
            },
            {
              id: "8",
              requirement: "BIM技术应用方案",
              status: "partial",
              details: "提供了BIM应用说明，但缺少详细实施计划、软件配置和人员培训方案",
            },
            {
              id: "9",
              requirement: "绿色建筑技术方案",
              status: "partial",
              details: "提供了基本的绿色建筑措施，但技术深度和具体实施方案需要进一步完善",
            },
          ],
        },
        scoreDetails: {
          totalScore: 94,
          categories: [
            {
              name: "技术方案",
              score: 88,
              maxScore: 100,
              weight: 0.3,
              details: "技术方案基本完整，但BIM应用和智能化方案需要完善，医疗建筑专项技术有待加强",
            },
            {
              name: "项目管理",
              score: 96,
              maxScore: 100,
              weight: 0.25,
              details: "项目管理方案详细完整，组织架构清晰，管理制度健全，具备丰富的项目管理经验",
            },
            {
              name: "质量保证",
              score: 95,
              maxScore: 100,
              weight: 0.2,
              details: "质量保证体系健全，检测手段先进，质量控制措施得当，具备完善的质量追溯体系",
            },
            {
              name: "安全措施",
              score: 82,
              maxScore: 100,
              weight: 0.15,
              details: "基础安全措施完备，但医疗建筑专项安全措施需要加强，应急预案需要细化",
            },
            {
              name: "成本控制",
              score: 98,
              maxScore: 100,
              weight: 0.1,
              details: "成本控制方案科学合理，预算编制准确，风险控制措施有效，具备良好的成本管控能力",
            },
          ],
        },
        defectStatistics: {
          total: 5,
          critical: 1,
          major: 2,
          minor: 2,
          byCategory: {
            "技术方案": 2,
            "安全措施": 1,
            "材料清单": 1,
            "绿色建筑": 1,
          },
        },
      };
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 1200);
  }, [params.id]);

  const handleExport = async (type: "pdf" | "excel" | "word") => {
    setExportLoading(type);
    try {
      // 模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success(`${type.toUpperCase()}格式的分析报告已生成完成`);
    } catch (_error) {
      message.error("导出失败，请重试");
    } finally {
      setExportLoading(null);
    }
  };

  const handlePrint = () => {
    message.success("正在准备打印，请稍候...");
    // 实际项目中这里会调用打印功能
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("分享链接已复制到剪贴板");
  };

  const defectColumns: ColumnsType<BidDefect> = [
    {
      title: "缺陷等级",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: BidDefect["type"]) => {
        const configs = {
          critical: { color: "red", text: "严重缺陷", icon: <CloseCircleOutlined /> },
          major: { color: "orange", text: "重要缺陷", icon: <ExclamationCircleOutlined /> },
          minor: { color: "blue", text: "轻微缺陷", icon: <CheckCircleOutlined /> },
        };
        const config = configs[type];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "问题描述",
      dataIndex: "description",
      key: "description",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "位置信息",
      dataIndex: "location",
      key: "location",
      width: 180,
      render: (text: string) => (
        <Text code style={{ fontSize: 12 }}>{text}</Text>
      ),
    },
    {
      title: "优化建议",
      dataIndex: "suggestion",
      key: "suggestion",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary">{text}</Text>
        </Tooltip>
      ),
    },
  ];

  const scoreColumns: ColumnsType<ScoreCategory> = [
    {
      title: "评分项目",
      dataIndex: "name",
      key: "name",
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "得分情况",
      dataIndex: "score",
      key: "score",
      width: 120,
      render: (score: number, record: ScoreCategory) => (
        <Space>
          <Text style={{
            color: score >= 95 ? "#52c41a" : score >= 90 ? "#73d13d" : score >= 85 ? "#faad14" : score >= 80 ? "#fa8c16" : "#ff4d4f",
            fontWeight: "bold",
          }}>
            {score}
          </Text>
          <Text type="secondary">/ {record.maxScore}</Text>
        </Space>
      ),
    },
    {
      title: "权重占比",
      dataIndex: "weight",
      key: "weight",
      width: 100,
      render: (weight: number) => (
        <Tag color="blue">{(weight * 100).toFixed(0)}%</Tag>
      ),
    },
    {
      title: "完成度",
      key: "progress",
      width: 150,
      render: (_, record: ScoreCategory) => {
        const percent = (record.score / record.maxScore) * 100;
        return (
          <Progress
            percent={percent}
            size="small"
            status={percent >= 95 ? "success" : percent >= 85 ? "normal" : "exception"}
            format={(percent) => `${percent?.toFixed(0)}%`}
          />
        );
      },
    },
    {
      title: "详细说明",
      dataIndex: "details",
      key: "details",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary">{text}</Text>
        </Tooltip>
      ),
    },
  ];

  const riskColumns: ColumnsType<RiskItem> = [
    {
      title: "风险等级",
      dataIndex: "level",
      key: "level",
      width: 100,
      render: (level: RiskItem["level"]) => {
        const configs = {
          high: { color: "red", text: "高风险", icon: <CloseCircleOutlined /> },
          medium: { color: "orange", text: "中风险", icon: <WarningOutlined /> },
          low: { color: "green", text: "低风险", icon: <CheckCircleOutlined /> },
        };
        const config = configs[level];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "风险描述",
      dataIndex: "description",
      key: "description",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "潜在影响",
      dataIndex: "impact",
      key: "impact",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary">{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "缓解措施",
      dataIndex: "mitigation",
      key: "mitigation",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="success">{text}</Text>
        </Tooltip>
      ),
    },
  ];

  const complianceColumns: ColumnsType<ComplianceItem> = [
    {
      title: "合规要求",
      dataIndex: "requirement",
      key: "requirement",
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "合规状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: ComplianceItem["status"]) => {
        const configs = {
          compliant: { color: "success", icon: <CheckCircleOutlined />, text: "合规" },
          "non-compliant": { color: "error", icon: <CloseCircleOutlined />, text: "不合规" },
          partial: { color: "warning", icon: <WarningOutlined />, text: "部分合规" },
        };
        const config = configs[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "详细说明",
      dataIndex: "details",
      key: "details",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      ),
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 95) return "#52c41a";
    if (score >= 90) return "#73d13d";
    if (score >= 85) return "#faad14";
    if (score >= 80) return "#fa8c16";
    return "#ff4d4f";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading || !analysis) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <BarChartOutlined style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }} />
          <div>正在加载分析报告...</div>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: "overview",
      label: (
        <Space>
          <BarChartOutlined />
          <span>分析概览</span>
        </Space>
      ),
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="综合得分"
                  value={analysis.score}
                  suffix="分"
                  prefix={<TrophyOutlined />}
                  valueStyle={{
                    color: getScoreColor(analysis.score),
                    fontSize: 28,
                    fontWeight: "bold",
                  }}
                />
                <div style={{ marginTop: 8 }}>
                  <Progress
                    percent={analysis.score}
                    size="small"
                    status={analysis.score >= 90 ? "success" : analysis.score >= 80 ? "normal" : "exception"}
                    showInfo={false}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="发现缺陷"
                  value={analysis.defectStatistics.total}
                  suffix="个"
                  prefix={<BugOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Badge count={analysis.defectStatistics.critical} style={{ backgroundColor: "#ff4d4f" }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>严重</Text>
                    </Badge>
                    <Badge count={analysis.defectStatistics.major} style={{ backgroundColor: "#faad14" }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>重要</Text>
                    </Badge>
                    <Badge count={analysis.defectStatistics.minor} style={{ backgroundColor: "#1890ff" }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>轻微</Text>
                    </Badge>
                  </Space>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="优化建议"
                  value={analysis.suggestions.length}
                  suffix="条"
                  prefix={<BulbOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>专业AI分析</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="合规检查"
                  value={analysis.analysisReport.complianceCheck.filter(c => c.status === "compliant").length}
                  suffix={`/${analysis.analysisReport.complianceCheck.length}`}
                  prefix={<SafetyCertificateOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>通过率 {((analysis.analysisReport.complianceCheck.filter(c => c.status === "compliant").length / analysis.analysisReport.complianceCheck.length) * 100).toFixed(0)}%</Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Card
            title={
              <Space>
                <BarChartOutlined style={{ color: "#1890ff" }} />
                <span>分析摘要</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Alert
              message="AI智能分析结果"
              description={analysis.analysisReport.summary}
              type="info"
              showIcon
              icon={<ThunderboltOutlined />}
              style={{ marginBottom: 16 }}
            />

            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <span>优势分析</span>
                    </Space>
                  }
                  size="small"
                  style={{ marginBottom: 16 }}
                >
                  <List
                    dataSource={analysis.analysisReport.strengths}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: "8px 0" }}>
                        <List.Item.Meta
                          avatar={
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: "#f6ffed",
                              border: "1px solid #b7eb8f",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              color: "#52c41a",
                              fontWeight: "bold",
                            }}
                            >
                              {index + 1}
                            </div>
                          }
                          description={
                            <Text style={{ fontSize: 14 }}>{item}</Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <ExclamationCircleOutlined style={{ color: "#faad14" }} />
                      <span>不足分析</span>
                    </Space>
                  }
                  size="small"
                >
                  <List
                    dataSource={analysis.analysisReport.weaknesses}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: "8px 0" }}>
                        <List.Item.Meta
                          avatar={
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: "#fffbe6",
                              border: "1px solid #ffe58f",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              color: "#faad14",
                              fontWeight: "bold",
                            }}
                            >
                              {index + 1}
                            </div>
                          }
                          description={
                            <Text style={{ fontSize: 14 }}>{item}</Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Card>

          <Card
            title={
              <Space>
                <BulbOutlined style={{ color: "#faad14" }} />
                <span>优化建议</span>
              </Space>
            }
          >
            <List
              dataSource={analysis.suggestions}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: "#fff7e6",
                        border: "1px solid #ffd591",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#faad14",
                        fontWeight: "bold",
                      }}
                      >
                        {index + 1}
                      </div>
                    }
                    title={`建议 ${index + 1}`}
                    description={item}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      ),
    },
    {
      key: "score",
      label: (
        <Space>
          <TrophyOutlined />
          <span>评分详情</span>
        </Space>
      ),
      children: (
        <div>
          <Card title="评分明细" style={{ marginBottom: 16 }}>
            <Table
              columns={scoreColumns}
              dataSource={analysis.scoreDetails.categories}
              rowKey="name"
              pagination={false}
              size="middle"
            />
          </Card>

          <Card title="评分分布">
            <Row gutter={16}>
              {analysis.scoreDetails.categories.map((category) => (
                <Col xs={24} sm={12} md={8} key={category.name} style={{ marginBottom: 16 }}>
                  <Card size="small" hoverable>
                    <Statistic
                      title={category.name}
                      value={category.score}
                      suffix={`/${category.maxScore}`}
                      valueStyle={{
                        color: category.score >= 95 ? "#52c41a" : category.score >= 90 ? "#73d13d" : category.score >= 85 ? "#faad14" : category.score >= 80 ? "#fa8c16" : "#ff4d4f",
                      }}
                    />
                    <Progress
                      percent={(category.score / category.maxScore) * 100}
                      size="small"
                      status={category.score >= 95 ? "success" : category.score >= 85 ? "normal" : "exception"}
                      style={{ marginTop: 8 }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Tag color="blue">权重 {(category.weight * 100).toFixed(0)}%</Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      ),
    },
    {
      key: "defects",
      label: (
        <Space>
          <BugOutlined />
          <span>缺陷统计</span>
        </Space>
      ),
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="严重缺陷"
                  value={analysis.defectStatistics.critical}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="重要缺陷"
                  value={analysis.defectStatistics.major}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="轻微缺陷"
                  value={analysis.defectStatistics.minor}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="总计缺陷"
                  value={analysis.defectStatistics.total}
                  prefix={<BugOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="缺陷详情">
            <Table
              columns={defectColumns}
              dataSource={analysis.defects}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </div>
      ),
    },
    {
      key: "risk",
      label: (
        <Space>
          <WarningOutlined />
          <span>风险评估</span>
        </Space>
      ),
      children: (
        <Card title="风险分析">
          <Table
            columns={riskColumns}
            dataSource={analysis.analysisReport.riskAssessment}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>
      ),
    },
    {
      key: "compliance",
      label: (
        <Space>
          <SafetyCertificateOutlined />
          <span>合规检查</span>
        </Space>
      ),
      children: (
        <Card title="合规性检查">
          <Table
            columns={complianceColumns}
            dataSource={analysis.analysisReport.complianceCheck}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      {/* 页面头部 */}
      <Card
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
            >
              返回
            </Button>
            <Divider type="vertical" />
            <FileSearchOutlined style={{ color: "#1890ff" }} />
            <span>分析详情 - {analysis.fileName}</span>
          </Space>
        }
        extra={
          <Space>
            <Button
              type="default"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
              打印
            </Button>
            <Button
              type="default"
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            >
              分享
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={exportLoading === "pdf"}
              onClick={() => handleExport("pdf")}
            >
              导出PDF
            </Button>
            <Button
              icon={<DownloadOutlined />}
              loading={exportLoading === "excel"}
              onClick={() => handleExport("excel")}
            >
              导出Excel
            </Button>
            <Button
              icon={<DownloadOutlined />}
              loading={exportLoading === "word"}
              onClick={() => handleExport("word")}
            >
              导出Word
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Descriptions column={4} size="small">
          <Descriptions.Item label="文件大小">
            {formatFileSize(analysis.fileSize)}
          </Descriptions.Item>
          <Descriptions.Item label="上传时间">{analysis.uploadDate}</Descriptions.Item>
          <Descriptions.Item label="分析状态">
            <Tag color="green" icon={<CheckCircleOutlined />}>分析完成</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="分析时长">
            <Text type="secondary">2分30秒</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 主要内容 */}
      <Card>
        <Tabs
          items={tabItems}
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
        />
      </Card>
    </div>
  );
};

export default BidAnalysisDetailPage;
