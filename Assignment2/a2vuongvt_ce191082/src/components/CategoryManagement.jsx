import React, { useState, useEffect } from "react";
import api, { extractErrorMessage } from "../services/api";
import CrudModal from "./CrudModal";

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategories = async (keyword = "") => {
        try {
            setLoading(true);
            const res = await api.getCategories(keyword);
            setCategories(res.data || []);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCategories(search);
    };

    const handleCreate = async (formData) => {
        try {
            await api.createCategory({
                categoryName: formData.categoryName.trim(),
                categoryDescription: formData.categoryDescription.trim(),
                parentCategoryId: formData.parentCategoryId ? Number(formData.parentCategoryId) : null,
                isActive: Number(formData.isActive),
            });
            setMessage({ type: "success", text: "Thêm danh mục thành công!" });
            fetchCategories(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.updateCategory(selectedCategory.categoryId, {
                categoryName: formData.categoryName.trim(),
                categoryDescription: formData.categoryDescription.trim(),
                parentCategoryId: formData.parentCategoryId ? Number(formData.parentCategoryId) : null,
                isActive: Number(formData.isActive),
            });
            setMessage({ type: "success", text: "Cập nhật danh mục thành công!" });
            fetchCategories(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleDelete = async (cat) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.categoryName}" không?`)) {
            return;
        }
        try {
            setMessage({ type: "", text: "" });
            await api.deleteCategory(cat.categoryId);
            setMessage({ type: "success", text: `Đã xóa danh mục "${cat.categoryName}" thành công!` });
            fetchCategories(search);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        }
    };

    const parentOptions = [
        { value: "", label: "-- Không có (Danh mục gốc) --" },
        ...categories
            .filter((c) => !selectedCategory || c.categoryId !== selectedCategory.categoryId)
            .map((c) => ({ value: c.categoryId, label: `${c.categoryName} (ID: ${c.categoryId})` })),
    ];

    const fields = [
        { name: "categoryName", label: "Tên Danh Mục (CategoryName)", required: true },
        {
            name: "categoryDescription",
            label: "Mô Tả (CategoryDescription)",
            type: "textarea",
            rows: 3,
            required: true,
        },
        {
            name: "parentCategoryId",
            label: "Danh Mục Cha (ParentCategoryID)",
            type: "select",
            defaultValue: "",
            options: parentOptions,
        },
        {
            name: "isActive",
            label: "Trạng Thái (IsActive)",
            type: "select",
            defaultValue: 1,
            options: [
                { value: 1, label: "Active (1)" },
                { value: 0, label: "Inactive (0)" },
            ],
        },
    ];

    return (
        <div>
            <div className="section-header">
                <h2>Quản Lý Danh Mục (Category - Staff Role)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Lưu ý: Chỉ xóa được danh mục chưa chứa bất kỳ bài viết (NewsArticle) nào.
                </p>
            </div>

            {message.text && (
                <div className={message.type === "error" ? "alert-error" : "alert-success"}>
                    {message.text}
                </div>
            )}

            <div className="toolbar">
                <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm theo tên hoặc mô tả danh mục..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Tìm kiếm
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setSearch("");
                            fetchCategories("");
                        }}
                    >
                        Tất cả
                    </button>
                </form>

                <button
                    className="btn btn-success"
                    onClick={() => {
                        setModalMode("create");
                        setSelectedCategory(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Thêm Danh Mục
                </button>
            </div>

            {loading ? (
                <p>Đang tải danh mục...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Danh Mục</th>
                            <th>Mô Tả</th>
                            <th>Danh Mục Cha</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((cat) => {
                                const parent = categories.find((p) => p.categoryId === cat.parentCategoryId);
                                return (
                                    <tr key={cat.categoryId}>
                                        <td style={{ textAlign: "center" }}>{cat.categoryId}</td>
                                        <td><b>{cat.categoryName}</b></td>
                                        <td>{cat.categoryDescription}</td>
                                        <td style={{ textAlign: "center" }}>
                                            {parent ? parent.categoryName : "Gốc (Root)"}
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <span className={cat.isActive === 1 ? "badge badge-success" : "badge badge-danger"}>
                                                {cat.isActive === 1 ? "Active (1)" : "Inactive (0)"}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => {
                                                    setModalMode("update");
                                                    setSelectedCategory({
                                                        ...cat,
                                                        parentCategoryId: cat.parentCategoryId ?? "",
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Sửa
                                            </button>{" "}
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(cat)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    Không tìm thấy danh mục nào!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <CrudModal
                isOpen={isModalOpen}
                mode={modalMode}
                title="Danh Mục"
                initialData={selectedCategory}
                fields={fields}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
            />
        </div>
    );
}
