import React, { useState } from 'react';

const INITIAL_LOGS = [
  {
    id: 'LOG-2026-0891',
    timestamp: '29/11/2026 00:14:22',
    actor: 'admin@guardly.vn',
    role: 'ADMIN',
    module: 'Cây vị trí 3 cấp',
    action: 'CREATE_LOCATION',
    severity: 'INFO',
    ipAddress: '192.168.1.10',
    summary: 'Thêm vị trí Cấp 3 [P103-SRV] Phòng máy chủ phụ trực thuộc Tầng 1',
    detailBefore: 'Chưa tồn tại nút [P103-SRV]',
    detailAfter: '{ code: "P103-SRV", level: 3, parentId: "FLR-A1" }',
  },
  {
    id: 'LOG-2026-0890',
    timestamp: '28/11/2026 22:45:09',
    actor: 'tech.minh@guardly.vn',
    role: 'TECHNICIAN',
    module: 'Thiết bị & Sự cố',
    action: 'UPDATE_STATUS',
    severity: 'WARNING',
    ipAddress: '192.168.1.42',
    summary: 'Chuyển trạng thái Camera PTZ cổng Bắc từ ACTIVE sang BROKEN',
    detailBefore: '{ assetCode: "CAM-014", status: "ACTIVE" }',
    detailAfter: '{ assetCode: "CAM-014", status: "BROKEN", note: "Mất tín hiệu PoE" }',
  },
  {
    id: 'LOG-2026-0889',
    timestamp: '28/11/2026 21:18:54',
    actor: 'unknown (guest)',
    role: 'GUEST',
    module: 'Xác thực & Bảo mật',
    action: 'LOGIN_FAILED',
    severity: 'CRITICAL',
    ipAddress: '103.48.192.77',
    summary: 'Đăng nhập thất bại liên tiếp 5 lần vào tài khoản admin@guardly.vn',
    detailBefore: 'failedAttempts: 4',
    detailAfter: 'failedAttempts: 5 -> Tạm khóa phiên đăng nhập 15 phút',
  },
  {
    id: 'LOG-2026-0888',
    timestamp: '28/11/2026 19:05:31',
    actor: 'admin@guardly.vn',
    role: 'ADMIN',
    module: 'Phân quyền hệ thống',
    action: 'UPDATE_PERMISSION',
    severity: 'WARNING',
    ipAddress: '192.168.1.10',
    summary: 'Cập nhật quyền xóa thiết bị cho vai trò ASSET_MANAGER',
    detailBefore: '{ role: "ASSET_MANAGER", canDeleteAsset: true }',
    detailAfter: '{ role: "ASSET_MANAGER", canDeleteAsset: false }',
  },
  {
    id: 'LOG-2026-0887',
    timestamp: '28/11/2026 16:30:12',
    actor: 'asset.lan@guardly.vn',
    role: 'ASSET_MANAGER',
    module: 'Danh mục & Vị trí',
    action: 'IMPORT_ASSETS',
    severity: 'INFO',
    ipAddress: '192.168.1.25',
    summary: 'Nhập mới 12 đầu báo khói quang điện vào danh mục CAT-FIRE',
    detailBefore: 'CAT-FIRE totalAssets: 40',
    detailAfter: 'CAT-FIRE totalAssets: 52',
  },
  {
    id: 'LOG-2026-0886',
    timestamp: '28/11/2026 14:11:03',
    actor: 'admin@guardly.vn',
    role: 'ADMIN',
    module: 'Nhãn trạng thái',
    action: 'CREATE_STATUS_LABEL',
    severity: 'INFO',
    ipAddress: '192.168.1.10',
    summary: 'Tạo nhãn trạng thái mới [STANDBY] Dự phòng trong kho',
    detailBefore: 'Tổng số nhãn: 4',
    detailAfter: '{ code: "STANDBY", color: "BLUE", enabled: true }',
  },
];

const SEVERITY_STYLE = {
  INFO: { label: 'Thông tin', bg: '#dbeafe', color: '#1d4ed8' },
  WARNING: { label: 'Cảnh báo', bg: '#fef3c7', color: '#b45309' },
  CRITICAL: { label: 'Nghiêm trọng', bg: '#fee2e2', color: '#b91c1c' },
};

