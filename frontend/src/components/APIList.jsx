import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Space,
  Card,
  Select,
  Input,
  Button,
  message,
  Descriptions,
  Modal
} from 'antd';
import { SearchOutlined, ApiOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { serviceKnowledgeAPI } from '../api/api';

const { Option } = Select;

/**
 * API列表组件（Tab 2）
 */
const APIList = () => {
  const { t } = useTranslation();

  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPath, setSearchPath] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
    loadAPIs();
  }, []);

  const loadServices = async () => {
    try {
      const response = await serviceKnowledgeAPI.getAll();
      setServices(response);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const loadAPIs = async () => {
    setLoading(true);
    try {
      const response = await serviceKnowledgeAPI.getAll();
      // 从每个服务的knowledge字段中提取API信息
      const allAPIs = [];
      response.forEach(service => {
        if (service.knowledge) {
          try {
            const knowledge = JSON.parse(service.knowledge);
            if (knowledge.api_endpoints && Array.isArray(knowledge.api_endpoints)) {
              knowledge.api_endpoints.forEach(api => {
                allAPIs.push({
                  id: `${service.id}-${api.path}-${api.method}`,
                  serviceId: service.id,
                  serviceName: service.serviceName,
                  ...api
                });
              });
            }
          } catch (error) {
            console.error('Failed to parse knowledge for service:', service.serviceName, error);
          }
        }
      });
      setApis(allAPIs);
    } catch (error) {
      message.error('Failed to load APIs: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadAPIs();
  };

  const handleReset = () => {
    setSearchPath('');
    setFilterMethod('all');
    setFilterService('all');
    loadAPIs();
  };

  const handleViewDetail = (api) => {
    setSelectedAPI(api);
    setDetailVisible(true);
  };

  const getMethodTag = (method) => {
    const colorMap = {
      GET: 'green',
      POST: 'blue',
      PUT: 'orange',
      DELETE: 'red'
    };
    return <Tag color={colorMap[method] || 'default'}>{method}</Tag>;
  };

  // 过滤和搜索
  const filteredAPIs = apis.filter(api => {
    // 按服务筛选
    if (filterService !== 'all' && api.serviceId != filterService) {
      return false;
    }

    // 按方法筛选
    if (filterMethod !== 'all' && api.method !== filterMethod) {
      return false;
    }

    // 按路径搜索
    if (searchPath && !api.path.toLowerCase().includes(searchPath.toLowerCase())) {
      return false;
    }

    return true;
  });

  const columns = [
    {
      title: t('apiList.method'),
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method) => getMethodTag(method)
    },
    {
      title: t('apiList.path'),
      dataIndex: 'path',
      key: 'path',
      render: (path) => <span style={{ fontFamily: 'monospace' }}>{path}</span>
    },
    {
      title: t('common.serviceName') || 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 150
    },
    {
      title: t('apiList.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description) => description || '-'
    },
    {
      title: t('serviceList.actions'),
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleViewDetail(record)}
        >
          {t('apiList.details')}
        </Button>
      )
    }
  ];

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            {t('apiList.title')}
          </h2>
          <Button
            type="primary"
            icon={<ApiOutlined />}
            onClick={loadAPIs}
          >
            {t('apiList.refresh')}
          </Button>
        </div>

        <Space size="middle">
          <Input
            placeholder={t('apiList.searchByPath')}
            value={searchPath}
            onChange={(e) => setSearchPath(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
          <Select
            value={filterService}
            onChange={setFilterService}
            style={{ width: 200 }}
            placeholder={t('apiList.filterByService')}
          >
            <Option value="all">{t('apiList.allServices')}</Option>
            {services.map(service => (
              <Option key={service.id} value={service.id}>
                {service.serviceName}
              </Option>
            ))}
          </Select>
          <Select
            value={filterMethod}
            onChange={setFilterMethod}
            style={{ width: 150 }}
            placeholder={t('apiList.allMethods')}
          >
            <Option value="all">{t('apiList.allMethods')}</Option>
            <Option value="GET">{t('httpMethods.GET')}</Option>
            <Option value="POST">{t('httpMethods.POST')}</Option>
            <Option value="PUT">{t('httpMethods.PUT')}</Option>
            <Option value="DELETE">{t('httpMethods.DELETE')}</Option>
          </Select>
          <Button onClick={handleSearch} icon={<SearchOutlined />}>
            {t('apiList.search')}
          </Button>
          <Button onClick={handleReset}>
            {t('common.reset')}
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredAPIs}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => t('apiList.totalApis', { total })
          }}
        />
      </Space>

      {/* API详情弹窗 */}
      <Modal
        title={t('apiList.title') + ' - ' + t('apiList.details')}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            {t('common.close')}
          </Button>
        ]}
      >
        {selectedAPI && (
          <Descriptions bordered column={1} style={{ marginTop: '16px' }}>
            <Descriptions.Item label={t('common.serviceName') || 'Service'}>
              {selectedAPI.serviceName}
            </Descriptions.Item>
            <Descriptions.Item label={t('apiList.method')}>
              {getMethodTag(selectedAPI.method)}
            </Descriptions.Item>
            <Descriptions.Item label={t('apiList.path')}>
              <span style={{ fontFamily: 'monospace' }}>
                {selectedAPI.path}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={t('apiList.description')}>
              {selectedAPI.description || t('apiList.noDescription')}
            </Descriptions.Item>
            {selectedAPI.parameters && selectedAPI.parameters.length > 0 && (
              <Descriptions.Item label={t('apiList.parameters')}>
                <Space direction="vertical" size="small">
                  {selectedAPI.parameters.map((param, index) => (
                    <div key={index}>
                      <strong>{param.name}</strong> ({param.type})
                      {param.required && <Tag color="red" style={{ marginLeft: 8 }}>{t('apiList.required')}</Tag>}
                      {param.description && <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>{param.description}</div>}
                    </div>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
            <Descriptions.Item label={t('apiList.returnType')}>
              <span style={{ fontFamily: 'monospace' }}>
                {selectedAPI.returnType || t('apiList.unknown')}
              </span>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default APIList;
