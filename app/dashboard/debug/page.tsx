"use client";
import {
  CodeOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  SaveOutlined,
  SettingOutlined
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography
} from "antd";
import dayjs from 'dayjs';
import React, { useCallback, useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

interface JsonFile {
  name: string;
  content: Record<string, any>;
  lastModified: string;
  size: number;
}

interface FormField {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  path: string[];
}

const DebugPage: React.FC = () => {
  const [selectedAnalysisFile, setSelectedAnalysisFile] = useState<string>("");
  const [selectedQualificationFile, setSelectedQualificationFile] = useState<string>("");
  const [analysisJson, setAnalysisJson] = useState<Record<string, any>>({});
  const [qualificationJson, setQualificationJson] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingType, setEditingType] = useState<'analysis' | 'qualification' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingData, setEditingData] = useState<Record<string, any>>({});

  // 模拟数据
  const mockAnalysisFiles: JsonFile[] = [
    {
      name: "tender_analysis_001.json",
      content: {
        projectName: "某市政道路建设工程",
        analysisDate: "2024-01-15",
        budget: 5000000,
        isUrgent: true,
        requirements: {
          technicalSpecs: ["道路等级：城市主干路", "设计速度：60km/h"],
          qualifications: ["市政公用工程施工总承包一级", "安全生产许可证"]
        },
        riskAssessment: {
          level: "中等",
          score: 75,
          factors: ["工期紧张", "交通影响"]
        }
      },
      lastModified: "2024-01-15 14:30:00",
      size: 2048
    },
    {
      name: "tender_analysis_002.json",
      content: {
        projectName: "办公楼装修工程",
        analysisDate: "2024-01-14",
        budget: 2000000,
        isUrgent: false,
        requirements: {
          technicalSpecs: ["装修等级：精装修", "环保标准：绿色建筑"]
        }
      },
      lastModified: "2024-01-14 16:45:00",
      size: 1536
    }
  ];

  const mockQualificationFiles: JsonFile[] = [
    {
      name: "company_qualification_001.json",
      content: {
        companyName: "某建筑工程有限公司",
        registrationNumber: "91110000123456789X",
        establishedDate: "2010-05-20",
        isActive: true,
        qualifications: {
          construction: {
            level: "特级",
            scope: ["房屋建筑工程", "市政公用工程"],
            validUntil: "2025-12-31"
          },
          safety: {
            certificateNumber: "(京)JZ安许证字[2023]001号",
            validUntil: "2026-06-30"
          }
        },
        performance: {
          recentProjects: 156,
          totalValue: "50.8亿元",
          successRate: 98.5
        }
      },
      lastModified: "2024-01-15 10:20:00",
      size: 3072
    }
  ];

  // 检测数据类型
  const detectType = (value: any): FormField['type'] => {
    if (value === null || value === undefined) return 'string';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date';
    return 'string';
  };

  // 将JSON转换为表单字段
  const jsonToFormFields = (obj: any, path: string[] = []): FormField[] => {
    const fields: FormField[] = [];

    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = [...path, key];
      const type = detectType(value);

      fields.push({
        key,
        value,
        type,
        path: currentPath
      });
    });

    return fields;
  };

  // 渲染表单项
  const renderFormItem = (field: FormField, parentPath: string = '') => {
    const fieldName = parentPath ? `${parentPath}.${field.key}` : field.key;
    const fieldPath = field.path.join('.');

    switch (field.type) {
      case 'boolean':
        return (
          <Form.Item
            key={fieldPath}
            name={fieldName}
            label={field.key}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item
            key={fieldPath}
            name={fieldName}
            label={field.key}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        );

      case 'date':
        return (
          <Form.Item
            key={fieldPath}
            name={fieldName}
            label={field.key}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        );

      case 'array':
        return (
          <Form.Item key={fieldPath} label={field.key}>
            <Card size="small" style={{ backgroundColor: '#fafafa' }}>
              <Form.List name={fieldName}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name]}
                          style={{ margin: 0, flex: 1 }}
                        >
                          <Input placeholder={`${field.key}项目`} />
                        </Form.Item>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          danger
                        />
                      </Space>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加{field.key}项目
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>
          </Form.Item>
        );

      case 'object':
        const subFields = jsonToFormFields(field.value, field.path);
        return (
          <Form.Item key={fieldPath} label={field.key}>
            <Card size="small" style={{ backgroundColor: '#f8f9fa' }}>
              {subFields.map(subField =>
                renderFormItem(subField, fieldName)
              )}
            </Card>
          </Form.Item>
        );

      default:
        return (
          <Form.Item
            key={fieldPath}
            name={fieldName}
            label={field.key}
          >
            <Input />
          </Form.Item>
        );
    }
  };

  // 处理文件选择
  const handleFileSelect = useCallback((type: 'analysis' | 'qualification', fileName: string) => {
    const files = type === 'analysis' ? mockAnalysisFiles : mockQualificationFiles;
    const file = files.find(f => f.name === fileName);

    if (file) {
      if (type === 'analysis') {
        setSelectedAnalysisFile(fileName);
        setAnalysisJson(file.content);
      } else {
        setSelectedQualificationFile(fileName);
        setQualificationJson(file.content);
      }
      message.success(`已加载 ${fileName}`);
    }
  }, []);

  // 开始编辑
  const startEdit = useCallback((type: 'analysis' | 'qualification') => {
    const content = type === 'analysis' ? analysisJson : qualificationJson;
    setEditingData(content);
    setEditingType(type);
    setIsEditing(true);

    // 设置表单初始值
    const formValues = flattenObject(content);
    form.setFieldsValue(formValues);
  }, [analysisJson, qualificationJson, form]);

  // 扁平化对象用于表单
  const flattenObject = (obj: any, prefix = ''): any => {
    const flattened: any = {};

    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value, newKey));
      } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        flattened[newKey] = dayjs(value);
      } else {
        flattened[newKey] = value;
      }
    });

    return flattened;
  };

  // 重构对象从表单值
  const unflattenObject = (flattened: any): any => {
    const result: any = {};

    Object.keys(flattened).forEach(key => {
      const keys = key.split('.');
      let current = result;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      let value = flattened[key];
      if (dayjs.isDayjs(value)) {
        value = value.format('YYYY-MM-DD');
      }

      current[keys[keys.length - 1]] = value;
    });

    return result;
  };

  // 保存编辑
  const saveEdit = useCallback(async () => {
    try {
      setLoading(true);
      const formValues = await form.validateFields();
      const reconstructedJson = unflattenObject(formValues);

      if (editingType === 'analysis') {
        setAnalysisJson(reconstructedJson);
      } else {
        setQualificationJson(reconstructedJson);
      }

      // 模拟保存到文件
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('JSON文件保存成功');
      setIsEditing(false);
      setEditingType(null);
    } catch (error) {
      message.error('表单验证失败，请检查输入');
    } finally {
      setLoading(false);
    }
  }, [form, editingType]);

  // 模拟分析请求
  const requestAnalysis = useCallback(async () => {
    if (!selectedAnalysisFile || !selectedQualificationFile) {
      message.warning('请先选择分析文件和资质文件');
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success(`分析完成：${selectedAnalysisFile} + ${selectedQualificationFile}`);
    } catch (error) {
      message.error('分析请求失败');
    } finally {
      setLoading(false);
    }
  }, [selectedAnalysisFile, selectedQualificationFile]);

  const tabItems = [
    {
      key: '1',
      label: (
        <Space>
          <FileTextOutlined />
          招标分析文件
        </Space>
      ),
      children: (
        <Card size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>选择分析文件：</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="请选择招标分析文件"
                value={selectedAnalysisFile}
                onChange={(value) => handleFileSelect('analysis', value)}
              >
                {mockAnalysisFiles.map(file => (
                  <Option key={file.name} value={file.name}>
                    <Space>
                      <FileTextOutlined />
                      {file.name}
                      <Text type="secondary">({(file.size / 1024).toFixed(1)}KB)</Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>

            {selectedAnalysisFile && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <Space>
                    <Text strong>文件内容：</Text>
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => startEdit('analysis')}
                    >
                      表单编辑
                    </Button>
                  </Space>
                </div>
                <Collapse size="small">
                  <Panel header="查看JSON结构" key="1">
                    <pre style={{
                      margin: 0,
                      fontSize: '12px',
                      maxHeight: '200px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      backgroundColor: '#f5f5f5',
                      padding: '8px',
                      borderRadius: '4px'
                    }}>
                      {JSON.stringify(analysisJson, null, 2)}
                    </pre>
                  </Panel>
                </Collapse>
              </div>
            )}
          </Space>
        </Card>
      ),
    },
    {
      key: '2',
      label: (
        <Space>
          <DatabaseOutlined />
          公司资质文件
        </Space>
      ),
      children: (
        <Card size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>选择资质文件：</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                placeholder="请选择公司资质文件"
                value={selectedQualificationFile}
                onChange={(value) => handleFileSelect('qualification', value)}
              >
                {mockQualificationFiles.map(file => (
                  <Option key={file.name} value={file.name}>
                    <Space>
                      <DatabaseOutlined />
                      {file.name}
                      <Text type="secondary">({(file.size / 1024).toFixed(1)}KB)</Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>

            {selectedQualificationFile && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <Space>
                    <Text strong>文件内容：</Text>
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => startEdit('qualification')}
                    >
                      表单编辑
                    </Button>
                  </Space>
                </div>
                <Collapse size="small">
                  <Panel header="查看JSON结构" key="1">
                    <pre style={{
                      margin: 0,
                      fontSize: '12px',
                      maxHeight: '200px',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      backgroundColor: '#f5f5f5',
                      padding: '8px',
                      borderRadius: '4px'
                    }}>
                      {JSON.stringify(qualificationJson, null, 2)}
                    </pre>
                  </Panel>
                </Collapse>
              </div>
            )}
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
          <SettingOutlined style={{ marginRight: 12, color: '#1890ff' }} />
          JSON文件管理器
        </Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          选择并编辑招标分析文件和公司资质文件，支持可视化表单编辑
        </Text>
      </div>

      {/* 主要功能区域 */}
      <Row gutter={[16, 16]}>
        {/* 文件管理 */}
        <Col xs={24} xl={16}>
          <Card
            title={
              <Space>
                <FolderOpenOutlined />
                <span>文件管理</span>
              </Space>
            }
            extra={
              <Button
                type="primary"
                icon={<CodeOutlined />}
                loading={loading}
                onClick={requestAnalysis}
                disabled={!selectedAnalysisFile || !selectedQualificationFile}
              >
                执行分析
              </Button>
            }
          >
            <Tabs items={tabItems} />
          </Card>
        </Col>

        {/* 状态面板 */}
        <Col xs={24} xl={8}>
          <Card
            title={
              <Space>
                <SettingOutlined />
                <span>状态面板</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Alert
                message="文件状态"
                description={
                  <div>
                    <div style={{ marginBottom: 4 }}>
                      <Text strong>分析文件: </Text>
                      {selectedAnalysisFile ? (
                        <Tag color="green">{selectedAnalysisFile}</Tag>
                      ) : (
                        <Tag>未选择</Tag>
                      )}
                    </div>
                    <div>
                      <Text strong>资质文件: </Text>
                      {selectedQualificationFile ? (
                        <Tag color="blue">{selectedQualificationFile}</Tag>
                      ) : (
                        <Tag>未选择</Tag>
                      )}
                    </div>
                  </div>
                }
                type={selectedAnalysisFile && selectedQualificationFile ? 'success' : 'info'}
                showIcon
              />

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>快捷操作</Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    block
                    icon={<EditOutlined />}
                    disabled={!selectedAnalysisFile}
                    onClick={() => startEdit('analysis')}
                  >
                    编辑分析文件
                  </Button>
                  <Button
                    block
                    icon={<DatabaseOutlined />}
                    disabled={!selectedQualificationFile}
                    onClick={() => startEdit('qualification')}
                  >
                    编辑资质文件
                  </Button>
                  <Button
                    block
                    type="primary"
                    icon={<CodeOutlined />}
                    loading={loading}
                    disabled={!selectedAnalysisFile || !selectedQualificationFile}
                    onClick={requestAnalysis}
                  >
                    执行分析请求
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 表单编辑器模态框 */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            {editingType === 'analysis' ? '编辑招标分析文件' : '编辑公司资质文件'}
          </Space>
        }
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setIsEditing(false)}>
            取消
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={saveEdit}
          >
            保存
          </Button>,
        ]}
        style={{ top: 20 }}
      >
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="表单编辑器"
            description="通过可视化表单编辑JSON数据，支持动态添加和删除字段，保存后自动转换为JSON格式"
            type="info"
            showIcon
          />
        </div>

        <div style={{ maxHeight: '60vh', overflow: 'auto', padding: '0 8px' }}>
          <Form
            form={form}
            layout="vertical"
            size="small"
          >
            {editingData && Object.keys(editingData).length > 0 &&
              jsonToFormFields(editingData).map(field =>
                renderFormItem(field)
              )
            }
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default DebugPage;
