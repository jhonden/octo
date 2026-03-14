import React, { useState } from 'react'
import './Dock.css'

/**
 * Dock Navigation Component
 * Mac OS-style dock with fan-shaped sub-menus
 */
const Dock = ({ currentPage, onPageChange }) => {
  const [hoveredMenu, setHoveredMenu] = useState(null)

  // Menu items configuration
  const menuItems = [
    {
      key: 'dashboard',
      icon: '📊',
      label: '仪表盘',
    },
    {
      key: 'services',
      icon: '📚',
      label: '服务知识',
      hasSubmenu: true,
      submenu: [
        { key: 'services-list', icon: '📋', label: '服务列表' },
        { key: 'services-topology', icon: '🕸️', label: '服务拓扑' },
        { key: 'services-dependency', icon: '🔗', label: '依赖分析' },
        { key: 'services-search', icon: '🔍', label: '服务搜索' },
      ],
    },
    {
      key: 'spaces',
      icon: '💼',
      label: '设计空间',
    },
    {
      key: 'skills',
      icon: '⚙️',
      label: '技能管理',
    },
    {
      key: 'mcp',
      icon: '🔌',
      label: 'MCP 集成',
    },
  ]

  // Calculate fan position for submenu items
  const calculateFanPosition = (index, totalItems) => {
    const fanRadius = 100 // Distance from parent menu
    const fanAngle = 120 // Total spread angle in degrees
    const startAngle = -60 // Start angle in degrees (from vertical up)

    // Calculate angle for this item
    const angle = startAngle + (index * (fanAngle / (totalItems - 1)))

    // Convert to radians and calculate position
    const radians = (angle * Math.PI) / 180
    const x = Math.sin(radians) * fanRadius
    const y = -Math.cos(radians) * fanRadius // Negative for upward direction

    return { x, y, angle }
  }

  // Handle menu item click
  const handleMenuClick = (menuItem) => {
    if (menuItem.hasSubmenu) {
      // Don't change page for items with submenus
      return
    }
    onPageChange(menuItem.key)
  }

  // Handle submenu item click
  const handleSubmenuClick = (submenuKey, e) => {
    e.stopPropagation() // Prevent parent menu click
    onPageChange(submenuKey)
  }

  return (
    <div className="dock">
      {menuItems.map((menuItem) => (
        <div
          key={menuItem.key}
          className={`dock-item ${menuItem.hasSubmenu ? 'has-submenu' : ''} ${currentPage === menuItem.key ? 'active' : ''}`}
          onMouseEnter={() => setHoveredMenu(menuItem.key)}
          onMouseLeave={() => setHoveredMenu(null)}
          onClick={() => handleMenuClick(menuItem)}
        >
          {/* Icon */}
          <div className="dock-icon">{menuItem.icon}</div>

          {/* Label */}
          <div className="dock-label">{menuItem.label}</div>

          {/* Fan-shaped submenu */}
          {menuItem.hasSubmenu && menuItem.submenu && (
            <div className="dock-fan-menu">
              {menuItem.submenu.map((subItem, index) => {
                const { x, y } = calculateFanPosition(index, menuItem.submenu.length)
                return (
                  <div
                    key={subItem.key}
                    className={`dock-fan-item ${currentPage === subItem.key ? 'active' : ''}`}
                    style={{
                      transform: hoveredMenu === menuItem.key
                        ? `translate(${x}px, ${y}px)`
                        : 'translate(0px, 0px)',
                    }}
                    onClick={(e) => handleSubmenuClick(subItem.key, e)}
                  >
                    <div className="dock-fan-icon">{subItem.icon}</div>
                    <div className="dock-fan-label">{subItem.label}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Dock
