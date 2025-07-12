"use client";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  AuditOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  HistoryOutlined,
  MonitorOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

// 审计日志数据类型
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "warning";
  duration: number;
  riskLevel?: "low" | "medium" | "high";
}

// 筛选条件类型
interface FilterParams {
  userId?: string;
  action?: string;
  module?: string;
  status?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  keyword?: string;
}

// 统计卡片组件
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
  suffix?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color,
  suffix = "",
  description,
}) => {
  return (
    <Card
      className="stat-card"
      style={{
        borderRadius: "12px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      bodyStyle={{ padding: "24px" }}
      hoverable
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
            }}>
              <span style={{ color, fontSize: "18px" }}>{icon}</span>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: "14px", fontWeight: 500 }}>
                {title}
              </Text>
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <Text style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#262626",
              lineHeight: 1,
            }}>
              {value}{suffix}
            </Text>
          </div>

          {trend && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {trend.isPositive ? (
                <ArrowUpOutlined style={{ color: "#52c41a", fontSize: "12px" }} />
              ) : (
                <ArrowDownOutlined style={{ color: "#ff4d4f", fontSize: "12px" }} />
              )}
              <Text
                style={{
                  fontSize: "12px",
                  color: trend.isPositive ? "#52c41a" : "#ff4d4f",
                  fontWeight: 500,
                }}
              >
                {Math.abs(trend.value)}%
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                vs 昨日
              </Text>
            </div>
          )}

          {description && (
            <Text type="secondary" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>
              {description}
            </Text>
          )}
        </div>
      </div>
    </Card>
  );
};

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState<FilterParams>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [exportLoading, setExportLoading] = useState(false);
  const [cleanupModalVisible, setCleanupModalVisible] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(false);

  // 模拟数据
  const mockLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      userId: "user001",
      userName: "张三",
      action: "登录系统",
      module: "用户管理",
      details: "用户成功登录系统",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0",
      status: "success",
      duration: 1200,
      riskLevel: "low",
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:25:10",
      userId: "user002",
      userName: "李四",
      action: "创建项目",
      module: "项目管理",
      details: "创建新的招标项目：办公设备采购",
      ipAddress: "192.168.1.101",
      userAgent: "Firefox/121.0.0.0",
      status: "success",
      duration: 2500,
      riskLevel: "low",
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:20:45",
      userId: "user003",
      userName: "王五",
      action: "删除文档",
      module: "文档管理",
      details: "尝试删除受保护文档",
      ipAddress: "192.168.1.102",
      userAgent: "Safari/17.0",
      status: "failed",
      duration: 800,
      riskLevel: "high",
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:15:30",
      userId: "user001",
      userName: "张三",
      action: "修改配置",
      module: "系统设置",
      details: "修改数据采集频率设置",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0",
      status: "warning",
      duration: 1800,
      riskLevel: "medium",
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:10:15",
      userId: "user004",
      userName: "赵六",
      action: "导出数据",
      module: "数据管理",
      details: "导出招标项目数据报表",
      ipAddress: "192.168.1.103",
      userAgent: "Edge/120.0.0.0",
      status: "success",
      duration: 5200,
      riskLevel: "low",
    },
  ];

  // 表格列定义
  const columns: ColumnsType<AuditLog> = [
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 160,
      sorter: true,
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CalendarOutlined style={{ color: "#8c8c8c", fontSize: "12px" }} />
            <span style={{ fontSize: "13px" }}>{text}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "用户信息",
      dataIndex: "userName",
      key: "userName",
      width: 140,
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
          <div>
            <div style={{ fontSize: "13px", fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: "11px" }}>{record.userId}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "操作类型",
      dataIndex: "action",
      key: "action",
      width: 120,
      filters: [
        { text: "登录系统", value: "登录系统" },
        { text: "创建项目", value: "创建项目" },
        { text: "删除文档", value: "删除文档" },
        { text: "修改配置", value: "修改配置" },
        { text: "导出数据", value: "导出数据" },
      ],
      render: (text) => (
        <Tag color="blue" style={{ fontSize: "12px" }}>{text}</Tag>
      ),
    },
    {
      title: "所属模块",
      dataIndex: "module",
      key: "module",
      width: 100,
      filters: [
        { text: "用户管理", value: "用户管理" },
        { text: "项目管理", value: "项目管理" },
        { text: "文档管理", value: "文档管理" },
        { text: "系统设置", value: "系统设置" },
        { text: "数据管理", value: "数据管理" },
      ],
      render: (text) => (
        <Tag color="geekblue" style={{ fontSize: "12px" }}>{text}</Tag>
      ),
    },
    {
      title: "操作详情",
      dataIndex: "details",
      key: "details",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontSize: "13px" }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "IP地址",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 120,
      render: (text) => (
        <Text code style={{ fontSize: "12px" }}>{text}</Text>
      ),
    },
    {
      title: "风险等级",
      dataIndex: "riskLevel",
      key: "riskLevel",
      width: 90,
      filters: [
        { text: "低风险", value: "low" },
        { text: "中风险", value: "medium" },
        { text: "高风险", value: "high" },
      ],
      render: (riskLevel) => {
        const riskConfig = {
          low: { color: "green", text: "低风险" },
          medium: { color: "orange", text: "中风险" },
          high: { color: "red", text: "高风险" },
        };
        const config = riskConfig[riskLevel as keyof typeof riskConfig];
        return <Badge color={config.color} text={config.text} />;
      },
    },
    {
      title: "执行状态",
      dataIndex: "status",
      key: "status",
      width: 90,
      filters: [
        { text: "成功", value: "success" },
        { text: "失败", value: "failed" },
        { text: "警告", value: "warning" },
      ],
      render: (status) => {
        const statusConfig = {
          success: { color: "success", text: "成功" },
          failed: { color: "error", text: "失败" },
          warning: { color: "warning", text: "警告" },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "响应时间",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      sorter: true,
      render: (duration) => (
        <span style={{
          color: duration > 3000 ? "#ff4d4f" : duration > 1500 ? "#faad14" : "#52c41a",
          fontSize: "12px",
          fontWeight: 500,
        }}>
          {duration}ms
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Tooltip title="查看详情">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => message.info(`查看 ${record.userName} 的操作详情`)}
          />
        </Tooltip>
      ),
    },
  ];

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs(mockLogs);
      setPagination(prev => ({ ...prev, total: mockLogs.length }));
    } catch (_error) {
      message.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  // 导出数据
  const handleExport = async () => {
    setExportLoading(true);
    try {
      // 模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success("导出成功！文件已下载到本地");
    } catch (_error) {
      message.error("导出失败");
    } finally {
      setExportLoading(false);
    }
  };

  // 数据清理
  const handleCleanup = async (type: "manual" | "auto") => {
    try {
      // 模拟清理过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success(`${type === "manual" ? "手动" : "自动"}清理完成`);
      setCleanupModalVisible(false);
      loadData();
    } catch (_error) {
      message.error("清理失败");
    }
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({});
    loadData();
  };

  // 实时监控切换
  const toggleRealTimeMode = () => {
    setRealTimeMode(!realTimeMode);
    message.success(`${!realTimeMode ? "开启" : "关闭"}实时监控模式`);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 计算留存期信息
  const retentionInfo = {
    totalDays: 180, // 6个月
    remainingDays: 45,
    oldestRecord: "2023-07-15",
    recordCount: mockLogs.length,
  };

  // 统计数据
  const statsData = {
    totalRecords: retentionInfo.recordCount,
    todayOperations: 15,
    abnormalOperations: 3,
    storageUsage: 75,
    activeUsers: 8,
    avgResponseTime: 1850,
  };

  return (
    <div style={{ padding: "0", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面标题区域 */}
      <div style={{
        background: "#fff",
        padding: "24px 24px 0",
        marginBottom: "16px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: "12px" }}>
              <AuditOutlined style={{ color: "#1890ff" }} />
              审计日志管理
            </Title>
            <Text type="secondary" style={{ fontSize: "14px", marginTop: "4px", display: "block" }}>
              系统操作记录与安全审计追踪
            </Text>
          </div>
          <Space>
            <Button
              type={realTimeMode ? "primary" : "default"}
              icon={<MonitorOutlined />}
              onClick={toggleRealTimeMode}
            >
              {realTimeMode ? "实时监控中" : "开启实时监控"}
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={exportLoading}
              onClick={handleExport}
            >
              导出报告
            </Button>
          </Space>
        </div>

        {/* 留存期提醒 */}
        <Alert
          message="数据留存期提醒"
          description={
            <div>
              <Text>审计日志保留期为 <Text strong>6个月</Text>，最早记录日期：{retentionInfo.oldestRecord}</Text>
              <br />
              <Text>距离自动清理还有 <Text strong style={{ color: "#faad14" }}>{retentionInfo.remainingDays}</Text> 天，当前共有 <Text strong>{retentionInfo.recordCount}</Text> 条记录</Text>
            </div>
          }
          type="info"
          icon={<ClockCircleOutlined />}
          showIcon
          style={{ marginBottom: "16px" }}
          action={
            <Button
              size="small"
              type="primary"
              onClick={() => setCleanupModalVisible(true)}
            >
              数据清理设置
            </Button>
          }
        />
      </div>

      {/* 统计信息卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="总记录数"
            value={statsData.totalRecords}
            icon={<DatabaseOutlined />}
            color="#1890ff"
            trend={{ value: 12.5, isPositive: true }}
            description="系统累计审计记录"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日操作"
            value={statsData.todayOperations}
            icon={<TeamOutlined />}
            color="#52c41a"
            trend={{ value: 8.3, isPositive: true }}
            description="当日用户操作次数"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="异常操作"
            value={statsData.abnormalOperations}
            icon={<SafetyCertificateOutlined />}
            color="#ff4d4f"
            trend={{ value: 15.2, isPositive: false }}
            description="需要关注的异常行为"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="平均响应时间"
            value={statsData.avgResponseTime}
            icon={<HistoryOutlined />}
            color="#722ed1"
            suffix="ms"
            trend={{ value: 5.7, isPositive: false }}
            description="系统操作响应性能"
          />
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card
        style={{
          marginBottom: "16px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FilterOutlined style={{ color: "#1890ff" }} />
            <span>筛选条件</span>
          </div>
        }
        size="small"
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6} lg={4}>
            <Input
              placeholder="搜索用户/操作"
              prefix={<SearchOutlined />}
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="操作类型"
              style={{ width: "100%" }}
              allowClear
              value={filters.action}
              onChange={(value) => setFilters({ ...filters, action: value })}
            >
              <Option value="登录系统">登录系统</Option>
              <Option value="创建项目">创建项目</Option>
              <Option value="删除文档">删除文档</Option>
              <Option value="修改配置">修改配置</Option>
              <Option value="导出数据">导出数据</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="所属模块"
              style={{ width: "100%" }}
              allowClear
              value={filters.module}
              onChange={(value) => setFilters({ ...filters, module: value })}
            >
              <Option value="用户管理">用户管理</Option>
              <Option value="项目管理">项目管理</Option>
              <Option value="文档管理">文档管理</Option>
              <Option value="系统设置">系统设置</Option>
              <Option value="数据管理">数据管理</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="执行状态"
              style={{ width: "100%" }}
              allowClear
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <Option value="success">成功</Option>
              <Option value="failed">失败</Option>
              <Option value="warning">警告</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={5}>
            <RangePicker
              style={{ width: "100%" }}
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs] })}
              placeholder={["开始日期", "结束日期"]}
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={3}>
            <Space>
              <Button type="primary" onClick={loadData}>
                查询
              </Button>
              <Button onClick={resetFilters}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileTextOutlined style={{ color: "#1890ff" }} />
              <span>审计记录</span>
              {realTimeMode && (
                <Badge status="processing" text="实时更新" />
              )}
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                loading={exportLoading}
                onClick={handleExport}
              >
                导出
              </Button>
            </Space>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              name: record.id,
            }),
          }}
          scroll={{ x: 1400 }}
          size="small"
        />

        {selectedRowKeys.length > 0 && (
          <div style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "#f6f8fa",
            borderRadius: "6px",
            border: "1px solid #e1e4e8",
          }}>
            <Space>
              <Text strong>已选择 {selectedRowKeys.length} 条记录</Text>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除选中的记录吗？"
                description="此操作不可恢复，请谨慎操作。"
                onConfirm={() => {
                  message.success("删除成功");
                  setSelectedRowKeys([]);
                  loadData();
                }}
              >
                <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                  批量删除
                </Button>
              </Popconfirm>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
                size="small"
              >
                导出选中
              </Button>
            </Space>
          </div>
        )}
      </Card>

      {/* 数据清理设置弹窗 */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SettingOutlined style={{ color: "#1890ff" }} />
            <span>数据清理设置</span>
          </div>
        }
        open={cleanupModalVisible}
        onCancel={() => setCleanupModalVisible(false)}
        footer={null}
        width={700}
      >
        <div style={{ padding: "16px 0" }}>
          <Alert
            message="清理规则说明"
            description="系统将自动清理超过6个月的审计日志，您也可以手动执行清理操作。清理后的数据将无法恢复，请谨慎操作。"
            type="info"
            style={{ marginBottom: "24px" }}
            showIcon
          />

          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="手动清理"
                size="small"
                style={{ height: "200px" }}
                headStyle={{ background: "#fafafa" }}
              >
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <DeleteOutlined style={{ fontSize: "32px", color: "#ff4d4f", marginBottom: "16px" }} />
                  <p style={{ marginBottom: "16px", color: "#666" }}>立即清理超过6个月的历史数据</p>
                  <Button
                    type="primary"
                    danger
                    block
                    icon={<DeleteOutlined />}
                    onClick={() => handleCleanup("manual")}
                  >
                    立即清理
                  </Button>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="自动清理"
                size="small"
                style={{ height: "200px" }}
                headStyle={{ background: "#fafafa" }}
              >
                <div style={{ padding: "20px 0" }}>
                  <SettingOutlined style={{ fontSize: "32px", color: "#1890ff", marginBottom: "16px", display: "block", textAlign: "center" }} />
                  <p style={{ marginBottom: "16px", color: "#666", textAlign: "center" }}>配置自动清理策略和时间</p>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Select
                      placeholder="清理频率"
                      style={{ width: "100%" }}
                      defaultValue="daily"
                    >
                      <Option value="daily">每日清理</Option>
                      <Option value="weekly">每周清理</Option>
                      <Option value="monthly">每月清理</Option>
                    </Select>
                    <Button
                      type="primary"
                      block
                      icon={<SettingOutlined />}
                      onClick={() => handleCleanup("auto")}
                    >
                      保存设置
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default AuditLogsPage;
