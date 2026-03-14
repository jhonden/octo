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
import { serviceKnowledgeAPI } from '../api/api';

const { Option } = Select;

/**
 * API列表组件（Tab 2）
 */
const APIList = () => {
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
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (method) => getMethodTag(method)
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      render: (path) => <span style={{ fontFamily: 'monospace' }}>{path}</span>
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 150
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description) => description || '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleViewDetail(record)}
        >
          View Details
        </Button>
      )
    }
  ];

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            API Endpoints
          </h2>
          <Button
            type="primary"
            icon={<ApiOutlined />}
            onClick={loadAPIs}
          >
            Refresh APIs
          </Button>
        </div>

        <Space size="middle">
          <Input
            placeholder="Search by path"
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
            placeholder="Filter by service"
          >
            <Option value="all">All Services</Option>
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
            placeholder="Filter by method"
          >
            <Option value="all">All Methods</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
          <Button onClick={handleSearch} icon={<SearchOutlined />}>
            Search
          </Button>
          <Button onClick={handleReset}>
            Reset
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
            showTotal: (total) => `Total ${total} APIs`
          }}
        />
      </Space>

      {/* API详情弹窗 */}
      <Modal
        title="API Details"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Close
          </Button>
        ]}
      >
        {selectedAPI && (
          <Descriptions bordered column={1} style={{ marginTop: '16px' }}>
            <Descriptions.Item label="Service">
              {selectedAPI.serviceName}
            </Descriptions.Item>
            <Descriptions.Item label="Method">
              {getMethodTag(selectedAPI.method)}
            </Descriptions.Item>
            <Descriptions.Item label="Path">
              <span style={{ fontFamily: 'monospace' }}>
                {selectedAPI.path}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedAPI.description || 'No description'}
            </Descriptions.Item>
            {selectedAPI.parameters && selectedAPI.parameters.length > 0 && (
              <Descriptions.Item label="Parameters">
                <Space direction="vertical" size="small">
                  {selectedAPI.parameters.map((param, index) => (
                    <div key={index}>
                      <strong>{param.name}</strong> ({param.type})
                      {param.required && <Tag color="red" style={{ marginLeft: 8 }}>Required</Tag>}
                      {param.description && <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>{param.description}</div>}
                    </div>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Return Type">
              <span style={{ fontFamily: 'monospace' }}>
                {selectedAPI.returnType || 'Unknown'}
              </span>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default APIList;
