"use client";
import type {
  ComparisonDifference,
  Qualification,
  QualificationComparison,
} from "@/types/dashboard/tender";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  SwapOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Alert,
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
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";

const { Option } = Select;
const { Title, Text } = Typography;

const QualificationComparePage: React.FC = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [availableQualifications, setAvailableQualifications] = useState<Qualification[]>([]);
  const [comparison, setComparison] = useState<QualificationComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockQualifications: Qualification[] = [
        {
          id: "1",
          companyName: "中建三局集团有限公司",
          companyCode: "ZJ3J001",
          qualificationType: "建筑工程施工总承包",
          qualificationLevel: "特级",
          certificateNumber: "A1234567890",
          issueDate: "2020-01-15",
          expiryDate: "2025-01-15",
          issuingAuthority: "住房和城乡建设部",
          businessScope: ["房屋建筑工程", "市政公用工程", "机电安装工程"],
          status: "valid",
          attachments: [],
          createdAt: "2020-01-15",
          updatedAt: "2024-01-10",
        },
        {
          id: "2",
          companyName: "中国建筑股份有限公司",
          companyCode: "ZGJS002",
          qualificationType: "建筑工程施工总承包",
          qualificationLevel: "特级",
          certificateNumber: "A0987654321",
          issueDate: "2021-03-20",
          expiryDate: "2024-03-20",
          issuingAuthority: "住房和城乡建设部",
          businessScope: ["房屋建筑工程", "市政公用工程"],
          status: "expiring",
          attachments: [],
          createdAt: "2021-03-20",
          updatedAt: "2024-01-12",
        },
        {
          id: "3",
          companyName: "上海建工集团股份有限公司",
          companyCode: "SHJG003",
          qualificationType: "建筑工程施工总承包",
          qualificationLevel: "一级",
          certificateNumber: "B1122334455",
          issueDate: "2022-06-10",
          expiryDate: "2027-06-10",
          issuingAuthority: "上海市住房和城乡建设管理委员会",
          businessScope: ["房屋建筑工程", "市政公用工程", "城市轨道交通工程"],
          status: "valid",
          attachments: [],
          createdAt: "2022-06-10",
          updatedAt: "2024-01-08",
        },
        {
          id: "4",
          companyName: "中铁建工集团有限公司",
          companyCode: "ZTJG004",
          qualificationType: "建筑工程施工总承包",
          qualificationLevel: "特级",
          certificateNumber: "A5566778899",
          issueDate: "2019-09-15",
          expiryDate: "2024-09-15",
          issuingAuthority: "住房和城乡建设部",
          businessScope: ["房屋建筑工程", "铁路工程", "市政公用工程"],
          status: "expiring",
          attachments: [],
          createdAt: "2019-09-15",
          updatedAt: "2024-01-05",
        },
        {
          id: "5",
          companyName: "广东建工集团有限公司",
          companyCode: "GDJG005",
          qualificationType: "建筑工程施工总承包",
          qualificationLevel: "一级",
          certificateNumber: "B9988776655",
          issueDate: "2021-12-01",
          expiryDate: "2026-12-01",
          issuingAuthority: "广东省住房和城乡建设厅",
          businessScope: ["房屋建筑工程", "市政公用工程"],
          status: "valid",
          attachments: [],
          createdAt: "2021-12-01",
          updatedAt: "2024-01-15",
        },
      ];
      setAvailableQualifications(mockQualifications);
      setDataLoading(false);
    };

    loadData();
  }, []);

  const handleAddCompany = (companyId: string) => {
    if (selectedCompanies.length >= 5) {
      message.warning("最多只能选择5家企业进行对比");
      return;
    }
    if (!selectedCompanies.includes(companyId)) {
      setSelectedCompanies([...selectedCompanies, companyId]);
      message.success("企业添加成功");
    }
  };

  const handleRemoveCompany = (companyId: string) => {
    setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
    message.info("已移除企业");
  };

  const handleClearAll = () => {
    setSelectedCompanies([]);
    setComparison(null);
    message.info("已清空所有选择");
  };

  const handleRefresh = () => {
    setDataLoading(true);
    setTimeout(() => {
      setDataLoading(false);
      message.success("数据刷新成功");
    }, 1000);
  };

  const handleCompare = () => {
    if (selectedCompanies.length < 2) {
      message.warning("至少选择2家企业进行对比");
      return;
    }

    setLoading(true);

    // 模拟对比分析
    setTimeout(() => {
      const selectedQualifications = availableQualifications.filter(q =>
        selectedCompanies.includes(q.id),
      );

      const mockComparison: QualificationComparison = {
        companies: selectedQualifications,
        comparisonResult: {
          differences: [
            {
              field: "qualificationLevel",
              fieldName: "资质等级",
              values: Object.fromEntries(
                selectedQualifications.map(q => [q.id, q.qualificationLevel]),
              ),
              isDifferent: new Set(selectedQualifications.map(q => q.qualificationLevel)).size > 1,
            },
            {
              field: "status",
              fieldName: "证书状态",
              values: Object.fromEntries(
                selectedQualifications.map(q => [q.id, q.status]),
              ),
              isDifferent: new Set(selectedQualifications.map(q => q.status)).size > 1,
            },
            {
              field: "businessScope",
              fieldName: "经营范围",
              values: Object.fromEntries(
                selectedQualifications.map(q => [q.id, q.businessScope]),
              ),
              isDifferent: true,
            },
            {
              field: "issuingAuthority",
              fieldName: "发证机关",
              values: Object.fromEntries(
                selectedQualifications.map(q => [q.id, q.issuingAuthority]),
              ),
              isDifferent: new Set(selectedQualifications.map(q => q.issuingAuthority)).size > 1,
            },
            {
              field: "expiryDate",
              fieldName: "有效期至",
              values: Object.fromEntries(
                selectedQualifications.map(q => [q.id, q.expiryDate]),
              ),
              isDifferent: new Set(selectedQualifications.map(q => q.expiryDate)).size > 1,
            },
          ],
          scores: selectedQualifications.map((company, index) => {
            const baseScore = getLevelScore(company.qualificationLevel);
            const statusScore = getStatusScore(company.status);
            const scopeScore = company.businessScope.length * 5;
            const totalScore = Math.min(100, baseScore + statusScore + scopeScore - index * 2);

            return {
              companyId: company.id,
              companyName: company.companyName,
              totalScore,
              categoryScores: {
                "资质等级": baseScore,
                "有效期状态": statusScore,
                "经营范围": Math.min(100, scopeScore),
                "证书完整性": 95 - index,
                "行业声誉": 85 + index * 2,
              },
              rank: index + 1,
            };
          }).sort((a, b) => b.totalScore - a.totalScore).map((item, index) => ({ ...item, rank: index + 1 })),
          summary: {
            totalCompanies: selectedCompanies.length,
            differenceCount: selectedQualifications.length > 1 ? 4 : 0,
            recommendedCompany: selectedQualifications[0]?.companyName || "",
            comparisonDate: new Date().toLocaleString("zh-CN"),
          },
        },
      };

      setComparison(mockComparison);
      setLoading(false);
      message.success("对比分析完成");
    }, 2000);
  };

  const handleExport = (format: "pdf" | "excel") => {
    message.success(`正在导出${format.toUpperCase()}格式的对比报告...`);
    setExportModalVisible(false);
    // 模拟导出进度
    setTimeout(() => {
      message.success("报告导出成功");
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid": return "success";
      case "expiring": return "warning";
      case "expired": return "error";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "valid": return "有效";
      case "expiring": return "即将过期";
      case "expired": return "已过期";
      default: return "未知";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid": return <CheckCircleOutlined />;
      case "expiring": return <ExclamationCircleOutlined />;
      case "expired": return <CloseCircleOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const getLevelScore = (level: string) => {
    switch (level) {
      case "特级": return 100;
      case "一级": return 85;
      case "二级": return 70;
      case "三级": return 55;
      default: return 40;
    }
  };

  const getStatusScore = (status: string) => {
    switch (status) {
      case "valid": return 100;
      case "expiring": return 70;
      case "expired": return 30;
      default: return 50;
    }
  };

  const renderComparisonTable = () => {
    if (!comparison) return null;

    const columns: ColumnsType<any> = [
      {
        title: (
          <div style={{ fontWeight: "bold", color: "#1890ff" }}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            对比项目
          </div>
        ),
        dataIndex: "fieldName",
        key: "fieldName",
        width: 140,
        fixed: "left",
        render: (text: string) => (
          <Text strong style={{ color: "#262626" }}>{text}</Text>
        ),
      },
      ...comparison.companies.map((company) => ({
        title: (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: 4 }}>
              <SafetyCertificateOutlined style={{ marginRight: 6, color: "#1890ff" }} />
              {company.companyName}
            </div>
            <Tag color="blue" className="small-tag">{company.companyCode}</Tag>
          </div>
        ),
        dataIndex: company.id,
        key: company.id,
        width: 220,
        render: (value: any, record: ComparisonDifference) => {
          const cellValue = record.values[company.id];
          const isDifferent = record.isDifferent;

          let displayValue = cellValue;

          if (record.field === "status") {
            displayValue = (
              <Tag
                color={getStatusColor(cellValue)}
                icon={getStatusIcon(cellValue)}
                style={{ borderRadius: "6px" }}
              >
                {getStatusLabel(cellValue)}
              </Tag>
            );
          } else if (record.field === "qualificationLevel") {
            const score = getLevelScore(cellValue);
            displayValue = (
              <Tag
                color={score >= 100 ? "gold" : score >= 85 ? "blue" : score >= 70 ? "green" : "default"}
                icon={<StarOutlined />}
                style={{ borderRadius: "6px" }}
              >
                {cellValue}
              </Tag>
            );
          } else if (record.field === "businessScope") {
            displayValue = (
              <div style={{ maxHeight: "80px", overflowY: "auto" }}>
                {cellValue.map((scope: string, index: number) => (
                  <Tag
                    key={index}
                    className="small-tag"
                    style={{
                      marginBottom: 4,
                      borderRadius: "4px",
                      backgroundColor: "#f0f2f5",
                      border: "1px solid #d9d9d9",
                    }}
                  >
                    {scope}
                  </Tag>
                ))}
              </div>
            );
          } else if (record.field === "expiryDate") {
            const isExpiring = new Date(cellValue) <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
            displayValue = (
              <div style={{ color: isExpiring ? "#faad14" : "#52c41a" }}>
                {cellValue}
              </div>
            );
          }

          return (
            <div style={{
              backgroundColor: isDifferent ? "#fff7e6" : "inherit",
              padding: "8px",
              borderRadius: "6px",
              border: isDifferent ? "1px solid #ffd591" : "1px solid transparent",
              position: "relative",
            }}>
              {displayValue}
              {isDifferent && (
                <Tooltip title="此项存在差异">
                  <ExclamationCircleOutlined
                    style={{
                      color: "#faad14",
                      position: "absolute",
                      top: 4,
                      right: 4,
                      fontSize: "12px",
                    }}
                  />
                </Tooltip>
              )}
            </div>
          );
        },
      })),
    ];

    return (
      <Table
        columns={columns}
        dataSource={comparison.comparisonResult.differences}
        rowKey="field"
        pagination={false}
        scroll={{ x: 800 }}
        size="middle"
        bordered
        style={{
          backgroundColor: "#fafafa",
          borderRadius: "8px",
        }}
      />
    );
  };

  const renderScoreComparison = () => {
    if (!comparison) return null;

    return (
      <Row gutter={[16, 16]}>
        {comparison.comparisonResult.scores.map((score) => (
          <Col xs={24} lg={8} key={score.companyId}>
            <Card
              hoverable
              style={{
                borderRadius: "12px",
                boxShadow: score.rank === 1 ? "0 4px 12px rgba(24, 144, 255, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                border: score.rank === 1 ? "2px solid #1890ff" : "1px solid #f0f0f0",
              }}
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                    <Text strong style={{ fontSize: "16px" }}>{score.companyName}</Text>
                  </div>
                  {score.rank === 1 && (
                    <TrophyOutlined style={{ color: "#faad14", fontSize: "20px" }} />
                  )}
                </div>
              }
              extra={
                <Badge
                  count={`第${score.rank}名`}
                  style={{
                    backgroundColor: score.rank === 1 ? "#52c41a" : score.rank === 2 ? "#faad14" : "#ff7875",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              }
            >
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <Statistic
                  title="综合得分"
                  value={score.totalScore}
                  suffix="分"
                  valueStyle={{
                    color: score.totalScore >= 90 ? "#52c41a" : score.totalScore >= 80 ? "#faad14" : "#ff4d4f",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                  prefix={<BarChartOutlined />}
                />
                <Progress
                  percent={score.totalScore}
                  strokeColor={{
                    "0%": score.totalScore >= 90 ? "#52c41a" : score.totalScore >= 80 ? "#faad14" : "#ff4d4f",
                    "100%": score.totalScore >= 90 ? "#73d13d" : score.totalScore >= 80 ? "#ffc53d" : "#ff7875",
                  }}
                  style={{ marginTop: 8 }}
                />
              </div>

              <Divider style={{ margin: "16px 0" }} />

              <div>
                <Text strong style={{ marginBottom: 12, display: "block" }}>分项得分</Text>
                {Object.entries(score.categoryScores).map(([category, categoryScore]) => (
                  <div key={category} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <Text style={{ fontSize: "13px" }}>{category}</Text>
                      <Text strong style={{ fontSize: "13px" }}>{categoryScore}分</Text>
                    </div>
                    <Progress
                      percent={categoryScore}
                      size="small"
                      status={categoryScore >= 90 ? "success" : categoryScore >= 80 ? "normal" : "exception"}
                      showInfo={false}
                      strokeColor={categoryScore >= 90 ? "#52c41a" : categoryScore >= 80 ? "#1890ff" : "#ff4d4f"}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  if (dataLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">正在加载企业资质数据...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
          <SwapOutlined style={{ marginRight: 12 }} />
          资质对比分析
        </Title>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          智能化企业资质多维度对比分析平台
        </Text>
      </div>

      {/* 操作面板 */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <SafetyCertificateOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            企业选择与对比
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={dataLoading}
            >
              刷新数据
            </Button>
            {selectedCompanies.length > 0 && (
              <Button
                icon={<DeleteOutlined />}
                onClick={handleClearAll}
                danger
              >
                清空选择
              </Button>
            )}
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Alert
          message="对比说明"
          description="选择2-5家企业进行资质对比，系统将从资质等级、有效期状态、经营范围、发证机关等维度进行综合分析评分。"
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: 20 }}
        />

        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col xs={24} lg={14}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>选择对比企业:</Text>
            </div>
            <Select<string>
              style={{ width: "100%" }}
              placeholder="请选择要对比的企业"
              onSelect={handleAddCompany}
              value={undefined}
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {availableQualifications
                .filter(q => !selectedCompanies.includes(q.id))
                .map(q => (
                  <Option key={q.id} value={q.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{q.companyName}</span>
                      <Tag color={q.qualificationLevel === "特级" ? "gold" : "blue"} className="small-tag">
                        {q.qualificationLevel}
                      </Tag>
                    </div>
                  </Option>
                ))
              }
            </Select>
          </Col>
          <Col xs={24} lg={10}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>操作:</Text>
            </div>
            <Space size="middle">
              <Button
                type="primary"
                icon={<SwapOutlined />}
                onClick={handleCompare}
                loading={loading}
                disabled={selectedCompanies.length < 2}
                size="large"
              >
                开始对比分析
              </Button>
              {comparison && (
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => setExportModalVisible(true)}
                  size="large"
                >
                  导出报告
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {selectedCompanies.length > 0 && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <Text strong>已选择企业 ({selectedCompanies.length}/5):</Text>
            </div>
            <Space wrap size={[8, 8]}>
              {selectedCompanies.map(companyId => {
                const company = availableQualifications.find(q => q.id === companyId);
                return company ? (
                  <Tag
                    key={companyId}
                    closable
                    onClose={() => handleRemoveCompany(companyId)}
                    color="processing"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "13px",
                    }}
                    icon={<TeamOutlined />}
                  >
                    {company.companyName}
                  </Tag>
                ) : null;
              })}
            </Space>
          </div>
        )}
      </Card>

      {loading && (
        <Card style={{ marginBottom: 16, textAlign: "center" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>正在进行智能对比分析，请稍候...</Text>
          </div>
        </Card>
      )}

      {comparison && (
        <div>
          {/* 对比摘要 */}
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <BarChartOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                对比摘要
              </div>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="对比企业数"
                  value={comparison.comparisonResult.summary.totalCompanies}
                  suffix="家"
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="差异项目数"
                  value={comparison.comparisonResult.summary.differenceCount}
                  suffix="项"
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: "#faad14" }}
                />
              </Col>
              <Col xs={24} sm={6}>
                <div>
                  <div style={{ fontSize: "14px", color: "#666", marginBottom: 4 }}>推荐企业</div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#52c41a" }}>
                    <TrophyOutlined style={{ marginRight: 8 }} />
                    {comparison.comparisonResult.summary.recommendedCompany}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={6}>
                <div>
                  <div style={{ fontSize: "14px", color: "#666", marginBottom: 4 }}>对比时间</div>
                  <div style={{ fontSize: "16px" }}>
                    {comparison.comparisonResult.summary.comparisonDate}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 评分对比 */}
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <BarChartOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                评分对比
              </div>
            }
            style={{ marginBottom: 16 }}
          >
            {renderScoreComparison()}
          </Card>

          {/* 详细对比 */}
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <FileTextOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                详细对比
              </div>
            }
          >
            {renderComparisonTable()}
          </Card>
        </div>
      )}

      {!comparison && !loading && selectedCompanies.length === 0 && (
        <Card style={{ textAlign: "center", padding: "60px 0" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary">请选择企业进行资质对比分析</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  支持同时对比2-5家企业的资质信息
                </Text>
              </div>
            }
          />
        </Card>
      )}

      {/* 导出弹窗 */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <DownloadOutlined style={{ marginRight: 8 }} />
            导出对比报告
          </div>
        }
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setExportModalVisible(false)}>
            取消
          </Button>,
          <Button key="pdf" type="primary" onClick={() => handleExport("pdf")}>
            <DownloadOutlined /> 导出PDF
          </Button>,
          <Button key="excel" onClick={() => handleExport("excel")}>
            <DownloadOutlined /> 导出Excel
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="报告标题">
            <Input
              defaultValue="企业资质对比分析报告"
              placeholder="请输入报告标题"
            />
          </Form.Item>
          <Form.Item label="报告说明">
            <Input.TextArea
              rows={4}
              defaultValue="本报告基于企业资质信息进行多维度对比分析，从资质等级、有效期状态、经营范围、发证机关等角度综合评估，为项目决策提供科学参考依据。"
              placeholder="请输入报告说明"
            />
          </Form.Item>
          <Alert
            message="导出说明"
            description="PDF格式适合打印和存档，Excel格式便于进一步数据分析和处理。"
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default QualificationComparePage;
