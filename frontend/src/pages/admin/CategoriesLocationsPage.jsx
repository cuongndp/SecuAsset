import React, { useState } from 'react';

const INITIAL_CATEGORIES = [
  { id: 1, code: 'CAT-CAM', name: 'Camera giám sát', assetCount: 98, status: 'ACTIVE', description: 'Camera IP, PTZ, hồng ngoại trong nhà và ngoài trời' },
  { id: 2, code: 'CAT-FIRE', name: 'Cảm biến báo cháy', assetCount: 52, status: 'ACTIVE', description: 'Đầu báo khói, báo nhiệt, nút nhấn khẩn cấp' },
  { id: 3, code: 'CAT-INT', name: 'Chống đột nhập', assetCount: 42, status: 'ACTIVE', description: 'Cảm biến chuyển động PIR, từ cửa, còi hú' },
  { id: 4, code: 'CAT-NET', name: 'Thiết bị truyền tin', assetCount: 36, status: 'ACTIVE', description: 'Switch PoE, bộ chuyển đổi quang điện, router' },
  { id: 5, code: 'CAT-NVR', name: 'Máy chủ ghi hình', assetCount: 20, status: 'INACTIVE', description: 'Đầu ghi NVR/DVR lưu trữ dữ liệu hình ảnh' },
];

const INITIAL_LOCATIONS = [
  { id: 1, code: 'LOC-GATE', name: 'Cổng chính & Bãi xe', area: 'Khu vực ngoài trời', assetCount: 45, status: 'ACTIVE' },
  { id: 2, code: 'LOC-T1', name: 'Tầng 1 - Sảnh lễ tân', area: 'Tòa nhà A', assetCount: 64, status: 'ACTIVE' },
  { id: 3, code: 'LOC-T2', name: 'Tầng 2 - Khu văn phòng', area: 'Tòa nhà A', assetCount: 58, status: 'ACTIVE' },
  { id: 4, code: 'LOC-SRV', name: 'Phòng Server trung tâm', area: 'Tầng hầm B1', assetCount: 31, status: 'ACTIVE' },
  { id: 5, code: 'LOC-WH', name: 'Kho vật tư cũ', area: 'Nhà kho B', assetCount: 12, status: 'INACTIVE' },
];

