import React, { useState } from 'react';

const ROLES = [
  { key: 'ADMIN', label: 'ADMIN (Quản trị viên)', badgeColor: '#0f766e', badgeBg: '#ccfbf1' },
  { key: 'ASSET_MANAGER', label: 'ASSET_MANAGER (Quản lý tài sản)', badgeColor: '#1d4ed8', badgeBg: '#dbeafe' },
  { key: 'TECHNICIAN', label: 'TECHNICIAN (Kỹ thuật viên)', badgeColor: '#b45309', badgeBg: '#fef3c7' },
];

const INITIAL_PERMISSIONS = [
  {
    id: 'asset_view',
    group: 'Quản lý thiết bị an ninh',
    name: 'Xem danh sách & chi tiết thiết bị',
    ADMIN: true,
    ASSET_MANAGER: true,
    TECHNICIAN: true,
  },
  {
    id: 'asset_edit',
    group: 'Quản lý thiết bị an ninh',
    name: 'Thêm mới, cập nhật & điều chuyển thiết bị',
    ADMIN: true,
    ASSET_MANAGER: true,
    TECHNICIAN: false,
  },
  {
    id: 'asset_delete',
    group: 'Quản lý thiết bị an ninh',
    name: 'Thanh lý / Xóa hồ sơ thiết bị',
    ADMIN: true,
    ASSET_MANAGER: false,
    TECHNICIAN: false,
  },
  {
    id: 'maint_plan',
    group: 'Bảo trì & Xử lý sự cố',
    name: 'Lập kế hoạch & phân công phiếu bảo trì',
    ADMIN: true,
    ASSET_MANAGER: true,
    TECHNICIAN: false,
  },
  {
    id: 'maint_execute',
    group: 'Bảo trì & Xử lý sự cố',
    name: 'Cập nhật kết quả kiểm tra & sửa chữa thiết bị',
    ADMIN: true,
    ASSET_MANAGER: true,
    TECHNICIAN: true,
  },
  {
    id: 'user_manage',
    group: 'Người dùng & Phân quyền',
    name: 'Quản lý tài khoản, khóa/mở khóa & đặt lại mật khẩu',
    ADMIN: true,
    ASSET_MANAGER: false,
    TECHNICIAN: false,
  },
  {
    id: 'role_matrix',
    group: 'Người dùng & Phân quyền',
    name: 'Thay đổi ma trận phân quyền hệ thống',
    ADMIN: true,
    ASSET_MANAGER: false,
    TECHNICIAN: false,
  },
  {
    id: 'system_audit',
    group: 'Hệ thống & Nhật ký',
    name: 'Xem nhật ký hệ thống & cấu hình chung',
    ADMIN: true,
    ASSET_MANAGER: false,
    TECHNICIAN: false,
  },
];

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [notice, setNotice] = useState('');

  const groups = ['ALL', ...Array.from(new Set(INITIAL_PERMISSIONS.map((p) => p.group)))];

  const filteredPermissions =
    selectedGroup === 'ALL'
      ? permissions
      : permissions.filter((item) => item.group === selectedGroup);

  // Bật / tắt quyền cho vai trò (khóa không cho tự gỡ quyền ADMIN để tránh mất quyền quản trị)
  const handleTogglePermission = (permId, roleKey) => {
    if (roleKey === 'ADMIN') {
      setNotice('Vai trò ADMIN luôn giữ toàn quyền hệ thống để đảm bảo an toàn vận hành.');
      return;
    }

    setPermissions((prev) =>
      prev.map((item) =>
        item.id === permId ? { ...item, [roleKey]: !item[roleKey] } : item
      )
    );
    setNotice('');
  };

  const handleSaveChanges = () => {
    setNotice('Đã lưu cấu hình ma trận phân quyền hệ thống thành công.');
  };

  const handleResetDefault = () => {
    setPermissions(INITIAL_PERMISSIONS);
    setNotice('Đã khôi phục ma trận phân quyền về mặc định ban đầu.');
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {/* Tiêu đề & nút thao tác */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Phân quyền hệ thống</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Thiết lập ma trận quyền hạn truy cập chức năng theo từng vai trò người dùng.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleResetDefault}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Khôi phục mặc định
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#0f766e',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Lưu phân quyền
          </button>
        </div>
      </div>

      {/* Thông báo thao tác */}
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
            style={{
              background: 'transparent',
              border: 'none',
              color: '#065f46',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Bộ lọc theo nhóm chức năng */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        {groups.map((grp) => {
          const active = selectedGroup === grp;
          return (
            <button
              key={grp}
              type="button"
              onClick={() => setSelectedGroup(grp)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: active ? '#0f766e' : '#cbd5e1',
                background: active ? '#0f766e' : '#ffffff',
                color: active ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {grp === 'ALL' ? 'Tất cả nhóm chức năng' : grp}
            </button>
          );
        })}
      </div>

      {/* Bảng ma trận phân quyền */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '14px 16px' }}>Nhóm chức năng</th>
              <th style={{ padding: '14px 16px' }}>Quyền hạn chi tiết</th>
              {ROLES.map((role) => (
                <th key={role.key} style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background: role.badgeBg,
                      color: role.badgeColor,
                    }}
                  >
                    {role.key}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPermissions.map((perm) => (
              <tr key={perm.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                  {perm.group}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1e293b' }}>
                  {perm.name}
                </td>
                {ROLES.map((role) => {
                  const checked = perm[role.key];
                  const isAdmin = role.key === 'ADMIN';
                  return (
                    <td key={role.key} style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isAdmin}
                        onChange={() => handleTogglePermission(perm.id, role.key)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#0f766e',
                          cursor: isAdmin ? 'not-allowed' : 'pointer',
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}