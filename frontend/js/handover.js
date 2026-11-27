document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. DỮ LIỆU BÀN GIAO MẪU
    // ==========================================

    const initialHandovers = [
        { id: 1, code: "PBG-0001", asset: "Laptop Dell Latitude 5440", assetCode: "TS-0001", type: "Cấp phát", from: "Nguyễn Minh Anh", to: "Trần Thu Hà", department: "Kế toán", date: "2026-11-26", status: "Chờ xác nhận", note: "Kèm sạc và túi chống sốc." },
        { id: 2, code: "PBG-0002", asset: "Máy in HP LaserJet Pro M404dn", assetCode: "TS-0002", type: "Điều chuyển", from: "Phạm Ngọc Lan", to: "Lê Quốc Bảo", department: "Kinh doanh", date: "2026-11-25", status: "Chờ xác nhận", note: "" },
        { id: 3, code: "PBG-0003", asset: "Máy chiếu Epson EB-X51", assetCode: "TS-0003", type: "Thu hồi", from: "Vũ Đức Thịnh", to: "Kho tài sản", department: "Kinh doanh", date: "2026-11-24", status: "Hoàn tất", note: "Thu hồi để bảo trì định kỳ." },
        { id: 4, code: "PBG-0004", asset: "Máy tính Lenovo ThinkCentre", assetCode: "TS-0004", type: "Cấp phát", from: "Nguyễn Minh Anh", to: "Nguyễn Văn Nam", department: "Công nghệ thông tin", date: "2026-11-22", status: "Hoàn tất", note: "" },
        { id: 5, code: "PBG-0005", asset: "Camera IP Hikvision", assetCode: "TS-0005", type: "Cấp phát", from: "Nguyễn Minh Anh", to: "Hoàng Văn Nam", department: "Hành chính", date: "2026-11-20", status: "Hoàn tất", note: "" },
        { id: 6, code: "PBG-0006", asset: "Màn hình Dell P2422H", assetCode: "TS-0008", type: "Điều chuyển", from: "Trần Thu Hà", to: "Ngô Thị Mai", department: "Hành chính", date: "2026-11-19", status: "Chờ xác nhận", note: "" },
        { id: 7, code: "PBG-0007", asset: "Switch mạng TP-Link", assetCode: "TS-0007", type: "Thu hồi", from: "Lê Hoàng Minh", to: "Kho tài sản", department: "Công nghệ thông tin", date: "2026-11-15", status: "Hoàn tất", note: "" },
        { id: 8, code: "PBG-0008", asset: "Bộ lưu điện UPS", assetCode: "TS-0006", type: "Cấp phát", from: "Nguyễn Minh Anh", to: "Bùi Anh Tuấn", department: "Công nghệ thông tin", date: "2026-11-12", status: "Đã hủy", note: "Tài sản đang hỏng, hủy phiếu." }
    ];

    const STORAGE_KEY = "guardly_handovers";

    let handovers = loadData();
    let filteredHandovers = [...handovers];

    let currentPage = 1;
    const pageSize = 5;

    let editingId = null;

    // ==========================================
    // 2. LẤY CÁC ELEMENT HTML
    // ==========================================

    const $ = id => document.getElementById(id);

    const tableBody = $("handoverTableBody");
    const searchInput = $("searchInput");
    const typeFilter = $("typeFilter");
    const departmentFilter = $("departmentFilter");
    const statusFilter = $("statusFilter");
    const handoverModal = $("handoverModal");
    const detailModal = $("detailModal");
    const handoverForm = $("handoverForm");

    // ==========================================
    // 3. ĐỌC VÀ LƯU LOCALSTORAGE
    // ==========================================

    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved === null) {
                return JSON.parse(JSON.stringify(initialHandovers));
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                throw new Error("Dữ liệu không hợp lệ");
            }

            return parsed;

        } catch (error) {
            console.error("Không thể đọc dữ liệu:", error);
            return JSON.parse(JSON.stringify(initialHandovers));
        }
    }

    function saveData() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(handovers));
            return true;

        } catch (error) {
            console.error("Không thể lưu dữ liệu:", error);
            alert("Lưu dữ liệu thất bại!");
            return false;
        }
    }

    // ==========================================
    // 4. HÀM TIỆN ÍCH
    // ==========================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function formatDate(value) {
        if (!value) return "—";
        const [y, m, d] = value.split("-");
        return `${d}/${m}/${y}`;
    }

    function getStatusClass(status) {
        const classes = {
            "Chờ xác nhận": "status-pending",
            "Hoàn tất": "status-done",
            "Đã hủy": "status-cancel"
        };
        return classes[status] || "status-pending";
    }

    function getTypeClass(type) {
        const classes = {
            "Cấp phát": "type-give",
            "Thu hồi": "type-back",
            "Điều chuyển": "type-move"
        };
        return classes[type] || "type-give";
    }

    // ==========================================
    // 5. CẬP NHẬT THỐNG KÊ
    // ==========================================

    function updateStatistics() {

        const count = status =>
            handovers.filter(item => item.status === status).length;

        $("totalCount").textContent = handovers.length + " phiếu";
        $("pendingCount").textContent = "Chờ xác nhận: " + count("Chờ xác nhận");
        $("doneCount").textContent = "Hoàn tất: " + count("Hoàn tất");
        $("cancelCount").textContent = "Đã hủy: " + count("Đã hủy");
        $("tableTotal").textContent =
            "Tổng cộng " + filteredHandovers.length + " phiếu";
    }

    // ==========================================
    // 6. HIỂN THỊ DANH SÁCH PHIẾU
    // ==========================================

    function renderTable() {

        const totalPages = Math.max(
            1,
            Math.ceil(filteredHandovers.length / pageSize)
        );

        currentPage = Math.min(currentPage, totalPages);

        const start = (currentPage - 1) * pageSize;

        const pageItems = filteredHandovers.slice(start, start + pageSize);

        if (pageItems.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="empty-row">
                        Không tìm thấy phiếu bàn giao phù hợp.
                    </td>
                </tr>
            `;

        } else {

            tableBody.innerHTML = pageItems.map(item => `

                <tr>

                    <td class="checkbox-col">
                        <input type="checkbox" class="row-checkbox" value="${item.id}">
                    </td>

                    <td>
                        <span class="asset-code">${escapeHTML(item.code)}</span>
                    </td>

                    <td>
                        <div class="asset-name">${escapeHTML(item.asset)}</div>
                        <span class="asset-serial">Mã: ${escapeHTML(item.assetCode)}</span>
                    </td>

                    <td>
                        <span class="type-badge ${getTypeClass(item.type)}">
                            ${escapeHTML(item.type)}
                        </span>
                    </td>

                    <td>${escapeHTML(item.from)}</td>

                    <td>${escapeHTML(item.to)}</td>

                    <td>${escapeHTML(item.department)}</td>

                    <td>${formatDate(item.date)}</td>

                    <td>
                        <span class="status-badge ${getStatusClass(item.status)}">
                            ${escapeHTML(item.status)}
                        </span>
                    </td>

                    <td class="actions">

                        <button class="action-link" data-action="detail" data-id="${item.id}">
                            Chi tiết
                        </button>

                        <button class="action-link" data-action="edit" data-id="${item.id}">
                            Sửa
                        </button>

                        <button class="action-link delete" data-action="delete" data-id="${item.id}">
                            Xóa
                        </button>

                    </td>

                </tr>

            `).join("");
        }

        $("pageInfo").textContent =
            filteredHandovers.length === 0
                ? "Hiển thị 0 phiếu"
                : `Hiển thị ${start + 1}–${Math.min(
                    start + pageSize,
                    filteredHandovers.length
                )} trong ${filteredHandovers.length} phiếu`;

        $("currentPage").textContent = currentPage;
        $("prevPage").disabled = currentPage === 1;
        $("nextPage").disabled = currentPage >= totalPages;
        $("selectAll").checked = false;

        updateStatistics();
    }

    // ==========================================
    // 7. TÌM KIẾM VÀ LỌC
    // ==========================================

    function applyFilters() {

        const keyword = searchInput.value.trim().toLowerCase();
        const type = typeFilter.value;
        const department = departmentFilter.value;
        const status = statusFilter.value;

        filteredHandovers = handovers.filter(item => {

            const searchContent = [
                item.code,
                item.asset,
                item.assetCode,
                item.from,
                item.to
            ].join(" ").toLowerCase();

            return (
                searchContent.includes(keyword) &&
                (!type || item.type === type) &&
                (!department || item.department === department) &&
                (!status || item.status === status)
            );
        });

        currentPage = 1;

        renderTable();
    }

    $("filterBtn").addEventListener("click", applyFilters);
    searchInput.addEventListener("input", applyFilters);
    typeFilter.addEventListener("change", applyFilters);
    departmentFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);

    // ==========================================
    // 8. PHÂN TRANG
    // ==========================================

    $("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    $("nextPage").addEventListener("click", () => {
        const totalPages = Math.ceil(filteredHandovers.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    // ==========================================
    // 9. CHỌN TẤT CẢ
    // ==========================================

    $("selectAll").addEventListener("change", function () {
        document.querySelectorAll(".row-checkbox").forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // ==========================================
    // 10. MỞ FORM THÊM / SỬA
    // ==========================================

    const fieldIds = {
        code: "hCode", type: "hType", asset: "hAsset", assetCode: "hAssetCode",
        from: "hFrom", to: "hTo", department: "hDepartment",
        date: "hDate", status: "hStatus", note: "hNote"
    };

    function nextCode() {
        const max = handovers.reduce((m, item) => {
            const n = parseInt(String(item.code).replace(/\D/g, ""), 10);
            return Number.isNaN(n) ? m : Math.max(m, n);
        }, 0);
        return "PBG-" + String(max + 1).padStart(4, "0");
    }

    function openHandoverModal(item = null) {

        handoverForm.reset();

        editingId = item ? item.id : null;

        $("modalTitle").textContent =
            item ? "Chỉnh sửa phiếu bàn giao" : "Tạo phiếu bàn giao";

        $("hCode").readOnly = !!item;

        if (item) {
            Object.entries(fieldIds).forEach(([key, id]) => {
                $(id).value = item[key] ?? "";
            });
        } else {
            $("hCode").value = nextCode();
            $("hDate").value = new Date().toISOString().slice(0, 10);
        }

        handoverModal.classList.add("show");
    }

    function closeHandoverModal() {
        handoverModal.classList.remove("show");
        handoverForm.reset();
        editingId = null;
        $("hCode").readOnly = false;
    }

    $("addBtn").addEventListener("click", () => openHandoverModal());
    $("closeModal").addEventListener("click", closeHandoverModal);
    $("cancelModal").addEventListener("click", closeHandoverModal);

    // ==========================================
    // 11. THÊM VÀ CẬP NHẬT PHIẾU
    // ==========================================

    handoverForm.addEventListener("submit", event => {

        event.preventDefault();

        const data = {};

        Object.entries(fieldIds).forEach(([key, id]) => {
            data[key] = $(id).value.trim();
        });

        if (!editingId && handovers.some(
            item => item.code.toLowerCase() === data.code.toLowerCase()
        )) {
            alert("Mã phiếu đã tồn tại!");
            return;
        }

        const wasEditing = !!editingId;

        const previous = handovers;

        handovers = wasEditing
            ? handovers.map(item =>
                item.id === editingId ? { ...item, ...data } : item)
            : [...handovers, { id: Date.now(), ...data }];

        if (!saveData()) {
            handovers = previous;
            return;
        }

        closeHandoverModal();

        applyFilters();

        alert(
            wasEditing
                ? "Cập nhật phiếu bàn giao thành công!"
                : "Tạo phiếu bàn giao thành công!"
        );
    });

    // ==========================================
    // 12. CHI TIẾT / SỬA / XÓA
    // ==========================================

    tableBody.addEventListener("click", event => {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        const id = Number(button.dataset.id);

        const item = handovers.find(h => h.id === id);

        if (!item) return;

        const action = button.dataset.action;

        if (action === "detail") showDetail(item);

        if (action === "edit") openHandoverModal(item);

        if (action === "delete") {

            if (!confirm(`Bạn có chắc muốn xóa phiếu ${item.code} không?`)) return;

            const previous = handovers;

            handovers = handovers.filter(h => h.id !== id);

            if (!saveData()) {
                handovers = previous;
                return;
            }

            applyFilters();

            alert("Đã xóa phiếu bàn giao thành công!");
        }
    });

    // ==========================================
    // 13. HIỂN THỊ CHI TIẾT
    // ==========================================

    function showDetail(item) {

        const fields = [
            ["Mã phiếu", item.code],
            ["Loại phiếu", item.type],
            ["Tên tài sản", item.asset],
            ["Mã tài sản", item.assetCode],
            ["Người giao", item.from],
            ["Người nhận", item.to],
            ["Phòng ban", item.department],
            ["Ngày bàn giao", formatDate(item.date)],
            ["Trạng thái", item.status],
            ["Ghi chú", item.note || "Không có ghi chú"]
        ];

        $("detailContent").innerHTML = fields.map(([label, value]) => `
            <div class="detail-item ${label === "Ghi chú" ? "full" : ""}">
                <span>${escapeHTML(label)}</span>
                <strong>${escapeHTML(value)}</strong>
            </div>
        `).join("");

        detailModal.classList.add("show");
    }

    function closeDetailModal() {
        detailModal.classList.remove("show");
    }

    $("closeDetail").addEventListener("click", closeDetailModal);
    $("closeDetailBtn").addEventListener("click", closeDetailModal);

    // ==========================================
    // 14. XUẤT FILE CSV MỞ BẰNG EXCEL
    // ==========================================

    $("exportBtn").addEventListener("click", () => {

        if (filteredHandovers.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const headers = [
            "Mã phiếu", "Tên tài sản", "Mã tài sản", "Loại phiếu",
            "Người giao", "Người nhận", "Phòng ban",
            "Ngày bàn giao", "Trạng thái", "Ghi chú"
        ];

        const rows = filteredHandovers.map(item => [
            item.code, item.asset, item.assetCode, item.type,
            item.from, item.to, item.department,
            formatDate(item.date), item.status, item.note
        ]);

        const csv = "\uFEFF" + [headers, ...rows].map(row =>
            row.map(value =>
                '"' + String(value ?? "").replace(/"/g, '""') + '"'
            ).join(",")
        ).join("\r\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "danh-sach-ban-giao.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    });

    // ==========================================
    // 15. KHÔI PHỤC DỮ LIỆU MẪU
    // ==========================================

    $("restoreBtn").addEventListener("click", () => {

        if (!confirm("Bạn có muốn khôi phục dữ liệu mẫu không? Dữ liệu hiện tại sẽ bị thay thế.")) return;

        const previous = handovers;

        handovers = JSON.parse(JSON.stringify(initialHandovers));

        if (!saveData()) {
            handovers = previous;
            return;
        }

        searchInput.value = "";
        typeFilter.value = "";
        departmentFilter.value = "";
        statusFilter.value = "";

        filteredHandovers = [...handovers];

        currentPage = 1;

        renderTable();

        alert("Đã khôi phục dữ liệu mẫu!");
    });

    // ==========================================
    // 16. ĐÓNG MODAL
    // ==========================================

    [handoverModal, detailModal].forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                modal.classList.remove("show");
            }
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeHandoverModal();
            closeDetailModal();
        }
    });

    // ==========================================
    // 17. KHỞI TẠO TRANG
    // ==========================================

    filteredHandovers = [...handovers];

    renderTable();

});