import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Progress,
  Tag,
  Card,
  Descriptions,
  message,
  Spin
} from 'antd';
import {
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  DatabaseOutlined,
  SettingOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

/**
 * 服务知识分析组件
 */
const KnowledgeAnalysis = () => {
  const [services, setServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [analyses, setAnalyses] = useState({});
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/service-knowledge`);
      setServices(response.data);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const loadAnalyses = async (serviceIds) => {
    try {
      const responses = await Promise.all(
        serviceIds.map(id =>
          axios.get(`${API_BASE}/api/service-knowledge/analysis/${id}`)
        )
      );
      const analysesMap = {};
      responses.forEach((response, index) => {
        analysesMap[serviceIds[index]] = response.data;
      });
      setAnalyses(analysesMap);
    } catch (error) {
      console.error('Failed to load analyses:', error);
    }
  };

  const handleStartAnalysis = async () => {
    if (selectedServiceIds.length === 0) {
      message.warning('Please select at least one service');
      return;
    }

    setAnalyzing(true);
    try {
      await axios.post(`${API_BASE}/api/service-knowledge/analysis/analyze`, {
        serviceIds: selectedServiceIds
      });

      message.success('Analysis started successfully');

      // 开始轮询进度
      const interval = setInterval(() => {
        loadAnalyses(selectedServiceIds);
      }, 2000);

      // 5分钟后停止轮询
      setTimeout(() => {
        clearInterval(interval);
        setAnalyzing(false);
      }, 300000);
    } catch (error) {
      message.error('Failed to start analysis: ' + (error.response?.data?.message || error.message));
      setAnalyzing(false);
    }
  };

  const handleViewDetail = (serviceId) => {
    const analysis = analyses[serviceId];
    if (analysis) {
      setSelectedAnalysis(analysis);
      setDetailVisible(true);
    } else {
      message.info('Analysis not completed yet');
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { icon: <ClockCircleOutlined />, color: 'default', text: 'Pending' },
      in_progress: { icon: <PlayCircleOutlined />, color: 'processing', text: 'In Progress' },
      completed: { icon: <CheckCircleOutlined />, color: 'success', text: 'Completed' },
      failed: { icon: <CloseCircleOutlined />, color: 'error', text: 'Failed' }
    };

    const s = statusMap[status] || statusMap.pending;
    return (
      <Tag icon={s.icon} color={s.color}>
        {s.text}
      </Tag>
    );
  };

  const getStepIcon = (stepName) => {
    const iconMap = {
      '代码下载': <DatabaseOutlined />,
      '代码扫描': <ApiOutlined />,
      'API提取': <ApiOutlined />,
      '依赖分析': <ApiOutlined />,
      '配置提取': <SettingOutlined />,
      '生成文档': <FileTextOutlined />,
      '入库': <DatabaseOutlined />
    };
    return iconMap[stepName] || <FileTextOutlined />;
  };

  const getStepStatusTag = (status) => {
    const colorMap = {
      pending: 'default',
      in_progress: 'processing',
      completed: 'success',
      failed: 'error'
    };
    return <Tag color={colorMap[status]}>{status}</Tag>;
  };

  const calculateProgress = (steps) => {
    if (!steps || steps.length === 0) return 0;

    const completedCount = steps.filter(s => s.status === 'completed').length;
    return Math.round((completedCount / steps.length) * 100);
  };

  const serviceColumns = [
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
      sorter: (a, b) => a.serviceName.localeCompare(b.serviceName)
    },
    {
      title: 'Status',
      dataIndex: 'id',
      key: 'status',
      width: 150,
      render: (_, record) => {
        const analysis = analyses[record.id];
        if (analysis) {
          return getStatusTag(analysis.status);
        }
        return <Tag color="default">Not Analyzed</Tag>;
      }
    },
    {
      title: 'Progress',
      dataIndex: 'id',
      key: 'progress',
      width: 200,
      render: (_, record) => {
        const analysis = analyses[record.id];
        if (analysis && analysis.steps) {
          const progress = calculateProgress(analysis.steps);
          return <Progress percent={progress} status={analysis.status === 'completed' ? 'success' : 'active'} />;
        }
        return <Progress percent={0} />;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            onClick={() => handleViewDetail(record.id)}
          >
            View Details
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Spin spinning={loading} tip="Loading services...">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              Knowledge Analysis
            </h2>
            <Space>
              <Button
                type="primary"
                onClick={handleStartAnalysis}
                loading={analyzing}
                disabled={selectedServiceIds.length === 0}
                icon={<PlayCircleOutlined />}
              >
                Start Analysis
              </Button>
              <Button
                onClick={loadServices}
                icon={<DatabaseOutlined />}
              >
                Refresh
              </Button>
            </Space>
          </div>

          <Table
            columns={serviceColumns}
            dataSource={services}
            rowSelection={{
              selectedRowKeys: selectedServiceIds,
              onChange: setSelectedServiceIds
            }}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true
            }}
          />
        </Space>

        {/* 分析详情弹窗 */}
        <Modal
          title={`Analysis Details - ${selectedAnalysis?.serviceName || ''}`}
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          width={800}
          footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>
              Close
            </Button>
          ]}
        >
          {selectedAnalysis && (
            <Descriptions bordered column={1} style={{ marginTop: '16px' }}>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedAnalysis.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Start Time">
                {selectedAnalysis.startTime}
              </Descriptions.Item>
              <Descriptions.Item label="End Time">
                {selectedAnalysis.endTime || 'In Progress...'}
              </Descriptions.Item>
              <Descriptions.Item label="Confidence">
                {selectedAnalysis.confidence ? `${selectedAnalysis.confidence}%` : '-'}
              </Descriptions.Item>

              {selectedAnalysis.errorMessage && (
                <Descriptions.Item label="Error">
                  <Tag color="error">{selectedAnalysis.errorMessage}</Tag>
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Steps" span={2}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  {selectedAnalysis.steps && selectedAnalysis.steps.map((step, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                      <span style={{ marginRight: 12 }}>{getStepIcon(step.stepName)}</span>
                      <span style={{ flex: 1 }}>{step.description}</span>
                      <span>{getStepStatusTag(step.status)}</span>
                    </div>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Spin>
    </div>
  );
};

export default KnowledgeAnalysis;
