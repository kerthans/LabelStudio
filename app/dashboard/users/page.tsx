"use client";
import type {
  TwoFactorStatus,
  User,
  UserQueryParams,
  UserRole,
  UserStatus,
  VerificationStatus,
} from "@/types/dashboard/user";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  FilterOutlined,
  MoreOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  SecurityScanOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const UsersPage: React.FC = () => {
  const router = useRouter();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [queryParams, setQueryParams] = useState<UserQueryParams>({
    page: 1,
    pageSize: 10,
  });

  // 模拟用户数据
  const mockUsers: User[] = [
    {
      id: "1",
      username: "admin",
      email: "admin@magnify.ai",
      phone: "13800138000",
      realName: "张三",
      avatar: "",
      role: "admin" as UserRole,
      status: "active" as UserStatus,
      verificationStatus: "verified" as VerificationStatus,
      twoFactorStatus: "enabled" as TwoFactorStatus,
      permissions: [],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      lastLoginAt: "2024-01-15T10:30:00Z",
      loginCount: 156,
    },
    {
      id: "2",
      username: "manager01",
      email: "manager@magnify.ai",
      phone: "13800138001",
      realName: "李四",
      avatar: "",
      role: "manager" as UserRole,
      status: "active" as UserStatus,
      verificationStatus: "pending" as VerificationStatus,
      twoFactorStatus: "disabled" as TwoFactorStatus,
      permissions: [],
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-14T00:00:00Z",
      lastLoginAt: "2024-01-14T15:20:00Z",
      loginCount: 89,
    },
    {
      id: "3",
      username: "user01",
      email: "user@magnify.ai",
      phone: "13800138002",
      realName: "王五",
      avatar: "",
      role: "user" as UserRole,
      status: "inactive" as UserStatus,
      verificationStatus: "not_submitted" as VerificationStatus,
      twoFactorStatus: "disabled" as TwoFactorStatus,
      permissions: [],
      createdAt: "2024-01-03T00:00:00Z",
      updatedAt: "2024-01-13T00:00:00Z",
      lastLoginAt: "2024-01-10T09:15:00Z",
      loginCount: 23,
    },
  ];

  // 角色配置
  const roleConfig = {
    super_admin: { label: "超级管理员", color: "red" },
    admin: { label: "管理员", color: "orange" },
    manager: { label: "经理", color: "blue" },
    user: { label: "用户", color: "green" },
    viewer: { label: "访客", color: "default" },
  };

  // 状态配置
  const statusConfig = {
    active: { label: "活跃", color: "success" },
    inactive: { label: "非活跃", color: "default" },
    pending: { label: "待审核", color: "processing" },
    suspended: { label: "已暂停", color: "error" },
  };

  // 认证状态配置
  const verificationConfig = {
    verified: { label: "已认证", color: "success", icon: <CheckCircleOutlined /> },
    pending: { label: "待审核", color: "processing", icon: <ClockCircleOutlined /> },
    rejected: { label: "已拒绝", color: "error", icon: <ExclamationCircleOutlined /> },
    not_submitted: { label: "未提交", color: "default", icon: <UserOutlined /> },
  };

  // 2FA状态配置
  const _twoFactorConfig = {
    enabled: { label: "已启用", color: "success" },
    disabled: { label: "未启用", color: "default" },
    pending: { label: "待设置", color: "processing" },
  };

  // 统计数据
  const getStatistics = () => {
    const activeUsers = users.filter(user => user.status === "active").length;
    const verifiedUsers = users.filter(user => user.verificationStatus === "verified").length;
    const twoFactorEnabled = users.filter(user => user.twoFactorStatus === "enabled").length;

    return {
      total: users.length,
      active: activeUsers,
      verified: verifiedUsers,
      twoFactor: twoFactorEnabled,
    };
  };

  const statistics = getStatistics();

  // 表格列定义
  const columns: ColumnsType<User> = [
    {
      title: "用户信息",
      key: "userInfo",
      width: 240,
      fixed: "left",
      render: (_, record) => (
        <Space size={12}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={record.avatar}
            style={{
              backgroundColor: record.avatar ? "transparent" : token.colorPrimary,
              border: `1px solid ${token.colorBorder}`,
            }}
          />
          <div>
            <div style={{
              fontWeight: 600,
              fontSize: "14px",
              color: token.colorText,
              marginBottom: "2px",
            }}>
              {record.realName || record.username}
            </div>
            <div style={{
              fontSize: "12px",
              color: token.colorTextSecondary,
              lineHeight: "16px",
            }}>
              {record.email}
            </div>
            {record.phone && (
              <div style={{
                fontSize: "12px",
                color: token.colorTextTertiary,
                lineHeight: "16px",
              }}>
                {record.phone}
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: UserRole) => (
        <Tag
          color={roleConfig[role]?.color}
          style={{
            borderRadius: "6px",
            fontWeight: 500,
            border: "none",
          }}
        >
          {roleConfig[role]?.label}
        </Tag>
      ),
      filters: Object.entries(roleConfig).map(([key, value]) => ({
        text: value.label,
        value: key,
      })),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: UserStatus) => (
        <Badge
          status={statusConfig[status]?.color as "success" | "processing" | "error" | "default" | "warning"}
          text={
            <span style={{
              fontWeight: 500,
              color: status === "active" ? token.colorSuccess : token.colorTextSecondary,
            }}>
              {statusConfig[status]?.label}
            </span>
          }
        />
      ),
      filters: Object.entries(statusConfig).map(([key, value]) => ({
        text: value.label,
        value: key,
      })),
    },
    {
      title: "实名认证",
      dataIndex: "verificationStatus",
      key: "verificationStatus",
      width: 130,
      render: (status: VerificationStatus) => (
        <Space size={6}>
          <span style={{
            color: status === "verified" ? token.colorSuccess :
              status === "rejected" ? token.colorError :
                status === "pending" ? token.colorWarning : token.colorTextSecondary,
          }}>
            {verificationConfig[status]?.icon}
          </span>
          <span style={{
            fontSize: "13px",
            fontWeight: 500,
            color: status === "verified" ? token.colorSuccess :
              status === "rejected" ? token.colorError :
                status === "pending" ? token.colorWarning : token.colorTextSecondary,
          }}>
            {verificationConfig[status]?.label}
          </span>
        </Space>
      ),
      filters: Object.entries(verificationConfig).map(([key, value]) => ({
        text: value.label,
        value: key,
      })),
    },
    {
      title: "双因子认证",
      dataIndex: "twoFactorStatus",
      key: "twoFactorStatus",
      width: 120,
      render: (status: TwoFactorStatus, record) => (
        <Tooltip title={status === "enabled" ? "点击禁用双因子认证" : "点击启用双因子认证"}>
          <Switch
            checked={status === "enabled"}
            size="small"
            onChange={(checked) => handleToggle2FA(record.id, checked)}
            style={{
              backgroundColor: status === "enabled" ? token.colorSuccess : undefined,
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "最后登录",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 160,
      sorter: (a, b) => new Date(a.lastLoginAt || 0).getTime() - new Date(b.lastLoginAt || 0).getTime(),
      render: (date: string) => (
        <div>
          <div style={{ fontSize: "13px", color: token.colorText }}>
            {date ? new Date(date).toLocaleDateString() : "从未登录"}
          </div>
          {date && (
            <div style={{ fontSize: "12px", color: token.colorTextSecondary }}>
              {new Date(date).toLocaleTimeString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "登录次数",
      dataIndex: "loginCount",
      key: "loginCount",
      width: 100,
      sorter: (a, b) => a.loginCount - b.loginCount,
      render: (count: number) => (
        <Text strong style={{ color: token.colorPrimary }}>
          {count.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 160,
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="编辑用户">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
              style={{
                color: token.colorPrimary,
                borderRadius: "6px",
              }}
            />
          </Tooltip>
          <Tooltip title="权限管理">
            <Button
              type="text"
              icon={<SafetyCertificateOutlined />}
              onClick={() => handlePermissions(record.id)}
              style={{
                color: token.colorWarning,
                borderRadius: "6px",
              }}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: "resetPassword",
                  label: "重置密码",
                  icon: <SafetyOutlined />,
                },
                {
                  key: "switchRole",
                  label: "切换角色",
                  icon: <UserSwitchOutlined />,
                },
                {
                  type: "divider",
                },
                {
                  key: "delete",
                  label: "删除用户",
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
              onClick: ({ key }) => handleMenuClick(key, record),
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              style={{
                color: token.colorTextSecondary,
                borderRadius: "6px",
              }}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: User) => ({
      disabled: record.role === "super_admin",
      name: record.username,
    }),
  };

  // 加载用户数据
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
      setTotal(mockUsers.length);
    } catch (_error) {
      message.error("加载用户数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  // 处理搜索
  const handleSearch = (value: string) => {
    setQueryParams(prev => ({ ...prev, keyword: value, page: 1 }));
  };

  // 处理筛选
  const handleFilterChange = (key: string, value: string | undefined) => {
    setQueryParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // 处理编辑
  const handleEdit = (userId: string) => {
    router.push(`/dashboard/users/edit/${userId}`);
  };

  // 处理权限管理
  const handlePermissions = (_userId: string) => {
    Modal.info({
      title: "权限管理",
      content: "权限管理功能开发中...",
      icon: <SafetyCertificateOutlined style={{ color: token.colorPrimary }} />,
    });
  };

  // 处理2FA切换
  const handleToggle2FA = (userId: string, enabled: boolean) => {
    message.success({
      content: `${enabled ? "启用" : "禁用"}双因子认证成功`,
      duration: 3,
    });
  };

  // 处理菜单点击
  const handleMenuClick = (key: string, record: User) => {
    switch (key) {
      case "resetPassword":
        Modal.confirm({
          title: "重置密码",
          content: `确定要重置用户 ${record.realName || record.username} 的密码吗？`,
          icon: <SafetyOutlined style={{ color: token.colorWarning }} />,
          okText: "确认重置",
          cancelText: "取消",
          onOk: () => message.success("密码重置成功，新密码已发送至用户邮箱"),
        });
        break;
      case "switchRole":
        Modal.info({
          title: "切换角色",
          content: "角色切换功能开发中...",
          icon: <UserSwitchOutlined style={{ color: token.colorPrimary }} />,
        });
        break;
      case "delete":
        Modal.confirm({
          title: "删除用户",
          content: `确定要删除用户 ${record.realName || record.username} 吗？此操作不可恢复。`,
          icon: <ExclamationCircleOutlined style={{ color: token.colorError }} />,
          okType: "danger",
          okText: "确认删除",
          cancelText: "取消",
          onOk: () => message.success("用户删除成功"),
        });
        break;
    }
  };

  // 处理新增用户
  const handleAddUser = () => {
    router.push("/dashboard/users/add");
  };

  // 处理批量操作
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要删除的用户");
      return;
    }

    Modal.confirm({
      title: "批量删除用户",
      content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？此操作不可恢复。`,
      icon: <ExclamationCircleOutlined style={{ color: token.colorError }} />,
      okType: "danger",
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        message.success(`成功删除 ${selectedRowKeys.length} 个用户`);
        setSelectedRowKeys([]);
      },
    });
  };

  // 处理刷新
  const handleRefresh = () => {
    loadUsers();
    message.success("数据刷新成功");
  };

  // 处理导出
  const handleExport = () => {
    message.success("用户数据导出成功");
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers, queryParams]);

  return (
    <div style={{
      padding: "24px",
      backgroundColor: token.colorBgLayout,
      minHeight: "100vh",
    }}>
      {/* 页面标题和统计 */}
      <div style={{ marginBottom: "24px" }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }}>
          <Col>
            <Title level={2} style={{ margin: 0, color: token.colorText }}>
              用户管理
            </Title>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              管理系统用户账户、权限和安全设置
            </Text>
          </Col>
          <Col>
            <Space size={12}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                style={{ borderRadius: "6px" }}
              >
                刷新
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExport}
                style={{ borderRadius: "6px" }}
              >
                导出
              </Button>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={handleAddUser}
                size="large"
                style={{
                  borderRadius: "8px",
                  fontWeight: 500,
                  height: "40px",
                  paddingInline: "20px",
                }}
              >
                新增用户
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ borderRadius: "8px", border: `1px solid ${token.colorBorder}` }}>
              <Statistic
                title="总用户数"
                value={statistics.total}
                prefix={<TeamOutlined style={{ color: token.colorPrimary }} />}
                valueStyle={{ color: token.colorText, fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ borderRadius: "8px", border: `1px solid ${token.colorBorder}` }}>
              <Statistic
                title="活跃用户"
                value={statistics.active}
                prefix={<CheckCircleOutlined style={{ color: token.colorSuccess }} />}
                valueStyle={{ color: token.colorSuccess, fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ borderRadius: "8px", border: `1px solid ${token.colorBorder}` }}>
              <Statistic
                title="已认证用户"
                value={statistics.verified}
                prefix={<SafetyCertificateOutlined style={{ color: token.colorWarning }} />}
                valueStyle={{ color: token.colorWarning, fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ borderRadius: "8px", border: `1px solid ${token.colorBorder}` }}>
              <Statistic
                title="2FA启用"
                value={statistics.twoFactor}
                prefix={<SecurityScanOutlined style={{ color: token.colorInfo }} />}
                valueStyle={{ color: token.colorInfo, fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 搜索和筛选 */}
      <Card
        style={{
          marginBottom: "16px",
          borderRadius: "8px",
          border: `1px solid ${token.colorBorder}`,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="搜索用户名、邮箱、姓名"
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择角色"
              allowClear
              style={{ width: "100%" }}
              size="large"
              onChange={(value) => handleFilterChange("role", value)}
              suffixIcon={<FilterOutlined />}
            >
              {Object.entries(roleConfig).map(([key, value]) => (
                <Option key={key} value={key}>{value.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: "100%" }}
              size="large"
              onChange={(value) => handleFilterChange("status", value)}
              suffixIcon={<FilterOutlined />}
            >
              {Object.entries(statusConfig).map(([key, value]) => (
                <Option key={key} value={key}>{value.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="认证状态"
              allowClear
              style={{ width: "100%" }}
              size="large"
              onChange={(value) => handleFilterChange("verificationStatus", value)}
              suffixIcon={<FilterOutlined />}
            >
              {Object.entries(verificationConfig).map(([key, value]) => (
                <Option key={key} value={key}>{value.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 批量操作栏 */}
      {selectedRowKeys.length > 0 && (
        <Card
          style={{
            marginBottom: "16px",
            borderRadius: "8px",
            border: `1px solid ${token.colorPrimary}`,
            backgroundColor: token.colorPrimaryBg,
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Text strong style={{ color: token.colorPrimary }}>
                  已选择 {selectedRowKeys.length} 项
                </Text>
                <Button
                  type="link"
                  onClick={() => setSelectedRowKeys([])}
                  style={{ padding: 0, height: "auto" }}
                >
                  取消选择
                </Button>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDelete}
                  style={{ borderRadius: "6px" }}
                >
                  批量删除
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* 用户列表 */}
      <Card
        style={{
          borderRadius: "8px",
          border: `1px solid ${token.colorBorder}`,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        }}
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <Text type="secondary">
                第 {range[0]}-{range[1]} 条，共 {total} 条
              </Text>
            ),
            onChange: (page, pageSize) => {
              setQueryParams(prev => ({ ...prev, page, pageSize }));
            },
            pageSizeOptions: ["10", "20", "50", "100"],
            style: { marginTop: "16px" },
          }}
          scroll={{ x: 1400 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default UsersPage;
