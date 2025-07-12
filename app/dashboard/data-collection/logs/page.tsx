"use client";

import { CollectionLog, CollectionTask } from "@/types/dashboard/tender";
import {
  BellOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  FilterOutlined,
  FireOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  DatePicker,
  Divider,
  Drawer,
  Empty,
  Input,
  List,
  Modal,
  Progress,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

interface LogEntry extends CollectionLog {
  dataSourceName: string;
  taskId: string;
}

interface AlertRule {
  id: string;
  name: string;
  type: "error_rate" | "response_time" | "success_rate" | "custom";
  condition: string;
  threshold: number;
  enabled: boolean;
  notificationMethods: string[];
}

interface SystemAlert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  source: string;
  resolved: boolean;
}

import { Dayjs } from "dayjs";

const CollectionLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedDataSource, setSelectedDataSource] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [logDetailVisible, setLogDetailVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [alertSettingsVisible, setAlertSettingsVisible] = useState(false);
  const [contextPanelVisible, setContextPanelVisible] = useState(true);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  useEffect(() => {
    loadData();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadData, 3000); // 3秒刷新一次
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadLogs(),
      loadTasks(),
      loadAlerts(),
      loadAlertRules(),
    ]);
    setLoading(false);
  };

  const loadLogs = () => {
    // 模拟实时日志数据
    const mockLogs: LogEntry[] = Array.from({ length: 50 }, (_, index) => {
      const levels = ["info", "warning", "error"];
      const dataSources = ["中国政府采购网", "全国公共资源交易平台", "企查查", "天眼查"];
      const level = levels[Math.floor(Math.random() * levels.length)] as "info" | "warning" | "error";
      const dataSourceName = dataSources[Math.floor(Math.random() * dataSources.length)];

      const messages = {
        info: [
          "数据采集启动",
          "页面解析成功",
          "数据入库完成",
          "任务执行正常",
          "IP轮换成功",
        ],
        warning: [
          "响应时间超过阈值",
          "检测到反爬虫机制",
          "数据解析部分失败",
          "重试机制触发",
          "代理IP响应慢",
        ],
        error: [
          "连接超时失败",
          "IP地址被封禁",
          "页面结构变更",
          "数据库连接异常",
          "解析器崩溃",
        ],
      };

      const message = messages[level][Math.floor(Math.random() * messages[level].length)];

      return {
        id: `log-${index + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        level,
        message,
        dataSourceName,
        taskId: `task-${Math.floor(Math.random() * 5) + 1}`,
        details: {
          url: `https://${dataSourceName.toLowerCase().replace(/\s+/g, "")}.com/page${Math.floor(Math.random() * 100)}`,
          responseTime: Math.floor(Math.random() * 5000),
          statusCode: level === "error" ? (Math.random() > 0.5 ? 500 : 404) : 200,
          userAgent: "Mozilla/5.0 (compatible; DataCollector/1.0)",
          ip: `192.168.1.${100 + Math.floor(Math.random() * 10)}`,
        },
      };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setLogs(mockLogs);
  };

  const loadTasks = () => {
    const mockTasks: CollectionTask[] = [
      {
        id: "task-1",
        dataSourceId: "ds-1",
        dataSourceName: "中国政府采购网",
        status: "running",
        startTime: new Date(Date.now() - 3600000).toISOString(),
        progress: 75,
        itemsCollected: 150,
        itemsTotal: 200,
        currentUrl: "http://www.ccgp.gov.cn/cggg/dfgg/gkzb/",
        logs: [],
      },
      {
        id: "task-2",
        dataSourceId: "ds-2",
        dataSourceName: "全国公共资源交易平台",
        status: "completed",
        startTime: new Date(Date.now() - 7200000).toISOString(),
        endTime: new Date(Date.now() - 1800000).toISOString(),
        progress: 100,
        itemsCollected: 89,
        itemsTotal: 89,
        logs: [],
      },
      {
        id: "task-3",
        dataSourceId: "ds-3",
        dataSourceName: "企查查",
        status: "failed",
        startTime: new Date(Date.now() - 5400000).toISOString(),
        endTime: new Date(Date.now() - 3600000).toISOString(),
        progress: 45,
        itemsCollected: 23,
        itemsTotal: 50,
        error: "IP被封禁，无法继续采集",
        logs: [],
      },
    ];

    setTasks(mockTasks);
  };

  const loadAlerts = () => {
    const mockAlerts: SystemAlert[] = [
      {
        id: "alert-1",
        type: "critical",
        title: "多个数据源采集失败",
        message: "企查查和天眼查连续5分钟采集失败，可能存在IP封禁问题",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        source: "自动监控",
        resolved: false,
      },
      {
        id: "alert-2",
        type: "warning",
        title: "响应时间异常",
        message: "中国政府采购网平均响应时间超过5秒",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        source: "性能监控",
        resolved: false,
      },
    ];

    setAlerts(mockAlerts);
  };

  const loadAlertRules = () => {
    const mockAlertRules: AlertRule[] = [
      {
        id: "rule-1",
        name: "错误率过高告警",
        type: "error_rate",
        condition: "错误率 > 20%",
        threshold: 20,
        enabled: true,
        notificationMethods: ["email", "sms"],
      },
      {
        id: "rule-2",
        name: "响应时间过长告警",
        type: "response_time",
        condition: "平均响应时间 > 5000ms",
        threshold: 5000,
        enabled: true,
        notificationMethods: ["email"],
      },
    ];

    setAlertRules(mockAlertRules);
  };

  const handleViewLogDetail = (log: LogEntry) => {
    setSelectedLog(log);
    setLogDetailVisible(true);
  };

  const handleExportLogs = () => {
    const filteredLogs = getFilteredLogs();
    const csvContent = [
      ["时间", "级别", "数据源", "消息", "详情"].join(","),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.dataSourceName,
        log.message,
        JSON.stringify(log.details),
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `collection_logs_${dayjs().format("YYYY-MM-DD_HH-mm-ss")}.csv`;
    link.click();
  };

  const getFilteredLogs = () => {
    return logs.filter(log => {
      if (selectedLevel !== "all" && log.level !== selectedLevel) return false;
      if (selectedDataSource !== "all" && log.dataSourceName !== selectedDataSource) return false;
      if (searchKeyword && !log.message.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
      if (dateRange && dateRange.length === 2) {
        const logTime = dayjs(log.timestamp);
        if (logTime.isBefore(dateRange[0]) || logTime.isAfter(dateRange[1])) return false;
      }
      return true;
    });
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info": return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
      case "warning": return <WarningOutlined style={{ color: "#faad14" }} />;
      case "error": return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
      default: return <InfoCircleOutlined />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "info": return "blue";
      case "warning": return "orange";
      case "error": return "red";
      default: return "default";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical": return <FireOutlined style={{ color: "#ff4d4f" }} />;
      case "warning": return <WarningOutlined style={{ color: "#faad14" }} />;
      case "info": return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
      default: return <InfoCircleOutlined />;
    }
  };

  const filteredLogs = getFilteredLogs();
  const errorLogs = filteredLogs.filter(log => log.level === "error");
  const warningLogs = filteredLogs.filter(log => log.level === "warning");
  const runningTasks = tasks.filter(task => task.status === "running");
  const failedTasks = tasks.filter(task => task.status === "failed");
  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Title level={3} className="!mb-1">实时日志监控</Title>
            <Text type="secondary">智能监控数据采集过程，快速发现和解决问题</Text>
          </div>
          <Space>
            <Tooltip title="自动刷新">
              <Switch
                checked={autoRefresh}
                onChange={setAutoRefresh}
                checkedChildren={<ThunderboltOutlined />}
                unCheckedChildren={<PauseCircleOutlined />}
              />
            </Tooltip>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerVisible(true)}
            >
              筛选
            </Button>
            <Button
              icon={<ExportOutlined />}
              onClick={handleExportLogs}
            >
              导出
            </Button>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setAlertSettingsVisible(true)}
            >
              告警设置
            </Button>
          </Space>
        </div>
      </div>

      {/* 智能告警面板 - 替代传统统计卡片 */}
      {unresolvedAlerts.length > 0 && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BellOutlined className="text-red-500" />
              <Text strong>系统告警</Text>
              <Badge count={unresolvedAlerts.length} size="small" />
            </div>
            <Button size="small" type="link">查看全部</Button>
          </div>
          <div className="space-y-2">
            {unresolvedAlerts.slice(0, 2).map(alert => (
              <Alert
                key={alert.id}
                type={alert.type === "critical" ? "error" : alert.type === "warning" ? "warning" : "info"}
                message={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getAlertIcon(alert.type)}
                      <span className="font-medium">{alert.title}</span>
                      <Text type="secondary" className="text-sm">
                        {dayjs(alert.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                      </Text>
                    </div>
                    <Button size="small" type="link">处理</Button>
                  </div>
                }
                description={alert.message}
                showIcon={false}
                className="!border-l-4"
              />
            ))}
          </div>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：实时日志流 */}
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          {/* 快速筛选栏 */}
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Text className="text-sm font-medium">快速筛选:</Text>
                <Button
                  size="small"
                  type={selectedLevel === "error" ? "primary" : "default"}
                  danger={selectedLevel === "error"}
                  onClick={() => setSelectedLevel(selectedLevel === "error" ? "all" : "error")}
                >
                  错误 ({errorLogs.length})
                </Button>
                <Button
                  size="small"
                  type={selectedLevel === "warning" ? "primary" : "default"}
                  onClick={() => setSelectedLevel(selectedLevel === "warning" ? "all" : "warning")}
                >
                  警告 ({warningLogs.length})
                </Button>
              </div>
              <Divider type="vertical" />
              <Search
                placeholder="搜索日志内容..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
            </div>
          </div>

          {/* 日志列表 */}
          <div className="flex-1 overflow-auto">
            <Spin spinning={loading}>
              {filteredLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <Empty description="暂无日志数据" />
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${log.level === "error" ? "border-l-4 border-red-500 bg-red-50" :
                        log.level === "warning" ? "border-l-4 border-orange-500 bg-orange-50" : ""
                      }`}
                      onClick={() => handleViewLogDetail(log)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getLevelIcon(log.level)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Text className="text-sm font-medium">{log.dataSourceName}</Text>
                            <Tag className="small-tag">{log.taskId}</Tag>
                            <Text type="secondary" className="text-xs">
                              {dayjs(log.timestamp).format("HH:mm:ss")}
                            </Text>
                          </div>
                          <Paragraph className="!mb-0 text-sm" ellipsis={{ rows: 2 }}>
                            {log.message}
                          </Paragraph>
                          {log.details && (
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                              <span>响应时间: {log.details.responseTime}ms</span>
                              <span>状态码: {log.details.statusCode}</span>
                              <span>IP: {log.details.ip}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <Tag color={getLevelColor(log.level)} className="small-tag">
                            {log.level.toUpperCase()}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Spin>
          </div>
        </div>

        {/* 右侧：上下文信息面板 */}
        {contextPanelVisible && (
          <div className="w-80 bg-white flex flex-col">
            {/* 面板头部 */}
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <Text className="font-medium">系统状态</Text>
              <Button
                size="small"
                type="text"
                onClick={() => setContextPanelVisible(false)}
              >
                ×
              </Button>
            </div>

            {/* 任务状态 */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <Text className="font-medium">运行中任务</Text>
                <Badge count={runningTasks.length} size="small" />
              </div>
              <div className="space-y-3">
                {runningTasks.length === 0 ? (
                  <Text type="secondary" className="text-sm">暂无运行中任务</Text>
                ) : (
                  runningTasks.map(task => (
                    <div key={task.id} className="bg-gray-50 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Text className="text-sm font-medium">{task.dataSourceName}</Text>
                        <Badge status="processing" />
                      </div>
                      <Progress
                        percent={task.progress}
                        size="small"
                        format={() => `${task.itemsCollected}/${task.itemsTotal}`}
                      />
                      <Text type="secondary" className="text-xs mt-1 block">
                        运行时长: {dayjs().diff(dayjs(task.startTime), "minute")}分钟
                      </Text>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 失败任务 */}
            {failedTasks.length > 0 && (
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Text className="font-medium text-red-600">失败任务</Text>
                  <Badge count={failedTasks.length} size="small" />
                </div>
                <div className="space-y-2">
                  {failedTasks.map(task => (
                    <div key={task.id} className="bg-red-50 border border-red-200 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <Text className="text-sm font-medium">{task.dataSourceName}</Text>
                        <Badge status="error" />
                      </div>
                      <Text type="secondary" className="text-xs">
                        {task.error}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 性能指标 */}
            <div className="p-4">
              <Text className="font-medium mb-3 block">性能指标</Text>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HeartOutlined className="text-green-500" />
                    <Text className="text-sm">系统健康度</Text>
                  </div>
                  <Text className="text-sm font-medium text-green-600">良好</Text>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Text className="text-sm">平均响应时间</Text>
                    <Text className="text-sm font-medium">1.2s</Text>
                  </div>
                  <Progress percent={75} size="small" strokeColor="#52c41a" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Text className="text-sm">成功率</Text>
                    <Text className="text-sm font-medium">94.5%</Text>
                  </div>
                  <Progress percent={94.5} size="small" strokeColor="#1890ff" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 筛选抽屉 */}
      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={400}
      >
        <div className="space-y-6">
          <div>
            <Text className="block mb-2 font-medium">日志级别</Text>
            <Select
              value={selectedLevel}
              onChange={setSelectedLevel}
              style={{ width: "100%" }}
            >
              <Option value="all">所有级别</Option>
              <Option value="info">信息</Option>
              <Option value="warning">警告</Option>
              <Option value="error">错误</Option>
            </Select>
          </div>

          <div>
            <Text className="block mb-2 font-medium">数据源</Text>
            <Select
              value={selectedDataSource}
              onChange={setSelectedDataSource}
              style={{ width: "100%" }}
            >
              <Option value="all">所有数据源</Option>
              <Option value="中国政府采购网">中国政府采购网</Option>
              <Option value="全国公共资源交易平台">全国公共资源交易平台</Option>
              <Option value="企查查">企查查</Option>
              <Option value="天眼查">天眼查</Option>
            </Select>
          </div>

          <div>
            <Text className="block mb-2 font-medium">时间范围</Text>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              showTime
              style={{ width: "100%" }}
            />
          </div>

          <div className="pt-4 border-t">
            <Space>
              <Button onClick={() => {
                setSelectedLevel("all");
                setSelectedDataSource("all");
                setDateRange(null);
                setSearchKeyword("");
              }}>
                重置
              </Button>
              <Button type="primary" onClick={() => setFilterDrawerVisible(false)}>
                应用筛选
              </Button>
            </Space>
          </div>
        </div>
      </Drawer>

      {/* 日志详情模态框 */}
      <Modal
        title="日志详情"
        open={logDetailVisible}
        onCancel={() => setLogDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setLogDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="text-sm text-gray-500">时间</Text>
                <div className="font-medium">
                  {dayjs(selectedLog.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
              <div>
                <Text className="text-sm text-gray-500">级别</Text>
                <div>
                  <Tag color={getLevelColor(selectedLog.level)}>
                    {selectedLog.level.toUpperCase()}
                  </Tag>
                </div>
              </div>
              <div>
                <Text className="text-sm text-gray-500">数据源</Text>
                <div className="font-medium">{selectedLog.dataSourceName}</div>
              </div>
              <div>
                <Text className="text-sm text-gray-500">任务ID</Text>
                <div className="font-medium">{selectedLog.taskId}</div>
              </div>
            </div>

            <div>
              <Text className="text-sm text-gray-500 block mb-2">消息内容</Text>
              <div className="bg-gray-50 p-3 rounded">{selectedLog.message}</div>
            </div>

            {selectedLog.details && (
              <div>
                <Text className="text-sm text-gray-500 block mb-2">详细信息</Text>
                <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 告警设置模态框 */}
      <Modal
        title="告警设置"
        open={alertSettingsVisible}
        onCancel={() => setAlertSettingsVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAlertSettingsVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary">
            保存设置
          </Button>,
        ]}
        width={800}
      >
        <List
          dataSource={alertRules}
          renderItem={(rule) => (
            <List.Item
              actions={[
                <Switch
                  key="toggle"
                  checked={rule.enabled}
                  onChange={(checked) => {
                    setAlertRules(prev => prev.map(r =>
                      r.id === rule.id ? { ...r, enabled: checked } : r,
                    ));
                  }}
                />,
                <Button key="edit" size="small">编辑</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<BellOutlined />}
                title={rule.name}
                description={
                  <div>
                    <div>条件: {rule.condition}</div>
                    <div>通知方式: {rule.notificationMethods.join(", ")}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default CollectionLogsPage;
