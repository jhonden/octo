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
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DatabaseOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { serviceKnowledgeAPI, serviceRepositoryAPI } from '../api/api';
import RepositoryManage from '../components/RepositoryManage';
import KnowledgeAnalysis from '../components/KnowledgeAnalysis';

const { Option } = Select;

const ServiceKnowledge = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchName, setSearchName] = useState('');
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
      setServices(response.data || []);
      setPagination({
        ...pagination,
        total: (response.data || []).length
      });
    } catch (error) {
      message.error(t('repository.loadFailed') + ': ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchName) params.name = searchName;

      const response = await serviceKnowledgeAPI.search(params);
      setServices(response.data || []);
      setPagination({
        ...pagination,
        total: (response.data || []).length,
        current: 1
      });
    } catch (error) {
      message.error(t('repository.createFailed') + ': ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchName('');
    loadServices();
  };

  const handleAdd = () => {
    setEditingService(null);
    form.resetFields();
    form.setFieldsValue({
      version: '1.0.0'
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingService(record);
    form.setFieldsValue({
      serviceName: record.serviceName,
      version: record.version
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await serviceKnowledgeAPI.delete(id);
      message.success(t('repository.deletedSuccess'));
      loadServices();
    } catch (error) {
      message.error(t('repository.deleteFailed') + ': ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        serviceName: values.serviceName,
        version: values.version || '1.0.0',
        knowledge: editingService?.knowledge || {}
      };

      if (editingService) {
        await serviceKnowledgeAPI.update(editingService.id, data);
        message.success(t('serviceForm.updateSuccess'));
      } else {
        await serviceKnowledgeAPI.create(data);
        message.success(t('serviceForm.operationSuccess'));
      }

      setModalVisible(false);
      loadServices();
    } catch (error) {
      if (error.errorFields) {
        message.error(t('serviceForm.pleaseFillFields'));
      } else {
        message.error(t('serviceForm.operationFailed') + ': ' + (error.response?.data?.message || error.message));
      }
    }
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
      title: t('serviceList.serviceName'),
      dataIndex: 'serviceName',
      key: 'serviceName',
      sorter: (a, b) => a.serviceName.localeCompare(b.serviceName)
    },
    {
      title: t('serviceList.version'),
      dataIndex: 'version',
      key: 'version',
      width: 120
    },
    {
      title: t('serviceList.repositories'),
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
          {t('common.manage')}
        </Button>
      )
    },
    {
      title: t('serviceList.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => date ? new Date(date).toLocaleString() : '-'
    },
    {
      title: t('serviceList.actions'),
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('serviceList.deleteConfirm')}
            description={t('serviceList.deleteConfirmDesc')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('serviceList.yes')}
            cancelText={t('serviceList.no')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('common.delete')}
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
          items={[
            {
              key: 'services',
              label: <span><DatabaseOutlined /> {t('serviceList.title')}</span>,
              children: (
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                      {t('serviceList.title')}
                    </h2>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAdd}
                    >
                      {t('serviceList.addService')}
                    </Button>
                  </div>

                  <Space size="middle">
                    <Input
                      placeholder={t('serviceList.searchByName')}
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      onPressEnter={handleSearch}
                      style={{ width: 250 }}
                      prefix={<SearchOutlined />}
                    />
                    <Button onClick={handleSearch} icon={<SearchOutlined />}>
                      {t('common.search')}
                    </Button>
                    <Button onClick={handleReset}>
                      {t('common.reset')}
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
              )
            },
            {
              key: 'knowledge',
              label: <span><ExperimentOutlined /> {t('knowledge.title')}</span>,
              children: <KnowledgeAnalysis />
            }
          ]}
        />
      </Card>

      <Modal
        title={editingService ? t('serviceForm.editTitle') : t('serviceForm.addTitle')}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            label={t('serviceForm.serviceNameLabel')}
            name="serviceName"
            rules={[{ required: true, message: t('serviceForm.serviceNameRequired') }]}
          >
            <Input placeholder={t('serviceForm.serviceNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('serviceForm.versionLabel')}
            name="version"
            rules={[{ required: true, message: t('serviceForm.versionRequired') }]}
          >
            <Input placeholder={t('serviceForm.versionPlaceholder')} />
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
