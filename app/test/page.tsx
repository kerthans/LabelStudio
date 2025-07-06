'use client'

import Image from "next/image";
import { Button, Input, Card, Space, Divider, Typography, Switch, Slider, DatePicker, Select } from "antd";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function ComponentPlayground() {
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(30);
  const [selectValue, setSelectValue] = useState('option1');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <Title level={1} className="!mb-2">组件调试</Title>
        <Text type="secondary">Component Playground - 测试和预览各种组件效果</Text>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 按钮组件区域 */}
        <Card title="按钮组件 (Button Components)" className="shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Text strong>基础按钮</Text>
              <Space direction="vertical" className="w-full">
                <Button type="primary">主要按钮</Button>
                <Button type="default">默认按钮</Button>
                <Button type="dashed">虚线按钮</Button>
                <Button type="text">文本按钮</Button>
                <Button type="link">链接按钮</Button>
              </Space>
            </div>
            
            <div className="space-y-4">
              <Text strong>按钮状态</Text>
              <Space direction="vertical" className="w-full">
                <Button type="primary" loading>加载中</Button>
                <Button type="primary" disabled>禁用状态</Button>
                <Button type="primary" danger>危险按钮</Button>
                <Button type="primary" size="large">大尺寸</Button>
                <Button type="primary" size="small">小尺寸</Button>

              </Space>
            </div>
            
            <div className="space-y-4">
              <Text strong>按钮形状</Text>
              <Space direction="vertical" className="w-full">
                <Button type="primary" shape="round">圆角按钮</Button>
                <Button type="primary" shape="circle">圆</Button>
                <Button type="primary" block>块级按钮</Button>
                <Button type="primary" shape="circle" icon={<SearchOutlined />} />
              </Space>
            </div>
          </div>
        </Card>

        <Divider className="!my-8" />

        {/* 输入组件区域 */}
        <Card title="输入组件 (Input Components)" className="shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Text strong>基础输入</Text>
              <Space direction="vertical" className="w-full">
                <Input placeholder="基础输入框" />
                <Input placeholder="禁用状态" disabled />
                <Input.Password placeholder="密码输入" />
                <Input.TextArea placeholder="文本域" rows={3} />
              </Space>
            </div>
            
            <div className="space-y-4">
              <Text strong>选择组件</Text>
              <Space direction="vertical" className="w-full">
                <Select 
                  value={selectValue} 
                  onChange={setSelectValue}
                  className="w-full"
                  placeholder="请选择"
                >
                  <Option value="option1">选项一</Option>
                  <Option value="option2">选项二</Option>
                  <Option value="option3">选项三</Option>
                </Select>
                <DatePicker className="w-full" placeholder="选择日期" />
              </Space>
            </div>
          </div>
        </Card>

        <Divider className="!my-8" />

        {/* 交互组件区域 */}
        <Card title="交互组件 (Interactive Components)" className="shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Text strong>开关控制</Text>
              <Space direction="vertical" className="w-full">
                <div className="flex items-center justify-between">
                  <Text>开关状态:</Text>
                  <Switch 
                    checked={switchValue} 
                    onChange={setSwitchValue}
                    checkedChildren="开"
                    unCheckedChildren="关"
                  />
                </div>
                <Text type="secondary">当前状态: {switchValue ? '开启' : '关闭'}</Text>
              </Space>
            </div>
            
            <div className="space-y-4">
              <Text strong>滑块控制</Text>
              <Space direction="vertical" className="w-full">
                <Slider 
                  value={sliderValue}
                  onChange={setSliderValue}
                  tooltip={{ formatter: (value) => `${value}%` }}
                />
                <Text type="secondary">当前值: {sliderValue}%</Text>
              </Space>
            </div>
            
            <div className="space-y-4">
              <Text strong>状态展示</Text>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                <Paragraph className="!mb-2">
                  <Text strong>调试信息:</Text>
                </Paragraph>
                <Text code>Switch: {String(switchValue)}</Text><br/>
                <Text code>Slider: {sliderValue}</Text><br/>
                <Text code>Select: {selectValue}</Text>
              </div>
            </div>
          </div>
        </Card>

        <Divider className="!my-8" />

        {/* 展示组件区域 */}
        <Card title="展示组件 (Display Components)" className="shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card size="small" title="嵌套卡片" className="bg-blue-50 dark:bg-blue-900/20">
              <Text>这是一个嵌套的卡片组件，用于展示层级结构。</Text>
            </Card>
            
            <Card size="small" title="图片展示" className="bg-green-50 dark:bg-green-900/20">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={120}
                height={24}
                className="dark:invert"
              />
            </Card>
            
            <Card size="small" title="排版组件" className="bg-purple-50 dark:bg-purple-900/20">
              <Typography>
                <Title level={5}>小标题</Title>
                <Paragraph className="!mb-0">
                  这是一段示例文本，用于展示排版效果。
                </Paragraph>
              </Typography>
            </Card>
          </div>
        </Card>

        {/* 底部信息 */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <Text type="secondary">
            组件调试 - 快速测试和预览各种 Ant Design 组件效果
          </Text>
        </div>
      </div>
    </div>
  );
}
