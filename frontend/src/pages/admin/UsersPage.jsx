import React, { useState } from 'react';

const INITIAL_USERS = [
  {
    id: 1,
    username: 'admin',
    fullName: 'Nguyễn Văn Quản Trị',
    email: 'admin@guardly.vn',
    role: 'ADMIN',
    status: 'ACTIVE',
  },
  {
    id: 2,
    username: 'manager01',
    fullName: 'Trần Thị Thu Hà',
    email: 'ha.tran@guardly.vn',
    role: 'ASSET_MANAGER',
    status: 'ACTIVE',
  },
  {
    id: 3,
    username: 'tech01',
    fullName: 'Lê Hoàng Nam',
    email: 'nam.le@guardly.vn',
    role: 'TECHNICIAN',
    status: 'ACTIVE',
  },
  {
    id: 4,
    username: 'tech02',
    fullName: 'Phạm Minh Tuấn',
    email: 'tuan.pham@guardly.vn',
    role: 'TECHNICIAN',
    status: 'LOCKED',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notice, setNotice] = useState('');

  // Lọc danh sách theo từ khóa, vai trò và trạng thái
  const filteredUsers = users.filter((user) => {
    const keyword = searchText.trim().toLowerCase();
    const matchKeyword =
      !keyword ||
      user.username.toLowerCase().includes(keyword) ||
      user.fullName.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword);

    const matchRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || user.status === statusFilter;

    return matchKeyword && matchRole && matchStatus;
  });

  // Thao tác 1: Khóa / Mở khóa tài khoản
  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    setUsers((prev) =>
      prev.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item))
    );
    setNotice(
      `Đã ${nextStatus === 'LOCKED' ? 'khóa' : 'mở khóa'} tài khoản "${user.username}".`
    );
  };

  // Thao tác 2: Đổi vai trò trực tiếp trên dòng
  const handleChangeRole = (user, newRole) => {
    setUsers((prev) =>
      prev.map((item) => (item.id === user.id ? { ...item, role: newRole } : item))
    );
    setNotice(`Đã đổi vai trò của "${user.username}" thành ${newRole}.`);
  };

  // Thao tác 3: Đặt lại mật khẩu
  const handleResetPassword = (user) => {
    setNotice(`Đã đặt lại mật khẩu mặc định (Guardly@123) cho tài khoản "${user.username}".`);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {/* Tiêu đề trang */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>Quản lý người dùng</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
          Quản lý tài khoản đăng nhập, phân bổ vai trò, khóa/mở khóa và đặt lại mật khẩu.
        </p>
      </div>

      {/* Thông báo thao tác (nếu có) */}
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

      {/* Thanh tìm kiếm & bộ lọc */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Tìm theo tên đăng nhập, họ tên, email..."
          style={{
            flex: '1 1 240px',
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            background: '#fff',
          }}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="ADMIN">ADMIN (Quản trị viên)</option>
          <option value="ASSET_MANAGER">ASSET_MANAGER (Quản lý tài sản)</option>
          <option value="TECHNICIAN">TECHNICIAN (Kỹ thuật viên)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            background: '#fff',
          }}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="LOCKED">Đã khóa</option>
        </select>

        {(searchText || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: '8px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              background: '#f8fafc',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Bảng danh sách người dùng */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Tên đăng nhập</th>
              <th style={{ padding: '12px 16px' }}>Họ tên</th>
              <th style={{ padding: '12px 16px' }}>Email</th>
              <th style={{ padding: '12px 16px' }}>Vai trò</th>
              <th style={{ padding: '12px 16px' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                  Không tìm thấy người dùng nào phù hợp với điều kiện lọc.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isActive = user.status === 'ACTIVE';
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f766e' }}>
                      {user.username}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{user.fullName}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{user.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user, e.target.value)}
                        style={{
                          padding: '5px 8px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '13px',
                          background: '#fff',
                        }}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="ASSET_MANAGER">ASSET_MANAGER</option>
                        <option value="TECHNICIAN">TECHNICIAN</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: isActive ? '#dcfce7' : '#fee2e2',
                          color: isActive ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid',
                            borderColor: isActive ? '#fca5a5' : '#86efac',
                            background: isActive ? '#fef2f2' : '#f0fdf4',
                            color: isActive ? '#dc2626' : '#15803d',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {isActive ? 'Khóa' : 'Mở khóa'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResetPassword(user)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#fff',
                            color: '#334155',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          Đặt lại mật khẩu
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}