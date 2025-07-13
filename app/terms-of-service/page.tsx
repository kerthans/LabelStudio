"use client";
import {
  AuditOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
  WarningOutlined,
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

const TermsOfServicePage: React.FC = () => {
  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <Title level={1} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          服务条款
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          欢迎使用智能标注平台，请仔细阅读以下服务条款
        </Text>
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">生效日期：2024年1月15日</Text>
        </div>
      </div>

      <Row gutter={24}>
        {/* 导航锚点 */}
        <Col xs={24} lg={6}>
          <Card size="small" style={{ position: "sticky", top: 24 }}>
            <Anchor
              affix={false}
              items={[
                { key: "acceptance", href: "#acceptance", title: "条款接受" },
                { key: "services", href: "#services", title: "服务描述" },
                { key: "registration", href: "#registration", title: "用户注册" },
                { key: "conduct", href: "#conduct", title: "用户行为" },
                { key: "content", href: "#content", title: "内容规范" },
                { key: "intellectual", href: "#intellectual", title: "知识产权" },
                { key: "privacy", href: "#privacy", title: "隐私保护" },
                { key: "payment", href: "#payment", title: "付费服务" },
                { key: "termination", href: "#termination", title: "服务终止" },
                { key: "liability", href: "#liability", title: "责任限制" },
                { key: "dispute", href: "#dispute", title: "争议解决" },
                { key: "changes", href: "#changes", title: "条款变更" },
                { key: "contact", href: "#contact", title: "联系我们" },
              ]}
            />
          </Card>
        </Col>

        {/* 主要内容 */}
        <Col xs={24} lg={18}>
          <Card>
            {/* 条款接受 */}
            <div id="acceptance">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AuditOutlined style={{ color: "#1890ff" }} />
                条款接受
              </Title>
              <Paragraph>
                {"欢迎使用智能标注平台（以下简称\"本平台\"或\"我们\"）。本服务条款（以下简称\"条款\"）是您与本平台之间关于使用本平台服务的法律协议。"}
              </Paragraph>
              <Paragraph>
                <strong>通过访问或使用本平台，您表示已阅读、理解并同意受本条款约束。</strong>
                如果您不同意本条款的任何部分，请不要使用本平台的服务。
              </Paragraph>
              <Paragraph>
                本条款适用于所有用户，包括但不限于标注员、项目管理员、企业用户等。
              </Paragraph>
            </div>

            <Divider />

            {/* 服务描述 */}
            <div id="services">
              <Title level={2}>服务描述</Title>
              <Paragraph>
                智能标注平台是一个专业的数据标注和管理服务平台，提供以下主要功能：
              </Paragraph>
              <ul>
                <li><strong>数据标注服务</strong>：支持图像、文本、音频、视频等多种数据类型的标注</li>
                <li><strong>项目管理</strong>：提供完整的标注项目创建、分配、监控和管理功能</li>
                <li><strong>质量控制</strong>：多层次的质量检查和评估体系</li>
                <li><strong>团队协作</strong>：支持多人协作和任务分配</li>
                <li><strong>数据分析</strong>：提供标注数据的统计分析和可视化</li>
                <li><strong>API接口</strong>：开放的API接口支持第三方集成</li>
              </ul>
              <Paragraph>
                我们保留随时修改、暂停或终止任何服务功能的权利，但会提前通知用户。
              </Paragraph>
            </div>

            <Divider />

            {/* 用户注册 */}
            <div id="registration">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserOutlined style={{ color: "#52c41a" }} />
                用户注册与账户
              </Title>

              <Title level={3}>注册要求</Title>
              <ul>
                <li>您必须年满18周岁或在法定监护人同意下使用本服务</li>
                <li>提供真实、准确、完整的注册信息</li>
                <li>及时更新您的账户信息以保持准确性</li>
                <li>选择安全的密码并妥善保管您的账户凭据</li>
              </ul>

              <Title level={3}>账户责任</Title>
              <ul>
                <li>您对您账户下的所有活动负责</li>
                <li>不得与他人共享您的账户凭据</li>
                <li>如发现账户被盗用，应立即通知我们</li>
                <li>我们有权暂停或终止违规账户</li>
              </ul>
            </div>

            <Divider />

            {/* 用户行为 */}
            <div id="conduct">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <WarningOutlined style={{ color: "#fa8c16" }} />
                用户行为规范
              </Title>

              <Title level={3}>允许的使用</Title>
              <ul>
                <li>按照平台规定进行数据标注工作</li>
                <li>与团队成员进行正当的工作协作</li>
                <li>使用平台提供的工具和功能</li>
                <li>报告发现的技术问题或安全漏洞</li>
              </ul>

              <Title level={3}>
                禁止的行为
              </Title>
              <ul>
                <li><strong>违法行为</strong>：不得用于任何违法或不当目的</li>
                <li><strong>恶意攻击</strong>：不得攻击、破坏或干扰平台正常运行</li>
                <li><strong>数据滥用</strong>：不得未经授权访问、复制或分发他人数据</li>
                <li><strong>虚假信息</strong>：不得提供虚假或误导性信息</li>
                <li><strong>侵权行为</strong>：不得侵犯他人知识产权或其他合法权益</li>
                <li><strong>恶意竞争</strong>：不得进行不正当竞争行为</li>
              </ul>
            </div>

            <Divider />

            {/* 内容规范 */}
            <div id="content">
              <Title level={2}>内容规范</Title>

              <Title level={3}>用户生成内容</Title>
              <Paragraph>
                您在平台上创建、上传或分享的所有内容（包括标注数据、评论、反馈等）必须：
              </Paragraph>
              <ul>
                <li>符合法律法规要求</li>
                <li>不包含有害、威胁、诽谤、骚扰、侵权的内容</li>
                <li>不包含病毒、恶意代码或其他有害程序</li>
                <li>尊重他人隐私和知识产权</li>
              </ul>

              <Title level={3}>内容监管</Title>
              <ul>
                <li>我们有权审查和监管平台上的内容</li>
                <li>对于违规内容，我们有权删除或限制访问</li>
                <li>严重违规可能导致账户暂停或终止</li>
              </ul>
            </div>

            <Divider />

            {/* 知识产权 */}
            <div id="intellectual">
              <Title level={2}>知识产权</Title>

              <Title level={3}>平台知识产权</Title>
              <ul>
                <li>本平台的所有技术、软件、界面设计等均受知识产权保护</li>
                <li>未经许可，不得复制、修改、分发或创建衍生作品</li>
                <li>平台商标、标识等不得未经授权使用</li>
              </ul>

              <Title level={3}>用户内容权利</Title>
              <ul>
                <li>您保留对自己创建内容的知识产权</li>
                <li>您授予我们使用您内容的必要许可以提供服务</li>
                <li>您保证拥有上传内容的合法权利</li>
              </ul>
            </div>

            <Divider />

            {/* 隐私保护 */}
            <div id="privacy">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SafetyOutlined style={{ color: "#722ed1" }} />
                隐私保护
              </Title>
              <Paragraph>
                我们重视您的隐私保护，具体的隐私处理方式请参阅我们的《隐私政策》。
                主要原则包括：
              </Paragraph>
              <ul>
                <li>仅收集提供服务所必需的信息</li>
                <li>采用行业标准的安全措施保护您的数据</li>
                <li>不会未经授权向第三方披露您的个人信息</li>
                <li>您有权查询、更正或删除您的个人信息</li>
              </ul>
            </div>

            <Divider />

            {/* 付费服务 */}
            <div id="payment">
              <Title level={2}>付费服务</Title>

              <Title level={3}>服务计费</Title>
              <ul>
                <li>部分高级功能可能需要付费使用</li>
                <li>具体价格和计费方式以平台公布为准</li>
                <li>付费服务的具体条款将在购买时明确说明</li>
              </ul>

              <Title level={3}>退款政策</Title>
              <ul>
                <li>退款政策将根据具体服务类型确定</li>
                <li>因平台原因导致的服务中断将提供相应补偿</li>
                <li>恶意使用或违规行为不享受退款服务</li>
              </ul>
            </div>

            <Divider />

            {/* 服务终止 */}
            <div id="termination">
              <Title level={2}>服务终止</Title>

              <Title level={3}>用户终止</Title>
              <ul>
                <li>您可以随时停止使用我们的服务</li>
                <li>可以通过设置页面删除您的账户</li>
                <li>终止后，您的数据将按照隐私政策处理</li>
              </ul>

              <Title level={3}>平台终止</Title>
              <ul>
                <li>我们可能因违规行为暂停或终止您的账户</li>
                <li>严重违规可能导致永久禁用</li>
                <li>我们会提前通知服务的重大变更或终止</li>
              </ul>
            </div>

            <Divider />

            {/* 责任限制 */}
            <div id="liability">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
                责任限制
              </Title>

              <Title level={3}>服务免责</Title>
              <ul>
                <li>{"本平台按\"现状\"提供服务，不提供任何明示或暗示的保证"}</li>
                <li>{"我们不保证服务的连续性、及时性、安全性或无错误"}</li>
                <li>{"用户应自行承担使用服务的风险"}</li>
              </ul>

              <Title level={3}>损害赔偿限制</Title>
              <ul>
                <li>在法律允许的最大范围内，我们的责任限于直接损失</li>
                <li>不承担间接、特殊、惩罚性或后果性损害</li>
                <li>总责任不超过用户支付的服务费用</li>
              </ul>
            </div>

            <Divider />

            {/* 争议解决 */}
            <div id="dispute">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AuditOutlined style={{ color: "#13c2c2" }} />
                争议解决
              </Title>
              <ul>
                <li><strong>协商解决</strong>：首先通过友好协商解决争议</li>
                <li><strong>调解程序</strong>：协商不成可申请第三方调解</li>
                <li><strong>法律途径</strong>：最终可通过法律途径解决</li>
                <li><strong>管辖法院</strong>：由本平台所在地法院管辖</li>
                <li><strong>适用法律</strong>：适用中华人民共和国法律</li>
              </ul>
            </div>

            <Divider />

            {/* 条款变更 */}
            <div id="changes">
              <Title level={2}>条款变更</Title>
              <Paragraph>
                我们可能会不时更新本服务条款。重大变更时，我们会：
              </Paragraph>
              <ul>
                <li>在平台显著位置发布变更通知</li>
                <li>通过邮件或站内消息通知用户</li>
                <li>给予用户合理的适应期</li>
                <li>继续使用服务视为接受新条款</li>
              </ul>
            </div>

            <Divider />

            {/* 联系我们 */}
            <div id="contact">
              <Title level={2}>联系我们</Title>
              <Paragraph>
                如果您对本服务条款有任何疑问，请联系我们：
              </Paragraph>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MailOutlined style={{ color: "#1890ff" }} />
                  <Text>邮箱：legal@labelstudio.com</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PhoneOutlined style={{ color: "#52c41a" }} />
                  <Text>电话：400-123-4567</Text>
                </div>
                <div>
                  <Text>地址：北京市朝阳区科技园区智能标注平台</Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div >
  );
};

export default TermsOfServicePage;
