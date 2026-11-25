
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. DỮ LIỆU TÀI SẢN MẪU
    // ==========================================

    const initialAssets = [
        {
            id: 1,
            code: "TS-0001",
            name: "Laptop Dell Latitude 5440",
            serial: "DL5440-02381",
            type: "Máy tính",
            department: "Kế toán",
            user: "Trần Thu Hà",
            status: "Đang sử dụng",
            price: 24900000
        },
        {
            id: 2,
            code: "TS-0002",
            name: "Máy in HP LaserJet Pro M404dn",
            serial: "HP-403DN-018",
            type: "Thiết bị văn phòng",
            department: "Hành chính",
            user: "Phạm Ngọc Lan",
            status: "Đang sử dụng",
            price: 8560000
        },
        {
            id: 3,
            code: "TS-0003",
            name: "Máy chiếu Epson EB-X51",
            serial: "EP-X51-0056",
            type: "Thiết bị trình chiếu",
            department: "Kinh doanh",
            user: "",
            status: "Đang bảo trì",
            price: 12800000
        },
        {
            id: 4,
            code: "TS-0004",
            name: "Máy tính Lenovo ThinkCentre",
            serial: "LN-TC-0098",
            type: "Máy tính",
            department: "Công nghệ thông tin",
            user: "Nguyễn Văn Nam",
            status: "Trong kho",
            price: 18500000
        },
        {
            id: 5,
            code: "TS-0005",
            name: "Camera IP Hikvision",
            serial: "HK-CAM-0021",
            type: "Thiết bị an ninh",
            department: "Hành chính",
            user: "",
            status: "Đang sử dụng",
            price: 3200000
        },
        {
            id: 6,
            code: "TS-0006",
            name: "Bộ lưu điện UPS",
            serial: "UPS-0012",
            type: "Thiết bị an ninh",
            department: "Công nghệ thông tin",
            user: "",
            status: "Hỏng",
            price: 4500000
        },
        {
            id: 7,
            code: "TS-0007",
            name: "Switch mạng TP-Link",
            serial: "TPL-SW-007",
            type: "Thiết bị mạng",
            department: "Công nghệ thông tin",
            user: "Lê Hoàng Minh",
            status: "Đang sử dụng",
            price: 2800000
        },
        {
            id: 8,
            code: "TS-0008",
            name: "Màn hình Dell P2422H",
            serial: "DL-P2422-008",
            type: "Máy tính",
            department: "Kế toán",
            user: "Trần Thu Hà",
            status: "Trong kho",
            price: 5200000
        }
    ];

    const STORAGE_KEY = "guardly_assets";

    let assets = loadData();
    let filteredAssets = [...assets];

    let currentPage = 1;
    const pageSize = 5;

    let editingId = null;

    // ==========================================
    // 2. LẤY CÁC ELEMENT HTML
    // ==========================================

    const tableBody =
        document.getElementById("assetTableBody");

    const searchInput =
        document.getElementById("searchInput");

    const typeFilter =
        document.getElementById("typeFilter");

    const departmentFilter =
        document.getElementById("departmentFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const assetModal =
        document.getElementById("assetModal");

    const detailModal =
        document.getElementById("detailModal");

    const assetForm =
        document.getElementById("assetForm");

    // ==========================================
    // 3. ĐỌC VÀ LƯU LOCALSTORAGE
    // ==========================================

    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved === null) {
                return [...initialAssets];
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                throw new Error("Dữ liệu không hợp lệ");
            }

            return parsed;

        } catch (error) {
            console.error("Không thể đọc dữ liệu:", error);
            return [...initialAssets];
        }
    }

    function saveData() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(assets)
            );

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

    function formatMoney(value) {
        return Number(value).toLocaleString("vi-VN") + " ₫";
    }

    function getStatusClass(status) {

        const classes = {
            "Đang sử dụng": "status-using",
            "Đang bảo trì": "status-maintenance",
            "Trong kho": "status-stock",
            "Hỏng": "status-broken"
        };

        return classes[status] || "status-stock";
    }

    // ==========================================
    // 5. CẬP NHẬT THỐNG KÊ
    // ==========================================

    function updateStatistics() {

        const using = assets.filter(
            item => item.status === "Đang sử dụng"
        ).length;

        const maintenance = assets.filter(
            item => item.status === "Đang bảo trì"
        ).length;

        const stock = assets.filter(
            item => item.status === "Trong kho"
        ).length;

        document.getElementById("totalCount").textContent =
            assets.length + " tài sản";

        document.getElementById("usingCount").textContent =
            "Đang sử dụng: " + using;

        document.getElementById("maintenanceCount").textContent =
            "Đang bảo trì: " + maintenance;

        document.getElementById("stockCount").textContent =
            "Trong kho: " + stock;

        document.getElementById("tableTotal").textContent =
            "Tổng cộng " + filteredAssets.length + " tài sản";
    }

    // ==========================================
    // 6. HIỂN THỊ DANH SÁCH TÀI SẢN
    // ==========================================

    function renderTable() {

        const totalPages = Math.max(
            1,
            Math.ceil(filteredAssets.length / pageSize)
        );

        currentPage = Math.min(currentPage, totalPages);

        const start = (currentPage - 1) * pageSize;

        const pageAssets = filteredAssets.slice(
            start,
            start + pageSize
        );

        if (pageAssets.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-row">
                        Không tìm thấy tài sản phù hợp.
                    </td>
                </tr>
            `;

        } else {

            tableBody.innerHTML = pageAssets.map(item => `

                <tr>

                    <td class="checkbox-col">
                        <input
                            type="checkbox"
                            class="row-checkbox"
                            value="${item.id}"
                        >
                    </td>

                    <td>
                        <span class="asset-code">
                            ${escapeHTML(item.code)}
                        </span>
                    </td>

                    <td>
                        <div class="asset-name">
                            ${escapeHTML(item.name)}
                        </div>

                        <span class="asset-serial">
                            SN: ${escapeHTML(item.serial || "Chưa cập nhật")}
                        </span>
                    </td>

                    <td>${escapeHTML(item.type)}</td>

                    <td>${escapeHTML(item.department)}</td>

                    <td>${escapeHTML(item.user || "—")}</td>

                    <td>
                        <span class="status-badge ${getStatusClass(item.status)}">
                            ${escapeHTML(item.status)}
                        </span>
                    </td>

                    <td class="asset-price">
                        ${formatMoney(item.price)}
                    </td>

                    <td class="actions">

                        <button
                            class="action-link"
                            data-action="detail"
                            data-id="${item.id}">
                            Chi tiết
                        </button>

                        <button
                            class="action-link"
                            data-action="edit"
                            data-id="${item.id}">
                            Sửa
                        </button>

                        <button
                            class="action-link delete"
                            data-action="delete"
                            data-id="${item.id}">
                            Xóa
                        </button>

                    </td>

                </tr>

            `).join("");
        }

        // Thông tin phân trang
        document.getElementById("pageInfo").textContent =
            filteredAssets.length === 0
                ? "Hiển thị 0 tài sản"
                : `Hiển thị ${start + 1}–${Math.min(
                    start + pageSize,
                    filteredAssets.length
                )} trong ${filteredAssets.length} tài sản`;

        document.getElementById("currentPage").textContent =
            currentPage;

        document.getElementById("prevPage").disabled =
            currentPage === 1;

        document.getElementById("nextPage").disabled =
            currentPage >= totalPages;

        document.getElementById("selectAll").checked = false;

        updateStatistics();
    }

    // ==========================================
    // 7. TÌM KIẾM VÀ LỌC
    // ==========================================

    function applyFilters() {

        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        const type = typeFilter.value;
        const department = departmentFilter.value;
        const status = statusFilter.value;

        filteredAssets = assets.filter(item => {

            const searchContent = [
                item.code,
                item.name,
                item.serial,
                item.user
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

    document.getElementById("filterBtn")
        .addEventListener("click", applyFilters);

    searchInput.addEventListener("input", applyFilters);

    typeFilter.addEventListener("change", applyFilters);

    departmentFilter.addEventListener("change", applyFilters);

    statusFilter.addEventListener("change", applyFilters);

    // ==========================================
    // 8. PHÂN TRANG
    // ==========================================

    document.getElementById("prevPage")
        .addEventListener("click", () => {

            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });

    document.getElementById("nextPage")
        .addEventListener("click", () => {

            const totalPages = Math.ceil(
                filteredAssets.length / pageSize
            );

            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });

    // ==========================================
    // 9. CHỌN TẤT CẢ
    // ==========================================

    document.getElementById("selectAll")
        .addEventListener("change", function () {

            document.querySelectorAll(".row-checkbox")
                .forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
        });

    // ==========================================
    // 10. MỞ FORM THÊM / SỬA
    // ==========================================

    function openAssetModal(item = null) {

        assetForm.reset();

        editingId = item ? item.id : null;

        document.getElementById("modalTitle").textContent =
            item ? "Chỉnh sửa tài sản" : "Thêm tài sản mới";

        document.getElementById("assetCode").readOnly = !!item;

        if (item) {

            document.getElementById("assetCode").value = item.code;
            document.getElementById("assetName").value = item.name;
            document.getElementById("assetSerial").value = item.serial;
            document.getElementById("assetType").value = item.type;
            document.getElementById("assetDepartment").value = item.department;
            document.getElementById("assetUser").value = item.user;
            document.getElementById("assetStatus").value = item.status;
            document.getElementById("assetPrice").value = item.price;
        }

        assetModal.classList.add("show");
    }

    function closeAssetModal() {

        assetModal.classList.remove("show");

        assetForm.reset();

        editingId = null;

        document.getElementById("assetCode").readOnly = false;
    }

    document.getElementById("addBtn")
        .addEventListener("click", () => openAssetModal());

    document.getElementById("closeModal")
        .addEventListener("click", closeAssetModal);

    document.getElementById("cancelModal")
        .addEventListener("click", closeAssetModal);

    // ==========================================
    // 11. THÊM VÀ CẬP NHẬT TÀI SẢN
    // ==========================================

    assetForm.addEventListener("submit", event => {

        event.preventDefault();

        const code = document.getElementById("assetCode")
            .value.trim();

        const name = document.getElementById("assetName")
            .value.trim();

        const serial = document.getElementById("assetSerial")
            .value.trim();

        const type = document.getElementById("assetType").value;

        const department =
            document.getElementById("assetDepartment").value;

        const user = document.getElementById("assetUser")
            .value.trim();

        const status = document.getElementById("assetStatus").value;

        const price = Number(
            document.getElementById("assetPrice").value
        );

        if (!editingId && assets.some(
            item => item.code.toLowerCase() === code.toLowerCase()
        )) {
            alert("Mã tài sản đã tồn tại!");
            return;
        }

        const assetData = {
            code,
            name,
            serial,
            type,
            department,
            user,
            status,
            price
        };

        let newAssets;

        if (editingId) {

            newAssets = assets.map(item =>
                item.id === editingId
                    ? { ...item, ...assetData }
                    : item
            );

        } else {

            newAssets = [
                ...assets,
                {
                    id: Date.now(),
                    ...assetData
                }
            ];
        }

        const previousAssets = assets;

        assets = newAssets;

        if (!saveData()) {
            assets = previousAssets;
            return;
        }

        closeAssetModal();

        applyFilters();

        alert(
            editingId
                ? "Cập nhật tài sản thành công!"
                : "Thêm tài sản thành công!"
        );
    });

    // ==========================================
    // 12. CHI TIẾT / SỬA / XÓA
    // ==========================================

    tableBody.addEventListener("click", event => {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        const id = Number(button.dataset.id);

        const item = assets.find(asset => asset.id === id);

        if (!item) return;

        const action = button.dataset.action;

        if (action === "detail") {
            showDetail(item);
        }

        if (action === "edit") {
            openAssetModal(item);
        }

        if (action === "delete") {

            const confirmed = confirm(
                `Bạn có chắc muốn xóa tài sản ${item.code} không?`
            );

            if (!confirmed) return;

            const previousAssets = assets;

            assets = assets.filter(asset => asset.id !== id);

            if (!saveData()) {
                assets = previousAssets;
                return;
            }

            applyFilters();

            alert("Đã xóa tài sản thành công!");
        }
    });

    // ==========================================
    // 13. HIỂN THỊ CHI TIẾT
    // ==========================================

    function showDetail(item) {

        const fields = [
            ["Mã tài sản", item.code],
            ["Tên tài sản", item.name],
            ["Số sê-ri", item.serial || "Chưa cập nhật"],
            ["Loại tài sản", item.type],
            ["Phòng ban", item.department],
            ["Người sử dụng", item.user || "Chưa bàn giao"],
            ["Trạng thái", item.status],
            ["Nguyên giá", formatMoney(item.price)]
        ];

        document.getElementById("detailContent").innerHTML =
            fields.map(([label, value]) => `
                <div class="detail-item">
                    <span>${escapeHTML(label)}</span>
                    <strong>${escapeHTML(value)}</strong>
                </div>
            `).join("");

        detailModal.classList.add("show");
    }

    function closeDetailModal() {
        detailModal.classList.remove("show");
    }

    document.getElementById("closeDetail")
        .addEventListener("click", closeDetailModal);

    document.getElementById("closeDetailBtn")
        .addEventListener("click", closeDetailModal);

    // ==========================================
    // 14. XUẤT FILE CSV MỞ BẰNG EXCEL
    // ==========================================

    document.getElementById("exportBtn")
        .addEventListener("click", () => {

            if (filteredAssets.length === 0) {
                alert("Không có dữ liệu để xuất!");
                return;
            }

            const headers = [
                "Mã tài sản",
                "Tên tài sản",
                "Số sê-ri",
                "Loại tài sản",
                "Phòng ban",
                "Người sử dụng",
                "Trạng thái",
                "Nguyên giá"
            ];

            const rows = filteredAssets.map(item => [
                item.code,
                item.name,
                item.serial,
                item.type,
                item.department,
                item.user,
                item.status,
                item.price
            ]);

            const csv = "\uFEFF" + [
                headers,
                ...rows
            ].map(row =>
                row.map(value =>
                    '"' + String(value ?? "").replace(/"/g, '""') + '"'
                ).join(",")
            ).join("\r\n");

            const blob = new Blob([csv], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "danh-sach-tai-san.csv";

            document.body.appendChild(link);

            link.click();

            link.remove();

            URL.revokeObjectURL(url);
        });

    // ==========================================
    // 15. KHÔI PHỤC DỮ LIỆU MẪU
    // ==========================================

    document.getElementById("restoreBtn")
        .addEventListener("click", () => {

            const confirmed = confirm(
                "Bạn có muốn khôi phục dữ liệu mẫu không? Dữ liệu hiện tại sẽ bị thay thế."
            );

            if (!confirmed) return;

            const previousAssets = assets;

            assets = JSON.parse(JSON.stringify(initialAssets));

            if (!saveData()) {
                assets = previousAssets;
                return;
            }

            searchInput.value = "";
            typeFilter.value = "";
            departmentFilter.value = "";
            statusFilter.value = "";

            filteredAssets = [...assets];

            currentPage = 1;

            renderTable();

            alert("Đã khôi phục dữ liệu mẫu!");
        });

    // ==========================================
    // 16. ĐÓNG MODAL
    // ==========================================

    [assetModal, detailModal].forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                modal.classList.remove("show");
            }
        });
    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeAssetModal();
            closeDetailModal();
        }
    });

    // ==========================================
    // 17. KHỞI TẠO TRANG
    // ==========================================

    filteredAssets = [...assets];

    renderTable();

});
