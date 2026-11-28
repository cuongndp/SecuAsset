import React, { useState } from 'react';

const INITIAL_TREE = [
  {
    id: 'BLD-A',
    code: 'CS-HQ',
    name: 'Trụ sở chính - Tòa nhà A',
    level: 1,
    assetCount: 142,
    description: 'Khối văn phòng điều hành và trung tâm giám sát an ninh',
    children: [
      {
        id: 'FLR-A1',
        code: 'T1-A',
        name: 'Tầng 1 - Sảnh & Tiếp đón',
        level: 2,
        assetCount: 64,
        description: 'Khu vực ra vào chính, quầy lễ tân và kiểm soát cửa',
        children: [
          { id: 'RM-A101', code: 'P101-LOB', name: 'Sảnh chính cửa xoay', level: 3, assetCount: 28, description: '4 Camera dome, 2 cổng từ kiểm soát thẻ' },
          { id: 'RM-A102', code: 'P102-SEC', name: 'Phòng trực bảo vệ (SOC)', level: 3, assetCount: 36, description: 'Màn hình giám sát trung tâm, tủ báo cháy' },
        ],
      },
      {
        id: 'FLR-AB1',
        code: 'B1-A',
        name: 'Tầng hầm B1 - Kỹ thuật & Bãi xe',
        level: 2,
        assetCount: 78,
        description: 'Hầm để xe nhân viên và phòng hạ tầng mạng',
        children: [
          { id: 'RM-AB101', code: 'B1-SRV', name: 'Phòng Server trung tâm', level: 3, assetCount: 46, description: 'Đầu ghi NVR chính, cảm biến nhiệt & khói chuyên dụng' },
          { id: 'RM-AB102', code: 'B1-PKG', name: 'Lối lên xuống hầm xe', level: 3, assetCount: 32, description: 'Camera nhận diện biển số LPR, barrier tự động' },
        ],
      },
    ],
  },
  {
    id: 'BLD-B',
    code: 'CS-WH',
    name: 'Khu kho vận & Vật tư B',
    level: 1,
    assetCount: 68,
    description: 'Khu vực lưu trữ thiết bị dự phòng và hàng hóa',
    children: [
      {
        id: 'FLR-B1',
        code: 'KV-B1',
        name: 'Khu vực kho chính',
        level: 2,
        assetCount: 68,
        description: 'Toàn bộ mặt bằng kho hàng tầng trệt',
        children: [
          { id: 'RM-B101', code: 'KHO-01', name: 'Cửa xuất nhập hàng số 1', level: 3, assetCount: 40, description: 'Camera góc rộng ngoài trời, cảm biến từ cửa cuốn' },
          { id: 'RM-B102', code: 'KHO-02', name: 'Kho thiết bị an ninh dự phòng', level: 3, assetCount: 28, description: 'Đầu báo khói quang điện, khóa từ vân tay' },
        ],
      },
    ],
  },
];

const LEVEL_BADGE = {
  1: { label: 'Cấp 1 · Cơ sở / Tòa nhà', bg: '#dbeafe', color: '#1d4ed8' },
  2: { label: 'Cấp 2 · Tầng / Khu vực', bg: '#fef3c7', color: '#b45309' },
  3: { label: 'Cấp 3 · Phòng / Điểm đặt', bg: '#dcfce7', color: '#15803d' },
};

