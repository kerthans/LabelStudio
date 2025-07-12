"use client";
import type { Qualification, QualificationFilter } from "@/types/dashboard/tender";
import {
  BankOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileProtectOutlined,
  FilterOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Empty,
  Input,
  Modal,
  Progress,
  Row,
  Select,
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

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const QualificationPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState<QualificationFilter>({});
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [expiringCount, setExpiringCount] = useState(0);
  const [statistics, setStatistics] = useState({
    total: 0,
    valid: 0,
    expiring: 0,
    expired: 0,
  });

  // 模拟数据加载
  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockData: Qualification[] = [
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
          createdAt: "2024-01-10",
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
          createdAt: "2024-01-12",
          updatedAt: "2024-01-12",
        },
        {
          id: "3",
          companyName: "上海建工集团股份有限公司",
          companyCode: "SHJG003",
          qualificationType: "市政公用工程施工总承包",
          qualificationLevel: "一级",
          certificateNumber: "B1122334455",
          issueDate: "2019-06-10",
          expiryDate: "2023-06-10",
          issuingAuthority: "上海市住房和城乡建设管理委员会",
          businessScope: ["市政公用工程", "城市轨道交通工程"],
          status: "expired",
          attachments: [],
          createdAt: "2024-01-08",
          updatedAt: "2024-01-08",
        },
        {
          id: "4",
          companyName: "中铁建工集团有限公司",
          companyCode: "ZTJG004",
          qualificationType: "铁路工程施工总承包",
          qualificationLevel: "一级",
          certificateNumber: "C3344556677",
          issueDate: "2022-08-15",
          expiryDate: "2027-08-15",
          issuingAuthority: "国家铁路局",
          businessScope: ["铁路工程", "城市轨道交通工程"],
          status: "valid",
          attachments: [],
          createdAt: "2024-01-05",
          updatedAt: "2024-01-05",
        },
      ];

      setQualifications(mockData);

      // 计算统计数据
      const stats = {
        total: mockData.length,
        valid: mockData.filter(q => q.status === "valid").length,
        expiring: mockData.filter(q => q.status === "expiring").length,
        expired: mockData.filter(q => q.status === "expired").length,
      };
      setStatistics(stats);
      setExpiringCount(stats.expiring);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(false);
    setRefreshing(false);
    message.success("数据已刷新");
  };

  const statusConfig = {
    valid: { color: "success", text: "有效", icon: <CheckCircleOutlined /> },
    expired: { color: "error", text: "已过期", icon: <ExclamationCircleOutlined /> },
    expiring: { color: "warning", text: "即将过期", icon: <ClockCircleOutlined /> },
    suspended: { color: "default", text: "已暂停", icon: <WarningOutlined /> },
  };

  const levelConfig = {
    "特级": { color: "gold", icon: "🏆" },
    "一级": { color: "blue", icon: "🥇" },
    "二级": { color: "green", icon: "🥈" },
    "三级": { color: "default", icon: "🥉" },
  };

  const columns: ColumnsType<Qualification> = [
    {
      title: "企业信息",
      key: "company",
      width: 280,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={40}
            icon={<BankOutlined />}
            style={{
              backgroundColor: "#1890ff",
              marginRight: 12,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontWeight: 600,
              fontSize: 14,
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {record.companyName}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.companyCode}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "资质信息",
      key: "qualification",
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text strong style={{ fontSize: 13 }}>
              {record.qualificationType}
            </Text>
          </div>
          <Tag
            color={levelConfig[record.qualificationLevel as keyof typeof levelConfig]?.color}
            style={{ fontSize: 11 }}
          >
            {record.qualificationLevel}
          </Tag>
        </div>
      ),
    },
    {
      title: "证书编号",
      dataIndex: "certificateNumber",
      key: "certificateNumber",
      width: 140,
      render: (text: string) => (
        <Text code style={{ fontSize: 12 }}>{text}</Text>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: keyof typeof statusConfig, record: Qualification) => {
        const config = statusConfig[status];
        return (
          <div>
            <Tag color={config.color} icon={config.icon} style={{ marginBottom: 4 }}>
              {config.text}
            </Tag>
            {status === "expiring" && (
              <div>
                <Tooltip title={`将于 ${record.expiryDate} 过期`}>
                  <Text type="warning" style={{ fontSize: 11 }}>
                    <ClockCircleOutlined style={{ marginRight: 2 }} />
                    {record.expiryDate}
                  </Text>
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "有效期",
      key: "validity",
      width: 140,
      render: (_, record) => {
        const isExpiring = record.status === "expiring";
        const isExpired = record.status === "expired";
        return (
          <div>
            <div style={{ fontSize: 12, marginBottom: 2 }}>
              <Text type="secondary">发证：{record.issueDate}</Text>
            </div>
            <div style={{ fontSize: 12 }}>
              <Text
                type={isExpired ? "danger" : isExpiring ? "warning" : "secondary"}
              >
                到期：{record.expiryDate}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "经营范围",
      dataIndex: "businessScope",
      key: "businessScope",
      width: 200,
      render: (scope: string[]) => (
        <div>
          {scope.slice(0, 2).map((item, index) => (
            <Tag key={index} className="small-tag" style={{ marginBottom: 2 }}>
              {item}
            </Tag>
          ))}
          {scope.length > 2 && (
            <Tooltip title={scope.slice(2).join("、")}>
              <Tag className="small-tag" style={{ cursor: "pointer" }}>
                +{scope.length - 2}
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "查看详情",
                icon: <EyeOutlined />,
                onClick: () => router.push(`/dashboard/qualification/${record.id}`),
              },
              {
                key: "edit",
                label: "编辑",
                icon: <EditOutlined />,
                onClick: () => router.push(`/dashboard/qualification/edit/${record.id}`),
              },
              {
                type: "divider",
              },
              {
                key: "delete",
                label: "删除",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  const handleDelete = (record: Qualification) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除企业"${record.companyName}"的资质记录吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () => {
        message.success("删除成功");
        loadData(false);
      },
    });
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, keyword: value });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: "批量删除确认",
      content: `确定要删除选中的 ${selectedRowKeys.length} 个资质记录吗？此操作不可恢复。`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () => {
        message.success(`已删除 ${selectedRowKeys.length} 个资质记录`);
        setSelectedRowKeys([]);
        loadData(false);
      },
    });
  };

  const clearFilters = () => {
    setFilters({});
    message.success("筛选条件已清空");
  };

  const uploadProps: UploadProps = {
    name: "file",
    accept: ".xlsx,.xls,.csv",
    beforeUpload: (file) => {
      const isValidType = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === "text/csv";
      if (!isValidType) {
        message.error("只支持 Excel 和 CSV 格式的文件！");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("文件大小不能超过 5MB！");
        return false;
      }
      return true;
    },
    customRequest: ({ file, onSuccess, onError }) => {
      const timer = setTimeout(() => {
        message.success("文件上传成功，正在处理数据...");
        onSuccess?.(null);
        setImportModalVisible(false);
        loadData(false);
      }, 2000);
    },
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record: Qualification) => ({
      disabled: record.status === "expired",
    }),
  };

  return (
    <div>
      {/* 页面标题和统计 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <SafetyCertificateOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              企业资质管理
            </Title>
            <Text type="secondary">管理企业资质证书，监控有效期状态</Text>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshing}
            >
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/dashboard/qualification/add")}
              size="large"
            >
              新增资质
            </Button>
          </Space>
        </div>

        {/* 统计卡片 */}
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Card size="small" hoverable>
              <Statistic
                title="总资质数量"
                value={statistics.total}
                suffix="个"
                prefix={<FileProtectOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" hoverable>
              <Statistic
                title="有效资质"
                value={statistics.valid}
                suffix="个"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" hoverable>
              <Statistic
                title="即将过期"
                value={statistics.expiring}
                suffix="个"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
              {statistics.expiring > 0 && (
                <Progress
                  percent={(statistics.expiring / statistics.total) * 100}
                  size="small"
                  strokeColor="#faad14"
                  showInfo={false}
                  style={{ marginTop: 8 }}
                />
              )}
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" hoverable>
              <Statistic
                title="已过期"
                value={statistics.expired}
                suffix="个"
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 到期预警 */}
      {expiringCount > 0 && (
        <Alert
          message="资质到期预警"
          description={`有 ${expiringCount} 个资质即将到期，请及时处理续期手续！`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="link">
              立即处理
            </Button>
          }
        />
      )}

      {/* 主要内容卡片 */}
      <Card>
        {/* 筛选区域 */}
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8} md={6}>
              <Input.Search
                placeholder="搜索企业名称或代码"
                allowClear
                onSearch={handleSearch}
                style={{ width: "100%" }}
                enterButton={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Select
                placeholder="资质类型"
                allowClear
                style={{ width: "100%" }}
                onChange={(value) => setFilters({ ...filters, qualificationType: value })}
              >
                <Option value="建筑工程施工总承包">建筑工程</Option>
                <Option value="市政公用工程施工总承包">市政工程</Option>
                <Option value="机电工程施工总承包">机电工程</Option>
                <Option value="铁路工程施工总承包">铁路工程</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={3}>
              <Select
                placeholder="资质等级"
                allowClear
                style={{ width: "100%" }}
                onChange={(value) => setFilters({ ...filters, qualificationLevel: value })}
              >
                <Option value="特级">特级</Option>
                <Option value="一级">一级</Option>
                <Option value="二级">二级</Option>
                <Option value="三级">三级</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={3}>
              <Select
                placeholder="状态"
                allowClear
                style={{ width: "100%" }}
                onChange={(value) => setFilters({ ...filters, status: value })}
              >
                <Option value="valid">有效</Option>
                <Option value="expiring">即将过期</Option>
                <Option value="expired">已过期</Option>
                <Option value="suspended">已暂停</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={5}>
              <RangePicker
                placeholder={["开始日期", "结束日期"]}
                style={{ width: "100%" }}
                size="middle"
              />
            </Col>
            <Col xs={24} sm={8} md={3}>
              <Space>
                <Button icon={<FilterOutlined />}>高级筛选</Button>
                <Button icon={<ClearOutlined />} onClick={clearFilters}>清空</Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 操作栏 */}
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => setImportModalVisible(true)}
                >
                  批量导入
                </Button>
                <Button icon={<DownloadOutlined />}>
                  导出模板
                </Button>
                {selectedRowKeys.length > 0 && (
                  <>
                    <Divider type="vertical" />
                    <Text type="secondary">已选择 {selectedRowKeys.length} 项</Text>
                    <Button size="small" onClick={handleBatchDelete} danger>
                      批量删除
                    </Button>
                    <Button size="small" icon={<DownloadOutlined />}>
                      导出数据
                    </Button>
                  </>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={qualifications}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: 1200 }}
          pagination={{
            total: qualifications.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无资质数据"
              >
                <Button type="primary" onClick={() => router.push("/dashboard/qualification/add")}>
                  立即添加
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* 批量导入弹窗 */}
      <Modal
        title={
          <Space>
            <UploadOutlined style={{ color: "#1890ff" }} />
            <span>批量导入资质数据</span>
          </Space>
        }
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setImportModalVisible(false)}>
            取消
          </Button>,
          <Button key="template" icon={<DownloadOutlined />}>
            下载模板
          </Button>,
        ]}
      >
        <Alert
          message="导入说明"
          description="请下载模板文件，按照模板格式填写数据后上传。支持 Excel 和 CSV 格式，文件大小不超过 5MB。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持 Excel (.xlsx, .xls) 和 CSV 格式</p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
};

export default QualificationPage;
