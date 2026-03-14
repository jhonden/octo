import React, { useState } from 'react'
import Dock from './components/Dock'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handlePageChange = (page) => {
    console.log('Navigating to:', page)
    setCurrentPage(page)
  }

  return (
    <div className="App">
      {/* Main content area */}
      <div className="main-content">
        <h1>Octo - 设计工作空间</h1>
        <p>当前页面: {currentPage}</p>
      </div>

      {/* Dock Navigation */}
      <Dock currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  )
}

export default App
