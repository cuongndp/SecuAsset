import React, { useState } from 'react';

const DEFAULT_SETTINGS = {
  // 1. Thông tin hệ thống
  systemName: 'Guardly SecuAsset Enterprise',
  organizationName: 'Ban Quản lý Hạ tầng & An ninh Tập đoàn',
  supportEmail: 'soc-support@guardly.vn',
  timezone: 'Asia/Ho_Chi_Minh (GMT+7)',

  // 2. Bảo mật & Phiên đăng nhập
  sessionTimeoutMinutes: 30,
  maxFailedLogins: 5,
  lockoutDurationMinutes: 15,
  enforceStrongPassword: true,
  requireTwoFactorAdmin: false,

  // 3. Cảnh báo & Giám sát thiết bị
  offlineAlertMinutes: 5,
  maintenanceReminderDays: 7,
  enableEmailAlerts: true,
  enableDashboardSound: false,

  // 4. Sao lưu & Bảo trì
  autoBackupFrequency: 'DAILY',
  logRetentionDays: 90,
  maintenanceMode: false,
};

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [notice, setNotice] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState('29/11/2026 00:20:00');

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!settings.systemName.trim() || !settings.supportEmail.trim()) {
      setNotice('Vui lòng nhập đầy đủ Tên hệ thống và Email hỗ trợ kỹ thuật.');
      return;
    }
    const now = new Date();
    const formatted = now.toLocaleString('vi-VN');
    setLastSavedAt(formatted);
    setNotice('Đã lưu toàn bộ cấu hình hệ thống thành công.');
  };

  const handleResetDefault = () => {
    setSettings(DEFAULT_SETTINGS);
    setNotice('Đã khôi phục các thông số về giá trị mặc định ban đầu.');
  };

  const handleManualBackup = () => {
    setNotice('Đã khởi tạo bản sao lưu cấu hình & danh mục hệ thống (backup_guardly_2026.json).');
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {/* Tiêu đề & Nút thao tác nhanh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Cấu hình chung hệ thống</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Thiết lập thông tin vận hành, chính sách bảo mật đăng nhập, ngưỡng cảnh báo thiết bị và sao lưu dữ liệu.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleManualBackup}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Sao lưu ngay
          </button>
          <button
            type="button"
            onClick={handleResetDefault}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Khôi phục mặc định
          </button>
        </div>
      </div>

      {/* Thông báo */}
      {notice && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
          }}
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice('')}
            style={{ background: 'transparent', border: 'none', color: '#065f46', fontWeight: '700', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Cảnh báo chế độ bảo trì nếu đang bật */}
      {settings.maintenanceMode && (
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            color: '#92400e',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Chế độ bảo trì đang BẬT: Chỉ tài khoản Quản trị viên (ADMIN) mới có thể đăng nhập vào hệ thống.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px', marginBottom: '20px' }}>
          {/* Khối 1: Thông tin định danh hệ thống */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              1. Thông tin định danh & Đơn vị
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Tên hiển thị hệ thống
              </label>
              <input
                type="text"
                value={settings.systemName}
                onChange={(e) => handleChange('systemName', e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Đơn vị chủ quản
              </label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => handleChange('organizationName', e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Email đầu mối hỗ trợ kỹ thuật (SOC)
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Múi giờ chuẩn hệ thống
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
              >
                <option value="Asia/Ho_Chi_Minh (GMT+7)">Asia/Ho_Chi_Minh (GMT+7)</option>
                <option value="UTC (GMT+0)">UTC (GMT+0)</option>
              </select>
            </div>
          </div>

          {/* Khối 2: Chính sách bảo mật & Đăng nhập */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              2. Chính sách bảo mật & Phiên làm việc
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                  Hết phiên sau (phút)
                </label>
                <input
                  type="number"
                  min={5}
                  max={480}
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => handleChange('sessionTimeoutMinutes', Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                  Số lần sai mật khẩu tối đa
                </label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={settings.maxFailedLogins}
                  onChange={(e) => handleChange('maxFailedLogins', Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Thời gian khóa tạm tài khoản khi nhập sai quá số lần (phút)
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={settings.lockoutDurationMinutes}
                onChange={(e) => handleChange('lockoutDurationMinutes', Number(e.target.value))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
              <input
                type="checkbox"
                checked={settings.enforceStrongPassword}
                onChange={(e) => handleChange('enforceStrongPassword', e.target.checked)}
              />
              Bắt buộc mật khẩu mạnh (tối thiểu 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.requireTwoFactorAdmin}
                onChange={(e) => handleChange('requireTwoFactorAdmin', e.target.checked)}
              />
              Yêu cầu xác thực 2 bước (2FA) đối với tài khoản Quản trị viên
            </label>
          </div>

          {/* Khối 3: Ngưỡng cảnh báo thiết bị an ninh */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              3. Ngưỡng cảnh báo & Giám sát thiết bị
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Cảnh báo mất kết nối thiết bị sau (phút)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.offlineAlertMinutes}
                onChange={(e) => handleChange('offlineAlertMinutes', Number(e.target.value))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Nhắc lịch bảo trì định kỳ trước (ngày)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={settings.maintenanceReminderDays}
                onChange={(e) => handleChange('maintenanceReminderDays', Number(e.target.value))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}>
              <input
                type="checkbox"
                checked={settings.enableEmailAlerts}
                onChange={(e) => handleChange('enableEmailAlerts', e.target.checked)}
              />
              Gửi email thông báo tự động khi có sự cố thiết bị mức Nghiêm trọng
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enableDashboardSound}
                onChange={(e) => handleChange('enableDashboardSound', e.target.checked)}
              />
              Phát âm thanh cảnh báo trên màn hình giám sát trung tâm (SOC)
            </label>
          </div>

          {/* Khối 4: Sao lưu & Chế độ bảo trì */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              4. Lưu trữ nhật ký & Bảo trì hệ thống
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Tần suất sao lưu dữ liệu tự động
              </label>
              <select
                value={settings.autoBackupFrequency}
                onChange={(e) => handleChange('autoBackupFrequency', e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
              >
                <option value="DAILY">Hàng ngày (02:00 sáng)</option>
                <option value="WEEKLY">Hàng tuần (Chủ nhật)</option>
                <option value="MANUAL">Chỉ sao lưu thủ công</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                Thời gian lưu giữ Nhật ký hệ thống (ngày)
              </label>
              <input
                type="number"
                min={30}
                max={365}
                value={settings.logRetentionDays}
                onChange={(e) => handleChange('logRetentionDays', Number(e.target.value))}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div style={{ marginTop: '6px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#b45309', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                />
                Kích hoạt Chế độ bảo trì toàn hệ thống
              </label>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', paddingLeft: '22px' }}>
                Tạm khóa truy cập của Quản lý tài sản và Kỹ thuật viên để nâng cấp dữ liệu.
              </div>
            </div>
          </div>
        </div>

        {/* Thanh lưu cấu hình dưới cùng */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Lần cập nhật cấu hình gần nhất: <strong>{lastSavedAt}</strong>
          </span>

          <button
            type="submit"
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: 'none',
              background: '#0f766e',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Lưu toàn bộ cấu hình
          </button>
        </div>
      </form>
    </div>
  );
}