import React, { useState } from 'react';

const COLOR_PRESETS = [
  { key: 'GREEN', label: 'Xanh lá (Hoạt động)', bg: '#dcfce7', text: '#15803d' },
  { key: 'AMBER', label: 'Vàng cam (Bảo trì)', bg: '#fef3c7', text: '#b45309' },
  { key: 'RED', label: 'Đỏ (Sự cố / Hỏng)', bg: '#fee2e2', text: '#b91c1c' },
  { key: 'BLUE', label: 'Xanh dương (Chờ bàn giao)', bg: '#dbeafe', text: '#1d4ed8' },
  { key: 'SLATE', label: 'Xám (Lưu kho / Thanh lý)', bg: '#f1f5f9', text: '#475569' },
];

const INITIAL_STATUSES = [
  {
    id: 1,
    code: 'ACTIVE',
    name: 'Đang hoạt động',
    colorKey: 'GREEN',
    description: 'Thiết bị vận hành bình thường tại vị trí lắp đặt',
    assetCount: 198,
    isSystem: true,
    enabled: true,
  },
  {
    id: 2,
    code: 'MAINTENANCE',
    name: 'Đang bảo trì',
    colorKey: 'AMBER',
    description: 'Thiết bị đang trong lịch kiểm tra, bảo dưỡng định kỳ',
    assetCount: 24,
    isSystem: true,
    enabled: true,
  },
  {
    id: 3,
    code: 'BROKEN',
    name: 'Hỏng / Chờ sửa',
    colorKey: 'RED',
    description: 'Thiết bị gặp sự cố kỹ thuật, mất tín hiệu hoặc hư hỏng',
    assetCount: 12,
    isSystem: true,
    enabled: true,
  },
  {
    id: 4,
    code: 'STANDBY',
    name: 'Dự phòng trong kho',
    colorKey: 'BLUE',
    description: 'Thiết bị mới nhập hoặc dự phòng sẵn sàng thay thế',
    assetCount: 14,
    isSystem: false,
    enabled: true,
  },
  {
    id: 5,
    code: 'DISPOSED',
    name: 'Đã thanh lý',
    colorKey: 'SLATE',
    description: 'Thiết bị hết vòng đời sử dụng, đã loại khỏi vận hành',
    assetCount: 0,
    isSystem: false,
    enabled: false,
  },
];

