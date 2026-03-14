import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Space,
  Card,
  Popconfirm,
  Tabs
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DatabaseOutlined, ApiOutlined, ExperimentOutlined } from '@ant-design/icons';
import { serviceKnowledgeAPI, serviceRepositoryAPI } from '../api/api';
import RepositoryManage from '../components/RepositoryManage';
import APIList from '../components/APIList';
import KnowledgeAnalysis from '../components/KnowledgeAnalysis';

const { Option } = Select;

const ServiceKnowledge = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [form] = Form.useForm();
  const [repoManageVisible, setRepoManageVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await serviceKnowledgeAPI.getAll();
      setServices(response);
      setPagination({
        ...pagination,
        total: response.data.length
      });
    } catch (error) {
      message.error('Failed to load services: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await serviceKnowledgeAPI.search(params);
      setServices(response);
      setPagination({
        ...pagination,
        total: response.data.length,
        current: 1
      });
    } catch (error) {
      message.error('Search failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchName('');
    setFilterStatus('all');
    loadServices();
  };

  const handleAdd = () => {
    setEditingService(null);
    form.resetFields();
    form.setFieldsValue({
      version: '1.0.0',
      status: 'draft'
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingService(record);
    form.setFieldsValue({
      serviceName: record.serviceName,
      version: record.version,
      status: record.status
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await serviceKnowledgeAPI.delete(id);
      message.success('Service deleted successfully');
      loadServices();
    } catch (error) {
      message.error('Failed to delete service: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        serviceName: values.serviceName,
        version: values.version || '1.0.0',
        status: values.status || 'draft',
        knowledge: editingService?.knowledge || {}
      };

      if (editingService) {
        await serviceKnowledgeAPI.update(editingService.id, data);
        message.success('Service updated successfully');
      } else {
        await serviceKnowledgeAPI.create(data);
        message.success('Service created successfully');
      }

      setModalVisible(false);
      loadServices();
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in required fields');
      } else {
        message.error('Operation failed: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getStatusTag = (status) => {
    if (status === 'published') {
      return <Tag color="green">Published</Tag>;
    }
    return <Tag color="orange">Draft</Tag>;
  };

  const handleManageRepositories = (record) => {
    setSelectedService(record);
    setRepoManageVisible(true);
  };

  const handleRepoManageSuccess = () => {
    loadServices();
  };

  const columns = [
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
      sorter: (a, b) => a.serviceName.localeCompare(b.serviceName)
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: 120
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Published', value: 'published' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Repositories',
      dataIndex: 'id',
      key: 'repositories',
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<DatabaseOutlined />}
          onClick={() => handleManageRepositories(record)}
        >
          Manage
        </Button>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => date ? new Date(date).toLocaleString() : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this service?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', height: '100%' }}>
      <Card style={{ height: '100%' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          style={{ height: '100%' }}
        >
          <Tabs.TabPane
            tab={<span><DatabaseOutlined /> Service List</span>}
            key="services"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                  Service List
                </h1>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  Add Service
                </Button>
              </div>

              <Space size="middle">
                <Input
                  placeholder="Search by service name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onPressEnter={handleSearch}
                  style={{ width: 250 }}
                  prefix={<SearchOutlined />}
                />
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 150 }}
                >
                  <Option value="all">All Status</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
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
                dataSource={services}
                loading={loading}
                rowKey="id"
                pagination={{
                  ...pagination,
                  onChange: (page) => setPagination({ ...pagination, current: page })
                }}
              />
            </Space>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<span><ApiOutlined /> API List</span>}
            key="api-list"
          >
            <APIList />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<span><ExperimentOutlined /> Knowledge Analysis</span>}
            key="knowledge-analysis"
          >
            <KnowledgeAnalysis />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingService ? 'Edit Service' : 'Add New Service'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            label="Service Name"
            name="serviceName"
            rules={[{ required: true, message: 'Please enter service name' }]}
          >
            <Input placeholder="e.g., user-service" />
          </Form.Item>

          <Form.Item
            label="Version"
            name="version"
            rules={[{ required: true, message: 'Please enter version' }]}
          >
            <Input placeholder="e.g., 1.0.0" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="published">Published</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <RepositoryManage
        visible={repoManageVisible}
        serviceId={selectedService?.id}
        serviceName={selectedService?.serviceName}
        onCancel={() => setRepoManageVisible(false)}
        onSuccess={handleRepoManageSuccess}
      />
    </div>
  );
};

export default ServiceKnowledge;
