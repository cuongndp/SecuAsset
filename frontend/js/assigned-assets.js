// ===== Trạng thái =====
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);

const STATUS = {
  IN_USE:      { label: 'Đang sử dụng', cls: 'badge--ok' },
  MAINTENANCE: { label: 'Đang bảo trì', cls: 'badge--tech' },
  BROKEN:      { label: 'Hỏng',         cls: 'badge--admin' },
  IN_STOCK:    { label: 'Trong kho',    cls: 'badge--off' },
};

let users = [];
let current = null;
let assets = [];
let schedules = [];
let hit = params.get('asset') || '';    // mã tài sản cần làm nổi bật (đến từ ô tra cứu)

// ===== Ô hiển thị theo hạn =====
function warrantyCell(iso) {
  if (!iso) return '—';
  const d = daysUntil(iso);
  if (d < 0) return `${fmtDay(iso)} <span class="badge badge--admin">Hết hạn</span>`;
  if (d <= 30) return `${fmtDay(iso)} <span class="badge badge--tech">Còn ${d} ngày</span>`;
  return fmtDay(iso);
}
function dueBadge(iso) {
  const d = daysUntil(iso);
  if (d < 0) return '<span class="badge badge--admin">Quá hạn</span>';
  if (d <= 7) return '<span class="badge badge--tech">Sắp đến hạn</span>';
  return '<span class="badge badge--manager">Đã lên lịch</span>';
}

// ===== Chuyển tab =====
function setTab(name) {
  document.querySelectorAll('.tab').forEach((t) => {
    const on = t.dataset.tab === name;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on);
  });
  ['info', 'assets', 'schedules'].forEach((n) => { $('panel-' + n).hidden = n !== name; });
  if (name === 'assets') {
    const row = document.querySelector('tr.is-hit');
    if (row) row.scrollIntoView({ block: 'center' });
  }
}
document.querySelector('.tabs').addEventListener('click', (e) => {
  const t = e.target.closest('.tab');
  if (t) setTab(t.dataset.tab);
});

// ===== Tab Thông tin =====
function renderInfo() {
  const u = current;
  const role = ROLE_INFO[u.role] || { label: u.role, cls: '' };
  const n = (code) => assets.filter((a) => a.status === code).length;
  const warn = assets.filter((a) => a.warrantyUntil && daysUntil(a.warrantyUntil) <= 30).length;

  $('infoList').innerHTML = `
    <div class="row"><dt>Họ tên</dt><dd>${esc(u.fullName)}</dd></div>
    <div class="row"><dt>Tên đăng nhập</dt><dd>${esc(u.username)}</dd></div>
    <div class="row"><dt>Vai trò</dt><dd><span class="badge ${role.cls}">${esc(role.label)}</span></dd></div>
    <div class="row"><dt>Email</dt><dd>${esc(u.email) || '—'}</dd></div>
    <div class="row"><dt>Điện thoại</dt><dd>${fmtPhone(u.phone)}</dd></div>
    <div class="row"><dt>Tài sản được giao</dt><dd>${assets.length
      ? `${assets.length} thiết bị · <a href="#assets" data-goto="assets">Xem danh sách</a>` : 'Chưa được giao tài sản nào'}</dd></div>
    <div class="row"><dt>Đang sử dụng</dt><dd>${n('IN_USE')}</dd></div>
    <div class="row"><dt>Đang bảo trì hoặc hỏng</dt><dd>${n('MAINTENANCE') + n('BROKEN')}</dd></div>
    <div class="row"><dt>Bảo hành sắp hết hoặc đã hết</dt><dd>${warn}</dd></div>
    <div class="row"><dt>Lịch bảo trì</dt><dd>${schedules.length
      ? `${schedules.length} việc · <a href="#schedules" data-goto="schedules">Xem lịch</a>` : 'Không có'}</dd></div>
    <div class="row"><dt>Lần đăng nhập cuối</dt><dd>${fmtDate(u.lastLogin)}</dd></div>`;

  $('sidePane').innerHTML = `
    <div class="avatar" aria-hidden="true">${esc(initials(u.fullName))}</div>
    <div class="name">${esc(u.fullName)}</div>
    <div class="sub">${esc(u.username)}</div>
    <a class="btn btn--primary" href="${PAGE.profile(u.id)}">Xem hồ sơ</a>
    <button type="button" class="btn btn--outline" data-goto="assets">Xem tài sản được giao</button>`;
}
$('panel-info').addEventListener('click', (e) => {
  const g = e.target.closest('[data-goto]');
  if (!g) return;
  e.preventDefault();
  setTab(g.dataset.goto);
});

// ===== Tab Tài sản =====
function filteredAssets() {
  const q = $('assetQ').value.trim().toLowerCase();
  const st = $('assetStatus').value;
  return assets.filter((a) =>
    (!st || a.status === st) &&
    (!q || `${a.assetCode} ${a.name} ${a.serialNumber || ''}`.toLowerCase().includes(q)));
}

