"use client";
import {
  DownloadOutlined,
  EyeOutlined,
  ReloadOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed" | "warning";
  duration: number;
  details: Record<string, any>;
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
}

const AuditLogsPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 模拟审计日志数据
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "log_001",
      timestamp: "2024-01-15 16:30:25",
      userId: "user_001",
      username: "zhangming",
      userRole: "标注员",
      action: "创建标注任务",
      resource: "annotation_task",
      resourceId: "task_12345",
      method: "POST",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      status: "success",
      duration: 245,
      details: {
        taskName: "医疗影像标注-批次001",
        datasetId: "dataset_001",
        assignedUsers: ["user_002", "user_003"],
      },
    },
    {
      id: "log_002",
      timestamp: "2024-01-15 16:25:12",
      userId: "user_002",
      username: "lihong",
      userRole: "项目经理",
      action: "修改用户权限",
      resource: "user_permission",
      resourceId: "user_004",
      method: "PUT",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      status: "success",
      duration: 156,
      details: {
        targetUser: "zhaomei",
        operation: "权限修改",
      },
      changes: {
        before: { permissions: ["标注任务"] },
        after: { permissions: ["标注任务", "质量检查"] },
      },
    },
    {
      id: "log_003",
      timestamp: "2024-01-15 16:20:45",
      userId: "user_005",
      username: "sunwei",
      userRole: "系统管理员",
      action: "删除数据集",
      resource: "dataset",
      resourceId: "dataset_old_001",
      method: "DELETE",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      status: "warning",
      duration: 1200,
      details: {
        datasetName: "过期测试数据集",
        reason: "数据过期清理",
        backupCreated: true,
      },
    },
    {
      id: "log_004",
      timestamp: "2024-01-15 16:15:30",
      userId: "user_003",
      username: "wangqiang",
      userRole: "质量专家",
      action: "登录系统",
      resource: "auth_session",
      resourceId: "session_789",
      method: "POST",
      ipAddress: "192.168.1.103",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      status: "success",
      duration: 89,
      details: {
        loginMethod: "用户名密码",
        sessionDuration: 28800,
      },
    },
    {
      id: "log_005",
      timestamp: "2024-01-15 16:10:15",
      userId: "user_unknown",
      username: "unknown",
      userRole: "未知",
      action: "尝试访问管理页面",
      resource: "admin_panel",
      resourceId: "admin_001",
      method: "GET",
      ipAddress: "203.0.113.1",
      userAgent: "curl/7.68.0",
      status: "failed",
      duration: 50,
      details: {
        reason: "权限不足",
        errorCode: "403",
      },
    },
  ]);

  const actionOptions = [
    { value: "all", label: "全部操作" },
    { value: "登录系统", label: "登录系统" },
    { value: "创建标注任务", label: "创建标注任务" },
    { value: "修改用户权限", label: "修改用户权限" },
    { value: "删除数据集", label: "删除数据集" },
    { value: "尝试访问管理页面", label: "访问管理页面" },
  ];

  const statusOptions = [
    { value: "all", label: "全部状态" },
    { value: "success", label: "成功" },
    { value: "failed", label: "失败" },
    { value: "warning", label: "警告" },
  ];

  const userOptions = [
    { value: "all", label: "全部用户" },
    { value: "zhangming", label: "张明" },
    { value: "lihong", label: "李红" },
    { value: "wangqiang", label: "王强" },
    { value: "sunwei", label: "孙伟" },
  ];

  // 筛选日志
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchText.toLowerCase()) ||
      log.username.toLowerCase().includes(searchText.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchText.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesUser = userFilter === "all" || log.username === userFilter;

    let matchesDate = true;
    if (dateRange) {
      const logDate = dayjs(log.timestamp);
      matchesDate = logDate.isAfter(dateRange[0]) && logDate.isBefore(dateRange[1]);
    }

    return matchesSearch && matchesAction && matchesStatus && matchesUser && matchesDate;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case "success": return "成功";
      case "failed": return "失败";
      case "warning": return "警告";
      default: return "未知";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "blue";
      case "POST": return "green";
      case "PUT": return "orange";
      case "DELETE": return "red";
      case "PATCH": return "purple";
      default: return "default";
    }
  };

  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailDrawerVisible(true);
  };

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
  };
  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("审计日志导出成功");
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("数据已刷新");
    }, 1000);
  };

  const columns: ColumnsType<AuditLog> = [
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 160,
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      render: (timestamp) => (
        <div style={{ fontSize: 12 }}>
          <div>{dayjs(timestamp).format("MM-DD HH:mm")}</div>
          <div style={{ color: "#666" }}>{dayjs(timestamp).format("YYYY")}</div>
        </div>
      ),
    },
    {
      title: "用户",
      key: "user",
      width: 150,
      render: (_, log) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <UserOutlined style={{ color: "#666" }} />
          <div>
            <div style={{ fontWeight: 500, fontSize: 12 }}>{log.username}</div>
            <div style={{ fontSize: 11, color: "#666" }}>{log.userRole}</div>
          </div>
        </div>
      ),
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: 180,
      render: (action, log) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{action}</div>
          <div style={{ display: "flex", gap: 4 }}>
            <Tag color={getMethodColor(log.method)} className="small-tag">
              {log.method}
            </Tag>
            <Tag color="default" className="small-tag">
              {log.resource}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => (
        <Badge
          status={status === "success" ? "success" : status === "failed" ? "error" : "warning"}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: "IP地址",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 120,
      render: (ip) => (
        <Text code style={{ fontSize: 11 }}>{ip}</Text>
      ),
    },
    {
      title: "耗时",
      dataIndex: "duration",
      key: "duration",
      width: 80,
      render: (duration) => (
        <Text style={{ fontSize: 12 }}>{duration}ms</Text>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 100,
      render: (_, log) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(log)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <SafetyOutlined />
              审计日志
            </Title>
            <Text type="secondary">记录系统操作日志，追踪用户行为和系统变更</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
              刷新
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport} loading={loading}>
              导出
            </Button>
          </Space>
        </div>

        {/* 筛选器 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="搜索操作、用户或资源"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={actionFilter}
                onChange={setActionFilter}
                style={{ width: "100%" }}
                placeholder="操作类型"
              >
                {actionOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
                placeholder="状态"
              >
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                value={userFilter}
                onChange={setUserFilter}
                style={{ width: "100%" }}
                placeholder="用户"
              >
                {userOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={6}>
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                style={{ width: "100%" }}
                placeholder={["开始时间", "结束时间"]}
              />
            </Col>
          </Row>
        </Card>
      </div>

      {/* 日志表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredLogs.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          }}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title="审计日志详情"
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        width={600}
      >
        {selectedLog && (
          <div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="时间">{selectedLog.timestamp}</Descriptions.Item>
              <Descriptions.Item label="用户">
                {selectedLog.username} ({selectedLog.userRole})
              </Descriptions.Item>
              <Descriptions.Item label="操作">{selectedLog.action}</Descriptions.Item>
              <Descriptions.Item label="资源">
                {selectedLog.resource} (ID: {selectedLog.resourceId})
              </Descriptions.Item>
              <Descriptions.Item label="请求方法">
                <Tag color={getMethodColor(selectedLog.method)}>{selectedLog.method}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={selectedLog.status === "success" ? "success" :
                    selectedLog.status === "failed" ? "error" : "warning"}
                  text={getStatusText(selectedLog.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="IP地址">{selectedLog.ipAddress}</Descriptions.Item>
              <Descriptions.Item label="用户代理">
                <Text code style={{ fontSize: 11, wordBreak: "break-all" }}>
                  {selectedLog.userAgent}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="耗时">{selectedLog.duration}ms</Descriptions.Item>
            </Descriptions>

            {selectedLog.details && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>操作详情</Title>
                <Card size="small">
                  <pre style={{ fontSize: 12, margin: 0, whiteSpace: "pre-wrap" }}>
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </Card>
              </div>
            )}

            {selectedLog.changes && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>变更记录</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small" title="变更前">
                      <pre style={{ fontSize: 12, margin: 0, whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(selectedLog.changes.before, null, 2)}
                      </pre>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="变更后">
                      <pre style={{ fontSize: 12, margin: 0, whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(selectedLog.changes.after, null, 2)}
                      </pre>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AuditLogsPage;
