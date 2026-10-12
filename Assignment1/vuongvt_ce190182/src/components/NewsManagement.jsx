import React, { useState } from "react";
import CrudModal from "./CrudModal";

export default function NewsManagement({ news, setNews, categories }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedNews, setSelectedNews] = useState(null);

    // Tìm kiếm theo tiêu đề (title)
    const displayedNews = news.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    const handleCreate = (data) => {
        const newNews = {
            id: news.length > 0 ? Math.max(...news.map((n) => n.id)) + 1 : 1,
            title: data.title,
            content: data.content,
            categoryId: Number(data.categoryId || (categories[0] ? categories[0].id : 1)),
            createdBy: data.createdBy || "Admin",
            status: Number(data.status !== undefined ? data.status : 1),
        };
        setNews([...news, newNews]);
    };

    const handleUpdate = (data) => {
        setNews(
            news.map((item) =>
                item.id === selectedNews.id
                    ? {
                          ...item,
                          ...data,
                          categoryId: Number(data.categoryId),
                          status: Number(data.status),
                      }
                    : item
            )
        );
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
            setNews(news.filter((item) => item.id !== id));
        }
    };

    // Khai báo fields cho CrudModal
    const fields = [
        { name: "title", label: "Tiêu Đề", required: true },
        { name: "content", label: "Nội Dung", required: true },
        {
            name: "categoryId",
            label: "Danh Mục",
            type: "select",
            options: categories.map((cat) => ({ value: cat.id, label: cat.name })),
        },
        { name: "createdBy", label: "Người Tạo", required: true },
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
            <h2>Quản Lý News Article</h2>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "6px", width: "250px" }}
                />
                <button
                    onClick={() => {
                        setModalMode("create");
                        setSelectedNews(null);
                        setIsModalOpen(true);
                    }}
                    style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "6px 12px", cursor: "pointer" }}
                >
                    + Thêm News Article
                </button>
            </div>

            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f2f2f2" }}>
                        <th>ID</th>
                        <th>Tiêu Đề</th>
                        <th>Nội Dung</th>
                        <th>Danh Mục</th>
                        <th>Người Tạo</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedNews.length > 0 ? (
                        displayedNews.map((item) => {
                            const category = categories.find((c) => c.id === item.categoryId);
                            return (
                                <tr key={item.id} style={{ textAlign: "center" }}>
                                    <td>{item.id}</td>
                                    <td style={{ textAlign: "left", maxWidth: "200px" }}>{item.title}</td>
                                    <td style={{ textAlign: "left", maxWidth: "250px" }}>
                                        {item.content.length > 50 ? item.content.slice(0, 50) + "..." : item.content}
                                    </td>
                                    <td>{category ? category.name : "N/A"}</td>
                                    <td>{item.createdBy}</td>
                                    <td>
                                        <span
                                            style={{
                                                padding: "4px 12px",
                                                borderRadius: "12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                backgroundColor: item.status === 1 ? "#dcfce7" : "#fee2e2",
                                                color: item.status === 1 ? "#16a34a" : "#dc2626",
                                            }}
                                        >
                                            {item.status === 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setModalMode("update");
                                                setSelectedNews(item);
                                                setIsModalOpen(true);
                                            }}
                                            style={{ backgroundColor: "#fbbf24", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                                        >
                                            Sửa
                                        </button>{" "}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                Không tìm thấy dữ liệu!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <CrudModal
                isOpen={isModalOpen}
                mode={modalMode}
                title="News Article"
                initialData={selectedNews}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
                fields={fields}
            />
        </div>
    );
}
