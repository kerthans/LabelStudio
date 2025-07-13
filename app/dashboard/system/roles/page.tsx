"use client";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Tree,
  Typography,
  message,
} from "antd";
import type { DataNode } from "antd/es/tree";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Permission {
  key: string;
  title: string;
  description: string;
  children?: Permission[];
}

// 使用 Ant Design 的 DataNode 类型
interface TreeNode extends DataNode {
  title: React.ReactNode;
  key: string;
  children?: TreeNode[];
}
interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive";
}

const RolesPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [form] = Form.useForm();

  // 权限树数据
  const permissionTree: Permission[] = [
    {
      key: "annotation",
      title: "标注管理",
      description: "数据标注相关功能",
      children: [
        { key: "annotation.create", title: "创建标注任务", description: "创建新的标注任务" },
        { key: "annotation.edit", title: "编辑标注任务", description: "修改标注任务信息" },
        { key: "annotation.delete", title: "删除标注任务", description: "删除标注任务" },
        { key: "annotation.assign", title: "分配标注任务", description: "将任务分配给标注员" },
        { key: "annotation.review", title: "标注审核", description: "审核标注结果" },
      ],
    },
    {
      key: "project",
      title: "项目管理",
      description: "项目相关管理功能",
      children: [
        { key: "project.create", title: "创建项目", description: "创建新项目" },
        { key: "project.edit", title: "编辑项目", description: "修改项目信息" },
        { key: "project.delete", title: "删除项目", description: "删除项目" },
        { key: "project.member", title: "成员管理", description: "管理项目成员" },
        { key: "project.settings", title: "项目设置", description: "配置项目参数" },
      ],
    },
    {
      key: "quality",
      title: "质量控制",
      description: "质量管理相关功能",
      children: [
        { key: "quality.review", title: "质量审核", description: "审核标注质量" },
        { key: "quality.metrics", title: "质量指标", description: "查看质量统计" },
        { key: "quality.standards", title: "标准管理", description: "管理质量标准" },
        { key: "quality.sampling", title: "抽样检查", description: "执行抽样质检" },
      ],
    },
    {
      key: "dataset",
      title: "数据管理",
      description: "数据集管理功能",
      children: [
        { key: "dataset.upload", title: "上传数据", description: "上传数据集" },
        { key: "dataset.edit", title: "编辑数据", description: "修改数据集" },
        { key: "dataset.delete", title: "删除数据", description: "删除数据集" },
        { key: "dataset.export", title: "导出数据", description: "导出标注结果" },
        { key: "dataset.preprocess", title: "数据预处理", description: "数据预处理功能" },
      ],
    },
    {
      key: "system",
      title: "系统管理",
      description: "系统管理功能",
      children: [
        { key: "system.users", title: "用户管理", description: "管理系统用户" },
        { key: "system.roles", title: "角色管理", description: "管理用户角色" },
        { key: "system.permissions", title: "权限管理", description: "管理系统权限" },
        { key: "system.settings", title: "系统设置", description: "系统参数配置" },
        { key: "system.logs", title: "日志管理", description: "查看系统日志" },
      ],
    },
    {
      key: "analytics",
      title: "数据分析",
      description: "数据分析和报表功能",
      children: [
        { key: "analytics.dashboard", title: "数据看板", description: "查看数据看板" },
        { key: "analytics.reports", title: "报表管理", description: "生成和管理报表" },
        { key: "analytics.export", title: "数据导出", description: "导出分析数据" },
      ],
    },
  ];

  // 模拟角色数据
  const [roles] = useState<Role[]>([
    {
      id: "role_001",
      name: "系统管理员",
      description: "拥有系统所有权限，负责系统维护和用户管理",
      userCount: 3,
      permissions: [
        "annotation.create", "annotation.edit", "annotation.delete", "annotation.assign", "annotation.review",
        "project.create", "project.edit", "project.delete", "project.member", "project.settings",
        "quality.review", "quality.metrics", "quality.standards", "quality.sampling",
        "dataset.upload", "dataset.edit", "dataset.delete", "dataset.export", "dataset.preprocess",
        "system.users", "system.roles", "system.permissions", "system.settings", "system.logs",
        "analytics.dashboard", "analytics.reports", "analytics.export",
      ],
      isSystem: true,
      createdAt: "2023-09-01",
      updatedAt: "2024-01-10",
      status: "active",
    },
    {
      id: "role_002",
      name: "项目经理",
      description: "负责项目管理、任务分配和进度跟踪",
      userCount: 8,
      permissions: [
        "annotation.create", "annotation.edit", "annotation.assign", "annotation.review",
        "project.create", "project.edit", "project.member", "project.settings",
        "quality.review", "quality.metrics",
        "dataset.upload", "dataset.edit", "dataset.export",
        "analytics.dashboard", "analytics.reports",
      ],
      isSystem: false,
      createdAt: "2023-10-15",
      updatedAt: "2024-01-08",
      status: "active",
    },
    {
      id: "role_003",
      name: "质量专家",
      description: "负责质量控制、标准制定和质量审核",
      userCount: 5,
      permissions: [
        "annotation.review",
        "quality.review", "quality.metrics", "quality.standards", "quality.sampling",
        "dataset.export",
        "analytics.dashboard", "analytics.reports",
      ],
      isSystem: false,
      createdAt: "2023-11-01",
      updatedAt: "2024-01-05",
      status: "active",
    },
    {
      id: "role_004",
      name: "标注员",
      description: "执行数据标注任务，提交标注结果",
      userCount: 45,
      permissions: [
        "annotation.create", "annotation.edit",
        "dataset.upload",
        "analytics.dashboard",
      ],
      isSystem: false,
      createdAt: "2023-12-01",
      updatedAt: "2024-01-12",
      status: "active",
    },
    {
      id: "role_005",
      name: "数据分析师",
      description: "负责数据分析、报表生成和数据洞察",
      userCount: 6,
      permissions: [
        "quality.metrics",
        "dataset.export",
        "analytics.dashboard", "analytics.reports", "analytics.export",
      ],
      isSystem: false,
      createdAt: "2023-12-15",
      updatedAt: "2024-01-03",
      status: "active",
    },
  ]);

  // 筛选角色
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchText.toLowerCase()) ||
    role.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      status: role.status,
    });
    setRoleModalVisible(true);
  };

  const handleDelete = (role: Role) => {
    if (role.isSystem) {
      message.warning("系统角色不能删除");
      return;
    }
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除角色 "${role.name}" 吗？此操作不可恢复。`,
      onOk: () => {
        message.success(`角色 "${role.name}" 已删除`);
      },
    });
  };

  // 修复Tree组件的onCheck回调函数类型
  const handlePermissionChange = (
    checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; },
  ) => {
    const checkedKeys = Array.isArray(checked) ? checked : checked.checked;
    setSelectedPermissions(checkedKeys.map(key => String(key)));
  };

  const renderPermissionTree = (permissions: Permission[]): TreeNode[] => {
    return permissions.map(perm => {
      const node: TreeNode = {
        title: (
          <div>
            <Text strong>{perm.title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{perm.description}</Text>
          </div>
        ),
        key: perm.key,
      };

      // 只有当 children 存在时才添加 children 属性
      if (perm.children) {
        node.children = renderPermissionTree(perm.children);
      }

      return node;
    });
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <SafetyOutlined />
              角色权限
            </Title>
            <Text type="secondary">管理系统角色和权限配置，控制用户访问范围</Text>
          </div>
          <Space>
            <Button icon={<SettingOutlined />} onClick={() => setPermissionModalVisible(true)}>
              权限配置
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setEditingRole(null);
              setSelectedPermissions([]);
              form.resetFields();
              setRoleModalVisible(true);
            }}>
              新增角色
            </Button>
          </Space>
        </div>

        {/* 搜索 */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索角色名称或描述"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
        </Row>
      </div>

      {/* 角色列表 */}
      <Row gutter={[16, 16]}>
        {filteredRoles.map(role => (
          <Col xs={24} sm={12} lg={8} xl={6} key={role.id}>
            <Card
              hoverable
              styles={{
                body: { padding: "20px" },
              }}
              actions={[
                <Tooltip title="查看详情" key="view">
                  <EyeOutlined />
                </Tooltip>,
                <Tooltip title="编辑角色" key="edit">
                  <EditOutlined onClick={() => handleEdit(role)} />
                </Tooltip>,
                <Tooltip title={role.isSystem ? "系统角色不可删除" : "删除角色"} key="delete">
                  <DeleteOutlined
                    style={{ color: role.isSystem ? "#d9d9d9" : "#ff4d4f" }}
                    onClick={() => !role.isSystem && handleDelete(role)}
                  />
                </Tooltip>,
              ]}
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: role.isSystem ? "#722ed1" : "#1890ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  color: "white",
                  fontSize: 20,
                }}>
                  {role.isSystem ? <SettingOutlined /> : <TeamOutlined />}
                </div>
                <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                  {role.name}
                  {role.isSystem && (
                    <Tag color="purple" className="small-tag" style={{ marginLeft: 8 }}>系统</Tag>
                  )}
                </Title>
                <Badge
                  count={role.userCount}
                  style={{ backgroundColor: "#52c41a" }}
                  title={`${role.userCount} 个用户`}
                >
                  <UserOutlined style={{ color: "#666", marginRight: 4 }} />
                </Badge>
              </div>

              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{ textAlign: "center", color: "#666", minHeight: 40 }}
              >
                {role.description}
              </Paragraph>

              <Divider style={{ margin: "16px 0" }} />

              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>权限数量</Text>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong>{role.permissions.length} 项</Text>
                  <Tag color={role.status === "active" ? "success" : "default"}>
                    {role.status === "active" ? "启用" : "停用"}
                  </Tag>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>更新时间: {role.updatedAt}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 角色编辑弹窗 */}
      <Modal
        title={editingRole ? "编辑角色" : "新增角色"}
        open={roleModalVisible}
        onCancel={() => setRoleModalVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            console.log("Role values:", { ...values, permissions: selectedPermissions });
            message.success(editingRole ? "角色信息已更新" : "角色创建成功");
            setRoleModalVisible(false);
          });
        }}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select placeholder="请选择状态">
                  <Option value="active">启用</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="角色描述" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item label="权限配置" required>
            <div style={{ border: "1px solid #d9d9d9", borderRadius: 6, padding: 16, maxHeight: 300, overflow: "auto" }}>
              <Tree
                checkable
                checkedKeys={selectedPermissions}
                onCheck={handlePermissionChange}
                treeData={renderPermissionTree(permissionTree)}
                defaultExpandAll
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限配置弹窗 */}
      <Modal
        title="权限配置"
        open={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPermissionModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <div style={{ maxHeight: 500, overflow: "auto" }}>
          <List
            dataSource={permissionTree}
            renderItem={(category) => (
              <List.Item>
                <Card size="small" style={{ width: "100%" }}>
                  <Title level={5}>{category.title}</Title>
                  <Text type="secondary">{category.description}</Text>
                  {category.children && (
                    <div style={{ marginTop: 12 }}>
                      <Row gutter={[8, 8]}>
                        {category.children.map(perm => (
                          <Col span={12} key={perm.key}>
                            <div style={{ padding: 8, border: "1px solid #f0f0f0", borderRadius: 4 }}>
                              <Text strong style={{ fontSize: 12 }}>{perm.title}</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 11 }}>{perm.description}</Text>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RolesPage;
