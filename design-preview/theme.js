// Refined Industrial Theme for Microservice Knowledge Manager
// 深邃的工业主义美学 - 类似于 VS Code 的主题语言

export const refinedIndustrialTheme = {
  'algorithm': true, // 启用暗色算法

  // 色彩系统
  'colorPrimary': '#3b82f6', // 电光蓝 - 代码高亮的蓝色
  'colorInfo': '#10b981', // 荧光绿 - 成功状态
  'colorSuccess': '#22c55e',
  'colorWarning': '#f59e0b', // 琥珀色 - 警告状态
  'colorError': '#ef4444', // 绯红 - 错误状态
  'colorBgBase': '#0d1117', // 深邃黑 - VS Code 风格
  'colorBgContainer': '#161b22', // 容器背景 - 稍亮的深灰
  'colorBgElevated': '#1e293b', // 浮层背景
  'colorBorder': '#334155', // 边框颜色 - 铁灰色
  'colorText': '#e2e8f0', // 主要文字 - 雾白
  'colorTextSecondary': '#94a3b8', // 次要文字 - 铁灰蓝
  'colorTextTertiary': '#64748b', // 三级文字 - 更深的铁灰蓝

  // 特殊强调色
  'colorAccent': '#06b6d4', // 青色 - 用于高亮重要元素
  'colorHighlight': '#a855f7', // 紫色 - 用于次要强调

  // 排版
  'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  'fontFamilyCode': '"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',

  // 圆角 - 微妙的圆角，不要太圆
  'borderRadius': 8,
  'borderRadiusLG': 12,

  // 间距 - 比默认更宽松
  'padding': 16,
  'paddingLG': 24,
  'paddingXL': 32,

  // 阴影 - 精致的深色阴影
  'boxShadow':
    '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',

  // 组件自定义
  'components': {
    'Layout': {
      'headerBg': '#0d1117',
      'siderBg': '#161b22',
    },
    'Menu': {
      'darkItemBg': 'transparent',
      'darkItemSelectedBg': '#1e293b',
      'darkItemHoverBg': '#1e293b',
    },
    'Button': {
      'colorPrimary': '#3b82f6',
      'colorPrimaryHover': '#2563eb',
      'primaryShadow': '0 0 0 0 2px rgba(59, 130, 246, 0.3)',
    },
    'Card': {
      'colorBgContainer': '#161b22',
      'colorBorderSecondary': '#334155',
    },
  },
};

export const colors = {
  // 主色调
  primary: '#3b82f6',      // 电光蓝
  secondary: '#10b981',    // 荧光绿
  accent: '#06b6d4',        // 青色
  highlight: '#a855f7',     // 紫色

  // 背景色
  background: {
    base: '#0d1117',       // 深邃黑
    container: '#161b22',    // 容器
    elevated: '#1e293b',    // 浮层
    hover: '#1f2937',       // 悬停
  },

  // 文字色
  text: {
    primary: '#e2e8f0',      // 主要
    secondary: '#94a3b8',   // 次要
    tertiary: '#64748b',     // 三级
    inverse: '#0d1117',     // 反色（深色背景上的文字）
  },

  // 功能色
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // 边框色
  border: {
    default: '#334155',
    focus: '#3b82f6',
    divider: '#1e293b',
  },
};

// 渐变
export const gradients = {
  primary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  accent: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  subtle: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
};

// 阴影效果
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.15)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.2)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)', // 发光效果
};
