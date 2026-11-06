# SecuAM

**Hệ thống quản lý tài sản và thiết bị an ninh** (Đề tài G1.10 – HKDN UTH – Gtel OTS)

## 1. Giới thiệu
SecuAM là phần mềm web quản lý vòng đời camera, cảm biến, thiết bị truyền tin, máy chủ và các thiết bị chuyên dụng trong hệ thống an ninh.

**Sản phẩm dự kiến:** phần mềm quản lý tài sản, mã QR, lịch sử bảo trì và báo cáo.

## 2. Chức năng chính
- Quản lý tài khoản và xác thực người dùng
- Quản lý phân quyền người dùng
- Quản lý tài sản và thiết bị an ninh
- Quản lý danh mục và vị trí thiết bị
- Quản lý mã QR tài sản
- Quản lý bảo trì và sửa chữa thiết bị
- Thống kê và báo cáo hệ thống

## 3. Công nghệ sử dụng
| Thành phần | Công nghệ |
|---|---|
| Front-end | HTML, CSS, JavaScript thuần |
| Back-end | ASP.NET Core Web API (.NET 8), Entity Framework Core |
| Cơ sở dữ liệu | SQL Server |
| Triển khai | Docker, Docker Compose |
| Quản lý công việc | Jira |
| Quản lý mã nguồn | Git, GitHub |

## 4. Cấu trúc thư mục
```text
SecuAM/
├── backend/             # ASP.NET Core Web API
├── frontend/            # Giao diện web (HTML, CSS, JS)
├── docker-compose.yml   # Sẽ bổ sung ở giai đoạn Xây dựng nền tảng
├── .gitignore
└── README.md
```

## 5. Kiến trúc
```text
Frontend (HTML/CSS/JS) → Controller → Service → DbContext (EF Core) → SQL Server
```

## 6. Thành viên nhóm
| STT | Họ tên | Vai trò |
|---|---|---|
| 1 | Nguyễn Đăng Phúc Cường | Leader |
| 2 | Nguyễn Quốc Thắng | Thành viên |
| 3 | Lê Hải Bằng | Thành viên |
| 4 | Nguyễn Đức Chung | Thành viên |
| 5 | Phan Khánh Huy | Thành viên |

## 7. Yêu cầu môi trường
- Visual Studio 2022 (hoặc .NET 8 SDK)
- VS Code
- SQL Server (hoặc Docker Desktop)
- Git

## 8. Cách chạy
Sẽ cập nhật sau khi hoàn thành giai đoạn Xây dựng nền tảng.

## 9. Quy tắc làm việc với Git
- Nhánh chính: `main` (không đẩy trực tiếp).
- Mỗi chức năng một nhánh: `feature/<tên-chức-năng>`, ví dụ `feature/qr-code`.
- Làm xong tạo Pull Request, có ít nhất 1 thành viên xem lại trước khi merge.
- Commit message rõ ràng, ví dụ: `feat: thêm API danh sách tài sản`.

## 10. Tiến độ
Theo dõi trên Jira (dự án SCRUM).
