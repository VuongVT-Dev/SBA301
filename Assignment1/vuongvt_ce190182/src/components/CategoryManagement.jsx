import React, { useState } from "react";
import CrudModal from "./CrudModal";

export default function CategoryManagement({ categories, setCategories }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedCategory, setSelectedCategory] = useState(null);

    const displayedCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    const handleCreate = (data) => {
        const quantity = Number(data.quantity);
        if (isNaN(quantity) || quantity < 0)
        {
            alert("Số lượng không được nhỏ hơn 0");
            return;
        }
        const newCategory = {
            id: categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
            name: data.name,
            image: data.image || "images/p1.jpg",
            quantity: Number(data.quantity || 0),
            status: Number(data.status || 1),
        };
        setCategories([...categories, newCategory]);
    };

    const handleUpdate = (data) => {
        const quantity = Number(data.quantity);
        if (isNaN(quantity) || quantity < 0)
        {
            alert("Số lượng không được nhỏ hơn 0");
            return;
        }
        setCategories(
            categories.map((item) =>
                item.id === selectedCategory.id ? { ...item, ...data, status: Number(data.status), quantity: Number(data.quantity) } : item
            )
        );
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa Category này không?")) {
            setCategories(categories.filter((item) => item.id !== id));
        }
    };

    // Khai báo các field cho form (bổ sung field image dạng file)
    const fields = [
        { name: "name", label: "Tên Thể Loại", required: true },
        { name: "image", label: "Hình Ảnh", type: "file" },
        { name: "quantity", label: "Số Lượng", type: "number" },
        {
            name: "status",
            label: "Trạng Thái",
            type: "select",
            options: [
                { value: 1, label: "Active" },
                { value: 0, label: "Inactive" },
            ],
        },
    ];

    return (
        <div>
            <h2>Quản Lý Category</h2>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "6px", width: "250px" }}
                />
                <button
                    onClick={() => { setModalMode("create"); setSelectedCategory(null); setIsModalOpen(true); }}
                    style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "6px 12px" }}
                >
                    + Thêm Category
                </button>
            </div>

            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ background: "#f2f2f2" }}>
                    <th>ID</th>
                    <th>Hình Ảnh</th>
                    <th>Tên Thể Loại</th>
                    <th>Số Lượng</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                </tr>
                </thead>
                <tbody>
                {displayedCategories.length > 0 ? (
                    displayedCategories.map((category) => (
                        <tr key={category.id} style={{ textAlign: "center" }}>
                            <td>{category.id}</td>
                            <td>
                                <img
                                    src={category.image.startsWith("blob:") ? category.image : `/${category.image}`}
                                    alt={category.name}
                                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                                />
                            </td>
                            <td>{category.name}</td>
                            <td>{category.quantity}</td>
                            <td>
                                <span style={{
                                    padding: "4px 12px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    backgroundColor: category.status === 1 ? "#dcfce7" : "#fee2e2",
                                    color: category.status === 1 ? "#16a34a" : "#dc2626"
                                }}>
                                    {category.status === 1 ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td>
                                <button
                                    onClick={() => { setModalMode("update"); setSelectedCategory(category); setIsModalOpen(true); }}
                                    style={{ backgroundColor: "#fbbf24", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                                >
                                    Sửa
                                </button>
                                {" "}
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>Không tìm thấy dữ liệu!</td>
                    </tr>
                )}
                </tbody>
            </table>

            <CrudModal
                isOpen={isModalOpen}
                mode={modalMode}
                initialData={selectedCategory}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
                fields={fields}
            />
        </div>
    );
}