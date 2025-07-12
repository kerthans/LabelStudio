"use client";

import {
  AlertOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileProtectOutlined,
  FireOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SafetyOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  StopOutlined,
  SyncOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Progress,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  Upload,
  UploadProps,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;

interface SecurityAlert {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: "active" | "resolved" | "investigating";
  affectedSystems: string[];
  severity: number;
}

interface DataLeak {
  id: string;
  type: "data_breach" | "unauthorized_access" | "data_exposure" | "system_compromise";
  title: string;
  description: string;
  discoveredAt: string;
  affectedRecords: number;
  dataTypes: string[];
  status: "detected" | "investigating" | "contained" | "resolved";
  riskLevel: "critical" | "high" | "medium" | "low";
  responseActions: string[];
}

interface MD5CheckResult {
  fileName: string;
  originalMD5: string;
  currentMD5: string;
  status: "match" | "mismatch" | "checking";
  checkTime: string;
}

interface EmergencyAction {
  id: string;
  name: string;
  description: string;
  type: "isolation" | "backup" | "notification" | "shutdown" | "recovery";
  status: "ready" | "executing" | "completed" | "failed";
  lastExecuted?: string;
  estimatedTime: number; // 分钟
}

const SecurityManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [dataLeaks, setDataLeaks] = useState<DataLeak[]>([]);
  const [md5Results, setMD5Results] = useState<MD5CheckResult[]>([]);
  const [emergencyActions, setEmergencyActions] = useState<EmergencyAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<EmergencyAction | null>(null);
  const [md5ModalVisible, setMD5ModalVisible] = useState(false);
  const [leakDetailVisible, setLeakDetailVisible] = useState(false);
  const [selectedLeak, setSelectedLeak] = useState<DataLeak | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadSecurityData();

    // 定时刷新安全数据
    const interval = setInterval(loadSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = () => {
    setLoading(true);

    // 模拟安全告警数据
    const mockAlerts: SecurityAlert[] = [
      {
        id: "alert-1",
        type: "critical",
        title: "检测到异常登录行为",
        description: "发现来自异常IP地址的多次登录尝试",
        source: "登录监控系统",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: "active",
        affectedSystems: ["用户认证系统", "API网关"],
        severity: 9,
      },
      {
        id: "alert-2",
        type: "high",
        title: "数据库连接异常",
        description: "数据库出现大量异常连接请求",
        source: "数据库监控",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: "investigating",
        affectedSystems: ["主数据库", "备份数据库"],
        severity: 7,
      },
      {
        id: "alert-3",
        type: "medium",
        title: "文件完整性检查失败",
        description: "系统关键文件MD5校验不匹配",
        source: "文件监控系统",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: "resolved",
        affectedSystems: ["文件系统"],
        severity: 5,
      },
    ];

    // 模拟数据泄露事件
    const mockLeaks: DataLeak[] = [
      {
        id: "leak-1",
        type: "unauthorized_access",
        title: "未授权访问用户数据",
        description: "检测到未授权用户尝试访问敏感用户数据",
        discoveredAt: new Date(Date.now() - 1800000).toISOString(),
        affectedRecords: 1250,
        dataTypes: ["用户个人信息", "联系方式", "登录记录"],
        status: "contained",
        riskLevel: "high",
        responseActions: ["立即隔离受影响系统", "重置相关用户密码", "通知相关用户"],
      },
      {
        id: "leak-2",
        type: "data_exposure",
        title: "配置文件意外暴露",
        description: "系统配置文件在公共目录中被意外暴露",
        discoveredAt: new Date(Date.now() - 3600000).toISOString(),
        affectedRecords: 0,
        dataTypes: ["系统配置", "数据库连接信息"],
        status: "resolved",
        riskLevel: "medium",
        responseActions: ["移除暴露文件", "更新配置密钥", "审查访问日志"],
      },
    ];

    // 模拟MD5检查结果
    const mockMD5Results: MD5CheckResult[] = [
      {
        fileName: "system_config.json",
        originalMD5: "a1b2c3d4e5f6789012345678901234567890abcd",
        currentMD5: "a1b2c3d4e5f6789012345678901234567890abcd",
        status: "match",
        checkTime: new Date().toISOString(),
      },
      {
        fileName: "user_database.db",
        originalMD5: "f1e2d3c4b5a6789012345678901234567890fedc",
        currentMD5: "f1e2d3c4b5a6789012345678901234567890fedc",
        status: "match",
        checkTime: new Date().toISOString(),
      },
      {
        fileName: "security_policy.xml",
        originalMD5: "123456789abcdef0123456789abcdef012345678",
        currentMD5: "987654321fedcba0987654321fedcba098765432",
        status: "mismatch",
        checkTime: new Date().toISOString(),
      },
    ];

    // 模拟应急处置动作
    const mockEmergencyActions: EmergencyAction[] = [
      {
        id: "action-1",
        name: "系统隔离",
        description: "立即隔离受影响的系统组件，防止威胁扩散",
        type: "isolation",
        status: "ready",
        estimatedTime: 5,
      },
      {
        id: "action-2",
        name: "数据备份",
        description: "紧急备份关键数据到安全位置",
        type: "backup",
        status: "ready",
        estimatedTime: 15,
      },
      {
        id: "action-3",
        name: "安全通知",
        description: "向相关人员和用户发送安全警告通知",
        type: "notification",
        status: "ready",
        estimatedTime: 2,
      },
      {
        id: "action-4",
        name: "系统关闭",
        description: "紧急关闭受影响的系统服务",
        type: "shutdown",
        status: "ready",
        estimatedTime: 3,
      },
      {
        id: "action-5",
        name: "灾难恢复",
        description: "启动灾难恢复程序，恢复系统正常运行",
        type: "recovery",
        status: "ready",
        estimatedTime: 60,
      },
    ];

    setTimeout(() => {
      setAlerts(mockAlerts);
      setDataLeaks(mockLeaks);
      setMD5Results(mockMD5Results);
      setEmergencyActions(mockEmergencyActions);
      setLoading(false);
    }, 1000);
  };

  const handleEmergencyAction = (action: EmergencyAction) => {
    setSelectedAction(action);
    setEmergencyModalVisible(true);
  };

  const executeEmergencyAction = async () => {
    if (!selectedAction) return;

    setEmergencyActions(prev => prev.map(action =>
      action.id === selectedAction.id
        ? { ...action, status: "executing" }
        : action,
    ));

    setTimeout(() => {
      setEmergencyActions(prev => prev.map(action =>
        action.id === selectedAction.id
          ? {
            ...action,
            status: "completed",
            lastExecuted: new Date().toISOString(),
          }
          : action,
      ));
      message.success(`${selectedAction.name}执行完成`);
      setEmergencyModalVisible(false);
    }, selectedAction.estimatedTime * 100);
  };

  const handleMD5Check = async (values: any) => {
    const { files } = values;
    if (!files || files.length === 0) return;

    setLoading(true);

    setTimeout(() => {
      const newResults = files.map((file: any) => ({
        fileName: file.name,
        originalMD5: "a1b2c3d4e5f6789012345678901234567890abcd",
        currentMD5: Math.random() > 0.7
          ? "a1b2c3d4e5f6789012345678901234567890abcd"
          : "987654321fedcba0987654321fedcba098765432",
        status: Math.random() > 0.7 ? "match" : "mismatch",
        checkTime: new Date().toISOString(),
      }));

      setMD5Results(prev => [...newResults, ...prev]);
      setLoading(false);
      setMD5ModalVisible(false);
      message.success("MD5校验完成");
    }, 2000);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, status: "resolved" }
        : alert,
    ));
    message.success("告警已标记为已解决");
  };

  const handleLeakResponse = (leakId: string, action: string) => {
    setDataLeaks(prev => prev.map(leak =>
      leak.id === leakId
        ? {
          ...leak,
          status: action === "contain" ? "contained" : "resolved",
          responseActions: [...leak.responseActions, `执行${action}操作`],
        }
        : leak,
    ));
    message.success(`泄露事件${action}操作已执行`);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical": return "red";
      case "high": return "orange";
      case "medium": return "yellow";
      case "low": return "blue";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "red";
      case "investigating": return "orange";
      case "resolved": return "green";
      case "contained": return "blue";
      default: return "default";
    }
  };

  // 计算安全指标
  const criticalAlerts = alerts.filter(alert => alert.type === "critical" && alert.status === "active").length;
  const activeLeaks = dataLeaks.filter(leak => leak.status !== "resolved").length;
  const md5Mismatches = md5Results.filter(result => result.status === "mismatch").length;
  const _readyActions = emergencyActions.filter(action => action.status === "ready").length;
  const totalAlerts = alerts.length;
  const _resolvedAlerts = alerts.filter(alert => alert.status === "resolved").length;
  const _securityScore = Math.round(((totalAlerts - criticalAlerts - activeLeaks) / Math.max(totalAlerts, 1)) * 100);

  // 企业级安全指标配置
  interface SecurityMetric {
    key: string;
    title: string;
    value: number;
    icon: React.ReactNode;
    status: "success" | "warning" | "error";
    trend?: {
      value: number;
      isPositive: boolean;
    };
    description: string;
  }

  const securityMetrics: SecurityMetric[] = [
    {
      key: "critical-threats",
      title: "严重威胁",
      value: criticalAlerts,
      icon: <AlertOutlined style={{ fontSize: "24px" }} />,
      status: criticalAlerts === 0 ? "success" : "error",
      trend: { value: 2, isPositive: false },
      description: "需要立即处理的严重安全威胁数量",
    },
    {
      key: "active-incidents",
      title: "活跃事件",
      value: activeLeaks,
      icon: <ExclamationCircleOutlined style={{ fontSize: "24px" }} />,
      status: activeLeaks === 0 ? "success" : activeLeaks <= 2 ? "warning" : "error",
      trend: { value: 1, isPositive: false },
      description: "当前正在处理的安全事件数量",
    },
    {
      key: "system-integrity",
      title: "系统完整性",
      value: Math.round(((md5Results.length - md5Mismatches) / Math.max(md5Results.length, 1)) * 100),
      icon: <SafetyOutlined style={{ fontSize: "24px" }} />,
      status: md5Mismatches === 0 ? "success" : md5Mismatches <= 2 ? "warning" : "error",
      description: "系统文件完整性检查通过率",
    },
  ];

  const getMetricCardStyle = (status: string) => {
    const baseStyle = {
      borderRadius: "12px",
      border: "1px solid",
      transition: "all 0.3s ease",
    };

    switch (status) {
      case "success":
        return { ...baseStyle, borderColor: "#52c41a", backgroundColor: "#f6ffed" };
      case "warning":
        return { ...baseStyle, borderColor: "#faad14", backgroundColor: "#fffbe6" };
      case "error":
        return { ...baseStyle, borderColor: "#ff4d4f", backgroundColor: "#fff2f0" };
      default:
        return { ...baseStyle, borderColor: "#d9d9d9", backgroundColor: "#fafafa" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "warning": return <WarningOutlined style={{ color: "#faad14" }} />;
      case "error": return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
      default: return <DashboardOutlined style={{ color: "#1890ff" }} />;
    }
  };

  const alertColumns = [
    {
      title: "级别",
      dataIndex: "type",
      key: "type",
      render: (type: string, _record: SecurityAlert) => (
        <Tag color={getAlertColor(type)} icon={
          type === "critical" ? <FireOutlined /> :
            type === "high" ? <WarningOutlined /> :
              type === "medium" ? <ExclamationCircleOutlined /> :
                <BellOutlined />
        }>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "告警标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "来源",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={getStatusColor(status) as any}
          text={
            status === "active" ? "活跃" :
              status === "investigating" ? "调查中" : "已解决"
          }
        />
      ),
    },
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: string) => dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: SecurityAlert) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>详情</Button>
          {record.status === "active" && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleResolveAlert(record.id)}
            >
              解决
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const leakColumns = [
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const typeMap = {
          data_breach: "数据泄露",
          unauthorized_access: "未授权访问",
          data_exposure: "数据暴露",
          system_compromise: "系统入侵",
        };
        return typeMap[type as keyof typeof typeMap] || type;
      },
    },
    {
      title: "事件标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "风险级别",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (level: string) => (
        <Tag color={getAlertColor(level)}>
          {level.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "影响记录数",
      dataIndex: "affectedRecords",
      key: "affectedRecords",
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={getStatusColor(status) as any}
          text={
            status === "detected" ? "已检测" :
              status === "investigating" ? "调查中" :
                status === "contained" ? "已控制" : "已解决"
          }
        />
      ),
    },
    {
      title: "发现时间",
      dataIndex: "discoveredAt",
      key: "discoveredAt",
      render: (time: string) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: DataLeak) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedLeak(record);
              setLeakDetailVisible(true);
            }}
          >
            详情
          </Button>
          {record.status === "detected" && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleLeakResponse(record.id, "contain")}
            >
              控制
            </Button>
          )}
          {record.status === "contained" && (
            <Button
              size="small"
              onClick={() => handleLeakResponse(record.id, "resolve")}
            >
              解决
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const md5Columns = [
    {
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "原始MD5",
      dataIndex: "originalMD5",
      key: "originalMD5",
      render: (md5: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {md5.substring(0, 16)}...
        </Text>
      ),
    },
    {
      title: "当前MD5",
      dataIndex: "currentMD5",
      key: "currentMD5",
      render: (md5: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {md5.substring(0, 16)}...
        </Text>
      ),
    },
    {
      title: "校验结果",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "match" ? "green" : status === "mismatch" ? "red" : "orange"}
          icon={
            status === "match" ? <CheckCircleOutlined /> :
              status === "mismatch" ? <ExclamationCircleOutlined /> :
                <ClockCircleOutlined />
          }
        >
          {status === "match" ? "匹配" : status === "mismatch" ? "不匹配" : "检查中"}
        </Tag>
      ),
    },
    {
      title: "检查时间",
      dataIndex: "checkTime",
      key: "checkTime",
      render: (time: string) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: () => false,
    onChange: (info) => {
      form.setFieldsValue({ files: info.fileList.map(f => f.originFileObj) });
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="mb-2 text-gray-800">
              <SecurityScanOutlined className="mr-3" />
              安全管理中心
            </Title>
            <Text type="secondary" className="text-base">
              实时监控系统安全状态，快速响应安全威胁
            </Text>
          </div>
          <Space>
            <Button
              icon={<SyncOutlined />}
              onClick={loadSecurityData}
              loading={loading}
            >
              刷新数据
            </Button>
            <Button type="primary" icon={<SettingOutlined />}>
              安全配置
            </Button>
          </Space>
        </div>
      </div>

      {/* 关键安全指标 */}
      <div className="mb-8">
        <Title level={4} className="mb-4 text-gray-700">安全态势概览</Title>
        <Row gutter={[24, 24]}>
          {securityMetrics.map((metric) => (
            <Col xs={24} sm={12} lg={6} key={metric.key}>
              <Card
                className="h-full hover:shadow-lg transition-shadow duration-300"
                style={getMetricCardStyle(metric.status)}
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${metric.status === "success" ? "bg-green-100" :
                      metric.status === "warning" ? "bg-yellow-100" :
                        metric.status === "error" ? "bg-red-100" : "bg-blue-100"
                    }`}>
                      <div className={`${metric.status === "success" ? "text-green-600" :
                        metric.status === "warning" ? "text-yellow-600" :
                          metric.status === "error" ? "text-red-600" : "text-blue-600"
                      }`}>
                        {metric.icon}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusIcon(metric.status)}
                  </div>
                </div>

                <div className="mb-3">
                  <Text className="text-gray-600 text-sm font-medium">{metric.title}</Text>
                  <div className="flex items-baseline mt-1">
                    <span className={`text-3xl font-bold ${metric.status === "success" ? "text-green-600" :
                      metric.status === "warning" ? "text-yellow-600" :
                        metric.status === "error" ? "text-red-600" : "text-blue-600"
                    }`}>
                      {metric.key === "security-score" || metric.key === "system-integrity" ? `${metric.value}%` : metric.value}
                    </span>
                    {metric.trend && (
                      <span className={`ml-2 text-sm ${metric.trend.isPositive ? "text-green-500" : "text-red-500"
                      }`}>
                        {metric.trend.isPositive ? "↗" : "↘"} {metric.trend.value}
                      </span>
                    )}
                  </div>
                </div>

                <Tooltip title={metric.description}>
                  <Text type="secondary" className="text-xs leading-relaxed">
                    {metric.description}
                  </Text>
                </Tooltip>

                {metric.key === "security-score" && (
                  <div className="mt-3">
                    <Progress
                      percent={metric.value}
                      size="small"
                      strokeColor={
                        metric.value >= 80 ? "#52c41a" :
                          metric.value >= 60 ? "#faad14" : "#ff4d4f"
                      }
                      showInfo={false}
                    />
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 紧急告警横幅 */}
      {criticalAlerts > 0 && (
        <Alert
          message="检测到严重安全威胁"
          description={`当前有 ${criticalAlerts} 个严重安全告警需要立即处理，建议立即采取应急措施`}
          type="error"
          showIcon
          icon={<FireOutlined />}
          action={
            <Space>
              <Button size="small" danger type="primary">
                立即处理
              </Button>
              <Button size="small">
                查看详情
              </Button>
            </Space>
          }
          className="mb-6"
          style={{ borderRadius: "8px" }}
        />
      )}

      {/* 应急处置按钮区域 */}
      <Card title="应急处置" className="mb-6">
        <Row gutter={16}>
          {emergencyActions.map(action => (
            <Col span={8} key={action.id} className="mb-4">
              <Card
                size="small"
                title={
                  <Space>
                    {action.type === "isolation" && <StopOutlined />}
                    {action.type === "backup" && <DatabaseOutlined />}
                    {action.type === "notification" && <BellOutlined />}
                    {action.type === "shutdown" && <StopOutlined />}
                    {action.type === "recovery" && <PlayCircleOutlined />}
                    {action.name}
                  </Space>
                }
                extra={
                  <Tag color={
                    action.status === "ready" ? "green" :
                      action.status === "executing" ? "orange" :
                        action.status === "completed" ? "blue" : "red"
                  }>
                    {action.status === "ready" ? "就绪" :
                      action.status === "executing" ? "执行中" :
                        action.status === "completed" ? "已完成" : "失败"}
                  </Tag>
                }
              >
                <Paragraph ellipsis={{ rows: 2 }}>
                  {action.description}
                </Paragraph>
                <div className="flex justify-between items-center">
                  <Text type="secondary">预计耗时: {action.estimatedTime}分钟</Text>
                  <Button
                    type={action.type === "shutdown" ? "primary" : "default"}
                    size="small"
                    danger={action.type === "shutdown"}
                    disabled={action.status === "executing"}
                    loading={action.status === "executing"}
                    onClick={() => handleEmergencyAction(action)}
                  >
                    {action.status === "executing" ? "执行中" : "执行"}
                  </Button>
                </div>
                {action.lastExecuted && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    上次执行: {dayjs(action.lastExecuted).format("MM-DD HH:mm")}
                  </Text>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 主要功能区域 */}
      <Card style={{ borderRadius: "12px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: "24px" }}
        >
          <Tabs.TabPane
            tab={
              <span>
                <AlertOutlined />
                安全告警
                {alerts.filter(a => a.status === "active").length > 0 && (
                  <Badge count={alerts.filter(a => a.status === "active").length} className="ml-2" />
                )}
              </span>
            }
            key="alerts"
          >
            <div className="mb-4">
              <Space>
                <Button icon={<ReloadOutlined />} onClick={loadSecurityData}>
                  刷新数据
                </Button>
                <Button icon={<SettingOutlined />}>
                  告警规则
                </Button>
                <Button icon={<DownloadOutlined />}>
                  导出报告
                </Button>
              </Space>
            </div>
            <Table
              columns={alertColumns}
              dataSource={alerts}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条告警`,
              }}
              scroll={{ x: 800 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <ExclamationCircleOutlined />
                泄露处理
                {activeLeaks > 0 && (
                  <Badge count={activeLeaks} className="ml-2" />
                )}
              </span>
            }
            key="leaks"
          >
            <div className="mb-4">
              <Space>
                <Button icon={<ReloadOutlined />} onClick={loadSecurityData}>
                  刷新数据
                </Button>
                <Button icon={<DownloadOutlined />}>
                  导出报告
                </Button>
              </Space>
            </div>
            <Table
              columns={leakColumns}
              dataSource={dataLeaks}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个事件`,
              }}
              scroll={{ x: 800 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <FileProtectOutlined />
                文件校验
                {md5Mismatches > 0 && (
                  <Badge count={md5Mismatches} className="ml-2" />
                )}
              </span>
            }
            key="md5"
          >
            <div className="mb-4">
              <Space>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setMD5ModalVisible(true)}
                >
                  上传文件校验
                </Button>
                <Button icon={<ReloadOutlined />} onClick={loadSecurityData}>
                  刷新数据
                </Button>
              </Space>
            </div>
            <Table
              columns={md5Columns}
              dataSource={md5Results}
              rowKey={(record) => `${record.fileName}-${record.checkTime}`}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个文件`,
              }}
              scroll={{ x: 800 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                安全日志
              </span>
            }
            key="logs"
          >
            <div className="bg-white p-4 rounded-lg">
              <Timeline>
                <Timeline.Item color="red" dot={<FireOutlined />}>
                  <div>
                    <Text strong className="text-red-600">严重安全事件</Text>
                    <div className="text-gray-600">检测到异常登录行为 - {dayjs().subtract(5, "minute").format("HH:mm")}</div>
                  </div>
                </Timeline.Item>
                <Timeline.Item color="orange" dot={<WarningOutlined />}>
                  <div>
                    <Text strong className="text-orange-600">安全警告</Text>
                    <div className="text-gray-600">数据库连接异常 - {dayjs().subtract(10, "minute").format("HH:mm")}</div>
                  </div>
                </Timeline.Item>
                <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
                  <div>
                    <Text strong className="text-green-600">安全检查完成</Text>
                    <div className="text-gray-600">系统安全扫描完成 - {dayjs().subtract(30, "minute").format("HH:mm")}</div>
                  </div>
                </Timeline.Item>
                <Timeline.Item color="blue" dot={<SecurityScanOutlined />}>
                  <div>
                    <Text strong className="text-blue-600">安全策略更新</Text>
                    <div className="text-gray-600">更新防火墙规则 - {dayjs().subtract(1, "hour").format("HH:mm")}</div>
                  </div>
                </Timeline.Item>
              </Timeline>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* 应急处置确认模态框 */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-orange-500 mr-2" />
            应急处置确认
          </div>
        }
        open={emergencyModalVisible}
        onCancel={() => setEmergencyModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEmergencyModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="execute"
            type="primary"
            danger={selectedAction?.type === "shutdown"}
            onClick={executeEmergencyAction}
          >
            确认执行
          </Button>,
        ]}
        width={600}
      >
        {selectedAction && (
          <div className="space-y-4">
            <Alert
              message="操作确认"
              description="您即将执行应急处置操作，此操作可能会影响系统正常运行，请确认后再执行。"
              type="warning"
              showIcon
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>操作名称：</Text>
                <div>{selectedAction.name}</div>
              </div>
              <div>
                <Text strong>预计耗时：</Text>
                <div>{selectedAction.estimatedTime}分钟</div>
              </div>
            </div>

            <div>
              <Text strong>操作描述：</Text>
              <div className="mt-1 text-gray-600">{selectedAction.description}</div>
            </div>

            <div>
              <Text strong>操作类型：</Text>
              <div className="mt-1">
                <Tag color={
                  selectedAction.type === "isolation" ? "orange" :
                    selectedAction.type === "backup" ? "blue" :
                      selectedAction.type === "notification" ? "green" :
                        selectedAction.type === "shutdown" ? "red" : "purple"
                }>
                  {selectedAction.type === "isolation" ? "系统隔离" :
                    selectedAction.type === "backup" ? "数据备份" :
                      selectedAction.type === "notification" ? "安全通知" :
                        selectedAction.type === "shutdown" ? "系统关闭" : "灾难恢复"}
                </Tag>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MD5校验模态框 */}
      <Modal
        title={
          <div className="flex items-center">
            <FileProtectOutlined className="mr-2" />
            MD5文件校验
          </div>
        }
        open={md5ModalVisible}
        onCancel={() => setMD5ModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleMD5Check} layout="vertical">
          <Form.Item
            name="files"
            label="选择文件"
            rules={[{ required: true, message: "请选择要校验的文件" }]}
          >
            <Upload.Dragger {...uploadProps} className="border-dashed border-2 border-gray-300 rounded-lg">
              <p className="ant-upload-drag-icon">
                <UploadOutlined className="text-4xl text-blue-500" />
              </p>
              <p className="ant-upload-text text-lg">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint text-gray-500">支持单个或批量上传，系统将自动计算MD5值进行完整性校验</p>
            </Upload.Dragger>
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setMD5ModalVisible(false)}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              开始校验
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 泄露事件详情模态框 */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-red-500 mr-2" />
            数据泄露事件详情
          </div>
        }
        open={leakDetailVisible}
        onCancel={() => setLeakDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setLeakDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedLeak && (
          <div className="space-y-6">
            <Row gutter={16}>
              <Col span={12}>
                <div><strong>事件类型:</strong> {selectedLeak.type}</div>
              </Col>
              <Col span={12}>
                <div><strong>风险级别:</strong>
                  <Tag color={getAlertColor(selectedLeak.riskLevel)} className="ml-2">
                    {selectedLeak.riskLevel.toUpperCase()}
                  </Tag>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div><strong>发现时间:</strong> {dayjs(selectedLeak.discoveredAt).format("YYYY-MM-DD HH:mm:ss")}</div>
              </Col>
              <Col span={12}>
                <div><strong>影响记录数:</strong> {selectedLeak.affectedRecords.toLocaleString()}</div>
              </Col>
            </Row>

            <div>
              <strong>事件描述:</strong>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border">{selectedLeak.description}</div>
            </div>

            <div>
              <strong>涉及数据类型:</strong>
              <div className="mt-2 space-x-2">
                {selectedLeak.dataTypes.map(type => (
                  <Tag key={type} className="mb-2">{type}</Tag>
                ))}
              </div>
            </div>

            <div>
              <strong>响应措施:</strong>
              <Timeline className="mt-3">
                {selectedLeak.responseActions.map((action, index) => (
                  <Timeline.Item key={index} color="blue">
                    {action}
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SecurityManagement;
