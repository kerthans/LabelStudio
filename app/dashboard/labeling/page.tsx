'use client';
import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Tag,
  Progress,
  List,
  Avatar,
  Divider,
} from 'antd';
import {
  HighlightOutlined,
  CheckOutlined,
  CloseOutlined,
  StepForwardOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';

const LabelingPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const mockData = {
    taskName: '动物图像分类标注',
    totalItems: 1000,
    completedItems: 245,
    currentItem: {
      id: 'img_001',
      type: 'image',
      url: '/api/placeholder/400/300',
      filename: 'cat_001.jpg',
    },
    labels: [
      { id: 'cat', name: '猫', color: '#1890ff' },
      { id: 'dog', name: '狗', color: '#52c41a' },
      { id: 'bird', name: '鸟', color: '#faad14' },
      { id: 'fish', name: '鱼', color: '#722ed1' },
      { id: 'other', name: '其他', color: '#f5222d' },
    ],
  };

  const handleLabelSelect = (labelId: string) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter(id => id !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const handleSubmit = () => {
    // 提交标注结果
    console.log('提交标注:', selectedLabels);
    setSelectedLabels([]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleSkip = () => {
    // 跳过当前项
    setSelectedLabels([]);
    setCurrentIndex(currentIndex + 1);
  };

  const progress = (mockData.completedItems / mockData.totalItems) * 100;

  return (
    <div>
      {/* 任务信息 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <h3 style={{ margin: 0 }}>{mockData.taskName}</h3>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              进度: {mockData.completedItems} / {mockData.totalItems}
            </p>
          </Col>
          <Col>
            <Progress
              type="circle"
              percent={Math.round(progress)}
              width={80}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {/* 标注区域 */}
        <Col xs={24} lg={16}>
          <Card title="标注内容" style={{ minHeight: 600 }}>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              {/* 这里应该是实际的图像或其他数据展示组件 */}
              <div
                style={{
                  width: '100%',
                  height: 400,
                  background: '#f5f5f5',
                  border: '2px dashed #d9d9d9',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  color: '#999',
                }}
              >
                📷 {mockData.currentItem.filename}
                <br />
                <small>这里显示待标注的图像</small>
              </div>
            </div>

            {/* 操作按钮 */}
            <Divider />
            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<UndoOutlined />}>
                撤销
              </Button>
              <Button icon={<SaveOutlined />}>
                保存
              </Button>
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                onClick={handleSubmit}
                disabled={selectedLabels.length === 0}
              >
                提交
              </Button>
              <Button 
                icon={<StepForwardOutlined />}
                onClick={handleSkip}
              >
                跳过
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 标签面板 */}
        <Col xs={24} lg={8}>
          <Card title="标签选择" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockData.labels.map((label) => (
                <Button
                  key={label.id}
                  block
                  size="large"
                  type={selectedLabels.includes(label.id) ? 'primary' : 'default'}
                  style={{
                    backgroundColor: selectedLabels.includes(label.id) ? label.color : undefined,
                    borderColor: label.color,
                    color: selectedLabels.includes(label.id) ? 'white' : label.color,
                  }}
                  onClick={() => handleLabelSelect(label.id)}
                >
                  {label.name}
                </Button>
              ))}
            </Space>
          </Card>

          {/* 快捷键说明 */}
          <Card title="快捷键" size="small">
            <List size="small">
              <List.Item>
                <span>数字键 1-5</span>
                <span>选择标签</span>
              </List.Item>
              <List.Item>
                <span>Enter</span>
                <span>提交标注</span>
              </List.Item>
              <List.Item>
                <span>Space</span>
                <span>跳过</span>
              </List.Item>
              <List.Item>
                <span>Ctrl+Z</span>
                <span>撤销</span>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LabelingPage;