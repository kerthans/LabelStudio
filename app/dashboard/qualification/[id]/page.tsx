"use client";
import type {
  Qualification,
  QualificationHistory,
  RelatedProject,
} from "@/types/dashboard/tender";
import {
  BuildOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  PaperClipOutlined,
  ProjectOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  ScheduleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Option } = Select;
const { TextArea } = Input;

const QualificationDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [history, setHistory] = useState<QualificationHistory[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([]);
  const [renewModalVisible, setRenewModalVisible] = useState(false);

  useEffect(() => {
    // 模拟获取资质详情
    setTimeout(() => {
      const mockQualification: Qualification = {
        id: params.id as string,
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
        attachments: [
          {
            id: "1",
            name: "建筑工程施工总承包特级资质证书.pdf",
            url: "/files/cert1.pdf",
            size: 2048000,
            type: "application/pdf",
            uploadDate: "2020-01-15",
          },
          {
            id: "2",
            name: "LICENSE.pdf",
            url: "/files/license.pdf",
            size: 1024000,
            type: "application/pdf",
            uploadDate: "2020-01-15",
          },
        ],
        createdAt: "2020-01-15",
        updatedAt: "2024-01-10",
      };

      const mockHistory: QualificationHistory[] = [
        {
          id: "1",
          action: "create",
          operator: "张三",
          timestamp: "2020-01-15 09:00:00",
          description: "创建资质记录",
        },
        {
          id: "2",
          action: "update",
          operator: "李四",
          timestamp: "2022-06-20 14:30:00",
          description: "更新经营范围",
          changes: {
            businessScope: {
              from: ["房屋建筑工程", "市政公用工程"],
              to: ["房屋建筑工程", "市政公用工程", "机电安装工程"],
            },
          },
        },
        {
          id: "3",
          action: "update",
          operator: "王五",
          timestamp: "2024-01-10 10:15:00",
          description: "更新联系信息",
        },
      ];

      const mockRelatedProjects: RelatedProject[] = [
        {
          id: "1",
          projectName: "某市政府办公楼建设项目",
          projectNumber: "TN2024001",
          status: "进行中",
          startDate: "2024-01-01",
          role: "主承包商",
        },
        {
          id: "2",
          projectName: "城市综合体建设项目",
          projectNumber: "TN2023015",
          status: "已完成",
          startDate: "2023-06-01",
          endDate: "2023-12-31",
          role: "主承包商",
        },
      ];

      setQualification(mockQualification);
      setHistory(mockHistory);
      setRelatedProjects(mockRelatedProjects);
      form.setFieldsValue({
        ...mockQualification,
        issueDate: dayjs(mockQualification.issueDate),
        expiryDate: dayjs(mockQualification.expiryDate),
      });
      setLoading(false);
    }, 1000);
  }, [params.id, form]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // 这里可以调用API保存数据
      console.log("保存数据:", values);
      setEditMode(false);
      message.success("保存成功");
    } catch (error) {
      message.error("保存失败，请检查表单信息");
    }
  };

  const handleCancel = () => {
    if (qualification) {
      form.setFieldsValue({
        ...qualification,
        issueDate: dayjs(qualification.issueDate),
        expiryDate: dayjs(qualification.expiryDate),
      });
    }
    setEditMode(false);
  };

  const handleRenew = () => {
    setRenewModalVisible(true);
  };

  const handleRenewSubmit = () => {
    message.success("续期申请已提交");
    setRenewModalVisible(false);
  };

  const statusColors = {
    valid: "green",
    expired: "red",
    expiring: "orange",
    suspended: "default",
  };

  const statusLabels = {
    valid: "有效",
    expired: "已过期",
    expiring: "即将过期",
    suspended: "已暂停",
  };

  const actionLabels = {
    create: "创建",
    update: "更新",
    renew: "续期",
    suspend: "暂停",
    restore: "恢复",
  };

  const projectColumns: ColumnsType<RelatedProject> = [
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "项目编号",
      dataIndex: "projectNumber",
      key: "projectNumber",
      width: 120,
    },
    {
      title: "参与角色",
      dataIndex: "role",
      key: "role",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const color = status === "进行中" ? "blue" : status === "已完成" ? "green" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "开始时间",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
    },
    {
      title: "结束时间",
      dataIndex: "endDate",
      key: "endDate",
      width: 120,
      render: (date: string) => date || "-",
    },
  ];

  const getExpiryStatus = (expiryDate: string) => {
    const now = dayjs();
    const expiry = dayjs(expiryDate);
    const daysLeft = expiry.diff(now, "day");

    if (daysLeft < 0) {
      return { status: "expired", text: "已过期", color: "red" };
    } else if (daysLeft <= 90) {
      return { status: "expiring", text: `${daysLeft}天后过期`, color: "orange" };
    } else {
      return { status: "valid", text: `${daysLeft}天后过期`, color: "green" };
    }
  };

  if (loading || !qualification) {
    return <Card loading={loading} />;
  }

  const expiryStatus = getExpiryStatus(qualification.expiryDate);

  const tabItems = [
    {
      key: "basic",
      label: (
        <span>
          <InfoCircleOutlined style={{ marginRight: 6 }} />
          基本信息
        </span>
      ),
      children: (
        <Card
          title={(
            <span>
              <SafetyCertificateOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              资质详情
            </span>
          )}
          extra={
            <Space>
              {!editMode ? (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  编辑
                </Button>
              ) : (
                <>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                    保存
                  </Button>
                  <Button icon={<CloseOutlined />} onClick={handleCancel}>
                    取消
                  </Button>
                </>
              )}
            </Space>
          }
        >
          {!editMode ? (
            <Descriptions column={2}>
              <Descriptions.Item label="企业名称">{qualification.companyName}</Descriptions.Item>
              <Descriptions.Item label="企业代码">{qualification.companyCode}</Descriptions.Item>
              <Descriptions.Item label="资质类型">{qualification.qualificationType}</Descriptions.Item>
              <Descriptions.Item label="资质等级">
                <Tag color={qualification.qualificationLevel === "特级" ? "gold" : "blue"}>
                  {qualification.qualificationLevel}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="证书编号">{qualification.certificateNumber}</Descriptions.Item>
              <Descriptions.Item label="发证机关">{qualification.issuingAuthority}</Descriptions.Item>
              <Descriptions.Item label="发证日期">{qualification.issueDate}</Descriptions.Item>
              <Descriptions.Item label="有效期至">
                <Space>
                  <span style={{ color: expiryStatus.color }}>{qualification.expiryDate}</span>
                  <Tag color={expiryStatus.color}>{expiryStatus.text}</Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusColors[qualification.status]}>
                  {statusLabels[qualification.status]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="经营范围" span={2}>
                <Space wrap>
                  {qualification.businessScope.map((scope, index) => (
                    <Tag key={index}>{scope}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="企业名称" name="companyName" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="企业代码" name="companyCode" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="资质类型" name="qualificationType" rules={[{ required: true }]}>
                    <Select>
                      <Option value="建筑工程施工总承包">建筑工程施工总承包</Option>
                      <Option value="市政公用工程施工总承包">市政公用工程施工总承包</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="资质等级" name="qualificationLevel" rules={[{ required: true }]}>
                    <Select>
                      <Option value="特级">特级</Option>
                      <Option value="一级">一级</Option>
                      <Option value="二级">二级</Option>
                      <Option value="三级">三级</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="证书编号" name="certificateNumber" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="发证机关" name="issuingAuthority" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="发证日期" name="issueDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="有效期至" name="expiryDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="经营范围" name="businessScope" rules={[{ required: true }]}>
                    <Select mode="multiple">
                      <Option value="房屋建筑工程">房屋建筑工程</Option>
                      <Option value="市政公用工程">市政公用工程</Option>
                      <Option value="机电安装工程">机电安装工程</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
        </Card>
      ),
    },
    {
      key: "validity",
      label: (
        <span>
          <ScheduleOutlined style={{ marginRight: 6 }} />
          有效期管理
        </span>
      ),
      children: (
        <div>
          <Card
            title={(
              <span>
                <ClockCircleOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                有效期状态
              </span>
            )}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Card size="small" hoverable>
                  <div style={{ textAlign: "center" }}>
                    <CalendarOutlined style={{ fontSize: 24, color: "#1890ff", marginBottom: 8 }} />
                    <div style={{ color: "#666", marginBottom: 4 }}>发证日期</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>{qualification.issueDate}</div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small">
                  <div style={{ textAlign: "center" }}>
                    <ClockCircleOutlined style={{ fontSize: 24, color: expiryStatus.color, marginBottom: 8 }} />
                    <div>有效期至</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: expiryStatus.color }}>
                      {qualification.expiryDate}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small">
                  <div style={{ textAlign: "center" }}>
                    <ExclamationCircleOutlined style={{ fontSize: 24, color: expiryStatus.color, marginBottom: 8 }} />
                    <div>状态</div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: expiryStatus.color }}>
                      {expiryStatus.text}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          {expiryStatus.status === "expiring" && (
            <Alert
              message="资质即将过期"
              description={`该资质将在${expiryStatus.text}，请及时办理续期手续。`}
              type="warning"
              showIcon
              action={
                <Button size="small" type="primary" onClick={handleRenew}>
                  申请续期
                </Button>
              }
              style={{ marginBottom: 16 }}
            />
          )}

          <Card title="有效期进度">
            <div style={{ padding: "20px 0" }}>
              <Progress
                percent={Math.max(0, Math.min(100, (dayjs().diff(dayjs(qualification.issueDate), "day") / dayjs(qualification.expiryDate).diff(dayjs(qualification.issueDate), "day")) * 100))}
                status={expiryStatus.status === "expired" ? "exception" : expiryStatus.status === "expiring" ? "active" : "success"}
                strokeColor={{
                  "0%": "#87d068",
                  "70%": "#faad14",
                  "100%": "#ff4d4f",
                }}
              />
              <div style={{ marginTop: 8, textAlign: "center", color: "#666" }}>
                资质有效期进度
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: "attachments",
      label: (
        <span>
          <PaperClipOutlined style={{ marginRight: 6 }} />
          附件管理
        </span>
      ),
      children: (
        <Card
          title={(
            <span>
              <FileTextOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              相关附件
            </span>
          )}
        >
          <div style={{ marginBottom: 16 }}>
            <Upload
              multiple
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => {
                message.success("文件上传成功");
              }}
            >
              <Button type="dashed" icon={<UploadOutlined />} size="large">
                上传附件
              </Button>
            </Upload>
          </div>

          <div>
            {qualification.attachments.map((file) => (
              <Card key={file.id} size="small" style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FileTextOutlined style={{ fontSize: 20, color: "#1890ff", marginRight: 12 }} />
                    <div>
                      <div style={{ fontWeight: "bold" }}>{file.name}</div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB • 上传时间: {file.uploadDate}
                      </div>
                    </div>
                  </div>
                  <Space>
                    <Button type="link" icon={<DownloadOutlined />} size="small">
                      下载
                    </Button>
                    <Button type="link" danger size="small">
                      删除
                    </Button>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      ),
    },
    {
      key: "history",
      label: (
        <span>
          <HistoryOutlined style={{ marginRight: 6 }} />
          历史记录
        </span>
      ),
      children: (
        <Card
          title={(
            <span>
              <HistoryOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              操作历史
            </span>
          )}
        >
          <Timeline
            items={history.map((record) => ({
              key: record.id,
              dot: <ClockCircleOutlined style={{ fontSize: "16px", color: "#1890ff" }} />,
              children: (
                <div>
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                    <Tag color="blue">{actionLabels[record.action]}</Tag>
                    <span style={{ marginLeft: 8 }}>{record.operator}</span>
                  </div>
                  <div style={{ color: "#666", fontSize: "12px", marginBottom: 4 }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {record.timestamp}
                  </div>
                  <div style={{ marginBottom: 8 }}>{record.description}</div>
                  {record.changes && (
                    <div style={{
                      marginTop: 8,
                      padding: 12,
                      background: "#f8f9fa",
                      borderRadius: 6,
                      border: "1px solid #e9ecef",
                    }}>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: 8, fontWeight: "bold" }}>
                        <InfoCircleOutlined style={{ marginRight: 4 }} />
                        变更详情:
                      </div>
                      {Object.entries(record.changes).map(([field, change]) => (
                        <div key={field} style={{ fontSize: "12px", marginBottom: 4 }}>
                          <strong>{field}:</strong>
                          <Tag color="red" className="small-tag" style={{ margin: "0 4px" }}>
                            {JSON.stringify(change.from)}
                          </Tag>
                          →
                          <Tag color="green" className="small-tag" style={{ margin: "0 4px" }}>
                            {JSON.stringify(change.to)}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        </Card>
      ),
    },
    {
      key: "projects",
      label: (
        <span>
          <BuildOutlined style={{ marginRight: 6 }} />
          关联项目
        </span>
      ),
      children: (
        <Card
          title={(
            <span>
              <ProjectOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              参与项目
            </span>
          )}
          extra={
            <Button type="primary" size="small">
              查看更多项目
            </Button>
          }
        >
          <Table
            columns={projectColumns}
            dataSource={relatedProjects}
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
      <Card
        title={(
          <div style={{ display: "flex", alignItems: "center" }}>
            <SafetyCertificateOutlined style={{ fontSize: 20, color: "#1890ff", marginRight: 12 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: "bold" }}>
                {qualification.companyName}
              </div>
              <div style={{ fontSize: 12, color: "#666", fontWeight: "normal" }}>
                {qualification.qualificationType}
              </div>
            </div>
          </div>
        )}
        extra={
          <Space>
            <Button icon={<CloseOutlined />} onClick={() => router.back()}>
              返回
            </Button>
            <Button type="primary" icon={<ProjectOutlined />} onClick={() => router.push("/dashboard/qualification/compare")}>
              资质对比
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
                {qualification.qualificationLevel}
              </div>
              <div style={{ color: "#666" }}>资质等级</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: expiryStatus.color }}>
                {expiryStatus.text}
              </div>
              <div style={{ color: "#666" }}>有效期状态</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>
                {qualification.businessScope.length}
              </div>
              <div style={{ color: "#666" }}>经营范围</div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs items={tabItems} />
      </Card>

      {/* 续期申请弹窗 */}
      <Modal
        title="申请资质续期"
        open={renewModalVisible}
        onOk={handleRenewSubmit}
        onCancel={() => setRenewModalVisible(false)}
      >
        <Alert
          message="续期提醒"
          description="请确保在资质到期前完成续期申请，避免影响正常业务开展。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form layout="vertical">
          <Form.Item label="续期原因" required>
            <TextArea rows={4} placeholder="请说明续期原因" />
          </Form.Item>
          <Form.Item label="预期续期时间" required>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QualificationDetailPage;
