// ===== Cấu hình =====
const USE_MOCK = true;                 // true: xem giao diện khi chưa có API. Khi API chạy, đổi thành false
const API_BASE = '/api';               // nginx chuyển tiếp /api sang container api (Hình 3.13)
const DASHBOARD_URL = '/dashboard.html';
const TOKEN_KEY = 'guardly_token';
const USER_KEY = 'guardly_user';

// ===== Lấy phần tử trên trang =====
const form = document.getElementById('loginForm');
const userInput = document.getElementById('username');
const passInput = document.getElementById('password');
const userBox = document.getElementById('userBox');
const passBox = document.getElementById('passBox');
const userError = document.getElementById('userError');
const passError = document.getElementById('passError');
const alertBox = document.getElementById('alert');
const alertText = document.getElementById('alertText');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const toggleBtn = document.getElementById('toggle');

// ===== Hàm giao diện =====
function showAlert(type, message) {
  alertBox.className = 'alert ' + type;
  alertText.textContent = message;
  alertBox.hidden = false;
}

function hideAlert() {
  alertBox.hidden = true;
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  submitBtn.classList.toggle('loading', loading);
  btnText.textContent = loading ? 'Đang đăng nhập…' : 'Đăng nhập';
}

function setFieldError(box, errEl, input, message) {
  box.classList.toggle('invalid', !!message);
  errEl.textContent = message || '';
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

// ===== Kiểm tra dữ liệu nhập =====
function validate() {
  const u = userInput.value.trim();
  const p = passInput.value;
  setFieldError(userBox, userError, userInput, u ? '' : 'Vui lòng nhập tên đăng nhập');
  setFieldError(passBox, passError, passInput, p ? '' : 'Vui lòng nhập mật khẩu');
  if (!u) { userInput.focus(); return false; }
  if (!p) { passInput.focus(); return false; }
  return true;
}

// ===== Gọi API =====
// Giả lập API để xem giao diện (chỉ dùng khi USE_MOCK = true)
function mockLogin(username, password) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (username === 'khoa') return resolve({ status: 403 });
      if (username === 'loi') return resolve({ status: 500 });
      if (username === 'admin' && password === 'Admin@123') {
        return resolve({
          status: 200,
          data: { token: 'mock-token', fullName: 'Quản trị hệ thống', roles: ['ADMIN'] }
        });
      }
      resolve({ status: 401 });
    }, 700);
  });
}

async function callLogin(username, password) {
  if (USE_MOCK) return mockLogin(username, password);
  const res = await fetch(API_BASE + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
  });
  let data = null;
  if (res.ok) data = await res.json();
  return { status: res.status, data: data };
}

// ===== Xử lý khi bấm Đăng nhập =====
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  hideAlert();
  if (!validate()) return;

  setLoading(true);
  try {
    const result = await callLogin(userInput.value.trim(), passInput.value);

    if (result.status === 200) {
      localStorage.setItem(TOKEN_KEY, result.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        fullName: result.data.fullName,
        roles: result.data.roles
      }));
      if (USE_MOCK) {
        showAlert('ok', 'Đăng nhập thành công (chế độ thử). Đặt USE_MOCK = false để gọi API thật.');
        setLoading(false);
      } else {
        window.location.href = DASHBOARD_URL;
      }
      return;
    }

    if (result.status === 401) {
      showAlert('error', 'Tên đăng nhập hoặc mật khẩu không đúng.');
      passInput.value = '';
      passInput.focus();
    } else if (result.status === 403) {
      showAlert('warn', 'Tài khoản đã bị khóa. Liên hệ quản trị viên.');
    } else {
      showAlert('error', 'Hệ thống đang gặp lỗi. Vui lòng thử lại sau.');
    }
  } catch (err) {
    showAlert('error', 'Không kết nối được máy chủ. Kiểm tra kết nối rồi thử lại.');
  }
  setLoading(false);
});

// ===== Sự kiện phụ =====
// Xóa thông báo lỗi từng trường khi người dùng gõ lại
userInput.addEventListener('input', function () {
  setFieldError(userBox, userError, userInput, '');
});
passInput.addEventListener('input', function () {
  setFieldError(passBox, passError, passInput, '');
});

// Hiện hoặc ẩn mật khẩu
toggleBtn.addEventListener('click', function () {
  const show = passInput.type === 'password';
  passInput.type = show ? 'text' : 'password';
  toggleBtn.setAttribute('aria-pressed', String(show));
  toggleBtn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
});

// ===== Khi tải trang =====
// Phiên hết hạn (trang khác chuyển về: login.html?expired=1) hoặc đã đăng nhập sẵn
const params = new URLSearchParams(window.location.search);
if (params.get('expired')) {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  showAlert('info', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
} else if (!USE_MOCK && localStorage.getItem(TOKEN_KEY)) {
  window.location.href = DASHBOARD_URL;
}