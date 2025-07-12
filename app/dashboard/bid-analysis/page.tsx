"use client";
import type { BidAnalysis, BidDefect } from "@/types/dashboard/tender";
import {
  BarChartOutlined,
  BugOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  List,
  Modal,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

const BidAnalysisPage: React.FC = () => {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<BidAnalysis[]>([]);
  const [_uploading, setUploading] = useState(false);
  const [selectedAnalysis, _setSelectedAnalysis] = useState<BidAnalysis | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // 模拟数据
  useEffect(() => {
    const mockAnalyses: BidAnalysis[] = [
      {
        id: "1",
        fileName: "北京市某医院综合楼建设工程投标书.pdf",
        fileSize: 15728640, // 15MB
        uploadDate: "2024-01-15 10:30:00",
        analysisStatus: "completed",
        progress: 100,
        score: 94,
        defects: [
          {
            id: "1",
            type: "major",
            description: "技术方案中缺少BIM技术应用说明",
            location: "第15页 技术方案章节",
            suggestion: "建议补充BIM技术在施工过程中的具体应用方案",
          },
          {
            id: "2",
            type: "minor",
            description: "部分材料品牌规格表述不够详细",
            location: "第23页 材料清单",
            suggestion: "建议使用国标规格型号并注明品牌等级",
          },
        ],
        suggestions: [
          "建议增加绿色建筑技术应用章节",
          "优化施工进度计划，考虑季节性因素",
          "完善质量控制体系，增加第三方检测",
          "补充应急预案和风险管控措施",
        ],
      },
      {
        id: "2",
        fileName: "上海市轨道交通设备采购投标文件.docx",
        fileSize: 8388608, // 8MB
        uploadDate: "2024-01-15 14:20:00",
        analysisStatus: "analyzing",
        progress: 78,
        score: 0,
        defects: [],
        suggestions: [],
      },
      {
        id: "3",
        fileName: "深圳智慧城市信息化建设项目标书.pdf",
        fileSize: 12582912, // 12MB
        uploadDate: "2024-01-14 16:45:00",
        analysisStatus: "completed",
        progress: 100,
        score: 88,
        defects: [
          {
            id: "3",
            type: "critical",
            description: "缺少数据安全保护方案",
            location: "第8页 安全方案",
            suggestion: "必须补充完整的数据加密和访问控制方案",
          },
          {
            id: "4",
            type: "major",
            description: "系统架构设计缺少容灾备份说明",
            location: "第12页 技术架构",
            suggestion: "建议增加异地容灾和数据备份策略",
          },
          {
            id: "5",
            type: "minor",
            description: "部分技术参数未达到最新国标要求",
            location: "第18页 技术参数",
            suggestion: "建议更新至最新国家标准要求",
          },
        ],
        suggestions: [
          "建议采用微服务架构提升系统可扩展性",
          "增加AI算法应用场景说明",
          "完善用户体验设计方案",
          "补充系统运维和技术支持方案",
        ],
      },
      {
        id: "4",
        fileName: "广州市环保设备采购项目投标书.pdf",
        fileSize: 6291456, // 6MB
        uploadDate: "2024-01-14 09:15:00",
        analysisStatus: "completed",
        progress: 100,
        score: 91,
        defects: [
          {
            id: "6",
            type: "minor",
            description: "环保认证证书有效期即将到期",
            location: "第5页 资质证明",
            suggestion: "建议提供最新的环保认证证书",
          },
        ],
        suggestions: [
          "建议增加设备能耗分析报告",
          "完善售后服务和维护方案",
        ],
      },
      {
        id: "5",
        fileName: "成都市教育信息化设备采购标书.docx",
        fileSize: 4194304, // 4MB
        uploadDate: "2024-01-13 11:30:00",
        analysisStatus: "failed",
        progress: 0,
        score: 0,
        defects: [],
        suggestions: [],
      },
    ];

    setTimeout(() => {
      setAnalyses(mockAnalyses);
      setLoading(false);
    }, 800);
  }, []);

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".pdf,.doc,.docx",
    beforeUpload: (file) => {
      const isValidType = file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isValidType) {
        message.error("仅支持 PDF、DOC、DOCX 格式文件");
        return false;
      }
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error("文件大小不能超过 50MB");
        return false;
      }
      return true;
    },
    customRequest: ({ file, onSuccess, onProgress }) => {
      setUploading(true);

      // 模拟上传和分析过程
      let progress = 0;
      const timer = setInterval(() => {
        progress += Math.random() * 25;
        if (progress > 100) {
          progress = 100;
          clearInterval(timer);
          setUploading(false);

          // 添加新的分析记录
          const newAnalysis: BidAnalysis = {
            id: Date.now().toString(),
            fileName: (file as File).name,
            fileSize: (file as File).size,
            uploadDate: new Date().toLocaleString("zh-CN"),
            analysisStatus: "analyzing",
            progress: 0,
            score: 0,
            defects: [],
            suggestions: [],
          };

          setAnalyses(prev => [newAnalysis, ...prev]);
          message.success("文件上传成功，AI智能分析已启动");
          onSuccess?.(null);

          // 模拟分析过程
          simulateAnalysis(newAnalysis.id);
        }
        onProgress?.({ percent: progress });
      }, 200);
    },
  };

  const simulateAnalysis = (analysisId: string) => {
    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 8;
      if (progress > 100) {
        progress = 100;
        clearInterval(timer);

        // 更新分析结果
        setAnalyses(prev => prev.map(analysis =>
          analysis.id === analysisId
            ? {
              ...analysis,
              analysisStatus: "completed" as const,
              progress: 100,
              score: Math.floor(Math.random() * 15) + 85, // 85-100分
              defects: [
                {
                  id: Date.now().toString(),
                  type: "minor" as const,
                  description: "文档格式规范性有待提升",
                  location: "文档第3-5页",
                  suggestion: "建议按照最新标准调整文档格式",
                },
              ],
              suggestions: [
                "建议优化技术方案表述",
                "完善项目实施计划",
                "增加风险控制措施",
              ],
            }
            : analysis,
        ));
        message.success("AI智能分析完成，报告已生成");
      } else {
        setAnalyses(prev => prev.map(analysis =>
          analysis.id === analysisId
            ? { ...analysis, progress }
            : analysis,
        ));
      }
    }, 600);
  };

  const getStatusConfig = (status: BidAnalysis["analysisStatus"]) => {
    const configs = {
      completed: { color: "success", text: "分析完成", icon: <CheckCircleOutlined /> },
      analyzing: { color: "processing", text: "分析中", icon: <BarChartOutlined /> },
      pending: { color: "warning", text: "等待分析", icon: <ExclamationCircleOutlined /> },
      failed: { color: "error", text: "分析失败", icon: <CloseCircleOutlined /> },
    };
    return configs[status] || configs.pending;
  };

  const getDefectTypeConfig = (type: BidDefect["type"]) => {
    const configs = {
      critical: { color: "red", text: "严重缺陷", icon: <CloseCircleOutlined /> },
      major: { color: "orange", text: "重要缺陷", icon: <ExclamationCircleOutlined /> },
      minor: { color: "blue", text: "轻微缺陷", icon: <CheckCircleOutlined /> },
    };
    return configs[type] || configs.minor;
  };

  const defectColumns: ColumnsType<BidDefect> = [
    {
      title: "缺陷类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: BidDefect["type"]) => {
        const config = getDefectTypeConfig(type);
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
      title: "位置",
      dataIndex: "location",
      key: "location",
      width: 150,
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "#52c41a";
    if (score >= 90) return "#73d13d";
    if (score >= 85) return "#faad14";
    if (score >= 80) return "#fa8c16";
    return "#ff4d4f";
  };

  const completedAnalyses = analyses.filter(a => a.analysisStatus === "completed");
  const analyzingCount = analyses.filter(a => a.analysisStatus === "analyzing").length;
  const avgScore = completedAnalyses.length > 0
    ? completedAnalyses.reduce((sum, a) => sum + a.score, 0) / completedAnalyses.length
    : 0;
  const totalDefects = completedAnalyses.reduce((sum, a) => sum + a.defects.length, 0);
  const criticalDefects = completedAnalyses.reduce((sum, a) =>
    sum + a.defects.filter(d => d.type === "critical").length, 0,
  );

  const handleViewDetail = (analysis: BidAnalysis) => {
    if (analysis.analysisStatus === "completed") {
      router.push(`/dashboard/bid-analysis/${analysis.id}`);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("数据已刷新");
    }, 1000);
  };

  return (
    <div>
      {/* 页面标题和操作 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <BarChartOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              投标分析管理
            </Title>
            <Text type="secondary">AI智能分析投标文件，提供专业优化建议</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
              刷新
            </Button>
            <Button icon={<FilterOutlined />}>
              筛选
            </Button>
          </Space>
        </div>
      </div>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总分析数量"
              value={analyses.length}
              suffix="份"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均得分"
              value={avgScore}
              precision={1}
              suffix="分"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: getScoreColor(avgScore) }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="检出缺陷"
              value={totalDefects}
              suffix="个"
              prefix={<BugOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
            {criticalDefects > 0 && (
              <div style={{ marginTop: 8 }}>
                <Badge count={criticalDefects} style={{ backgroundColor: "#ff4d4f" }}>
                  <Text type="secondary">严重缺陷</Text>
                </Badge>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="分析准确率"
              value={96.8}
              precision={1}
              suffix="%"
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
            {analyzingCount > 0 && (
              <div style={{ marginTop: 8 }}>
                <Badge count={analyzingCount} style={{ backgroundColor: "#1890ff" }}>
                  <Text type="secondary">分析中</Text>
                </Badge>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 文件上传 */}
      <Card
        title={
          <Space>
            <CloudUploadOutlined style={{ color: "#1890ff" }} />
            <span>上传投标文件</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Alert
          message="AI智能分析服务"
          description="支持PDF、DOC、DOCX格式，单个文件不超过50MB。采用先进的NLP技术和专业知识库，分析准确率≥95%，为您提供专业的投标优化建议。"
          type="info"
          showIcon
          icon={<BulbOutlined />}
          style={{ marginBottom: 16 }}
        />
        <Upload.Dragger {...uploadProps} style={{ padding: "40px 20px" }}>
          <p className="ant-upload-drag-icon">
            <CloudUploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传，采用企业级加密技术保护您的文件安全
          </p>
        </Upload.Dragger>
      </Card>

      {/* 分析记录 */}
      <Card
        title={
          <Space>
            <BarChartOutlined style={{ color: "#1890ff" }} />
            <span>分析记录</span>
            <Badge count={analyses.length} style={{ backgroundColor: "#f0f0f0", color: "#666" }} />
          </Space>
        }
        loading={loading}
      >
        <List
          dataSource={analyses}
          renderItem={(item) => {
            const statusConfig = getStatusConfig(item.analysisStatus);
            return (
              <List.Item
                actions={[
                  item.analysisStatus === "completed" && (
                    <Tooltip title="查看详细分析报告">
                      <Button
                        key="view"
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(item)}
                      >
                        查看详情
                      </Button>
                    </Tooltip>
                  ),
                  item.analysisStatus === "completed" && (
                    <Tooltip title="下载分析报告">
                      <Button
                        key="download"
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => message.success("报告下载已开始")}
                      >
                        下载报告
                      </Button>
                    </Tooltip>
                  ),
                  item.analysisStatus === "failed" && (
                    <Button
                      key="retry"
                      type="link"
                      icon={<ReloadOutlined />}
                      onClick={() => message.info("重新分析功能开发中")}
                    >
                      重新分析
                    </Button>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ position: "relative" }}>
                      <FileTextOutlined
                        style={{
                          fontSize: 32,
                          color: item.analysisStatus === "completed" ? "#52c41a" :
                            item.analysisStatus === "analyzing" ? "#1890ff" :
                              item.analysisStatus === "failed" ? "#ff4d4f" : "#faad14",
                        }}
                      />
                      {item.analysisStatus === "analyzing" && (
                        <div style={{
                          position: "absolute",
                          top: -2,
                          right: -2,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#1890ff",
                          animation: "pulse 1.5s infinite",
                        }} />
                      )}
                    </div>
                  }
                  title={
                    <div>
                      <Space>
                        <Text strong style={{ fontSize: 16 }}>{item.fileName}</Text>
                        <Tag color={statusConfig.color} icon={statusConfig.icon}>
                          {statusConfig.text}
                        </Tag>
                        {item.analysisStatus === "completed" && (
                          <Tag color={getScoreColor(item.score) === "#52c41a" ? "green" :
                            getScoreColor(item.score) === "#faad14" ? "orange" : "red"}>
                            <TrophyOutlined style={{ marginRight: 4 }} />
                            {item.score}分
                          </Tag>
                        )}
                      </Space>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Space split={<Divider type="vertical" />}>
                          <Text type="secondary">
                            <FileTextOutlined style={{ marginRight: 4 }} />
                            {formatFileSize(item.fileSize)}
                          </Text>
                          <Text type="secondary">{item.uploadDate}</Text>
                        </Space>
                      </div>
                      {item.analysisStatus === "analyzing" && (
                        <div style={{ marginBottom: 8 }}>
                          <Progress
                            percent={item.progress}
                            size="small"
                            status="active"
                            format={(percent) => `分析进度 ${percent}%`}
                          />
                        </div>
                      )}
                      {item.analysisStatus === "completed" && (
                        <Space split={<Divider type="vertical" />}>
                          <Text type="secondary">
                            <BugOutlined style={{ marginRight: 4, color: "#cf1322" }} />
                            发现 {item.defects.length} 个问题
                          </Text>
                          <Text type="secondary">
                            <BulbOutlined style={{ marginRight: 4, color: "#faad14" }} />
                            {item.suggestions.length} 条优化建议
                          </Text>
                          {item.defects.some(d => d.type === "critical") && (
                            <Text type="danger">
                              <ExclamationCircleOutlined style={{ marginRight: 4 }} />
                              包含严重缺陷
                            </Text>
                          )}
                        </Space>
                      )}
                      {item.analysisStatus === "failed" && (
                        <Text type="danger">
                          <CloseCircleOutlined style={{ marginRight: 4 }} />
                          分析失败，请检查文件格式或重新上传
                        </Text>
                      )}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <BarChartOutlined style={{ color: "#1890ff" }} />
            <span>分析详情 - {selectedAnalysis?.fileName}</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => message.success("完整报告下载已开始")}
          >
            下载完整报告
          </Button>,
        ]}
      >
        {selectedAnalysis && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="综合得分"
                    value={selectedAnalysis.score}
                    suffix="分"
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: getScoreColor(selectedAnalysis.score) }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="发现问题"
                    value={selectedAnalysis.defects.length}
                    suffix="个"
                    prefix={<BugOutlined />}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="优化建议"
                    value={selectedAnalysis.suggestions.length}
                    suffix="条"
                    prefix={<BulbOutlined />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="文件大小"
                    value={formatFileSize(selectedAnalysis.fileSize)}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>

            {selectedAnalysis.defects.length > 0 && (
              <Card
                title={
                  <Space>
                    <BugOutlined style={{ color: "#cf1322" }} />
                    <span>缺陷列表</span>
                  </Space>
                }
                size="small"
                style={{ marginBottom: 16 }}
              >
                <Table
                  columns={defectColumns}
                  dataSource={selectedAnalysis.defects}
                  rowKey="id"
                  size="small"
                  pagination={false}
                />
              </Card>
            )}

            <Card
              title={
                <Space>
                  <BulbOutlined style={{ color: "#faad14" }} />
                  <span>优化建议</span>
                </Space>
              }
              size="small"
            >
              <List
                dataSource={selectedAnalysis.suggestions}
                renderItem={(suggestion, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "#faad14",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}>
                          {index + 1}
                        </div>
                      }
                      description={suggestion}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Modal>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BidAnalysisPage;
