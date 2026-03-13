import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider, Button, Menu, Card, Row, Col, Statistic, Tag, Badge } from 'antd';
import { DatabaseOutlined, CodeOutlined, SettingOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const darkTheme = {
  algorithm: 'dark',
  token: {
    colorPrimary: '#3b82f6',
    colorBgBase: '#0d1117',
    colorBgContainer: '#161b22',
    colorBorder: '#334155',
    colorText: '#e2e8f0',
  },
};

const menuItems = [
  { key: 'dashboard', icon: <DatabaseOutlined />, label: '仪表盘' },
  { key: 'services', icon: <CodeOutlined />, label: '服务知识' },
  { key: 'spaces', icon: <SettingOutlined />, label: '设计空间' },
];

const Dashboard = () => {
  return (
    <div>
      <h1 style={{ color: '#e2e8f0', marginBottom: '24px' }}>欢迎回来，架构师</h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card style={{ background: '#161b22', border: '1px solid #334155' }}>
            <h3 style={{ color: '#e2e8f0' }}>设计空间</h3>
            <Statistic value={5} valueStyle={{ color: '#e2e8f0', fontSize: '36px' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: '#161b22', border: '1px solid #334155' }}>
            <h3 style={{ color: '#e2e8f0' }}>服务知识</h3>
            <Statistic value={23} valueStyle={{ color: '#e2e8f0', fontSize: '36px' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: '#161b22', border: '1px solid #334155' }}>
            <h3 style={{ color: '#e2e8f0' }}>历史设计</h3>
            <Statistic value={15} valueStyle={{ color: '#e2e8f0', fontSize: '36px' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ background: '#161b22', border: '1px solid #334155' }}>
            <h3 style={{ color: '#e2e8f0' }}>个人模板</h3>
            <Statistic value={3} valueStyle={{ color: '#e2e8f0', fontSize: '36px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const Services = () => {
  return (
    <div>
      <h1 style={{ color: '#e2e8f0', marginBottom: '24px' }}>服务知识</h1>
      <Button type="primary" style={{ marginBottom: '24px' }}>+ 添加服务知识</Button>
      <Row gutter={[16, 16]}>
        {[
          { name: 'user-service', version: '1.0.0' },
          { name: 'order-service', version: '1.0.0' },
          { name: 'payment-service', version: '1.2.0' },
        ].map((service) => (
          <Col span={8} key={service.name}>
            <Card
              title={service.name}
              extra={<Tag color="green">已发布</Tag>}
              style={{ background: '#161b22', border: '1px solid #334155' }}
            >
              <p style={{ color: '#94a3b8' }}>v{service.version}</p>
              <p style={{ color: '#64748b' }}>最后更新：2小时前</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const Spaces = () => {
  return (
    <div>
      <h1 style={{ color: '#e2e8f0', marginBottom: '24px' }}>设计空间</h1>
      <Button type="primary" style={{ marginBottom: '24px' }}>+ 创建设计空间</Button>
      <Row gutter={[16, 16]}>
        {[
          { name: '订单系统升级_v2', desc: 'V2.0订单系统架构升级设计', services: 3 },
          { name: '用户中心重构', desc: '用户中心系统重构方案', services: 1 },
          { name: '秒杀功能设计_v1', desc: '秒杀功能架构设计', services: 3 },
        ].map((space) => (
          <Col span={8} key={space.name}>
            <Card title={space.name} style={{ background: '#161b22', border: '1px solid #334155' }}>
              <p style={{ color: '#94a3b8', marginBottom: '12px' }}>{space.desc}</p>
              <p style={{ color: '#64748b' }}>📦 服务：{space.services}</p>
              <p style={{ color: '#64748b' }}>📋 模板：0</p>
              <Badge status="success" text="🌿 已连接" />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedKeys, setSelectedKeys] = useState(['dashboard']);

  const handleMenuClick = ({ key }) => {
    setCurrentPage(key);
    setSelectedKeys([key]);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <Services />;
      case 'spaces':
        return <Spaces />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ConfigProvider theme={darkTheme}>
      <Layout style={{ minHeight: '100vh', background: '#0d1117' }}>
        <Sider width={256} style={{ background: '#0d1117', borderRight: '1px solid #334155' }}>
          <div style={{ padding: '24px 0', marginBottom: '24px' }}>
            <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 700 }}>SKM</div>
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            onClick={handleMenuClick}
            style={{ background: 'transparent' }}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header style={{ background: '#0d1117', borderBottom: '1px solid #334155', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 700 }}>
              服务知识管理器
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button icon={<BellOutlined />} style={{ background: 'transparent', border: '1px solid #334155' }} />
              <Button icon={<UserOutlined />} style={{ background: 'transparent', border: '1px solid #334155' }} />
            </div>
          </Header>
          <Content style={{ background: '#0d1117', padding: '32px' }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