function renderAssets() {
  const list = filteredAssets();
  $('assetCount').textContent = `${list.length}/${assets.length} tài sản`;
  $('assetBody').innerHTML = list.length
    ? list.map((a) => {
        const st = STATUS[a.status] || { label: a.status, cls: '' };
        return `<tr class="${a.assetCode === hit ? 'is-hit' : ''}">
          <td class="mono">${esc(a.assetCode)}</td>
          <td>${esc(a.name)}</td>
          <td>${esc(a.category)}</td>
          <td>${esc(a.location || '—')}</td>
          <td class="mono">${esc(a.serialNumber || '—')}</td>
          <td><span class="badge ${st.cls}">${esc(st.label)}</span></td>
          <td>${warrantyCell(a.warrantyUntil)}</td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="7" class="empty">${assets.length ? 'Không có tài sản khớp bộ lọc.' : 'Chưa được giao tài sản nào.'}</td></tr>`;
}
$('assetQ').addEventListener('input', renderAssets);
$('assetStatus').addEventListener('change', renderAssets);

// Xuất CSV (mở được bằng Excel). Ô bắt đầu bằng = + - @ được thêm dấu ' để tránh bị chạy như công thức.
$('csvBtn').addEventListener('click', () => {
  const cell = (v) => {
    let s = String(v ?? '');
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const head = ['Mã tài sản', 'Tên tài sản', 'Danh mục', 'Vị trí', 'Số serial', 'Hãng', 'Model', 'Trạng thái', 'Hạn bảo hành'];
  const rows = filteredAssets().map((a) => [
    a.assetCode, a.name, a.category, a.location, a.serialNumber, a.brand, a.model,
    (STATUS[a.status] || {}).label || a.status, fmtDay(a.warrantyUntil),
  ]);
  const csv = [head, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `tai-san-${current.username}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

$('printBtn').addEventListener('click', () => window.print());

// ===== Tab Lịch bảo trì =====
function renderSchedules() {
  $('panel-schedules').innerHTML = schedules.length
    ? `<div class="table-wrap"><table>
        <thead><tr><th>Mã tài sản</th><th>Tên tài sản</th><th>Công việc</th><th>Chu kỳ</th><th>Hạn kế tiếp</th></tr></thead>
        <tbody>${schedules.slice().sort((a, b) => a.nextDue.localeCompare(b.nextDue)).map((s) => `
          <tr><td class="mono">${esc(s.assetCode)}</td><td>${esc(s.assetName)}</td><td>${esc(s.task)}</td>
          <td>${esc(s.frequency)}</td><td>${fmtDay(s.nextDue)} ${dueBadge(s.nextDue)}</td></tr>`).join('')}
        </tbody></table></div>`
    : '<div class="empty">Không có lịch bảo trì nào cho các tài sản này.</div>';
}

// ===== Nạp dữ liệu của một người dùng =====
async function loadUser(id) {
  current = users.find((u) => u.id === id);
  try {
    [assets, schedules] = await Promise.all([dataApi.assetsOf(id), dataApi.schedulesOf(id)]);
  } catch (err) {
    assets = [];
    schedules = [];
    toast('error', 'Không tải được danh sách tài sản. Vui lòng thử lại.');
  }
  $('bcProfile').href = PAGE.profile(id);
  $('assetTitle').textContent = 'Tài sản được giao cho ' + current.fullName;
  $('assetQ').value = '';
  $('assetStatus').value = '';
  $('cntAssets').textContent = assets.length;
  $('cntSched').textContent = schedules.length;
  renderInfo();
  renderAssets();
  renderSchedules();
}

$('userSelect').addEventListener('change', async (e) => {
  const id = Number(e.target.value);
  hit = '';
  history.replaceState(null, '', PAGE.assigned(id));
  await loadUser(id);
});

// ===== Khởi động =====
(async function init() {
  if (!SESSION) return;
  try {
    users = await dataApi.listUsers();
  } catch (err) {
    toast('error', 'Không tải được dữ liệu người dùng.');
    return;
  }

  $('assetStatus').innerHTML = '<option value="">Tất cả trạng thái</option>' +
    Object.entries(STATUS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');

  // Người cần xem lấy từ địa chỉ: assigned.html?id=2. Không phải quản trị viên thì chỉ xem của mình.
  const wanted = Number(params.get('id')) || ME_ID;
  const startId = IS_ADMIN && users.some((u) => u.id === wanted) ? wanted : ME_ID;

  if (IS_ADMIN) {
    $('viewAs').hidden = false;
    $('userSelect').innerHTML = users
      .map((u) => `<option value="${u.id}"${u.id === startId ? ' selected' : ''}>${esc(u.fullName)}${u.id === ME_ID ? ' (Tôi)' : ''}</option>`)
      .join('');
  }

  await loadUser(startId);
  if (hit || location.hash === '#assets') setTab('assets');
  else if (location.hash === '#schedules') setTab('schedules');
})();