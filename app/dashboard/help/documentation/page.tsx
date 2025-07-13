"use client";
import {
  BookOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  StarOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  Anchor,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Input,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  downloadUrl?: string;
  isPopular?: boolean;
  content?: string;
}

interface DocumentCategory {
  key: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  count: number;
}

const DocumentationPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  // 文档分类
  const categories: DocumentCategory[] = [
    {
      key: "all",
      title: "全部文档",
      icon: <FolderOpenOutlined />,
      description: "查看所有可用文档",
      count: 24,
    },
    {
      key: "getting-started",
      title: "快速入门",
      icon: <BookOutlined />,
      description: "新用户必读指南",
      count: 6,
    },
    {
      key: "annotation-guide",
      title: "标注指南",
      icon: <TagsOutlined />,
      description: "详细的标注操作说明",
      count: 8,
    },
    {
      key: "advanced-features",
      title: "高级功能",
      icon: <StarOutlined />,
      description: "进阶功能使用说明",
      count: 5,
    },
    {
      key: "troubleshooting",
      title: "故障排除",
      icon: <QuestionCircleOutlined />,
      description: "常见问题解决方案",
      count: 5,
    },
  ];

  // 文档数据
  const [documents] = useState<DocumentItem[]>([
    {
      id: "doc_001",
      title: "平台快速入门指南",
      description: "了解如何快速开始使用数据标注平台，包括账户设置、基本操作和工作流程。",
      category: "getting-started",
      tags: ["入门", "基础", "必读"],
      lastUpdated: "2024-01-15",
      isPopular: true,
      content: `# 平台快速入门指南

## 1. 账户设置

### 1.1 登录系统
- 使用您的企业邮箱和密码登录
- 首次登录需要修改初始密码
- 启用双因素认证以提高安全性

### 1.2 完善个人信息
- 上传个人头像
- 填写基本信息和联系方式
- 设置工作偏好和通知选项

## 2. 界面介绍

### 2.1 主要功能区域
- **工作台**: 查看任务概览和统计信息
- **标注任务**: 管理和执行标注工作
- **项目管理**: 创建和管理标注项目
- **数据管理**: 上传和管理数据集

### 2.2 导航栏功能
- 左侧导航：主要功能模块
- 顶部工具栏：搜索、通知、用户菜单
- 面包屑导航：当前位置指示

## 3. 基本操作流程

### 3.1 接收任务
1. 在"我的任务"中查看分配的任务
2. 点击任务名称查看详细信息
3. 确认任务要求和截止时间

### 3.2 执行标注
1. 点击"开始标注"进入标注界面
2. 根据标注指南进行数据标注
3. 使用快捷键提高标注效率
4. 定期保存标注进度

### 3.3 提交审核
1. 完成标注后进行自检
2. 确认标注质量符合要求
3. 提交任务等待审核

## 4. 注意事项

- 严格按照标注规范执行
- 遇到问题及时咨询项目负责人
- 保持标注的一致性和准确性
- 定期查看系统通知和更新`,
    },
    {
      id: "doc_002",
      title: "图像标注操作手册",
      description: "详细介绍图像分类、目标检测、语义分割等图像标注任务的操作方法。",
      category: "annotation-guide",
      tags: ["图像", "标注", "操作"],
      lastUpdated: "2024-01-12",
      isPopular: true,
      content: `# 图像标注操作手册

## 1. 图像分类标注

### 1.1 操作步骤
1. 仔细观察图像内容
2. 从预定义类别中选择最合适的标签
3. 如有疑问，标记为"不确定"
4. 点击"下一张"继续标注

### 1.2 质量要求
- 准确率要求：≥95%
- 标注速度：每小时100-150张
- 一致性检查：定期进行交叉验证

## 2. 目标检测标注

### 2.1 边界框绘制
1. 使用鼠标拖拽绘制边界框
2. 确保边界框紧贴目标物体
3. 为每个边界框分配正确的类别标签
4. 检查是否有遗漏的目标

### 2.2 标注规范
- 边界框应完全包含目标物体
- 避免包含过多背景区域
- 重叠物体需要分别标注
- 部分遮挡的物体也需要标注

## 3. 语义分割标注

### 3.1 像素级标注
1. 使用画笔工具进行像素级标注
2. 调整画笔大小以适应细节要求
3. 使用不同颜色区分不同类别
4. 确保边界准确无误

### 3.2 工具使用技巧
- 使用放大功能处理细节
- 利用自动填充工具提高效率
- 使用橡皮擦工具修正错误
- 定期保存标注进度`,
    },
    {
      id: "doc_003",
      title: "文本标注规范指南",
      description: "文本分类、命名实体识别、情感分析等文本标注任务的详细规范。",
      category: "annotation-guide",
      tags: ["文本", "NLP", "规范"],
      lastUpdated: "2024-01-10",
      content: `# 文本标注规范指南

## 1. 文本分类标注

### 1.1 分类原则
- 根据文本主要内容进行分类
- 优先选择最具体的类别
- 避免主观判断，基于客观事实
- 遇到边界情况时参考标注指南

### 1.2 常见类别
- 新闻资讯：政治、经济、体育、娱乐等
- 用户评论：正面、负面、中性
- 产品描述：功能介绍、使用说明等

## 2. 命名实体识别

### 2.1 实体类型
- 人名（PER）：真实人名、虚构人物
- 地名（LOC）：国家、城市、地标等
- 机构名（ORG）：公司、组织、学校等
- 时间（TIME）：日期、时间表达式

### 2.2 标注规则
- 选择完整的实体边界
- 避免包含修饰词
- 嵌套实体需要分别标注
- 缩写和全称统一处理

## 3. 情感分析标注

### 3.1 情感极性
- 正面：表达积极、满意的情感
- 负面：表达消极、不满的情感
- 中性：客观陈述，无明显情感倾向

### 3.2 标注要点
- 关注整体情感倾向
- 考虑上下文语境
- 区分事实陈述和情感表达
- 处理讽刺和反语表达`,
    },
    {
      id: "doc_004",
      title: "质量控制最佳实践",
      description: "如何确保标注质量，包括自检方法、质量指标和改进建议。",
      category: "advanced-features",
      tags: ["质量", "最佳实践", "改进"],
      lastUpdated: "2024-01-08",
      content: `# 质量控制最佳实践

## 1. 自检方法

### 1.1 标注前准备
- 仔细阅读标注指南
- 了解项目特定要求
- 熟悉标注工具功能
- 明确质量标准

### 1.2 标注过程中
- 保持专注，避免疲劳标注
- 定期休息，保持最佳状态
- 遇到疑问及时查阅指南
- 记录特殊情况和处理方法

### 1.3 标注后检查
- 随机抽查已完成的标注
- 检查标注的一致性
- 验证边界框的准确性
- 确认类别标签的正确性

## 2. 质量指标

### 2.1 准确率指标
- 分类准确率：≥95%
- 检测精度：≥90%
- 分割IoU：≥85%
- 一致性系数：≥0.8

### 2.2 效率指标
- 标注速度：符合项目要求
- 返工率：≤5%
- 及时完成率：≥95%

## 3. 持续改进

### 3.1 学习提升
- 参加培训课程
- 学习优秀案例
- 交流标注经验
- 关注行业动态

### 3.2 工具优化
- 熟练使用快捷键
- 自定义工作环境
- 利用辅助功能
- 反馈工具问题`,
    },
    {
      id: "doc_005",
      title: "常见问题解答",
      description: "汇总用户在使用过程中遇到的常见问题及解决方案。",
      category: "troubleshooting",
      tags: ["FAQ", "问题", "解决方案"],
      lastUpdated: "2024-01-05",
      isPopular: true,
      content: `# 常见问题解答

## 1. 登录相关问题

### Q: 忘记密码怎么办？
A: 点击登录页面的"忘记密码"链接，输入注册邮箱，系统会发送重置密码的邮件。

### Q: 账户被锁定怎么办？
A: 联系系统管理员或发送邮件至support@company.com申请解锁。

## 2. 标注工具问题

### Q: 标注工具加载缓慢？
A: 检查网络连接，清除浏览器缓存，或尝试使用其他浏览器。

### Q: 无法保存标注结果？
A: 确认网络连接正常，检查是否有权限，联系技术支持。

## 3. 任务管理问题

### Q: 找不到分配的任务？
A: 检查任务状态筛选条件，确认任务是否已过期或被重新分配。

### Q: 如何申请任务延期？
A: 在任务详情页面点击"申请延期"，填写延期原因和预期完成时间。

## 4. 数据相关问题

### Q: 数据无法正常显示？
A: 检查数据格式是否正确，确认浏览器支持该文件类型。

### Q: 如何下载标注结果？
A: 在项目管理页面选择"导出数据"，选择所需格式进行下载。`,
    },
  ]);

  // 筛选文档
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDocumentClick = (docId: string) => {
    setExpandedDoc(expandedDoc === docId ? null : docId);
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <BookOutlined />
              使用文档
            </Title>
            <Text type="secondary">查找您需要的帮助文档和操作指南</Text>
          </div>
          <Space>
            <Button icon={<DownloadOutlined />}>下载全部文档</Button>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧：分类导航 */}
        <Col xs={24} lg={6}>
          <Card title="文档分类" className="category-card">
            <List
              dataSource={categories}
              renderItem={(category) => (
                <List.Item
                  className={`category-item ${selectedCategory === category.key ? "active" : ""}`}
                  onClick={() => setSelectedCategory(category.key)}
                  style={{
                    cursor: "pointer",
                    padding: "12px 16px",
                    borderRadius: "6px",
                    marginBottom: "4px",
                    backgroundColor: selectedCategory === category.key ? "#e6f7ff" : "transparent",
                    border: selectedCategory === category.key ? "1px solid #1890ff" : "1px solid transparent",
                  }}
                >
                  <List.Item.Meta
                    avatar={category.icon}
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{category.title}</span>
                        <Badge count={category.count} style={{ backgroundColor: "#52c41a" }} />
                      </div>
                    }
                    description={category.description}
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 快速导航 */}
          <Card title="快速导航" style={{ marginTop: 16 }}>
            <Anchor
              items={[
                {
                  key: "getting-started",
                  href: "#getting-started",
                  title: "快速入门",
                },
                {
                  key: "annotation-guide",
                  href: "#annotation-guide",
                  title: "标注指南",
                },
                {
                  key: "advanced-features",
                  href: "#advanced-features",
                  title: "高级功能",
                },
                {
                  key: "troubleshooting",
                  href: "#troubleshooting",
                  title: "故障排除",
                },
              ]}
            />
          </Card>
        </Col>

        {/* 右侧：文档内容 */}
        <Col xs={24} lg={18}>
          {/* 搜索框 */}
          <Card style={{ marginBottom: 16 }}>
            <Search
              placeholder="搜索文档标题、内容或标签..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
              size="large"
              prefix={<SearchOutlined />}
            />
          </Card>

          {/* 文档列表 */}
          <div className="document-list">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                style={{ marginBottom: 16 }}
                className="document-card"
                hoverable
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDocumentClick(doc.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Title level={4} style={{ margin: 0 }}>
                          <FileTextOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                          {doc.title}
                        </Title>
                        {doc.isPopular && (
                          <Badge.Ribbon text="热门" color="red">
                            <div></div>
                          </Badge.Ribbon>
                        )}
                      </div>
                      <Paragraph
                        style={{ margin: 0, color: "#666" }}
                        ellipsis={{ rows: 2, expandable: false }}
                      >
                        {doc.description}
                      </Paragraph>
                    </div>
                    {doc.downloadUrl && (
                      <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // 下载文档逻辑
                        }}
                      />
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Space>
                      {doc.tags.map((tag) => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      更新时间：{doc.lastUpdated}
                    </Text>
                  </div>
                </div>

                {/* 展开的文档内容 */}
                {expandedDoc === doc.id && doc.content && (
                  <>
                    <Divider />
                    <div style={{ padding: "16px 0" }}>
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.6,
                          fontSize: 14,
                        }}
                      >
                        {doc.content}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <Card>
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <FileTextOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                <Title level={4} type="secondary">未找到相关文档</Title>
                <Text type="secondary">请尝试调整搜索条件或选择其他分类</Text>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DocumentationPage;
