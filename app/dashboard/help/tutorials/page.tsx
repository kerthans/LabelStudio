"use client";
import {
  CaretRightOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  StarOutlined,
  TagsOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  List,
  Modal,
  Progress,
  Rate,
  Row,
  Select,
  Space,
  Tag,
  Typography
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // 分钟
  videoUrl?: string;
  thumbnailUrl: string;
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
  rating: number;
  viewCount: number;
  isCompleted?: boolean;
  progress?: number;
  tags: string[];
  chapters: {
    id: string;
    title: string;
    duration: number;
    isCompleted?: boolean;
  }[];
  createdAt: string;
}

interface TutorialCategory {
  key: string;
  title: string;
  icon: React.ReactNode;
  count: number;
}

const TutorialsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  // 教程分类
  const categories: TutorialCategory[] = [
    {
      key: "all",
      title: "全部教程",
      icon: <VideoCameraOutlined />,
      count: 18
    },
    {
      key: "image-annotation",
      title: "图像标注",
      icon: <TagsOutlined />,
      count: 8
    },
    {
      key: "text-annotation",
      title: "文本标注",
      icon: <TagsOutlined />,
      count: 6
    },
    {
      key: "quality-control",
      title: "质量控制",
      icon: <StarOutlined />,
      count: 4
    }
  ];

  // 教程数据
  const [tutorials] = useState<Tutorial[]>([
    {
      id: "tutorial_001",
      title: "图像分类标注入门教程",
      description: "从零开始学习图像分类标注，包括工具使用、标注规范和质量要求。适合新手标注员快速上手。",
      category: "image-annotation",
      difficulty: "beginner",
      duration: 25,
      thumbnailUrl: "https://via.placeholder.com/320x180/1890ff/ffffff?text=图像分类",
      instructor: {
        name: "张明",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhang",
        title: "高级标注专家"
      },
      rating: 4.8,
      viewCount: 1245,
      isCompleted: true,
      progress: 100,
      tags: ["图像分类", "入门", "基础操作"],
      chapters: [
        { id: "ch1", title: "标注工具介绍", duration: 5, isCompleted: true },
        { id: "ch2", title: "分类标准说明", duration: 8, isCompleted: true },
        { id: "ch3", title: "实际操作演示", duration: 10, isCompleted: true },
        { id: "ch4", title: "质量检查方法", duration: 2, isCompleted: true }
      ],
      createdAt: "2024-01-10"
    },
    {
      id: "tutorial_002",
      title: "目标检测边界框标注",
      description: "详细讲解目标检测任务中边界框的绘制技巧、标注规范和常见错误避免方法。",
      category: "image-annotation",
      difficulty: "intermediate",
      duration: 35,
      thumbnailUrl: "https://via.placeholder.com/320x180/52c41a/ffffff?text=目标检测",
      instructor: {
        name: "李红",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=li",
        title: "计算机视觉专家"
      },
      rating: 4.9,
      viewCount: 987,
      progress: 60,
      tags: ["目标检测", "边界框", "中级"],
      chapters: [
        { id: "ch1", title: "目标检测基础", duration: 8, isCompleted: true },
        { id: "ch2", title: "边界框绘制技巧", duration: 12, isCompleted: true },
        { id: "ch3", title: "多目标标注策略", duration: 10, isCompleted: false },
        { id: "ch4", title: "质量评估标准", duration: 5, isCompleted: false }
      ],
      createdAt: "2024-01-08"
    },
    {
      id: "tutorial_003",
      title: "文本情感分析标注指南",
      description: "学习如何准确识别和标注文本中的情感倾向，包括正面、负面和中性情感的判断标准。",
      category: "text-annotation",
      difficulty: "beginner",
      duration: 20,
      thumbnailUrl: "https://via.placeholder.com/320x180/722ed1/ffffff?text=情感分析",
      instructor: {
        name: "王强",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=wang",
        title: "NLP算法工程师"
      },
      rating: 4.7,
      viewCount: 756,
      tags: ["文本分析", "情感识别", "NLP"],
      chapters: [
        { id: "ch1", title: "情感分析概述", duration: 5 },
        { id: "ch2", title: "标注规则详解", duration: 8 },
        { id: "ch3", title: "边界情况处理", duration: 7 }
      ],
      createdAt: "2024-01-05"
    },
    {
      id: "tutorial_004",
      title: "高级语义分割技术",
      description: "深入学习像素级标注技术，掌握复杂场景下的语义分割标注方法和工具使用技巧。",
      category: "image-annotation",
      difficulty: "advanced",
      duration: 45,
      thumbnailUrl: "https://via.placeholder.com/320x180/fa8c16/ffffff?text=语义分割",
      instructor: {
        name: "赵美",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhao",
        title: "深度学习专家"
      },
      rating: 4.9,
      viewCount: 432,
      tags: ["语义分割", "像素标注", "高级"],
      chapters: [
        { id: "ch1", title: "语义分割原理", duration: 10 },
        { id: "ch2", title: "工具高级功能", duration: 15 },
        { id: "ch3", title: "复杂场景处理", duration: 12 },
        { id: "ch4", title: "质量优化技巧", duration: 8 }
      ],
      createdAt: "2024-01-03"
    },
    {
      id: "tutorial_005",
      title: "标注质量控制最佳实践",
      description: "学习如何建立有效的质量控制体系，提高标注准确性和一致性，减少返工率。",
      category: "quality-control",
      difficulty: "intermediate",
      duration: 30,
      thumbnailUrl: "https://via.placeholder.com/320x180/13c2c2/ffffff?text=质量控制",
      instructor: {
        name: "孙伟",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=sun",
        title: "质量管理专家"
      },
      rating: 4.8,
      viewCount: 623,
      tags: ["质量控制", "最佳实践", "管理"],
      chapters: [
        { id: "ch1", title: "质量标准制定", duration: 8 },
        { id: "ch2", title: "检查流程设计", duration: 10 },
        { id: "ch3", title: "问题识别方法", duration: 7 },
        { id: "ch4", title: "持续改进策略", duration: 5 }
      ],
      createdAt: "2024-01-01"
    }
  ]);

  // 筛选教程
  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || tutorial.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  // 排序教程
  const sortedTutorials = [...filteredTutorials].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popular":
        return b.viewCount - a.viewCount;
      case "rating":
        return b.rating - a.rating;
      case "duration":
        return a.duration - b.duration;
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "green";
      case "intermediate": return "orange";
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

  const handlePlayTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setVideoModalVisible(true);
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <VideoCameraOutlined />
              标注教程
            </Title>
            <Text type="secondary">通过视频教程快速掌握标注技能和最佳实践</Text>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧：分类和筛选 */}
        <Col xs={24} lg={6}>
          {/* 分类导航 */}
          <Card title="教程分类" style={{ marginBottom: 16 }}>
            <List
              dataSource={categories}
              renderItem={(category) => (
                <List.Item
                  className={`category-item ${selectedCategory === category.key ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.key)}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    backgroundColor: selectedCategory === category.key ? '#e6f7ff' : 'transparent',
                    border: selectedCategory === category.key ? '1px solid #1890ff' : '1px solid transparent'
                  }}
                >
                  <List.Item.Meta
                    avatar={category.icon}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{category.title}</span>
                        <Badge count={category.count} style={{ backgroundColor: '#52c41a' }} />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 筛选选项 */}
          <Card title={<><FilterOutlined /> 筛选选项</>}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>难度等级</Text>
              <Select
                value={selectedDifficulty}
                onChange={setSelectedDifficulty}
                style={{ width: '100%' }}
              >
                <Option value="all">全部难度</Option>
                <Option value="beginner">入门</Option>
                <Option value="intermediate">中级</Option>
                <Option value="advanced">高级</Option>
              </Select>
            </div>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>排序方式</Text>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: '100%' }}
              >
                <Option value="latest">最新发布</Option>
                <Option value="popular">最受欢迎</Option>
                <Option value="rating">评分最高</Option>
                <Option value="duration">时长最短</Option>
              </Select>
            </div>
          </Card>
        </Col>

        {/* 右侧：教程列表 */}
        <Col xs={24} lg={18}>
          <Row gutter={[16, 16]}>
            {sortedTutorials.map((tutorial) => (
              <Col xs={24} sm={12} lg={8} key={tutorial.id}>
                <Card
                  hoverable
                  className="tutorial-card"
                  cover={
                    <div style={{ position: 'relative' }}>
                      <img
                        alt={tutorial.title}
                        src={tutorial.thumbnailUrl}
                        style={{ width: '100%', height: 180, objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: '50%',
                          width: 60,
                          height: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => handlePlayTutorial(tutorial)}
                      >
                        <PlayCircleOutlined style={{ fontSize: 32, color: '#fff' }} />
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: '#fff',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 12
                        }}
                      >
                        {tutorial.duration} 分钟
                      </div>
                      {tutorial.progress !== undefined && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)'
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${tutorial.progress}%`,
                              backgroundColor: '#52c41a'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  }
                  actions={[
                    <Button
                      key="play"
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handlePlayTutorial(tutorial)}
                    >
                      观看
                    </Button>,
                    <Button key="view" icon={<EyeOutlined />}>
                      {tutorial.viewCount}
                    </Button>
                  ]}
                >
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <Title level={5} style={{ margin: 0, flex: 1 }}>
                        {tutorial.title}
                      </Title>
                      {tutorial.isCompleted && (
                        <Badge status="success" text="已完成" />
                      )}
                    </div>
                    <Paragraph
                      style={{ margin: 0, color: '#666', fontSize: 12 }}
                      ellipsis={{ rows: 2 }}
                    >
                      {tutorial.description}
                    </Paragraph>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <Space wrap>
                      <Tag color={getDifficultyColor(tutorial.difficulty)}>
                        {getDifficultyText(tutorial.difficulty)}
                      </Tag>
                      {tutorial.tags.slice(0, 2).map((tag) => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar src={tutorial.instructor.avatar} size={24} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{tutorial.instructor.name}</div>
                        <div style={{ fontSize: 11, color: '#666' }}>{tutorial.instructor.title}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Rate disabled defaultValue={tutorial.rating} style={{ fontSize: 12 }} />
                      <div style={{ fontSize: 11, color: '#666' }}>{tutorial.rating}</div>
                    </div>
                  </div>

                  {tutorial.progress !== undefined && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ fontSize: 12 }}>学习进度</Text>
                        <Text style={{ fontSize: 12 }}>{tutorial.progress}%</Text>
                      </div>
                      <Progress percent={tutorial.progress} size="small" />
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          {sortedTutorials.length === 0 && (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <VideoCameraOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={4} type="secondary">暂无相关教程</Title>
                <Text type="secondary">请尝试调整筛选条件</Text>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* 视频播放弹窗 */}
      <Modal
        title={selectedTutorial?.title}
        open={videoModalVisible}
        onCancel={() => setVideoModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        {selectedTutorial && (
          <div>
            {/* 视频播放器占位 */}
            <div
              style={{
                width: '100%',
                height: 400,
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}
            >
              <PlayCircleOutlined style={{ fontSize: 64, color: '#fff' }} />
            </div>

            {/* 教程信息 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar src={selectedTutorial.instructor.avatar} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{selectedTutorial.instructor.name}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{selectedTutorial.instructor.title}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ClockCircleOutlined />
                    <span>{selectedTutorial.duration} 分钟</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <EyeOutlined />
                    <span>{selectedTutorial.viewCount}</span>
                  </div>
                </div>
              </div>
              <Paragraph>{selectedTutorial.description}</Paragraph>
            </div>

            {/* 章节列表 */}
            <div>
              <Title level={5}>课程章节</Title>
              <List
                dataSource={selectedTutorial.chapters}
                renderItem={(chapter, index) => (
                  <List.Item
                    style={{
                      padding: '8px 12px',
                      backgroundColor: chapter.isCompleted ? '#f6ffed' : 'transparent',
                      borderRadius: 4,
                      marginBottom: 4
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: chapter.isCompleted ? '#52c41a' : '#d9d9d9',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12
                          }}
                        >
                          {index + 1}
                        </div>
                      }
                      title={chapter.title}
                      description={`${chapter.duration} 分钟`}
                    />
                    <div>
                      {chapter.isCompleted ? (
                        <Tag color="success">已完成</Tag>
                      ) : (
                        <Button type="link" icon={<CaretRightOutlined />}>
                          播放
                        </Button>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TutorialsPage;