export default function LocationTreePage() {
  const [treeData, setTreeData] = useState(INITIAL_TREE);
  const [expandedIds, setExpandedIds] = useState(['BLD-A', 'FLR-A1', 'FLR-AB1', 'BLD-B', 'FLR-B1']);
  const [selectedNodeId, setSelectedNodeId] = useState('BLD-A');
  const [notice, setNotice] = useState('');

  // Form thêm nút mới (Cấp 1 gốc hoặc nút con của nút đang chọn)
  const [addMode, setAddMode] = useState('ROOT'); // 'ROOT' | 'CHILD'
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Tìm nút đang được chọn trong cây 3 cấp
  const findNodeById = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = findNodeById(treeData, selectedNodeId) || treeData[0] || null;

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    const allIds = [];
    treeData.forEach((b) => {
      allIds.push(b.id);
      b.children?.forEach((f) => allIds.push(f.id));
    });
    setExpandedIds(allIds);
  };

  const collapseAll = () => setExpandedIds([]);

  const handleAddNode = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) {
      setNotice('Vui lòng nhập đầy đủ Mã vị trí và Tên vị trí.');
      return;
    }

    const codeUpper = newCode.trim().toUpperCase();

    if (addMode === 'ROOT' || !selectedNode) {
      const newRoot = {
        id: `NODE-${Date.now()}`,
        code: codeUpper,
        name: newName.trim(),
        level: 1,
        assetCount: 0,
        description: newDesc.trim() || 'Chưa có mô tả',
        children: [],
      };
      setTreeData((prev) => [...prev, newRoot]);
      setSelectedNodeId(newRoot.id);
      setNotice(`Đã thêm Cơ sở / Tòa nhà mới "${newRoot.name}" (Cấp 1).`);
    } else {
      if (selectedNode.level >= 3) {
        setNotice('Cây vị trí chỉ hỗ trợ tối đa 3 cấp. Không thể thêm cấp con cho Phòng / Điểm đặt.');
        return;
      }

      const nextLevel = selectedNode.level + 1;
      const newChild = {
        id: `NODE-${Date.now()}`,
        code: codeUpper,
        name: newName.trim(),
        level: nextLevel,
        assetCount: 0,
        description: newDesc.trim() || 'Chưa có mô tả',
        children: [],
      };

      const insertChild = (nodes) =>
        nodes.map((node) => {
          if (node.id === selectedNode.id) {
            return { ...node, children: [...(node.children || []), newChild] };
          }
          if (node.children?.length) {
            return { ...node, children: insertChild(node.children) };
          }
          return node;
        });

      setTreeData((prev) => insertChild(prev));
      if (!expandedIds.includes(selectedNode.id)) {
        setExpandedIds((prev) => [...prev, selectedNode.id]);
      }
      setNotice(`Đã thêm "${newChild.name}" (Cấp ${nextLevel}) trực thuộc "${selectedNode.name}".`);
    }

    setNewCode('');
    setNewName('');
    setNewDesc('');
  };

  const handleDeleteNode = (targetNode) => {
    if (targetNode.children && targetNode.children.length > 0) {
      setNotice(`Không thể xóa "${targetNode.name}" vì vẫn còn ${targetNode.children.length} vị trí con trực thuộc.`);
      return;
    }
    if (targetNode.assetCount > 0) {
      setNotice(`Không thể xóa "${targetNode.name}" vì đang có ${targetNode.assetCount} thiết bị lắp đặt tại đây.`);
      return;
    }

    const removeNode = (nodes) =>
      nodes
        .filter((n) => n.id !== targetNode.id)
        .map((n) => ({
          ...n,
          children: n.children ? removeNode(n.children) : [],
        }));

    const updated = removeNode(treeData);
    setTreeData(updated);
    if (selectedNode?.id === targetNode.id) {
      setSelectedNodeId(updated[0]?.id || null);
    }
    setNotice(`Đã xóa vị trí "${targetNode.name}" khỏi cây phân cấp.`);
  };

  const renderTreeNodes = (nodes) =>
    nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedIds.includes(node.id);
      const isSelected = selectedNode?.id === node.id;
      const badge = LEVEL_BADGE[node.level];

      return (
        <div key={node.id} style={{ marginLeft: node.level === 1 ? 0 : '22px', marginTop: '6px' }}>
          <div
            onClick={() => setSelectedNodeId(node.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              border: isSelected ? '1.5px solid #0f766e' : '1px solid #e2e8f0',
              background: isSelected ? '#f0fdfa' : '#ffffff',
              cursor: 'pointer',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {node.level < 3 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(node.id);
                  }}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    fontWeight: '700',
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  {hasChildren ? (isExpanded ? '−' : '+') : '·'}
                </button>
              ) : (
                <span style={{ width: '24px', textAlign: 'center', color: '#94a3b8' }}>└</span>
              )}

              <span style={{ fontWeight: '700', color: '#0f766e', fontSize: '13px' }}>{node.code}</span>
              <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{node.name}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: badge.bg,
                  color: badge.color,
                }}
              >
                Cấp {node.level}
              </span>
            </div>

            <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap' }}>
              {node.assetCount} thiết bị
            </span>
          </div>

          {hasChildren && isExpanded && (
            <div style={{ borderLeft: '1.5px dashed #cbd5e1', marginLeft: '12px', paddingLeft: '4px' }}>
              {renderTreeNodes(node.children)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      {/* Tiêu đề */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Cây vị trí 3 cấp</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Tổ chức sơ đồ không gian lắp đặt thiết bị theo 3 tầng: Cơ sở/Tòa nhà ➔ Tầng/Khu vực ➔ Phòng/Điểm đặt.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={expandAll}
            style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            Mở rộng tất cả
          </button>
          <button
            type="button"
            onClick={collapseAll}
            style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            Thu gọn tất cả
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

      {/* Bố cục 2 cột: Trái là Cây vị trí, Phải là Chi tiết & Thêm nút */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Cột trái: Cây phân cấp */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '12px', color: '#0f172a' }}>
            Sơ đồ phân cấp khu vực
          </div>
          {treeData.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>Chưa có dữ liệu vị trí nào.</p>
          ) : (
            renderTreeNodes(treeData)
          )}
        </div>

        {/* Cột phải: Thông tin nút đang chọn & Form thêm mới */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Thẻ chi tiết nút đang chọn */}
          {selectedNode && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: LEVEL_BADGE[selectedNode.level].bg,
                    color: LEVEL_BADGE[selectedNode.level].color,
                  }}
                >
                  {LEVEL_BADGE[selectedNode.level].label}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteNode(selectedNode)}
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
                  Xóa vị trí này
                </button>
              </div>

              <h3 style={{ margin: '6px 0', fontSize: '18px' }}>
                [{selectedNode.code}] {selectedNode.name}
              </h3>
              <p style={{ margin: '0 0 12px', color: '#475569', fontSize: '14px' }}>
                {selectedNode.description}
              </p>

              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#334155', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
                <div>
                  <strong>Số thiết bị:</strong> {selectedNode.assetCount}
                </div>
                {selectedNode.level < 3 && (
                  <div>
                    <strong>Vị trí con trực thuộc:</strong> {selectedNode.children?.length || 0}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form thêm vị trí mới */}
          <form
            onSubmit={handleAddNode}
            style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>
              Thêm vị trí vào cây phân cấp
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="addMode"
                  checked={addMode === 'ROOT'}
                  onChange={() => setAddMode('ROOT')}
                />
                Thêm Cơ sở / Tòa nhà mới (Cấp 1)
              </label>

              {selectedNode && selectedNode.level < 3 && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="addMode"
                    checked={addMode === 'CHILD'}
                    onChange={() => setAddMode('CHILD')}
                  />
                  Thêm Cấp {selectedNode.level + 1} vào "{selectedNode.name}"
                </label>
              )}
            </div>

            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Mã vị trí (VD: CS-02, T3-A, P301...)"
              style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Tên vị trí (VD: Tòa nhà C, Tầng 3, Phòng kỹ thuật...)"
              style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Ghi chú / đặc điểm khu vực..."
              style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
            />

            <button
              type="submit"
              style={{
                padding: '9px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#0f766e',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              + Lưu vị trí mới
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}