export default function AuditLogsPage() {
  const [logs] = useState(INITIAL_LOGS);
  const [searchText, setSearchText] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(INITIAL_LOGS[0]);
  const [notice, setNotice] = useState('');

  const modules = ['ALL', ...Array.from(new Set(logs.map((l) => l.module)))];

  const filteredLogs = logs.filter((log) => {
    const matchSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    const kw = searchText.trim().toLowerCase();
    const matchKeyword =
      !kw ||
      log.id.toLowerCase().includes(kw) ||
      log.actor.toLowerCase().includes(kw) ||
      log.ipAddress.toLowerCase().includes(kw) ||
      log.summary.toLowerCase().includes(kw) ||
      log.action.toLowerCase().includes(kw);

    return matchSeverity && matchModule && matchKeyword;
  });

  const handleExportCsv = () => {
    setNotice(`Đã xuất ${filteredLogs.length} bản ghi nhật ký hệ thống ra tệp audit_logs_2026.csv.`);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {/* Tiêu đề & Nút xuất báo cáo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Nhật ký hệ thống (Audit Logs)</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Truy vết toàn bộ hoạt động quản trị, biến động trạng thái thiết bị và cảnh báo truy cập bảo mật.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          style={{
            padding: '9px 16px',
            borderRadius: '8px',
            border: 'none',
            background: '#0f766e',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ↓ Xuất nhật ký (CSV)
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

      {/* Thanh bộ lọc */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '14px 16px',
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
          placeholder="Tìm theo mã log, email, IP hoặc nội dung thao tác..."
          style={{ flex: '2 1 260px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
        />

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{ flex: '1 1 160px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
        >
          <option value="ALL">Tất cả mức độ</option>
          <option value="INFO">Thông tin (INFO)</option>
          <option value="WARNING">Cảnh báo (WARNING)</option>
          <option value="CRITICAL">Nghiêm trọng (CRITICAL)</option>
        </select>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          style={{ flex: '1 1 190px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#ffffff' }}
        >
          {modules.map((mod) => (
            <option key={mod} value={mod}>
              {mod === 'ALL' ? 'Tất cả phân hệ' : mod}
            </option>
          ))}
        </select>

        {(searchText || severityFilter !== 'ALL' || moduleFilter !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setSearchText('');
              setSeverityFilter('ALL');
              setModuleFilter('ALL');
            }}
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
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Bảng danh sách nhật ký */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflowX: 'auto', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Thời gian</th>
              <th style={{ padding: '12px 16px' }}>Mức độ</th>
              <th style={{ padding: '12px 16px' }}>Người thực hiện</th>
              <th style={{ padding: '12px 16px' }}>Phân hệ</th>
              <th style={{ padding: '12px 16px' }}>Nội dung thao tác</th>
              <th style={{ padding: '12px 16px' }}>Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '28px 16px', textAlign: 'center', color: '#64748b' }}>
                  Không có bản ghi nhật ký nào khớp với điều kiện lọc.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const sev = SEVERITY_STYLE[log.severity] || SEVERITY_STYLE.INFO;
                const isSelected = selectedLog?.id === log.id;
                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: isSelected ? '#f0fdfa' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: '#475569', fontSize: '13px' }}>
                      {log.timestamp}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: sev.bg,
                          color: sev.color,
                        }}
                      >
                        {sev.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{log.actor}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{log.role}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155', fontWeight: '500' }}>{log.module}</td>
                    <td style={{ padding: '12px 16px', color: '#1e293b' }}>{log.summary}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#475569' }}>
                      {log.ipAddress}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Khung xem chi tiết bản ghi đang chọn */}
      {selectedLog && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>
              Chi tiết truy vết: {selectedLog.id} · Mã hành động: <span style={{ color: '#0f766e' }}>{selectedLog.action}</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Bấm vào một dòng bất kỳ trên bảng để đối chiếu dữ liệu</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>DỮ LIỆU TRƯỚC THAY ĐỔI</div>
              <code style={{ fontSize: '13px', color: '#334155', wordBreak: 'break-word' }}>{selectedLog.detailBefore}</code>
            </div>
            <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f766e', marginBottom: '4px' }}>DỮ LIỆU SAU THAY ĐỔI</div>
              <code style={{ fontSize: '13px', color: '#0f172a', wordBreak: 'break-word' }}>{selectedLog.detailAfter}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}