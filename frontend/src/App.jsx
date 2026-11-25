import React, { useState } from 'react';
import { ADMIN_MENU } from './layouts/MainLayout';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import UsersPage from './pages/admin/UsersPage';

function App() {
  const [currentPath, setCurrentPath] = useState('/admin/users');

  const renderPage = () => {
    switch (currentPath) {
      case '/admin/dashboard':
        return <DashboardAdmin />;
      case '/admin/users':
        return <UsersPage />;
      default:
        return (
          <div style={{ padding: '32px', color: '#475569' }}>
            <h3>Trang đang phát triển ({currentPath})</h3>
            <p>Tính năng này sẽ được hoàn thiện theo kế hoạch các ngày tiếp theo.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Thanh menu bên trái (Sidebar 8 mục) */}
      <aside
        style={{
          width: '250px',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '0 12px 16px', borderBottom: '1px solid #1e293b', marginBottom: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2dd4bf' }}>Guardly Admin</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Vai trò: Quản trị viên</div>
        </div>

        {ADMIN_MENU.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setCurrentPath(item.path)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0f766e' : 'transparent',
                color: isActive ? '#ffffff' : '#cbd5e1',
                fontWeight: isActive ? '600' : '400',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </aside>

      {/* Khu vực nội dung chính bên phải */}
      <main style={{ flex: 1, overflowX: 'auto' }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;