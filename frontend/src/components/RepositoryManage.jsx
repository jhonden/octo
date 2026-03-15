import React, { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Button,
  Form,
  Input,
  Select,
  Radio,
  message,
  Space,
  Tag,
  Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { serviceRepositoryAPI } from '../api/api';

const { Option } = Select;

/**
 * 仓库管理弹窗组件
 */
const RepositoryManage = ({ visible, serviceId, serviceName, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRepo, setEditingRepo] = useState(null);
  const [form] = Form.useForm();
  const [repoType, setRepoType] = useState('git');

  useEffect(() => {
    if (visible && serviceId) {
      loadRepositories();
    }
  }, [visible, serviceId]);

  const loadRepositories = async () => {
    setLoading(true);
    try {
      const response = await serviceRepositoryAPI.getByServiceId(serviceId);
      setRepositories(response);
    } catch (error) {
      message.error(t('repository.loadFailed') + ': ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRepo(null);
    setRepoType('git');
    form.resetFields();
    form.setFieldsValue({
      type: 'git',
      isPrimary: false
    });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRepo(record);
    setRepoType(record.type);
    form.setFieldsValue({
      type: record.type,
      url: record.url,
      path: record.path,
      defaultBranch: record.defaultBranch,
      isPrimary: record.isPrimary
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await serviceRepositoryAPI.delete(id);
      message.success(t('repository.deletedSuccess'));
      loadRepositories();
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error(t('repository.deleteFailed') + ': ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSetPrimary = async (record) => {
    try {
      await serviceRepositoryAPI.setPrimary(record.id, serviceId);
      message.success(t('repository.setPrimarySuccess'));
      loadRepositories();
    } catch (error) {
      message.error(t('repository.setPrimaryFailed') + ': ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const data = {
        serviceId: serviceId,
        type: values.type,
        url: values.url,
        path: values.path,
        defaultBranch: values.defaultBranch,
        isPrimary: values.isPrimary
      };

      if (editingRepo) {
        // TODO: 实现更新逻辑
        message.info(t('repository.updateComing'));
      } else {
        await serviceRepositoryAPI.create(data);
        message.success(t('repository.createdSuccess'));
      }

      setModalVisible(false);
      loadRepositories();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.errorFields) {
        message.error(t('serviceForm.pleaseFillFields'));
      } else {
        message.error(t('serviceForm.operationFailed') + ': ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const columns = [
    {
      title: t('repository.type'),
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === 'git' ? 'blue' : 'green'}>{type.toUpperCase()}</Tag>
      )
    },
    {
      title: t('repository.gitRepo'),
      dataIndex: 'type',
      key: 'repository',
      render: (_, record) => (
        <span style={{ fontFamily: 'monospace' }}>
          {record.type === 'git' ? record.url : record.path}
        </span>
      )
    },
    {
      title: t('repository.branch'),
      dataIndex: 'defaultBranch',
      key: 'defaultBranch',
      width: 120
    },
    {
      title: t('repository.primary'),
      dataIndex: 'isPrimary',
      key: 'isPrimary',
      width: 100,
      render: (isPrimary) => isPrimary ? (
        <Tag color="gold" icon={<StarFilled />}>Primary</Tag>
      ) : (
        <Tag color="default">No</Tag>
      )
    },
    {
      title: t('serviceList.actions'),
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          {!record.isPrimary && (
            <Button
              type="link"
              size="small"
              icon={<StarOutlined />}
              onClick={() => handleSetPrimary(record)}
            >
              {t('repository.setAsPrimary')}
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('common.edit')}
          </Button>
          <Popconfirm
            title={t('repository.deleteConfirm')}
            description={t('repository.deleteConfirmDesc')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('serviceList.yes')}
            cancelText={t('serviceList.no')}
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Modal
        title={`${t('repository.manageTitle')} - ${serviceName}`}
        open={visible}
        onCancel={onCancel}
        width={900}
        footer={[
          <Button key="close" onClick={onCancel}>
            {t('common.close')}
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            {t('repository.addTitle')}
          </Button>
        ]}
      >
        <Table
          columns={columns}
          dataSource={repositories}
          loading={loading}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      <Modal
        title={editingRepo ? t('repository.editTitle') : t('repository.addTitle')}
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
            label={t('repository.type')}
            name="type"
            rules={[{ required: true, message: t('repository.typeRequired') }]}
          >
            <Radio.Group onChange={(e) => setRepoType(e.target.value)}>
              <Radio.Button value="git">{t('repository.gitRepo')}</Radio.Button>
              <Radio.Button value="local">{t('repository.localPath')}</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {repoType === 'git' ? (
            <>
              <Form.Item
                label={t('repository.urlLabel')}
                name="url"
                rules={[{ required: true, message: t('repository.urlRequired') }]}
              >
                <Input placeholder={t('repository.urlPlaceholder')} />
              </Form.Item>

              <Form.Item
                label={t('repository.defaultBranch')}
                name="defaultBranch"
              >
                <Select placeholder={t('repository.selectBranch')}>
                  <Option value="main">main</Option>
                  <Option value="master">master</Option>
                  <Option value="develop">develop</Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            <Form.Item
              label={t('repository.pathLabel')}
              name="path"
              rules={[{ required: true, message: t('repository.pathRequired') }]}
            >
              <Input placeholder={t('repository.pathPlaceholder')} />
            </Form.Item>
          )}

          <Form.Item
            name="isPrimary"
            valuePropName="checked"
          >
            <Radio.Group>
              <Radio value={true}>{t('repository.setAsPrimary')}</Radio>
              <Radio value={false}>{t('repository.regularRepository')}</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RepositoryManage;
