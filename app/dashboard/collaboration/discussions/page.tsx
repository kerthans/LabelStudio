"use client";
import {
  CommentOutlined,
  FireOutlined,
  LikeOutlined,
  MessageOutlined,
  PlusOutlined,
  TagOutlined,
  UserOutlined
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
  Tooltip,
  Typography
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  replies: number;
  likes: number;
  views: number;
  createdAt: string;
  lastReply: string;
  isHot: boolean;
  isPinned: boolean;
  status: 'open' | 'resolved' | 'closed';
}

const DiscussionsPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");

  // 模拟讨论数据
  const [discussions] = useState<Discussion[]>([
    {
      id: "disc_001",
      title: "医疗影像标注中的边界模糊问题如何处理？",
      content: "在进行医疗影像标注时，经常遇到病灶边界不清晰的情况，大家是如何处理这类问题的？有什么好的标注规范建议吗？",
      author: {
        name: "张医生",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhang",
        role: "医疗专家"
      },
      category: "标注规范",
      tags: ["医疗影像", "边界标注", "质量控制"],
      replies: 15,
      likes: 23,
      views: 156,
      createdAt: "2024-01-15 14:30",
      lastReply: "2024-01-15 16:45",
      isHot: true,
      isPinned: false,
      status: 'open'
    },
    {
      id: "disc_002",
      title: "文本情感分析标注一致性问题讨论",
      content: "不同标注员对同一段文本的情感倾向判断存在分歧，如何提高标注一致性？",
      author: {
        name: "李分析师",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=li",
        role: "数据分析师"
      },
      category: "质量控制",
      tags: ["情感分析", "一致性", "标注规范"],
      replies: 8,
      likes: 12,
      views: 89,
      createdAt: "2024-01-14 10:15",
      lastReply: "2024-01-15 09:20",
      isHot: false,
      isPinned: true,
      status: 'open'
    },
    {
      id: "disc_003",
      title: "目标检测标注工具推荐",
      content: "最近在做自动驾驶场景的目标检测标注，现有工具效率不高，有什么好用的标注工具推荐？",
      author: {
        name: "王工程师",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=wang",
        role: "算法工程师"
      },
      category: "工具推荐",
      tags: ["目标检测", "标注工具", "效率优化"],
      replies: 12,
      likes: 18,
      views: 134,
      createdAt: "2024-01-13 16:20",
      lastReply: "2024-01-14 11:30",
      isHot: false,
      isPinned: false,
      status: 'resolved'
    },
    {
      id: "disc_004",
      title: "语音标注质量评估标准建议",
      content: "针对多语言语音识别项目，我们需要制定统一的质量评估标准，欢迎大家提供建议。",
      author: {
        name: "赵研究员",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhao",
        role: "研究员"
      },
      category: "标准制定",
      tags: ["语音识别", "质量评估", "标准制定"],
      replies: 6,
      likes: 9,
      views: 67,
      createdAt: "2024-01-12 14:45",
      lastReply: "2024-01-13 10:15",
      isHot: false,
      isPinned: false,
      status: 'open'
    }
  ]);

  const categories = [
    { value: "all", label: "全部分类" },
    { value: "标注规范", label: "标注规范" },
    { value: "质量控制", label: "质量控制" },
    { value: "工具推荐", label: "工具推荐" },
    { value: "标准制定", label: "标准制定" },
    { value: "技术交流", label: "技术交流" },
  ];

  const sortOptions = [
    { value: "latest", label: "最新回复" },
    { value: "hot", label: "热门讨论" },
    { value: "likes", label: "点赞最多" },
    { value: "replies", label: "回复最多" },
  ];

  // 筛选和排序讨论
  const filteredDiscussions = discussions
    .filter(discussion => {
      const matchesSearch = discussion.title.toLowerCase().includes(searchText.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchText.toLowerCase()) ||
        discussion.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
      const matchesCategory = categoryFilter === "all" || discussion.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "hot":
          return (b.likes + b.replies + b.views) - (a.likes + a.replies + a.views);
        case "likes":
          return b.likes - a.likes;
        case "replies":
          return b.replies - a.replies;
        default:
          return new Date(b.lastReply).getTime() - new Date(a.lastReply).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'processing';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return '讨论中';
      case 'resolved': return '已解决';
      case 'closed': return '已关闭';
      default: return '未知';
    }
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <CommentOutlined />
              讨论区
            </Title>
            <Text type="secondary">与团队成员交流标注经验，解决技术难题</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} size="large">
            发起讨论
          </Button>
        </div>

        {/* 搜索和筛选 */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索讨论话题、内容或标签"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: "100%" }}
              size="large"
              placeholder="选择分类"
            >
              {categories.map(cat => (
                <Option key={cat.value} value={cat.value}>{cat.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: "100%" }}
              size="large"
              placeholder="排序方式"
            >
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {/* 讨论列表 */}
      {filteredDiscussions.length > 0 ? (
        <List
          dataSource={filteredDiscussions}
          renderItem={(discussion) => (
            <Card
              style={{ marginBottom: 16 }}
              hoverable
              styles={{
                body: { padding: "20px 24px" }
              }}
            >
              <div style={{ display: "flex", gap: 16 }}>
                <Avatar src={discussion.author.avatar} size={48} />
                <div style={{ flex: 1 }}>
                  {/* 标题行 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    {discussion.isPinned && (
                      <Tag color="red">置顶</Tag>
                    )}
                    {discussion.isHot && (
                      <Tag color="orange" icon={<FireOutlined />}>热门</Tag>
                    )}
                    <Tag color={getStatusColor(discussion.status)}>
                      {getStatusText(discussion.status)}
                    </Tag>
                    <Title level={5} style={{ margin: 0, flex: 1 }}>
                      {discussion.title}
                    </Title>
                  </div>

                  {/* 内容预览 */}
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ margin: "8px 0", color: "#666" }}
                  >
                    {discussion.content}
                  </Paragraph>

                  {/* 标签 */}
                  <div style={{ marginBottom: 12 }}>
                    <Space wrap>
                      <Tag icon={<TagOutlined />} color="blue">{discussion.category}</Tag>
                      {discussion.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  </div>

                  {/* 底部信息 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Space split={<Divider type="vertical" />}>
                      <Text type="secondary">
                        <UserOutlined /> {discussion.author.name} · {discussion.author.role}
                      </Text>
                      <Text type="secondary">{discussion.createdAt}</Text>
                      <Text type="secondary">最后回复: {discussion.lastReply}</Text>
                    </Space>

                    <Space size={16}>
                      <Tooltip title="点赞">
                        <Button type="text" icon={<LikeOutlined />} size="small">
                          {discussion.likes}
                        </Button>
                      </Tooltip>
                      <Tooltip title="回复">
                        <Button type="text" icon={<MessageOutlined />} size="small">
                          {discussion.replies}
                        </Button>
                      </Tooltip>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {discussion.views} 浏览
                      </Text>
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
            description="暂无相关讨论"
          >
            <Button type="primary" icon={<PlusOutlined />}>
              发起第一个讨论
            </Button>
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default DiscussionsPage;
