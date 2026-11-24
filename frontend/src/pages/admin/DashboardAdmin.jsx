import React, { useState } from 'react';

export default function DashboardAdmin() {
  const [stats] = useState([
    { id: 1, label: 'Tổng thiết bị', value: 248, color: '#0f766e', note: 'Toàn hệ thống' },
    { id: 2, label: 'Đang sử dụng', value: 186, color: '#15803d', note: 'Chiếm 75.0%' },
    { id: 3, label: 'Đang bảo trì', value: 24, color: '#d97706', note: 'Chiếm 9.7%' },
    { id: 4, label: 'Thiết bị hỏng', value: 12, color: '#dc2626', note: 'Cần xử lý gấp' },
  ]);

  const [categoryChart] = useState([
    { id: 'CAM', name: 'Camera giám sát', count: 98 },
    { id: 'FIRE', name: 'Cảm biến báo cháy', count: 52 },
    { id: 'INTR', name: 'Chống đột nhập', count: 42 },
    { id: 'COMM', name: 'Thiết bị truyền tin', count: 36 },
    { id: 'NVR', name: 'Máy chủ ghi hình', count: 20 },
  ]);

  const [recentLogs] = useState([
    { id: 10245, user: 'admin', action: 'UPDATE', target: 'Assets #15', time: '24/11/2026 09:25' },
    { id: 10244, user: 'manager01', action: 'CREATE', target: 'Assets #248', time: '24/11/2026 08:40' },
    { id: 10243, user: 'tech02', action: 'UPDATE', target: 'Maintenance #89', time: '23/11/2026 16:15' },
  ]);

  const [maintenanceAlerts] = useState([
    { id: 1, code: 'CAM-T3-01', name: 'Camera IP cổng chính', location: 'Tòa A - Tầng 1', due: 'Quá hạn 5 ngày' },
    { id: 2, code: 'NVR-T1-01', name: 'Đầu ghi hình NVR', location: 'Tòa A - Phòng Server', due: 'Quá hạn 2 ngày' },
    { id: 3, code: 'UPS-T1-02', name: 'Bộ lưu điện UPS', location: 'Tòa A - Tầng 1', due: 'Còn 3 ngày' },
  ]);

  const maxCount = Math.max(...categoryChart.map((item) => item.count), 1);

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>Tổng quan hệ thống (Admin)</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
          Theo dõi nhanh tình trạng thiết bị an ninh, cảnh báo bảo trì và hoạt động hệ thống.
        </p>
      </div>

      {/* 4 thẻ số liệu */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px',
              borderTop: `4px solid ${item.color}`,
            }}
          >
            <div style={{ fontSize: '13px', color: '#64748b' }}>{item.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0 4px' }}>{item.value}</div>
            <div style={{ fontSize: '12px', color: item.color }}>{item.note}</div>
          </div>
        ))}
      </div>

      {/* Biểu đồ cột cơ cấu thiết bị theo danh mục */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Số lượng thiết bị theo danh mục</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '180px', paddingTop: '20px' }}>
          {categoryChart.map((bar) => {
            const heightPercent = Math.round((bar.count / maxCount) * 140);
            return (
              <div key={bar.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>{bar.count}</span>
                <div
                  style={{
                    width: '48px',
                    height: `${heightPercent}px`,
                    backgroundColor: '#0f766e',
                    borderRadius: '6px 6px 0 0',
                  }}
                />
                <span style={{ fontSize: '12px', color: '#475569', marginTop: '8px', textAlign: 'center' }}>
                  {bar.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 bảng tóm tắt */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Bảng 1: Cảnh báo bảo trì */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Cảnh báo bảo trì gần hạn</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '8px' }}>Mã TS</th>
                <th style={{ padding: '8px' }}>Thiết bị</th>
                <th style={{ padding: '8px' }}>Trạng thái hạn</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceAlerts.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                    Không có thiết bị cần bảo trì
                  </td>
                </tr>
              ) : (
                maintenanceAlerts.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px', fontWeight: '600', color: '#0f766e' }}>{row.code}</td>
                    <td style={{ padding: '8px' }}>{row.name}</td>
                    <td style={{ padding: '8px', color: '#dc2626' }}>{row.due}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bảng 2: Nhật ký hoạt động gần đây */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Nhật ký hệ thống gần đây</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '8px' }}>Người dùng</th>
                <th style={{ padding: '8px' }}>Hành động</th>
                <th style={{ padding: '8px' }}>Đối tượng</th>
                <th style={{ padding: '8px' }}>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
                    Chưa có dữ liệu nhật ký
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px', fontWeight: '600' }}>{log.user}</td>
                    <td style={{ padding: '8px' }}>{log.action}</td>
                    <td style={{ padding: '8px' }}>{log.target}</td>
                    <td style={{ padding: '8px', color: '#64748b' }}>{log.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}