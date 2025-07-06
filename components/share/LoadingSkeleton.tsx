'use client';
import React from 'react';
import { Card, Row, Col, Skeleton } from 'antd';

interface LoadingSkeletonProps {
  type?: 'dashboard' | 'list' | 'form' | 'table' | 'profile' | 'adaptive';
  rows?: number;
  cards?: number;
  showAvatar?: boolean;
  showTitle?: boolean;
  // 新增：响应式配置
  layout?: {
    columns?: number;
    hasStatistics?: boolean;
    hasChart?: boolean;
    hasQuickActions?: boolean;
    hasRecentActivity?: boolean;
  };
  // 新增：自定义内容区域
  contentAreas?: Array<{
    span: number;
    height?: number;
    title?: boolean;
    rows?: number;
    type?: 'chart' | 'buttons' | 'list' | 'statistics';
  }>;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'dashboard',
  rows = 3,
  cards = 4,
  showAvatar = true,
  showTitle = true,
  layout,
  contentAreas,
}) => {
  // 自适应类型 - 根据传入的配置动态生成
  if (type === 'adaptive' && contentAreas) {
    return (
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
        {/* 统计卡片区域 */}
        {layout?.hasStatistics && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            {Array.from({ length: layout.columns || 4 }, (_, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card>
                  <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* 动态内容区域 */}
        <Row gutter={16}>
          {contentAreas.map((area, index) => (
            <Col xs={24} lg={area.span} key={index}>
              <Card title={area.title && showTitle ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : null}>
                {area.type === 'chart' && (
                  <Skeleton active paragraph={{ rows: area.rows || 8 }} title={false} />
                )}
                {area.type === 'buttons' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Array.from({ length: area.rows || 4 }, (_, btnIndex) => (
                      <Skeleton.Button key={btnIndex} active size="large" block />
                    ))}
                  </div>
                )}
                {area.type === 'list' && (
                  <div>
                    {Array.from({ length: area.rows || 3 }, (_, listIndex) => (
                      <div key={listIndex} style={{ marginBottom: '12px' }}>
                        <Skeleton active paragraph={{ rows: 1 }} title={{ width: '70%' }} />
                      </div>
                    ))}
                  </div>
                )}
                {area.type === 'statistics' && (
                  <Skeleton active paragraph={{ rows: area.rows || 2 }} title={{ width: '50%' }} />
                )}
              </Card>
            </Col>
          ))}
        </Row>

        {/* 最近活动区域 */}
        {layout?.hasRecentActivity && (
          <Card title={showTitle ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : null} style={{ marginTop: 16 }}>
            <Skeleton active paragraph={{ rows: 4 }} title={false} />
          </Card>
        )}
      </div>
    );
  }

  // Dashboard类型loading
  if (type === 'dashboard') {
    return (
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {Array.from({ length: cards }, (_, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card>
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
              </Card>
            </Col>
          ))}
        </Row>

        {/* 主要内容 */}
        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <Card title={showTitle ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : null}>
              <Skeleton active paragraph={{ rows: 8 }} title={false} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={showTitle ? <Skeleton.Input active size="small" style={{ width: 80 }} /> : null}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton.Button key={index} active size="large" block />
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 最近活动 */}
        <Card title={showTitle ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : null} style={{ marginTop: 16 }}>
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </Card>
      </div>
    );
  }

  // 列表类型loading
  if (type === 'list') {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          {Array.from({ length: rows }, (_, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              {showAvatar && <Skeleton.Avatar active size="default" />}
              <div style={{ flex: 1 }}>
                <Skeleton active paragraph={{ rows: 1 }} title={{ width: '70%' }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  // 表单类型loading
  if (type === 'form') {
    return (
      <div style={{ padding: '24px' }}>
        <Card title={showTitle ? <Skeleton.Input active size="small" style={{ width: 120 }} /> : null}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Array.from({ length: rows }, (_, index) => (
              <div key={index}>
                <Skeleton.Input active size="small" style={{ width: 80, marginBottom: 8 }} />
                <Skeleton.Input active size="default" block />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Skeleton.Button active size="default" />
              <Skeleton.Button active size="default" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 表格类型loading
  if (type === 'table') {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Skeleton.Input active size="default" style={{ width: 200 }} />
          </div>
          {Array.from({ length: rows }, (_, index) => (
            <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: '12px', alignItems: 'center' }}>
              <Skeleton.Input active size="small" style={{ width: '15%' }} />
              <Skeleton.Input active size="small" style={{ width: '25%' }} />
              <Skeleton.Input active size="small" style={{ width: '20%' }} />
              <Skeleton.Input active size="small" style={{ width: '15%' }} />
              <Skeleton.Button active size="small" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  // 个人资料类型loading
  if (type === 'profile') {
    return (
      <div style={{ padding: '24px' }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Skeleton.Avatar active size={100} style={{ marginBottom: '16px' }} />
                <Skeleton active paragraph={{ rows: 2 }} title={{ width: '80%' }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card title={showTitle ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : null}>
              <Skeleton active paragraph={{ rows: 6 }} title={false} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // 默认loading
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Skeleton active paragraph={{ rows }} title={showTitle} avatar={showAvatar} />
      </Card>
    </div>
  );
};

export default LoadingSkeleton;