export default function CategoriesLocationsPage() {
  const [activeTab, setActiveTab] = useState('CATEGORIES'); // 'CATEGORIES' | 'LOCATIONS'
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);

  const [searchText, setSearchText] = useState('');
  const [notice, setNotice] = useState('');

  // Form thêm / sửa nhanh
  const [editingId, setEditingId] = useState(null);
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formExtra, setFormExtra] = useState(''); // Mô tả (Danh mục) hoặc Khu vực (Vị trí)

  const isCatTab = activeTab === 'CATEGORIES';
  const currentList = isCatTab ? categories : locations;

  const filteredList = currentList.filter((item) => {
    const kw = searchText.trim().toLowerCase();
    if (!kw) return true;
    return (
      item.code.toLowerCase().includes(kw) ||
      item.name.toLowerCase().includes(kw) ||
      (isCatTab ? item.description : item.area).toLowerCase().includes(kw)
    );
  });

  const resetForm = () => {
    setEditingId(null);
    setFormCode('');
    setFormName('');
    setFormExtra('');
  };

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
    setSearchText('');
    setNotice('');
    resetForm();
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) {
      setNotice('Vui lòng nhập đầy đủ Mã và Tên trước khi lưu.');
      return;
    }

    if (isCatTab) {
      if (editingId) {
        setCategories((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? { ...item, code: formCode.trim().toUpperCase(), name: formName.trim(), description: formExtra.trim() }
              : item
          )
        );
        setNotice(`Đã cập nhật danh mục "${formName.trim()}".`);
      } else {
        const newItem = {
          id: Date.now(),
          code: formCode.trim().toUpperCase(),
          name: formName.trim(),
          description: formExtra.trim() || 'Chưa có mô tả',
          assetCount: 0,
          status: 'ACTIVE',
        };
        setCategories((prev) => [newItem, ...prev]);
        setNotice(`Đã thêm danh mục mới "${newItem.name}".`);
      }
    } else {
      if (editingId) {
        setLocations((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? { ...item, code: formCode.trim().toUpperCase(), name: formName.trim(), area: formExtra.trim() }
              : item
          )
        );
        setNotice(`Đã cập nhật vị trí "${formName.trim()}".`);
      } else {
        const newItem = {
          id: Date.now(),
          code: formCode.trim().toUpperCase(),
          name: formName.trim(),
          area: formExtra.trim() || 'Khu vực chung',
          assetCount: 0,
          status: 'ACTIVE',
        };
        setLocations((prev) => [newItem, ...prev]);
        setNotice(`Đã thêm vị trí mới "${newItem.name}".`);
      }
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormCode(item.code);
    setFormName(item.name);
    setFormExtra(isCatTab ? item.description : item.area);
    setNotice('');
  };

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (isCatTab) {
      setCategories((prev) => prev.map((c) => (c.id === item.id ? { ...c, status: nextStatus } : c)));
    } else {
      setLocations((prev) => prev.map((l) => (l.id === item.id ? { ...l, status: nextStatus } : l)));
    }
    setNotice(`Đã chuyển trạng thái "${item.name}" sang ${nextStatus === 'ACTIVE' ? 'Đang dùng' : 'Ngừng dùng'}.`);
  };

  const handleDelete = (item) => {
    if (item.assetCount > 0) {
      setNotice(`Không thể xóa "${item.name}" vì đang có ${item.assetCount} thiết bị trực thuộc.`);
      return;
    }
    if (isCatTab) {
      setCategories((prev) => prev.filter((c) => c.id !== item.id));
    } else {
      setLocations((prev) => prev.filter((l) => l.id !== item.id));
    }
    setNotice(`Đã xóa "${item.name}" khỏi hệ thống.`);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {/* Tiêu đề */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>Danh mục & Vị trí</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
          Quản lý phân loại thiết bị an ninh và các khu vực, vị trí lắp đặt trong hệ thống.
        </p>
      </div>

      {/* Chuyển Tab */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => handleSwitchTab('CATEGORIES')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: isCatTab ? '3px solid #0f766e' : '3px solid transparent',
            background: 'transparent',
            color: isCatTab ? '#0f766e' : '#64748b',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Danh mục thiết bị ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => handleSwitchTab('LOCATIONS')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: !isCatTab ? '3px solid #0f766e' : '3px solid transparent',
            background: 'transparent',
            color: !isCatTab ? '#0f766e' : '#64748b',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Vị trí lắp đặt ({locations.length})
        </button>
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

      {/* Form Thêm / Cập nhật nhanh */}
      <form
        onSubmit={handleSubmitForm}
        style={{
          background: '#ffffff',
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
          value={formCode}
          onChange={(e) => setFormCode(e.target.value)}
          placeholder={isCatTab ? 'Mã danh mục (VD: CAT-ACC)' : 'Mã vị trí (VD: LOC-T3)'}
          style={{ flex: '1 1 160px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
        />
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder={isCatTab ? 'Tên danh mục thiết bị...' : 'Tên vị trí lắp đặt...'}
          style={{ flex: '1 1 220px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
        />
        <input
          type="text"
          value={formExtra}
          onChange={(e) => setFormExtra(e.target.value)}
          placeholder={isCatTab ? 'Mô tả ngắn...' : 'Thuộc tòa nhà / khu vực...'}
          style={{ flex: '2 1 260px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#0f766e',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {editingId ? 'Lưu cập nhật' : '+ Thêm mới'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#475569',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Hủy sửa
          </button>
        )}
      </form>

      {/* Ô tìm kiếm */}
      <div style={{ marginBottom: '14px' }}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={isCatTab ? 'Tìm kiếm danh mục theo mã, tên, mô tả...' : 'Tìm kiếm vị trí theo mã, tên, khu vực...'}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '14px',
            background: '#ffffff',
          }}
        />
      </div>

      {/* Bảng dữ liệu */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Mã</th>
              <th style={{ padding: '12px 16px' }}>{isCatTab ? 'Tên danh mục' : 'Tên vị trí'}</th>
              <th style={{ padding: '12px 16px' }}>{isCatTab ? 'Mô tả' : 'Khu vực trực thuộc'}</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Số thiết bị</th>
              <th style={{ padding: '12px 16px' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '28px 16px', textAlign: 'center', color: '#64748b' }}>
                  Không tìm thấy dữ liệu phù hợp.
                </td>
              </tr>
            ) : (
              filteredList.map((item) => {
                const isActive = item.status === 'ACTIVE';
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0f766e' }}>{item.code}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{item.name}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      {isCatTab ? item.description : item.area}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>
                      {item.assetCount}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: isActive ? '#dcfce7' : '#f1f5f9',
                          color: isActive ? '#15803d' : '#64748b',
                        }}
                      >
                        {isActive ? 'Đang dùng' : 'Ngừng dùng'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#0f766e',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          {isActive ? 'Ngừng dùng' : 'Kích hoạt'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #fca5a5',
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Xóa
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