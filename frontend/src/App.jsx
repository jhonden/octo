import React, { useState } from 'react'
import Dock from './components/Dock'
import ServiceKnowledge from './pages/ServiceKnowledge'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handlePageChange = (page) => {
    console.log('Navigating to:', page)
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'services':
      case 'services-list':
        return <ServiceKnowledge />
      case 'dashboard':
      default:
        return (
          <div style={{ padding: '24px' }}>
            <h1>Octo - 设计工作空间</h1>
            <p>当前页面: {currentPage}</p>
          </div>
        )
    }
  }

  return (
    <div className="App">
      {/* Main content area */}
      <div className="main-content">
        {renderPage()}
      </div>

      {/* Dock Navigation */}
      <Dock currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  )
}

export default App
