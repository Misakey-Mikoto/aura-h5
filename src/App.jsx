import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ReportPage from './pages/ReportPage'
import './App.css'

function HomePage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Aura H5 测肤应用</h1>
      <div style={{ marginTop: '30px' }}>
        <Link 
          to="/report?id=cmg3x4qpi0002sqt1sj46yvhs" 
          style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#BA813C',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          查看测肤报告示例
        </Link>
      </div>
    </div>
  )
}

function App() {
  const basename = import.meta.env.DEV ? '/' : '/h5';
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
