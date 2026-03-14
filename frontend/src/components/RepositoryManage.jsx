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
import { serviceRepositoryAPI } from '../api/api';

const { Option } = Select;

/**
 * 仓库管理弹窗组件
 */
const RepositoryManage = ({ visible, serviceId, serviceName, onCancel, onSuccess }) => {
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
      message.error('Failed to load repositories: ' + (error.response?.data?.message || error.message));
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
      message.success('Repository deleted successfully');
      loadRepositories();
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error('Failed to delete repository: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSetPrimary = async (record) => {
    try {
      await serviceRepositoryAPI.setPrimary(record.id, serviceId);
      message.success('Primary repository set successfully');
      loadRepositories();
    } catch (error) {
      message.error('Failed to set primary repository: ' + (error.response?.data?.message || error.message));
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
        message.info('Update functionality coming soon');
      } else {
        await serviceRepositoryAPI.create(data);
        message.success('Repository created successfully');
      }

      setModalVisible(false);
      loadRepositories();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in required fields');
      } else {
        message.error('Operation failed: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === 'git' ? 'blue' : 'green'}>{type.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Repository',
      dataIndex: 'type',
      key: 'repository',
      render: (_, record) => (
        <span style={{ fontFamily: 'monospace' }}>
          {record.type === 'git' ? record.url : record.path}
        </span>
      )
    },
    {
      title: 'Branch',
      dataIndex: 'defaultBranch',
      key: 'defaultBranch',
      width: 120
    },
    {
      title: 'Primary',
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
      title: 'Actions',
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
              Set Primary
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this repository?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Modal
        title={`Manage Repositories - ${serviceName}`}
        open={visible}
        onCancel={onCancel}
        width={900}
        footer={[
          <Button key="close" onClick={onCancel}>
            Close
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Repository
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
        title={editingRepo ? 'Edit Repository' : 'Add New Repository'}
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
            label="Repository Type"
            name="type"
            rules={[{ required: true, message: 'Please select repository type' }]}
          >
            <Radio.Group onChange={(e) => setRepoType(e.target.value)}>
              <Radio.Button value="git">Git Repository</Radio.Button>
              <Radio.Button value="local">Local Path</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {repoType === 'git' ? (
            <>
              <Form.Item
                label="Git Repository URL"
                name="url"
                rules={[{ required: true, message: 'Please enter Git repository URL' }]}
              >
                <Input placeholder="https://github.com/username/repository.git" />
              </Form.Item>

              <Form.Item
                label="Default Branch"
                name="defaultBranch"
              >
                <Select placeholder="Select branch (optional)">
                  <Option value="main">main</Option>
                  <Option value="master">master</Option>
                  <Option value="develop">develop</Option>
                </Select>
              </Form.Item>
            </>
          ) : (
            <Form.Item
              label="Local Path"
              name="path"
              rules={[{ required: true, message: 'Please enter local path' }]}
            >
              <Input placeholder="/Users/username/code/service" />
            </Form.Item>
          )}

          <Form.Item
            name="isPrimary"
            valuePropName="checked"
          >
            <Radio.Group>
              <Radio value={true}>Set as Primary Repository</Radio>
              <Radio value={false}>Regular Repository</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RepositoryManage;
