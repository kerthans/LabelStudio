"use client";
import {
  BookOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  FolderOutlined,
  HeartOutlined,
  PlusOutlined,
  StarOutlined,
  TagOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  List,
  Row,
  Select,
  Space,
  Tag,
  Tree,
  Typography,
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: "document" | "video" | "template" | "guideline";
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  downloads: number;
  fileSize?: string;
  duration?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  isRecommended: boolean;
  isFavorite: boolean;
}

const KnowledgeBasePage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, _setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  // 模拟知识库数据
  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: "kb_001",
      title: "医疗影像标注规范指南",
      description: "详细介绍医疗影像标注的标准流程、质量要求和常见问题处理方法，包含大量实例和最佳实践。",
      type: "document",
      category: "标注规范",
      tags: ["医疗影像", "标注规范", "质量控制"],
      author: {
        name: "张医生",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhang",
        role: "医疗专家",
      },
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      views: 1256,
      likes: 89,
      downloads: 234,
      fileSize: "2.3 MB",
      difficulty: "intermediate",
      isRecommended: true,
      isFavorite: false,
    },
    {
      id: "kb_002",
      title: "文本标注工具使用教程",
      description: "从基础操作到高级功能的完整视频教程，帮助新手快速掌握文本标注工具的使用方法。",
      type: "video",
      category: "工具教程",
      tags: ["文本标注", "工具使用", "新手教程"],
      author: {
        name: "李老师",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=li",
        role: "培训师",
      },
      createdAt: "2024-01-08",
      updatedAt: "2024-01-12",
      views: 2341,
      likes: 156,
      downloads: 0,
      duration: "45分钟",
      difficulty: "beginner",
      isRecommended: true,
      isFavorite: true,
    },
    {
      id: "kb_003",
      title: "目标检测标注模板",
      description: "标准化的目标检测标注模板，包含常用类别定义、标注格式和导出规范。",
      type: "template",
      category: "标注模板",
      tags: ["目标检测", "标注模板", "标准化"],
      author: {
        name: "王工程师",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=wang",
        role: "算法工程师",
      },
      createdAt: "2024-01-05",
      updatedAt: "2024-01-10",
      views: 987,
      likes: 67,
      downloads: 189,
      fileSize: "1.2 MB",
      difficulty: "intermediate",
      isRecommended: false,
      isFavorite: false,
    },
    {
      id: "kb_004",
      title: "数据质量评估标准",
      description: "建立统一的数据质量评估体系，包含评估指标、评分标准和改进建议。",
      type: "guideline",
      category: "质量标准",
      tags: ["质量评估", "评估标准", "数据质量"],
      author: {
        name: "赵专家",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhao",
        role: "质量专家",
      },
      createdAt: "2024-01-03",
      updatedAt: "2024-01-08",
      views: 1567,
      likes: 123,
      downloads: 298,
      fileSize: "3.1 MB",
      difficulty: "advanced",
      isRecommended: true,
      isFavorite: true,
    },
    {
      id: "kb_005",
      title: "语音标注最佳实践",
      description: "语音数据标注的完整流程和技巧分享，包含多语言处理和质量控制方法。",
      type: "document",
      category: "最佳实践",
      tags: ["语音标注", "最佳实践", "多语言"],
      author: {
        name: "孙研究员",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=sun",
        role: "研究员",
      },
      createdAt: "2024-01-01",
      updatedAt: "2024-01-05",
      views: 834,
      likes: 45,
      downloads: 156,
      fileSize: "1.8 MB",
      difficulty: "intermediate",
      isRecommended: false,
      isFavorite: false,
    },
  ]);

  // 分类树数据
  const categoryTree = [
    {
      title: "标注规范",
      key: "标注规范",
      children: [
        { title: "图像标注", key: "图像标注" },
        { title: "文本标注", key: "文本标注" },
        { title: "音频标注", key: "音频标注" },
      ],
    },
    {
      title: "工具教程",
      key: "工具教程",
      children: [
        { title: "标注工具", key: "标注工具" },
        { title: "管理工具", key: "管理工具" },
        { title: "质量工具", key: "质量工具" },
      ],
    },
    {
      title: "标注模板",
      key: "标注模板",
      children: [
        { title: "分类模板", key: "分类模板" },
        { title: "检测模板", key: "检测模板" },
        { title: "分割模板", key: "分割模板" },
      ],
    },
    {
      title: "质量标准",
      key: "质量标准",
      children: [
        { title: "评估标准", key: "评估标准" },
        { title: "验收标准", key: "验收标准" },
      ],
    },
    {
      title: "最佳实践",
      key: "最佳实践",
      children: [
        { title: "效率提升", key: "效率提升" },
        { title: "质量改进", key: "质量改进" },
      ],
    },
  ];

  const typeOptions = [
    { value: "all", label: "全部类型" },
    { value: "document", label: "文档" },
    { value: "video", label: "视频" },
    { value: "template", label: "模板" },
    { value: "guideline", label: "指南" },
  ];

  const difficultyOptions = [
    { value: "all", label: "全部难度" },
    { value: "beginner", label: "入门" },
    { value: "intermediate", label: "中级" },
    { value: "advanced", label: "高级" },
  ];

  // 筛选知识项目
  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesDifficulty = difficultyFilter === "all" || item.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document": return <FileTextOutlined style={{ color: "#1890ff" }} />;
      case "video": return <VideoCameraOutlined style={{ color: "#722ed1" }} />;
      case "template": return <FolderOutlined style={{ color: "#52c41a" }} />;
      case "guideline": return <BookOutlined style={{ color: "#fa8c16" }} />;
      default: return <FileTextOutlined />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "document": return "文档";
      case "video": return "视频";
      case "template": return "模板";
      case "guideline": return "指南";
      default: return "未知";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "green";
      case "intermediate": return "blue";
      case "advanced": return "red";
      default: return "default";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "入门";
      case "intermediate": return "中级";
      case "advanced": return "高级";
      default: return "未知";
    }
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <BookOutlined />
              知识库
            </Title>
            <Text type="secondary">标注规范、工具教程、模板资源和最佳实践分享</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} size="large">
            贡献知识
          </Button>
        </div>

        {/* 搜索和筛选 */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索知识库内容、标签或作者"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
          <Col xs={8} sm={4} md={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
              size="large"
            >
              {typeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={4} md={4}>
            <Select
              value={difficultyFilter}
              onChange={setDifficultyFilter}
              style={{ width: "100%" }}
              size="large"
            >
              {difficultyOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <Row gutter={16}>
        {/* 左侧分类树 */}
        <Col xs={24} lg={6}>
          <Card
            title="知识分类"
            size="small"
            style={{ marginBottom: 16 }}
            styles={{
              body: { padding: "12px" },
            }}
          >
            <Tree
              showLine
              defaultExpandAll
              selectedKeys={selectedCategory}
              onSelect={(selectedKeys) => setSelectedCategory(selectedKeys.map(key => String(key)))}
              treeData={categoryTree}
            />
          </Card>
        </Col>

        {/* 右侧知识列表 */}
        <Col xs={24} lg={18}>
          {filteredItems.length > 0 ? (
            <List
              dataSource={filteredItems}
              renderItem={(item) => (
                <Card
                  style={{ marginBottom: 16 }}
                  hoverable
                  styles={{
                    body: { padding: "20px 24px" },
                  }}
                >
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", fontSize: 24 }}>
                      {getTypeIcon(item.type)}
                    </div>

                    <div style={{ flex: 1 }}>
                      {/* 标题行 */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        {item.isRecommended && (
                          <Tag color="gold" icon={<StarOutlined />}>推荐</Tag>
                        )}
                        <Tag color={getDifficultyColor(item.difficulty)}>
                          {getDifficultyText(item.difficulty)}
                        </Tag>
                        <Tag>{getTypeText(item.type)}</Tag>
                        <Title level={5} style={{ margin: 0, flex: 1 }}>
                          {item.title}
                        </Title>
                        {item.isFavorite && (
                          <HeartOutlined style={{ color: "#ff4d4f", fontSize: 16 }} />
                        )}
                      </div>

                      {/* 描述 */}
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ margin: "8px 0", color: "#666" }}
                      >
                        {item.description}
                      </Paragraph>

                      {/* 标签 */}
                      <div style={{ marginBottom: 12 }}>
                        <Space wrap>
                          <Tag icon={<TagOutlined />} color="blue">{item.category}</Tag>
                          {item.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                      </div>

                      {/* 底部信息 */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space split={<Divider type="vertical" />}>
                          <Space>
                            <Avatar src={item.author.avatar} size={20} />
                            <Text type="secondary">
                              {item.author.name} · {item.author.role}
                            </Text>
                          </Space>
                          <Text type="secondary">更新: {item.updatedAt}</Text>
                          {item.fileSize && (
                            <Text type="secondary">大小: {item.fileSize}</Text>
                          )}
                          {item.duration && (
                            <Text type="secondary">时长: {item.duration}</Text>
                          )}
                        </Space>

                        <Space split={<Divider type="vertical" />}>
                          <Space>
                            <EyeOutlined />
                            <Text type="secondary">{item.views}</Text>
                          </Space>
                          <Space>
                            <HeartOutlined />
                            <Text type="secondary">{item.likes}</Text>
                          </Space>
                          {item.downloads > 0 && (
                            <Space>
                              <DownloadOutlined />
                              <Text type="secondary">{item.downloads}</Text>
                            </Space>
                          )}
                          <Space>
                            <Button type="text" icon={<EyeOutlined />} size="small">
                              查看
                            </Button>
                            {item.type !== "video" && (
                              <Button type="text" icon={<DownloadOutlined />} size="small">
                                下载
                              </Button>
                            )}
                          </Space>
                        </Space>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            />
          ) : (
            <Card>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无相关知识内容"
              >
                <Button type="primary" icon={<PlusOutlined />}>
                  贡献第一个知识
                </Button>
              </Empty>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default KnowledgeBasePage;