export default function StatusLabelsPage() {
  const [statuses, setStatuses] = useState(INITIAL_STATUSES);
  const [searchText, setSearchText] = useState('');
  const [notice, setNotice] = useState('');

  // Form thêm / sửa nhãn trạng thái
  const [editingId, setEditingId] = useState(null);
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState('GREEN');
  const [formDesc, setFormDesc] = useState('');

  const getColorStyle = (colorKey) =>
    COLOR_PRESETS.find((c) => c.key === colorKey) || COLOR_PRESETS[0];

  const filteredStatuses = statuses.filter((item) => {
    const kw = searchText.trim().toLowerCase();
    if (!kw) return true;
    return (
      item.code.toLowerCase().includes(kw) ||
      item.name.toLowerCase().includes(kw) ||
      item.description.toLowerCase().includes(kw)
    );
  });

  const resetForm = () => {
    setEditingId(null);
    setFormCode('');
    setFormName('');
    setFormColor('GREEN');
    setFormDesc('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) {
      setNotice('Vui lòng nhập đầy đủ Mã trạng thái và Tên hiển thị.');
      return;
    }

    const normalizedCode = formCode.trim().toUpperCase();

    if (editingId) {
      setStatuses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                code: item.isSystem ? item.code : normalizedCode,
                name: formName.trim(),
                colorKey: formColor,
                description: formDesc.trim(),
              }
            : item
        )
      );
      setNotice(`Đã cập nhật nhãn trạng thái "${formName.trim()}".`);
    } else {
      if (statuses.some((s) => s.code === normalizedCode)) {
        setNotice(`Mã trạng thái "${normalizedCode}" đã tồn tại trong hệ thống.`);
        return;
      }
      const newItem = {
        id: Date.now(),
        code: normalizedCode,
        name: formName.trim(),
        colorKey: formColor,
        description: formDesc.trim() || 'Chưa có mô tả',
        assetCount: 0,
        isSystem: false,
        enabled: true,
      };
      setStatuses((prev) => [newItem, ...prev]);
      setNotice(`Đã thêm nhãn trạng thái mới "${newItem.name}".`);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormCode(item.code);
    setFormName(item.name);
    setFormColor(item.colorKey);
    setFormDesc(item.description);
    setNotice('');
  };

  const handleToggleEnabled = (item) => {
    if (item.isSystem && item.enabled) {
      setNotice(`Không thể tắt nhãn mặc định hệ thống "${item.name}".`);
      return;
    }
    const nextEnabled = !item.enabled;
    setStatuses((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, enabled: nextEnabled } : s))
    );
    setNotice(
      `Đã ${nextEnabled ? 'kích hoạt' : 'tạm ngưng'} nhãn trạng thái "${item.name}".`
    );
  };

  const handleDelete = (item) => {
    if (item.isSystem) {
      setNotice(`Không thể xóa nhãn mặc định hệ thống "${item.name}".`);
      return;
    }
    if (item.assetCount > 0) {
      setNotice(`Không thể xóa "${item.name}" vì đang có ${item.assetCount} thiết bị mang trạng thái này.`);
      return;
    }
    setStatuses((prev) => prev.filter((s) => s.id !== item.id));
    setNotice(`Đã xóa nhãn trạng thái "${item.name}".`);
  };

  const previewColor = getColorStyle(formColor);

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {/* Tiêu đề */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>Nhãn trạng thái thiết bị</h2>
        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
          Cấu hình danh mục trạng thái vòng đời thiết bị an ninh và màu sắc nhận diện trên toàn hệ thống.
        </p>
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

      {/* Form Thêm / Cập nhật nhãn */}
      <form
        onSubmit={handleSubmit}
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
          placeholder="Mã (VD: PENDING_CHECK)"
          style={{ flex: '1 1 150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
        />
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Tên hiển thị nhãn..."
          style={{ flex: '1 1 180px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
        />
        <select
          value={formColor}
          onChange={(e) => setFormColor(e.target.value)}
          style={{ flex: '1 1 180px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
        >
          {COLOR_PRESETS.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={formDesc}
          onChange={(e) => setFormDesc(e.target.value)}
          placeholder="Mô tả ý nghĩa trạng thái..."
          style={{ flex: '2 1 220px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
        />

        {/* Xem trước huy hiệu màu */}
        <span
          style={{
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '700',
            background: previewColor.bg,
            color: previewColor.text,
          }}
        >
          {formName.trim() || 'Xem trước nhãn'}
        </span>

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
          {editingId ? 'Lưu cập nhật' : '+ Thêm nhãn'}
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
          placeholder="Tìm kiếm nhãn theo mã, tên hoặc mô tả..."
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

      {/* Bảng danh sách nhãn trạng thái */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Mã trạng thái</th>
              <th style={{ padding: '12px 16px' }}>Huy hiệu hiển thị</th>
              <th style={{ padding: '12px 16px' }}>Mô tả</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Thiết bị áp dụng</th>
              <th style={{ padding: '12px 16px' }}>Phân loại</th>
              <th style={{ padding: '12px 16px' }}>Hiệu lực</th>
              <th style={{ padding: '12px 16px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStatuses.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '28px 16px', textAlign: 'center', color: '#64748b' }}>
                  Không tìm thấy nhãn trạng thái phù hợp.
                </td>
              </tr>
            ) : (
              filteredStatuses.map((item) => {
                const badge = getColorStyle(item.colorKey);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: '#334155' }}>
                      {item.code}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: badge.bg,
                          color: badge.text,
                        }}
                      >
                        {item.name}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{item.description}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>
                      {item.assetCount}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#64748b' }}>
                      {item.isSystem ? 'Mặc định hệ thống' : 'Tùy chỉnh'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: item.enabled ? '#dcfce7' : '#f1f5f9',
                          color: item.enabled ? '#15803d' : '#64748b',
                        }}
                      >
                        {item.enabled ? 'Đang bật' : 'Đã tắt'}
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
                          onClick={() => handleToggleEnabled(item)}
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
                          {item.enabled ? 'Tắt' : 'Bật'}
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