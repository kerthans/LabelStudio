"use client";
import {
  FileProtectOutlined,
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  Anchor,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Typography,
} from "antd";
import React from "react";

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <Title level={1} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <LockOutlined style={{ color: "#1890ff" }} />
          隐私政策
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          我们重视您的隐私，本政策详细说明了我们如何收集、使用和保护您的个人信息
        </Text>
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">最后更新时间：2024年1月15日</Text>
        </div>
      </div>

      <Row gutter={24}>
        {/* 导航锚点 */}
        <Col xs={24} lg={6}>
          <Card size="small" style={{ position: "sticky", top: 24 }}>
            <Anchor
              affix={false}
              items={[
                { key: "overview", href: "#overview", title: "政策概述" },
                { key: "collection", href: "#collection", title: "信息收集" },
                { key: "usage", href: "#usage", title: "信息使用" },
                { key: "sharing", href: "#sharing", title: "信息共享" },
                { key: "storage", href: "#storage", title: "信息存储" },
                { key: "security", href: "#security", title: "安全保护" },
                { key: "rights", href: "#rights", title: "用户权利" },
                { key: "cookies", href: "#cookies", title: "Cookie政策" },
                { key: "changes", href: "#changes", title: "政策变更" },
                { key: "contact", href: "#contact", title: "联系我们" },
              ]}
            />
          </Card>
        </Col>

        {/* 主要内容 */}
        <Col xs={24} lg={18}>
          <Card>
            {/* 政策概述 */}
            <div id="overview">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <InfoCircleOutlined style={{ color: "#1890ff" }} />
                政策概述
              </Title>
              <Paragraph>
                {"智能标注平台（以下简称\"我们\"或\"平台\"）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。"}
                {"我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息："}
              </Paragraph>
              <ul>
                <li><strong>权责一致原则</strong>：我们将按照法律法规要求，采取相应的安全保护措施</li>
                <li><strong>目的明确原则</strong>：我们仅为实现产品功能，向您提供服务之目的收集、使用个人信息</li>
                <li><strong>选择同意原则</strong>：我们会充分尊重您的选择，您有权控制个人信息的收集和使用</li>
                <li><strong>最少够用原则</strong>：我们只会收集实现产品功能所必要的信息</li>
                <li><strong>确保安全原则</strong>：我们将运用各种安全保护措施以确保信息安全</li>
                <li><strong>主体参与原则</strong>：我们将为您提供便利的方式来查询、更正或删除您的信息</li>
                <li><strong>公开透明原则</strong>：我们努力使用简明易懂的表述向您介绍隐私政策</li>
              </ul>
            </div>

            <Divider />

            {/* 信息收集 */}
            <div id="collection">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileProtectOutlined style={{ color: "#52c41a" }} />
                我们收集的信息
              </Title>

              <Title level={3}>1. 您主动提供的信息</Title>
              <Paragraph>
                当您注册账户、使用我们的服务时，您可能会向我们提供以下信息：
              </Paragraph>
              <ul>
                <li><strong>账户信息</strong>：用户名、邮箱地址、手机号码、密码</li>
                <li><strong>个人资料</strong>：姓名、头像、个人简介、工作信息</li>
                <li><strong>标注数据</strong>：您在平台上创建、编辑的标注内容和项目数据</li>
                <li><strong>反馈信息</strong>：您向我们提供的意见、建议或投诉内容</li>
              </ul>

              <Title level={3}>2. 我们自动收集的信息</Title>
              <Paragraph>
                当您使用我们的服务时，我们可能会自动收集以下信息：
              </Paragraph>
              <ul>
                <li><strong>设备信息</strong>：设备型号、操作系统、浏览器类型和版本</li>
                <li><strong>日志信息</strong>：IP地址、访问时间、访问页面、操作记录</li>
                <li><strong>使用数据</strong>：功能使用情况、操作习惯、性能数据</li>
                <li><strong>位置信息</strong>：基于IP地址的大致地理位置（仅用于安全验证）</li>
              </ul>
            </div>

            <Divider />

            {/* 信息使用 */}
            <div id="usage">
              <Title level={2}>我们如何使用您的信息</Title>
              <Paragraph>
                我们会出于以下目的使用收集到的信息：
              </Paragraph>
              <ul>
                <li><strong>提供服务</strong>：为您提供标注平台的核心功能和服务</li>
                <li><strong>账户管理</strong>：创建和管理您的账户，验证您的身份</li>
                <li><strong>功能改进</strong>：分析使用数据以改进产品功能和用户体验</li>
                <li><strong>安全保护</strong>：检测和防范安全威胁，保护平台和用户安全</li>
                <li><strong>客户支持</strong>：响应您的咨询、投诉和技术支持请求</li>
                <li><strong>法律合规</strong>：遵守适用的法律法规和监管要求</li>
              </ul>
            </div>

            <Divider />

            {/* 信息共享 */}
            <div id="sharing">
              <Title level={2}>信息共享</Title>
              <Paragraph>
                我们不会向第三方出售、出租或以其他方式披露您的个人信息，除非：
              </Paragraph>
              <ul>
                <li><strong>获得您的明确同意</strong>：在获得您明确同意的情况下</li>
                <li><strong>法律要求</strong>：根据法律法规、法律程序、政府要求</li>
                <li><strong>安全需要</strong>：为保护我们或他人的权利、财产或安全</li>
                <li><strong>业务转让</strong>：在合并、收购或资产转让中，但会要求新的持有者继续受本隐私政策约束</li>
                <li><strong>服务提供商</strong>：与为我们提供服务的第三方合作伙伴，但仅限于提供服务所必需的信息</li>
              </ul>
            </div>

            <Divider />

            {/* 信息存储 */}
            <div id="storage">
              <Title level={2}>信息存储</Title>
              <Paragraph>
                <strong>存储地点</strong>：您的个人信息将存储在中华人民共和国境内的服务器上。
              </Paragraph>
              <Paragraph>
                <strong>存储期限</strong>：我们仅在为实现本政策所述目的所必需的期间内保留您的个人信息：
              </Paragraph>
              <ul>
                <li>账户信息：在您的账户存续期间</li>
                <li>标注数据：根据项目需要和法律要求确定保存期限</li>
                <li>日志信息：通常保存不超过12个月</li>
                <li>当您注销账户时，我们将删除或匿名化处理您的个人信息</li>
              </ul>
            </div>

            <Divider />

            {/* 安全保护 */}
            <div id="security">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SafetyOutlined style={{ color: "#fa8c16" }} />
                安全保护措施
              </Title>
              <Paragraph>
                我们采用多种安全技术和程序来保护您的个人信息：
              </Paragraph>
              <ul>
                <li><strong>数据加密</strong>：使用SSL/TLS加密传输，敏感数据加密存储</li>
                <li><strong>访问控制</strong>：严格的权限管理和身份验证机制</li>
                <li><strong>安全监控</strong>：24/7安全监控和异常检测</li>
                <li><strong>定期审计</strong>：定期进行安全评估和漏洞扫描</li>
                <li><strong>员工培训</strong>：对员工进行数据保护和安全意识培训</li>
                <li><strong>应急响应</strong>：建立完善的安全事件应急响应机制</li>
              </ul>
            </div>

            <Divider />

            {/* 用户权利 */}
            <div id="rights">
              <Title level={2}>您的权利</Title>
              <Paragraph>
                根据相关法律法规，您享有以下权利：
              </Paragraph>
              <ul>
                <li><strong>知情权</strong>：了解我们处理您个人信息的情况</li>
                <li><strong>访问权</strong>：查询我们持有的您的个人信息</li>
                <li><strong>更正权</strong>：要求我们更正不准确的个人信息</li>
                <li><strong>删除权</strong>：在特定情况下要求我们删除您的个人信息</li>
                <li><strong>限制处理权</strong>：要求我们限制对您个人信息的处理</li>
                <li><strong>数据可携权</strong>：要求我们将您的数据转移给其他服务提供商</li>
                <li><strong>撤回同意权</strong>：撤回您之前给予的同意</li>
              </ul>
              <Paragraph>
                如需行使上述权利，请通过本页面底部的联系方式与我们联系。
              </Paragraph>
            </div>

            <Divider />

            {/* Cookie政策 */}
            <div id="cookies">
              <Title level={2}>Cookie和类似技术</Title>
              <Paragraph>
                我们使用Cookie和类似技术来改善您的用户体验：
              </Paragraph>
              <ul>
                <li><strong>必要Cookie</strong>：确保网站正常运行所必需的Cookie</li>
                <li><strong>功能Cookie</strong>：记住您的偏好设置和选择</li>
                <li><strong>分析Cookie</strong>：帮助我们了解网站使用情况</li>
                <li><strong>广告Cookie</strong>：我们目前不使用广告Cookie</li>
              </ul>
              <Paragraph>
                您可以通过浏览器设置管理Cookie，但禁用某些Cookie可能会影响网站功能。
              </Paragraph>
            </div>

            <Divider />

            {/* 政策变更 */}
            <div id="changes">
              <Title level={2}>隐私政策的变更</Title>
              <Paragraph>
                我们可能会不时更新本隐私政策。当我们对隐私政策进行重大变更时，我们会：
              </Paragraph>
              <ul>
                <li>在平台上发布更新通知</li>
                <li>通过邮件或站内消息通知您</li>
                <li>在某些情况下，征求您的明确同意</li>
              </ul>
              <Paragraph>
                建议您定期查看本页面以了解最新的隐私政策。
              </Paragraph>
            </div>

            <Divider />

            {/* 联系我们 */}
            <div id="contact">
              <Title level={2}>联系我们</Title>
              <Paragraph>
                如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：
              </Paragraph>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MailOutlined style={{ color: "#1890ff" }} />
                  <Text>邮箱：privacy@labelstudio.com</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PhoneOutlined style={{ color: "#52c41a" }} />
                  <Text>电话：400-123-4567</Text>
                </div>
                <div>
                  <Text>地址：北京市朝阳区科技园区智能标注平台</Text>
                </div>
              </Space>
              <Paragraph style={{ marginTop: 16 }}>
                我们将在收到您的请求后30天内回复。
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PrivacyPolicyPage;
