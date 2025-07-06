'use client';
import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Select, 
  InputNumber, 
  Switch, 
  Row, 
  Col, 
  Divider, 
  Typography, 
  Alert,
  Tabs,
  Tag,
  List,
  Slider,
  Checkbox,
  Form,
  Badge,
  Tooltip,
  Progress
} from 'antd';
import LoadingSkeleton from '@/components/share/LoadingSkeleton';
import { 
  PlayCircleOutlined, 
  CodeOutlined, 
  BulbOutlined, 
  RocketOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  StarOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

interface ContentArea {
  span: number;
  height?: number;
  title?: boolean;
  rows?: number;
  type?: 'chart' | 'buttons' | 'list' | 'statistics';
}

const LoadingTestPage: React.FC = () => {
  const [loadingType, setLoadingType] = useState<'dashboard' | 'list' | 'form' | 'table' | 'profile' | 'adaptive'>('dashboard');
  const [rows, setRows] = useState(3);
  const [cards, setCards] = useState(4);
  const [showAvatar, setShowAvatar] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDuration, setLoadingDuration] = useState(2);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Adaptive类型的配置
  const [adaptiveConfig, setAdaptiveConfig] = useState({
    hasStatistics: true,
    hasChart: true,
    hasQuickActions: true,
    hasRecentActivity: true,
    columns: 4
  });
  
  const [contentAreas, setContentAreas] = useState<ContentArea[]>([
    { span: 16, title: true, type: 'chart' as const, rows: 8 },
    { span: 8, title: true, type: 'buttons' as const, rows: 5 }
  ]);

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + (100 / (loadingDuration * 10));
      });
    }, 100);
  };

  const addContentArea = () => {
    setContentAreas(prev => [...prev, {
      span: 12,
      title: true,
      type: 'list',
      rows: 3
    }]);
  };

  const removeContentArea = (index: number) => {
    setContentAreas(prev => prev.filter((_, i) => i !== index));
  };

  const updateContentArea = (index: number, updates: Partial<ContentArea>) => {
    setContentAreas(prev => prev.map((area, i) => 
      i === index ? { ...area, ...updates } : area
    ));
  };

  const codeExamples = {
    basic: `import LoadingSkeleton from '@/components/LoadingSkeleton';

// 基础用法
{loading ? (
  <LoadingSkeleton type="dashboard" />
) : (
  <YourContent />
)}`,
    
    adaptive: `// 新增：自适应类型
<LoadingSkeleton 
  type="adaptive"
  layout={{
    columns: 4,
    hasStatistics: true,
    hasChart: true,
    hasQuickActions: true,
    hasRecentActivity: true,
  }}
  contentAreas={[
    {
      span: 16,
      title: true,
      type: 'chart',
      rows: 8,
    },
    {
      span: 8,
      title: true,
      type: 'buttons',
      rows: 5,
    },
  ]}
/>`,
    
    withHook: `import { useLoading } from '@/components/useLoading';

const { loading, withLoading } = useLoading();

const handleAsyncOperation = async () => {
  await withLoading(async () => {
    // 你的异步操作
    await fetchData();
  });
};`,
    
    customized: `<LoadingSkeleton
  type="list"
  rows={5}
  showAvatar={true}
  showTitle={false}
/>`
  };

  const features = [
    { title: '6种预设类型', desc: 'dashboard、list、form、table、profile、adaptive', icon: '🎨', isNew: true },
    { title: '高度可配置', desc: '行数、卡片数、头像、标题等都可自定义', icon: '⚙️', isNew: false },
    { title: '响应式设计', desc: '自动适配不同屏幕尺寸', icon: '📱', isNew: false },
    { title: '优雅动画', desc: '使用Ant Design原生Skeleton组件', icon: '✨', isNew: false },
    { title: 'TypeScript支持', desc: '完整的类型定义和智能提示', icon: '🔧', isNew: false },
    { title: '自适应布局', desc: '根据内容动态生成loading结构', icon: '🚀', isNew: true }
  ];

  const useCases = [
    { scenario: '数据加载', example: '列表页面、表格数据、统计图表' },
    { scenario: '表单提交', example: '用户注册、数据更新、文件上传' },
    { scenario: '页面切换', example: '路由跳转、Tab切换、模态框' },
    { scenario: 'API调用', example: '搜索结果、分页加载、实时数据' },
    { scenario: '自适应场景', example: '动态内容、可配置布局、响应式页面' }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题和介绍 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1}>
            <RocketOutlined style={{ color: '#1890ff', marginRight: '12px' }} />
            Loading Skeleton 测试中心
            <Badge count="升级版" style={{ marginLeft: '12px' }} />
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            一个优雅、可配置的React Loading组件库，支持多种场景和自定义配置
            <Tag color="red" style={{ marginLeft: '8px' }}>新增Adaptive类型</Tag>
          </Paragraph>
        </div>

        <Alert
          message="🎉 新功能发布"
          description="新增adaptive自适应类型，支持动态配置内容区域，完美匹配你的页面布局！"
          type="success"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      </Card>

      <Tabs defaultActiveKey="1" size="large">
        {/* 实时测试 */}
        <TabPane tab={<span><PlayCircleOutlined />实时测试</span>} key="1">
          <Row gutter={16}>
            <Col xs={24} lg={8}>
              <Card title={<><SettingOutlined /> 基础配置</>} style={{ marginBottom: '16px' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div>
                    <Text strong>Loading类型:</Text>
                    <Select
                      value={loadingType}
                      onChange={setLoadingType}
                      style={{ width: '100%', marginTop: '8px' }}
                      size="large"
                    >
                      <Option value="dashboard">🏠 仪表板</Option>
                      <Option value="list">📋 列表</Option>
                      <Option value="form">📝 表单</Option>
                      <Option value="table">📊 表格</Option>
                      <Option value="profile">👤 个人资料</Option>
                      <Option value="adaptive">
                        <Badge dot color="red">
                          🎯 自适应 (新)
                        </Badge>
                      </Option>
                    </Select>
                  </div>
                  
                  <div>
                    <Text strong>行数: </Text>
                    <Tag color="blue">{rows}</Tag>
                    <Slider
                      min={1}
                      max={10}
                      value={rows}
                      onChange={setRows}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                  
                  {(loadingType === 'dashboard' || loadingType === 'adaptive') && (
                    <div>
                      <Text strong>卡片数量: </Text>
                      <Tag color="green">{cards}</Tag>
                      <Slider
                        min={1}
                        max={8}
                        value={cards}
                        onChange={setCards}
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                  )}
                  
                  <div>
                    <Text strong>Loading时长: </Text>
                    <Tag color="purple">{loadingDuration}秒</Tag>
                    <Slider
                      min={1}
                      max={10}
                      value={loadingDuration}
                      onChange={setLoadingDuration}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                  
                  <Divider />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>显示头像:</Text>
                    <Switch 
                      checked={showAvatar} 
                      onChange={setShowAvatar}
                      checkedChildren="开"
                      unCheckedChildren="关"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>显示标题:</Text>
                    <Switch 
                      checked={showTitle} 
                      onChange={setShowTitle}
                      checkedChildren="开"
                      unCheckedChildren="关"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Loading状态:</Text>
                    <Switch 
                      checked={isLoading} 
                      onChange={setIsLoading}
                      checkedChildren="加载中"
                      unCheckedChildren="已完成"
                    />
                  </div>
                </Space>
              </Card>
              
              {/* Adaptive配置 */}
              {loadingType === 'adaptive' && (
                <Card title={<><ExperimentOutlined /> Adaptive配置</>} style={{ marginBottom: '16px' }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <Text strong>布局选项:</Text>
                      <div style={{ marginTop: '8px' }}>
                        <Checkbox 
                          checked={adaptiveConfig.hasStatistics}
                          onChange={(e) => setAdaptiveConfig(prev => ({...prev, hasStatistics: e.target.checked}))}
                        >
                          统计卡片
                        </Checkbox>
                        <br />
                        <Checkbox 
                          checked={adaptiveConfig.hasChart}
                          onChange={(e) => setAdaptiveConfig(prev => ({...prev, hasChart: e.target.checked}))}
                        >
                          图表区域
                        </Checkbox>
                        <br />
                        <Checkbox 
                          checked={adaptiveConfig.hasQuickActions}
                          onChange={(e) => setAdaptiveConfig(prev => ({...prev, hasQuickActions: e.target.checked}))}
                        >
                          快速操作
                        </Checkbox>
                        <br />
                        <Checkbox 
                          checked={adaptiveConfig.hasRecentActivity}
                          onChange={(e) => setAdaptiveConfig(prev => ({...prev, hasRecentActivity: e.target.checked}))}
                        >
                          最近活动
                        </Checkbox>
                      </div>
                    </div>
                    
                    <div>
                      <Text strong>内容区域配置:</Text>
                      {contentAreas.map((area, index) => (
                        <Card key={index} size="small" style={{ marginTop: '8px' }}>
                          <Row gutter={8}>
                            <Col span={8}>
                              <Text>宽度:</Text>
                              <InputNumber 
                                size="small" 
                                min={1} 
                                max={24} 
                                value={area.span}
                                onChange={(value) => updateContentArea(index, { span: value || 12 })}
                              />
                            </Col>
                            <Col span={8}>
                              <Text>类型:</Text>
                              <Select 
                                size="small" 
                                value={area.type}
                                onChange={(value) => updateContentArea(index, { type: value })}
                                style={{ width: '100%' }}
                              >
                                <Option value="chart">图表</Option>
                                <Option value="buttons">按钮</Option>
                                <Option value="list">列表</Option>
                                <Option value="statistics">统计</Option>
                              </Select>
                            </Col>
                            <Col span={8}>
                              <Text>行数:</Text>
                              <InputNumber 
                                size="small" 
                                min={1} 
                                max={10} 
                                value={area.rows}
                                onChange={(value) => updateContentArea(index, { rows: value || 3 })}
                              />
                            </Col>
                          </Row>
                          <Button 
                            size="small" 
                            danger 
                            onClick={() => removeContentArea(index)}
                            style={{ marginTop: '8px' }}
                          >
                            删除
                          </Button>
                        </Card>
                      ))}
                      <Button 
                        type="dashed" 
                        onClick={addContentArea}
                        style={{ width: '100%', marginTop: '8px' }}
                      >
                        + 添加内容区域
                      </Button>
                    </div>
                  </Space>
                </Card>
              )}
              
              <Card title={<><ThunderboltOutlined /> 操作面板</>}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {isLoading && (
                    <div>
                      <Text strong>加载进度:</Text>
                      <Progress percent={Math.round(loadingProgress)} size="small" />
                    </div>
                  )}
                  
                  <Button 
                    type="primary" 
                    onClick={handleSimulateLoading}
                    size="large"
                    block
                    icon={<PlayCircleOutlined />}
                    loading={isLoading}
                  >
                    {isLoading ? `加载中... ${Math.round(loadingProgress)}%` : `模拟${loadingDuration}秒Loading效果`}
                  </Button>
                  
                  <Button 
                    onClick={() => setIsLoading(!isLoading)}
                    size="large"
                    block
                  >
                    {isLoading ? '停止Loading' : '开始Loading'}
                  </Button>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} lg={16}>
              <Card title="🎬 Loading效果预览" style={{ minHeight: '600px' }}>
                {isLoading ? (
                  loadingType === 'adaptive' ? (
                    <LoadingSkeleton
                      type="adaptive"
                      showTitle={showTitle}
                      showAvatar={showAvatar}
                      layout={{
                        columns: adaptiveConfig.columns,
                        hasStatistics: adaptiveConfig.hasStatistics,
                        hasChart: adaptiveConfig.hasChart,
                        hasQuickActions: adaptiveConfig.hasQuickActions,
                        hasRecentActivity: adaptiveConfig.hasRecentActivity,
                      }}
                      contentAreas={contentAreas}
                    />
                  ) : (
                    <LoadingSkeleton
                      type={loadingType}
                      rows={rows}
                      cards={cards}
                      showAvatar={showAvatar}
                      showTitle={showTitle}
                    />
                  )
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#52c41a' }}>
                    <CheckCircleOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <Title level={2}>内容已加载完成</Title>
                    <Paragraph style={{ fontSize: '16px' }}>
                      这里是实际的页面内容，Loading效果已结束
                    </Paragraph>
                    <Button type="primary" onClick={() => setIsLoading(true)} size="large">
                      重新显示Loading
                    </Button>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 代码示例 */}
        <TabPane tab={<span><CodeOutlined />代码示例</span>} key="2">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="🚀 基础用法" size="small" style={{ marginBottom: '16px' }}>
                <pre style={{ background: '#f6f8fa', padding: '16px', borderRadius: '6px', overflow: 'auto', fontSize: '12px' }}>
                  <code>{codeExamples.basic}</code>
                </pre>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="🎯 自适应类型 (新)" size="small" style={{ marginBottom: '16px' }}>
                <Badge.Ribbon text="NEW" color="red">
                  <pre style={{ background: '#f6f8fa', padding: '16px', borderRadius: '6px', overflow: 'auto', fontSize: '12px' }}>
                    <code>{codeExamples.adaptive}</code>
                  </pre>
                </Badge.Ribbon>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="🎣 配合Hook使用" size="small" style={{ marginBottom: '16px' }}>
                <pre style={{ background: '#f6f8fa', padding: '16px', borderRadius: '6px', overflow: 'auto', fontSize: '12px' }}>
                  <code>{codeExamples.withHook}</code>
                </pre>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="⚙️ 自定义配置" size="small" style={{ marginBottom: '16px' }}>
                <pre style={{ background: '#f6f8fa', padding: '16px', borderRadius: '6px', overflow: 'auto', fontSize: '12px' }}>
                  <code>{codeExamples.customized}</code>
                </pre>
              </Card>
            </Col>
          </Row>

          <Card title="📋 完整API文档">
            <Tabs size="small">
              <TabPane tab="基础Props" key="basic-props">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Title level={4}>通用参数</Title>
                    <List
                      size="small"
                      dataSource={[
                        { prop: 'type', type: 'string', default: 'dashboard', desc: 'Loading类型' },
                        { prop: 'rows', type: 'number', default: '3', desc: '显示行数' },
                        { prop: 'cards', type: 'number', default: '4', desc: '卡片数量(仅dashboard)' },
                        { prop: 'showAvatar', type: 'boolean', default: 'true', desc: '是否显示头像' },
                        { prop: 'showTitle', type: 'boolean', default: 'true', desc: '是否显示标题' }
                      ]}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Text code>{item.prop}</Text>
                          <Tag color="blue">{item.type}</Tag>
                          <Text type="secondary">默认: {item.default}</Text>
                          <br />
                          <Text>{item.desc}</Text>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Title level={4}>Type类型说明</Title>
                    <List
                      size="small"
                      dataSource={[
                        { type: 'dashboard', desc: '仪表板布局，包含统计卡片和图表区域' },
                        { type: 'list', desc: '列表布局，适用于数据列表页面' },
                        { type: 'form', desc: '表单布局，适用于表单页面' },
                        { type: 'table', desc: '表格布局，适用于数据表格' },
                        { type: 'profile', desc: '个人资料布局，包含头像和信息区域' },
                        { type: 'adaptive', desc: '自适应布局，根据配置动态生成', isNew: true }
                      ]}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Tag color={item.isNew ? "red" : "green"}>{item.type}</Tag>
                          {item.isNew && <Badge count="NEW" style={{ marginLeft: '4px' }} />}
                          <Text>{item.desc}</Text>
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane tab="Adaptive配置" key="adaptive-props">
                <Alert
                  message="🎯 Adaptive类型专用配置"
                  description="这些配置仅在type='adaptive'时生效"
                  type="info"
                  style={{ marginBottom: '16px' }}
                />
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Title level={4}>Layout配置</Title>
                    <List
                      size="small"
                      dataSource={[
                        { prop: 'columns', type: 'number', desc: '统计卡片列数' },
                        { prop: 'hasStatistics', type: 'boolean', desc: '是否显示统计卡片' },
                        { prop: 'hasChart', type: 'boolean', desc: '是否显示图表区域' },
                        { prop: 'hasQuickActions', type: 'boolean', desc: '是否显示快速操作' },
                        { prop: 'hasRecentActivity', type: 'boolean', desc: '是否显示最近活动' }
                      ]}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Text code>layout.{item.prop}</Text>
                          <Tag color="purple">{item.type}</Tag>
                          <br />
                          <Text>{item.desc}</Text>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Title level={4}>ContentAreas配置</Title>
                    <List
                      size="small"
                      dataSource={[
                        { prop: 'span', type: 'number', desc: '栅格宽度(1-24)' },
                        { prop: 'title', type: 'boolean', desc: '是否显示标题' },
                        { prop: 'rows', type: 'number', desc: '内容行数' },
                        { prop: 'type', type: 'chart|buttons|list|statistics', desc: '内容类型' },
                        { prop: 'height', type: 'number', desc: '自定义高度(可选)' }
                      ]}
                      renderItem={(item: any) => (
                        <List.Item>
                          <Text code>contentAreas[].{item.prop}</Text>
                          <Tag color="orange">{item.type}</Tag>
                          <br />
                          <Text>{item.desc}</Text>
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </TabPane>

        {/* 特性介绍 */}
        <TabPane tab={<span><BulbOutlined />特性介绍</span>} key="3">
          <Row gutter={16}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <Badge.Ribbon text={feature.isNew ? "NEW" : ""} color="red" style={{ display: feature.isNew ? 'block' : 'none' }}>
                  <Card size="small" style={{ marginBottom: '16px', height: '140px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
                      <Title level={5}>
                        {feature.title}
                        {feature.isNew && <StarOutlined style={{ color: '#faad14', marginLeft: '4px' }} />}
                      </Title>
                      <Text type="secondary">{feature.desc}</Text>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Col>
            ))}
          </Row>

          <Card title="🎯 使用场景" style={{ marginTop: '24px' }}>
            <Row gutter={16}>
              {useCases.map((useCase, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <Card size="small" style={{ marginBottom: '16px' }}>
                    <Title level={5}>{useCase.scenario}</Title>
                    <Text type="secondary">{useCase.example}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Alert
            message="💡 最佳实践"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                <li>根据页面内容选择合适的Loading类型</li>
                <li>使用adaptive类型实现完全自定义的loading布局</li>
                <li>保持Loading时间在2-3秒内，避免用户等待过久</li>
                <li>在数据量大的页面使用分页或虚拟滚动配合Loading</li>
                <li>为异步操作提供明确的Loading反馈和进度指示</li>
                <li>在移动端适当减少Loading元素的复杂度</li>
                <li>使用contentAreas配置实现响应式loading布局</li>
              </ul>
            }
            type="success"
            showIcon
            style={{ marginTop: '24px' }}
          />
          
          <Card title="🔥 更新日志" style={{ marginTop: '24px' }}>
            <List
              dataSource={[
                { version: 'v2.0.0', date: '2024-01-15', changes: ['新增adaptive自适应类型', '支持动态配置内容区域', '增加进度指示器', '优化响应式布局'] },
                { version: 'v1.2.0', date: '2024-01-10', changes: ['增加滑块控制', '优化用户体验', '新增更多配置选项'] },
                { version: 'v1.1.0', date: '2024-01-05', changes: ['支持自定义loading时长', '增加实时预览功能'] }
              ]}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={<><Tag color="blue">{item.version}</Tag> <Text type="secondary">{item.date}</Text></>}
                    description={
                      <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                        {item.changes.map((change: string, idx: number) => (
                          <li key={idx}>{change}</li>
                        ))}
                      </ul>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default LoadingTestPage;