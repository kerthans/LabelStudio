"use client";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  StarFilled,
  StarOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;

// 模板数据接口
interface TemplateData {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  usageCount: number;
  rating: number;
  features: string[];
  tags: string[];
  isOfficial: boolean;
  isFavorite: boolean;
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  previewImage?: string;
}

// 统计卡片组件
const StatisticCard: React.FC<{
  title: string;
  value: number;
  suffix?: string;
  prefix: React.ReactNode;
  color: string;
  loading?: boolean;
}> = ({ title, value, suffix, prefix, color, loading = false }) => (
  <Card
    hoverable
    loading={loading}
    styles={{
      body: {
        padding: "24px",
      },
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color: color,
        }}
      >
        {prefix}
      </div>
      <div style={{ flex: 1 }}>
        <Statistic
          title={
            <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}>
              {title}
            </Text>
          }
          value={value}
          valueStyle={{
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.2,
            color: color,
          }}
          suffix={suffix}
        />
      </div>
    </div>
  </Card>
);

const ProjectTemplates: React.FC = () => {
  const router = useRouter();
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showFavorites, setShowFavorites] = useState(false);

  // 模拟模板数据
  const templatesData: TemplateData[] = [
    {
      id: "template_001",
      name: "医疗影像分类模板",
      description: "专为医疗影像分类设计的标注模板，包含常见的医疗影像标注规范和质量控制流程",
      type: "图像分类",
      category: "医疗健康",
      difficulty: "intermediate",
      estimatedTime: "2-4周",
      usageCount: 156,
      rating: 4.8,
      features: ["多类别标注", "质量控制", "专家审核", "DICOM支持"],
      tags: ["医疗", "影像", "分类", "质控"],
      isOfficial: true,
      isFavorite: true,
      createdBy: "医疗AI团队",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-15",
    },
    {
      id: "template_002",
      name: "自动驾驶目标检测模板",
      description: "针对自动驾驶场景的目标检测标注模板，支持车辆、行人、交通标志等多类目标",
      type: "目标检测",
      category: "自动驾驶",
      difficulty: "advanced",
      estimatedTime: "3-6周",
      usageCount: 89,
      rating: 4.9,
      features: ["边界框标注", "多目标识别", "3D标注", "点云支持"],
      tags: ["自动驾驶", "检测", "3D", "点云"],
      isOfficial: true,
      isFavorite: false,
      createdBy: "自动驾驶团队",
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-20",
    },
    {
      id: "template_003",
      name: "情感分析标注模板",
      description: "用于文本情感分析的标注模板，支持多维度情感标注和细粒度情感分类",
      type: "文本分类",
      category: "自然语言处理",
      difficulty: "beginner",
      estimatedTime: "1-3周",
      usageCount: 234,
      rating: 4.6,
      features: ["情感分析", "多维标注", "批量处理", "实时预览"],
      tags: ["NLP", "情感", "分类", "文本"],
      isOfficial: true,
      isFavorite: true,
      createdBy: "NLP团队",
      createdDate: "2023-12-15",
      lastUpdated: "2024-01-10",
    },
    {
      id: "template_004",
      name: "语音识别标注模板",
      description: "专业的语音识别标注模板，支持多语言、多说话人的语音转录和标注",
      type: "语音标注",
      category: "语音技术",
      difficulty: "intermediate",
      estimatedTime: "2-5周",
      usageCount: 67,
      rating: 4.7,
      features: ["语音转录", "说话人识别", "多语言", "时间戳"],
      tags: ["语音", "转录", "多语言", "ASR"],
      isOfficial: true,
      isFavorite: false,
      createdBy: "语音团队",
      createdDate: "2024-01-08",
      lastUpdated: "2024-01-18",
    },
    {
      id: "template_005",
      name: "电商商品分类模板",
      description: "电商平台商品图像分类标注模板，包含商品属性标注和质量评估",
      type: "图像分类",
      category: "电商零售",
      difficulty: "beginner",
      estimatedTime: "1-2周",
      usageCount: 178,
      rating: 4.5,
      features: ["商品分类", "属性标注", "质量评估", "批量导入"],
      tags: ["电商", "商品", "分类", "属性"],
      isOfficial: false,
      isFavorite: false,
      createdBy: "电商团队",
      createdDate: "2023-12-20",
      lastUpdated: "2024-01-12",
    },
    {
      id: "template_006",
      name: "视频行为识别模板",
      description: "视频中人体行为识别标注模板，支持动作分割和行为分类",
      type: "视频标注",
      category: "计算机视觉",
      difficulty: "advanced",
      estimatedTime: "4-8周",
      usageCount: 45,
      rating: 4.8,
      features: ["行为识别", "动作分割", "时序标注", "关键帧提取"],
      tags: ["视频", "行为", "动作", "时序"],
      isOfficial: true,
      isFavorite: true,
      createdBy: "视觉团队",
      createdDate: "2024-01-12",
      lastUpdated: "2024-01-22",
    },
  ];

  // 统计数据
  const statisticsData = [
    {
      title: "模板总数",
      value: templatesData.length,
      suffix: "个",
      prefix: <FileTextOutlined />,
      color: "#1890ff",
    },
    {
      title: "官方模板",
      value: templatesData.filter((t) => t.isOfficial).length,
      suffix: "个",
      prefix: <CheckCircleOutlined />,
      color: "#52c41a",
    },
    {
      title: "收藏模板",
      value: templatesData.filter((t) => t.isFavorite).length,
      suffix: "个",
      prefix: <StarFilled />,
      color: "#fa8c16",
    },
    {
      title: "总使用次数",
      value: templatesData.reduce((sum, t) => sum + t.usageCount, 0),
      suffix: "次",
      prefix: <ClockCircleOutlined />,
      color: "#722ed1",
    },
  ];

  // 获取难度标签
  const getDifficultyTag = (difficulty: string) => {
    const difficultyConfig = {
      beginner: { color: "green", text: "入门" },
      intermediate: { color: "orange", text: "中级" },
      advanced: { color: "red", text: "高级" },
    };
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 处理收藏
  const handleToggleFavorite = (_templateId: string) => {
    message.success("收藏状态已更新");
  };

  // 处理使用模板
  const handleUseTemplate = (templateId: string) => {
    router.push(`/dashboard/projects/create?template=${templateId}`);
  };

  // 处理预览模板
  const handlePreviewTemplate = (templateId: string) => {
    message.info(`预览模板: ${templateId}`);
  };

  // 处理复制模板
  const handleCopyTemplate = (_templateId: string) => {
    message.success("模板已复制到我的模板");
  };

  // 过滤数据
  const filteredData = templatesData.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || template.difficulty === difficultyFilter;
    const matchesFavorites = !showFavorites || template.isFavorite;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorites;
  });

  return (
    <div style={{ padding: "24px" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          项目模板
        </Title>
        <Text type="secondary">选择合适的模板快速创建标注项目</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatisticCard {...stat} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle">
              <Input
                placeholder="搜索模板名称"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Select
                placeholder="模板分类"
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ width: 150 }}
              >
                <Select.Option value="all">全部分类</Select.Option>
                <Select.Option value="医疗健康">医疗健康</Select.Option>
                <Select.Option value="自动驾驶">自动驾驶</Select.Option>
                <Select.Option value="自然语言处理">自然语言处理</Select.Option>
                <Select.Option value="语音技术">语音技术</Select.Option>
                <Select.Option value="电商零售">电商零售</Select.Option>
                <Select.Option value="计算机视觉">计算机视觉</Select.Option>
              </Select>
              <Select
                placeholder="难度等级"
                value={difficultyFilter}
                onChange={setDifficultyFilter}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部难度</Select.Option>
                <Select.Option value="beginner">入门</Select.Option>
                <Select.Option value="intermediate">中级</Select.Option>
                <Select.Option value="advanced">高级</Select.Option>
              </Select>
              <Button
                type={showFavorites ? "primary" : "default"}
                icon={<StarOutlined />}
                onClick={() => setShowFavorites(!showFavorites)}
              >
                我的收藏
              </Button>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/dashboard/projects/create")}
            >
              创建自定义模板
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 模板卡片网格 */}
      <Row gutter={[16, 16]}>
        {filteredData.map((template) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={template.id}>
            <Card
              hoverable
              actions={[
                <Tooltip title="预览模板" key="preview">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreviewTemplate(template.id)}
                  />
                </Tooltip>,
                <Tooltip title="复制模板" key="copy">
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyTemplate(template.id)}
                  />
                </Tooltip>,
                <Tooltip title={template.isFavorite ? "取消收藏" : "收藏"} key="favorite">
                  <Button
                    type="text"
                    icon={template.isFavorite ? <StarFilled /> : <StarOutlined />}
                    style={{ color: template.isFavorite ? "#fa8c16" : undefined }}
                    onClick={() => handleToggleFavorite(template.id)}
                  />
                </Tooltip>,
                <Tooltip title="使用模板" key="use">
                  <Button
                    type="text"
                    icon={<SettingOutlined />}
                    onClick={() => handleUseTemplate(template.id)}
                  />
                </Tooltip>,
              ]}
              styles={{
                body: { padding: "16px" },
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <Title level={5} style={{ margin: 0, flex: 1 }}>
                    {template.name}
                  </Title>
                  {template.isOfficial && (
                    <Badge.Ribbon text="官方" color="blue" />
                  )}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Space size={4}>
                    <Tag color="blue">{template.type}</Tag>
                    {getDifficultyTag(template.difficulty)}
                  </Space>
                </div>
              </div>

              <Paragraph
                type="secondary"
                style={{ fontSize: 12, marginBottom: 12, minHeight: 36 }}
                ellipsis={{ rows: 2 }}
              >
                {template.description}
              </Paragraph>

              <div style={{ marginBottom: 12 }}>
                <Space size={4} wrap>
                  {template.features.slice(0, 3).map((feature) => (
                    <Tag key={feature} className="small-tag" icon={<TagOutlined />}>
                      {feature}
                    </Tag>
                  ))}
                  {template.features.length > 3 && (
                    <Tag className="small-tag">+{template.features.length - 3}</Tag>
                  )}
                </Space>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <Space>
                  <Text type="secondary">使用 {template.usageCount} 次</Text>
                  <Text type="secondary">评分 {template.rating}</Text>
                </Space>
                <Text type="secondary">{template.estimatedTime}</Text>
              </div>

              <div style={{ marginTop: 12, textAlign: "center" }}>
                <Button
                  type="primary"
                  block
                  onClick={() => handleUseTemplate(template.id)}
                >
                  使用此模板
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredData.length === 0 && (
        <Card style={{ textAlign: "center", padding: "48px 24px" }}>
          <Text type="secondary">暂无符合条件的模板</Text>
        </Card>
      )}
    </div>
  );
};

export default ProjectTemplates;
