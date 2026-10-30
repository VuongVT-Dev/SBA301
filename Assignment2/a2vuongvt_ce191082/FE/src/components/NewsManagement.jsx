// Tác giả & coder: Thanh Vuong CE190182
import React, { useState, useEffect } from "react";
import api, { extractErrorMessage } from "../services/api";
import CrudModal from "./CrudModal";

export default function NewsManagement({ currentUser }) {
    const [newsList, setNewsList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedNews, setSelectedNews] = useState(null);

    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    const fetchAllData = async (keyword = "") => {
        try {
            setLoading(true);
            const [newsRes, catRes, tagRes] = await Promise.all([
                api.getAllNews(keyword),
                api.getCategories(),
                api.getTags(),
            ]);
            setNewsList(newsRes.data || []);
            setCategories(catRes.data || []);
            setTags(tagRes.data || []);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAllData(search);
    };

    const handleCreate = async (formData) => {
        try {
            await api.createNews({
                newsTitle: formData.newsTitle,
                headline: formData.headline,
                newsContent: formData.newsContent,
                newsSource: formData.newsSource || "FPT University",
                categoryId: Number(formData.categoryId),
                newsStatus: Number(formData.newsStatus),
                createdById: currentUser.accountId,
                tagIds: (formData.tagIds || []).map(Number),
            });
            setMessage({ type: "success", text: "Tạo bài viết mới thành công!" });
            fetchAllData(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.updateNews(selectedNews.newsArticleId, {
                newsTitle: formData.newsTitle,
                headline: formData.headline,
                newsContent: formData.newsContent,
                newsSource: formData.newsSource || "FPT University",
                categoryId: Number(formData.categoryId),
                newsStatus: Number(formData.newsStatus),
                updatedById: currentUser.accountId,
                tagIds: (formData.tagIds || []).map(Number),
            });
            setMessage({ type: "success", text: "Cập nhật bài viết thành công!" });
            fetchAllData(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleDelete = async (article) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${article.newsTitle}" không?`)) {
            return;
        }
        try {
            setMessage({ type: "", text: "" });
            await api.deleteNews(article.newsArticleId);
            setMessage({ type: "success", text: "Đã xóa bài viết thành công!" });
            fetchAllData(search);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        }
    };

    const handleCreateTag = async (formData) => {
        try {
            await api.createTag({
                tagName: formData.tagName.trim(),
                note: formData.note ? formData.note.trim() : "",
            });
            setMessage({ type: "success", text: `Đã thêm Tag "${formData.tagName}" thành công!` });
            const tagRes = await api.getTags();
            setTags(tagRes.data || []);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const fields = [
        { name: "newsTitle", label: "Tiêu Đề Bài Viết (NewsTitle)", required: true },
        { name: "headline", label: "Headline", required: true },
        {
            name: "categoryId",
            label: "Danh Mục (Category)",
            type: "select",
            required: true,
            defaultValue: categories[0]?.categoryId || "",
            options: categories.map((c) => ({
                value: c.categoryId,
                label: `${c.categoryName} (${c.isActive === 1 ? "Active" : "Inactive"})`,
            })),
        },
        {
            name: "newsContent",
            label: "Nội Dung (NewsContent)",
            type: "textarea",
            rows: 4,
            required: true,
        },
        {
            name: "newsSource",
            label: "Nguồn Tin (NewsSource)",
            required: true,
            defaultValue: "FPT University",
        },
        {
            name: "newsStatus",
            label: "Trạng Thái (NewsStatus)",
            type: "select",
            defaultValue: 1,
            options: [
                { value: 1, label: "Active (1 - Hiển thị công khai)" },
                { value: 0, label: "Inactive (0 - Bản nháp/Ẩn)" },
            ],
        },
        {
            name: "tagIds",
            label: "Thẻ Đính Kèm (Tags - NewsTag)",
            type: "checkbox-group",
            options: tags.map((t) => ({ value: t.tagId, label: t.tagName })),
        },
    ];

    const tagFields = [
        { name: "tagName", label: "Tên Tag (TagName)", required: true },
        { name: "note", label: "Ghi Chú (Note)", required: false },
    ];

    return (
        <div>
            <div className="section-header">
                <h2>Quản Lý Bài Viết & Tags (NewsArticle - Staff Role)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Tạo, sửa, xóa, tìm kiếm bài viết và gắn nhiều Tag (bảng NewsTag).
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
                        placeholder="Tìm theo tiêu đề hoặc headline..."
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
                            fetchAllData("");
                        }}
                    >
                        Tất cả
                    </button>
                </form>

                <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn btn-secondary" onClick={() => setIsTagModalOpen(true)}>
                        + Thêm Tag Mới
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => {
                            setModalMode("create");
                            setSelectedNews(null);
                            setIsModalOpen(true);
                        }}
                    >
                        + Thêm Bài Viết
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Đang tải danh sách bài viết...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu Đề & Headline</th>
                            <th>Danh Mục</th>
                            <th>Tags</th>
                            <th>Người Tạo / Ngày Tạo</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsList.length > 0 ? (
                            newsList.map((item) => (
                                <tr key={item.newsArticleId}>
                                    <td style={{ textAlign: "center" }}>{item.newsArticleId}</td>
                                    <td style={{ maxWidth: "280px" }}>
                                        <div style={{ fontWeight: "600" }}>{item.newsTitle}</div>
                                        <div style={{ fontSize: "12px", color: "#64748b" }}>{item.headline}</div>
                                    </td>
                                    <td>{item.category ? item.category.categoryName : "N/A"}</td>
                                    <td>
                                        {item.tags && item.tags.length > 0 ? (
                                            <div className="tag-list">
                                                {item.tags.map((t) => (
                                                    <span key={t.tagId} className="tag-chip">
                                                        #{t.tagName}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Không có tag</span>
                                        )}
                                    </td>
                                    <td style={{ fontSize: "12px" }}>
                                        <div><b>{item.createdBy ? item.createdBy.accountName : "N/A"}</b></div>
                                        <div style={{ color: "#64748b" }}>
                                            {item.createdDate ? new Date(item.createdDate).toLocaleDateString("vi-VN") : ""}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <span className={item.newsStatus === 1 ? "badge badge-success" : "badge badge-danger"}>
                                            {item.newsStatus === 1 ? "Active (1)" : "Inactive (0)"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => {
                                                setModalMode("update");
                                                setSelectedNews({
                                                    ...item,
                                                    categoryId: item.category ? item.category.categoryId : "",
                                                    tagIds: item.tags ? item.tags.map((t) => t.tagId) : [],
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Sửa
                                        </button>{" "}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(item)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    Không tìm thấy bài viết nào!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <CrudModal
                isOpen={isModalOpen}
                mode={modalMode}
                title="Bài Viết"
                initialData={selectedNews}
                fields={fields}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
            />

            <CrudModal
                isOpen={isTagModalOpen}
                mode="create"
                title="Tag"
                initialData={null}
                fields={tagFields}
                onClose={() => setIsTagModalOpen(false)}
                onSubmit={handleCreateTag}
            />
        </div>
    );
}
