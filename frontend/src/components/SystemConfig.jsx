import React from 'react';
import { Modal, Select, Space, message, Typography } from 'antd';
import { SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '../contexts/LanguageContext';

const { Text } = Typography;

const SystemConfig = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageContext();

  console.log('[SystemConfig] 渲染, visible:', visible);
  console.log('[SystemConfig] 当前语言:', currentLanguage);

  const handleLanguageChange = (lng) => {
    // 切换语言
    localStorage.setItem('app-language', lng);
    // 刷新页面以应用新语言
    window.location.reload();
  };

  return (
    <Modal
      title={t('systemConfig.title')}
      open={visible}
      onCancel={onClose}
      width={500}
      footer={[
        <button key="close" onClick={onClose} className="ant-btn ant-btn-default">
          {t('common.close')}
        </button>
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">

        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ fontSize: '16px' }}>
            {t('systemConfig.language')}
          </Text>
        </div>

        <Select
          value={currentLanguage}
          onChange={handleLanguageChange}
          style={{ width: '100%' }}
          size="large"
        >
          <Select.Option value="zh-CN">
            <Space size="small">
              <span>🇨🇳</span>
              <span>{t('systemConfig.simplifiedChinese')}</span>
              {currentLanguage === 'zh-CN' && <CheckCircleOutlined style={{ marginLeft: '8px', color: '#52c41a' }} />}
            </Space>
          </Select.Option>
          <Select.Option value="en-US">
            <Space size="small">
              <span>🇺🇸</span>
              <span>{t('systemConfig.english')}</span>
              {currentLanguage === 'en-US' && <CheckCircleOutlined style={{ marginLeft: '8px', color: '#52c41a' }} />}
            </Space>
          </Select.Option>
        </Select>

        <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {t('systemConfig.systemSettings')}
          </Text>
        </div>

      </Space>
    </Modal>
  );
};

export default SystemConfig;
