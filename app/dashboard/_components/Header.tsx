'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  BellOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Layout,
  theme,
  Avatar,
  Dropdown,
  Input,
  Badge,
  Space,
  Button,
} from 'antd';
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Search } = Input;

interface DashboardHeaderProps {
  title?: string;
  searchPlaceholder?: string;
  notificationCount?: number;
  userName?: string;
}

// 用户下拉菜单
const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    label: '个人资料',
  },
  {
    key: 'settings',
    label: '账户设置',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: '退出登录',
  },
];

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = '控制台',
  searchPlaceholder = '搜索功能、内容...',
  notificationCount = 0,
  userName = '管理员',
}) => {
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleSearch = (value: string) => {
    console.log('搜索:', value);
    // 这里可以添加搜索逻辑
    // 例如：router.push(`/dashboard/search?q=${encodeURIComponent(value)}`);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    console.log('用户菜单点击:', key);
    // 处理用户菜单点击逻辑
    switch (key) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/dashboard/settings');
        break;
      case 'logout':
        // 执行登出逻辑
        // 例如：清除token，跳转到登录页
        router.push('/auth');
        break;
      default:
        break;
    }
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: colorBgContainer,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        height: 64,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ margin: 0, marginRight: 24, color: '#001529' }}>
          {title}
        </h2>
        <Search
          placeholder={searchPlaceholder}
          allowClear
          style={{ width: 300 }}
          onSearch={handleSearch}
        />
      </div>

      <Space size="middle">
        <Badge count={notificationCount}>
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: '16px' }} />}
            size="large"
          />
        </Badge>
        <Dropdown 
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }} 
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span>{userName}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default DashboardHeader;