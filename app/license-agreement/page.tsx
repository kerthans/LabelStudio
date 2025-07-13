"use client";
import {
  CopyrightOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
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

const LicenseAgreementPage: React.FC = () => {
  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <Title level={1} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
          软件许可协议
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          智能标注平台软件使用许可协议
        </Text>
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">版本：1.0 | 生效日期：2024年1月15日</Text>
        </div>
      </div>

      <Row gutter={24}>
        {/* 导航锚点 */}
        <Col xs={24} lg={6}>
          <Card size="small" style={{ position: "sticky", top: 24 }}>
            <Anchor
              affix={false}
              items={[
                { key: "overview", href: "#overview", title: "协议概述" },
                { key: "definitions", href: "#definitions", title: "定义说明" },
                { key: "grant", href: "#grant", title: "许可授权" },
                { key: "restrictions", href: "#restrictions", title: "使用限制" },
                { key: "ownership", href: "#ownership", title: "所有权" },
                { key: "warranty", href: "#warranty", title: "保证声明" },
                { key: "liability", href: "#liability", title: "责任限制" },
                { key: "termination", href: "#termination", title: "协议终止" },
                { key: "compliance", href: "#compliance", title: "合规要求" },
                { key: "updates", href: "#updates", title: "更新维护" },
                { key: "governing", href: "#governing", title: "适用法律" },
                { key: "contact", href: "#contact", title: "联系方式" },
              ]}
            />
          </Card>
        </Col>

        {/* 主要内容 */}
        <Col xs={24} lg={18}>
          <Card>
            {/* 协议概述 */}
            <div id="overview">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <InfoCircleOutlined style={{ color: "#1890ff" }} />
                协议概述
              </Title>
              <Paragraph>
                {"本软件许可协议（以下简称\"协议\"）是您（个人或实体）与智能标注平台开发团队（以下简称\"许可方\"）"}
                {"之间关于智能标注平台软件（以下简称\"软件\"）使用的法律协议。"}
              </Paragraph>
              <Paragraph>
                <strong>通过安装、复制或使用本软件，您表示同意受本协议条款的约束。</strong>
                如果您不同意本协议的条款，请不要安装或使用本软件。
              </Paragraph>
              <Paragraph>
                本协议适用于软件的所有版本，包括但不限于桌面版、Web版、移动版及其相关组件。
              </Paragraph>
            </div>

            <Divider />

            {/* 定义说明 */}
            <div id="definitions">
              <Title level={2}>定义说明</Title>
              <Paragraph>
                在本协议中，以下术语具有特定含义：
              </Paragraph>
              <ul>
                <li><strong>{"软件"}</strong>：指智能标注平台及其所有相关组件、文档、更新和修改版本</li>
                <li><strong>{"许可方"}</strong>：指智能标注平台的开发和运营团队</li>
                <li><strong>{"被许可方"}</strong>：指获得软件使用许可的个人或实体</li>
                <li><strong>{"文档"}</strong>：指与软件相关的用户手册、技术文档、API文档等</li>
                <li><strong>{"更新"}</strong>：指软件的错误修复、安全补丁、功能改进等</li>
                <li><strong>{"商业用途"}</strong>：指以营利为目的的使用行为</li>
                <li><strong>{"源代码"}</strong>：指软件的人类可读形式代码</li>
              </ul>
            </div>

            <Divider />

            {/* 许可授权 */}
            <div id="grant">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <KeyOutlined style={{ color: "#52c41a" }} />
                许可授权
              </Title>

              <Title level={3}>基本许可</Title>
              <Paragraph>
                在遵守本协议条款的前提下，许可方授予您以下非排他性、不可转让的许可：
              </Paragraph>
              <ul>
                <li><strong>使用权</strong>：在授权设备上安装和使用软件</li>
                <li><strong>访问权</strong>：访问软件的功能和服务</li>
                <li><strong>文档权</strong>：使用相关文档和帮助材料</li>
                <li><strong>更新权</strong>：接收软件更新和维护服务</li>
              </ul>

              <Title level={3}>许可类型</Title>
              <ul>
                <li><strong>个人许可</strong>：供个人非商业使用</li>
                <li><strong>教育许可</strong>：供教育机构教学和研究使用</li>
                <li><strong>商业许可</strong>：供企业和组织商业使用</li>
                <li><strong>开发者许可</strong>：供开发者集成和定制使用</li>
              </ul>

              <Title level={3}>许可范围</Title>
              <ul>
                <li>许可仅限于软件的使用，不包括所有权转移</li>
                <li>许可不可转让给第三方</li>
                <li>许可受本协议条款限制</li>
              </ul>
            </div>

            <Divider />

            {/* 使用限制 */}
            <div id="restrictions">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <WarningOutlined style={{ color: "#fa8c16" }} />
                使用限制
              </Title>

              <Title level={3}>禁止行为</Title>
              <Paragraph>
                除非法律明确允许或获得许可方书面同意，您不得：
              </Paragraph>
              <ul>
                <li><strong>逆向工程</strong>：反编译、反汇编或逆向工程软件</li>
                <li><strong>修改软件</strong>：修改、改编或创建软件的衍生作品</li>
                <li><strong>分发软件</strong>：分发、出售、租赁或转让软件</li>
                <li><strong>移除标识</strong>：移除或修改软件中的版权、商标或其他标识</li>
                <li><strong>绕过保护</strong>：绕过或禁用软件的安全或技术保护措施</li>
                <li><strong>恶意使用</strong>：将软件用于非法、有害或恶意目的</li>
              </ul>

              <Title level={3}>使用条件</Title>
              <ul>
                <li>必须遵守所有适用的法律法规</li>
                <li>不得侵犯他人的知识产权</li>
                <li>不得用于竞争性产品的开发</li>
                <li>必须保护软件的机密信息</li>
              </ul>
            </div>

            <Divider />

            {/* 所有权 */}
            <div id="ownership">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CopyrightOutlined style={{ color: "#722ed1" }} />
                知识产权与所有权
              </Title>

              <Title level={3}>软件所有权</Title>
              <ul>
                <li>软件及其所有组件的所有权归许可方所有</li>
                <li>本协议不转让任何所有权给被许可方</li>
                <li>所有知识产权均由许可方保留</li>
              </ul>

              <Title level={3}>第三方组件</Title>
              <ul>
                <li>软件可能包含第三方开源组件</li>
                <li>第三方组件受其各自许可证约束</li>
                <li>相关许可证信息可在软件中查看</li>
              </ul>

              <Title level={3}>用户数据</Title>
              <ul>
                <li>您保留对自己数据的所有权</li>
                <li>许可方不声称对用户数据的所有权</li>
                <li>用户数据的处理遵循隐私政策</li>
              </ul>
            </div>

            <Divider />

            {/* 保证声明 */}
            <div id="warranty">
              <Title level={2}>保证与免责声明</Title>

              <Title level={3}>有限保证</Title>
              <ul>
                <li>{"软件按\"现状\"提供，不提供任何明示或暗示的保证"}</li>
                <li>不保证软件完全无错误或不间断运行</li>
                <li>不保证软件满足您的特定需求</li>
              </ul>

              <Title level={3}>免责声明</Title>
              <ul>
                <li>在法律允许的最大范围内，许可方免除所有保证</li>
                <li>包括但不限于适销性、特定用途适用性的保证</li>
                <li>您承担使用软件的全部风险</li>
              </ul>
            </div>

            <Divider />

            {/* 责任限制 */}
            <div id="liability">
              <Title level={2}>责任限制</Title>

              <Title level={3}>损害赔偿限制</Title>
              <ul>
                <li>许可方的总责任不超过您支付的许可费用</li>
                <li>不承担间接、特殊、偶然或后果性损害</li>
                <li>包括但不限于利润损失、数据丢失等</li>
              </ul>

              <Title level={3}>例外情况</Title>
              <ul>
                <li>故意不当行为或重大过失除外</li>
                <li>法律不允许限制的责任除外</li>
                <li>人身伤害或死亡责任除外</li>
              </ul>
            </div>

            <Divider />

            {/* 协议终止 */}
            <div id="termination">
              <Title level={2}>协议终止</Title>

              <Title level={3}>终止条件</Title>
              <ul>
                <li><strong>违约终止</strong>：违反协议条款时自动终止</li>
                <li><strong>主动终止</strong>：您可随时停止使用软件</li>
                <li><strong>通知终止</strong>：许可方可提前通知终止</li>
              </ul>

              <Title level={3}>终止后果</Title>
              <ul>
                <li>必须停止使用软件</li>
                <li>删除所有软件副本</li>
                <li>返还或销毁相关文档</li>
                <li>相关条款在终止后继续有效</li>
              </ul>
            </div>

            <Divider />

            {/* 合规要求 */}
            <div id="compliance">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LockOutlined style={{ color: "#13c2c2" }} />
                合规要求
              </Title>

              <Title level={3}>法律合规</Title>
              <ul>
                <li>遵守所有适用的国际、国家和地方法律</li>
                <li>遵守出口管制和贸易制裁法规</li>
                <li>遵守数据保护和隐私法规</li>
              </ul>

              <Title level={3}>行业标准</Title>
              <ul>
                <li>遵循相关行业的最佳实践</li>
                <li>符合信息安全标准要求</li>
                <li>满足质量管理体系要求</li>
              </ul>
            </div>

            <Divider />

            {/* 更新维护 */}
            <div id="updates">
              <Title level={2} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ToolOutlined style={{ color: "#eb2f96" }} />
                更新与维护
              </Title>

              <Title level={3}>软件更新</Title>
              <ul>
                <li>许可方可能提供软件更新</li>
                <li>更新可能包括新功能、改进或错误修复</li>
                <li>某些更新可能需要接受新的协议条款</li>
              </ul>

              <Title level={3}>技术支持</Title>
              <ul>
                <li>技术支持服务根据具体许可类型提供</li>
                <li>支持范围和响应时间可能有所不同</li>
                <li>详细支持政策请参考相关文档</li>
              </ul>
            </div>

            <Divider />

            {/* 适用法律 */}
            <div id="governing">
              <Title level={2}>适用法律与争议解决</Title>

              <Title level={3}>适用法律</Title>
              <ul>
                <li>本协议受中华人民共和国法律管辖</li>
                <li>不适用法律冲突原则</li>
                <li>国际销售货物合同公约不适用</li>
              </ul>

              <Title level={3}>争议解决</Title>
              <ul>
                <li>首先通过友好协商解决争议</li>
                <li>协商不成可申请仲裁</li>
                <li>最终可向有管辖权的法院起诉</li>
              </ul>
            </div>

            <Divider />

            {/* 联系方式 */}
            <div id="contact">
              <Title level={2}>联系方式</Title>
              <Paragraph>
                如果您对本许可协议有任何疑问，请联系我们：
              </Paragraph>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MailOutlined style={{ color: "#1890ff" }} />
                  <Text>邮箱：license@labelstudio.com</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PhoneOutlined style={{ color: "#52c41a" }} />
                  <Text>电话：400-123-4567</Text>
                </div>
                <div>
                  <Text>地址：北京市朝阳区科技园区智能标注平台</Text>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">
                    本协议的最新版本可在我们的官方网站查看。
                  </Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LicenseAgreementPage;
