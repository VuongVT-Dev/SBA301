// Tác giả & coder: Thanh Vuong CE190182
import React, { useState, useEffect } from "react";
import api, { extractErrorMessage } from "../services/api";

export default function NewsHistory({ currentUser }) {
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedArticle, setSelectedArticle] = useState(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.getNewsHistory(currentUser.accountId);
            setHistory(res.data || []);
        } catch (err) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.accountId) {
            fetchHistory();
        }
    }, [currentUser]);

    const filteredHistory = history.filter((item) => {
        const kw = search.toLowerCase().trim();
        if (!kw) return true;
        return (
            (item.newsTitle && item.newsTitle.toLowerCase().includes(kw)) ||
            (item.headline && item.headline.toLowerCase().includes(kw))
        );
    });

    return (
        <div>
            <div className="section-header">
                <h2>Lịch Sử Bài Viết Đã Tạo (My News History)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Danh sách các bài viết do <b>{currentUser.accountName}</b> tạo ra trong hệ thống.
                </p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="toolbar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Lọc nhanh theo tiêu đề hoặc headline..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-secondary" onClick={fetchHistory}>
                    Làm mới
                </button>
            </div>

            {loading ? (
                <p>Đang tải lịch sử bài viết...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu Đề</th>
                            <th>Headline</th>
                            <th>Danh Mục</th>
                            <th>Tags</th>
                            <th>Ngày Tạo</th>
                            <th>Trạng Thái</th>
                            <th>Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item) => (
                                <tr key={item.newsArticleId}>
                                    <td style={{ textAlign: "center" }}>{item.newsArticleId}</td>
                                    <td><b>{item.newsTitle}</b></td>
                                    <td>{item.headline}</td>
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
                                            "—"
                                        )}
                                    </td>
                                    <td style={{ textAlign: "center", fontSize: "12px" }}>
                                        {item.createdDate ? new Date(item.createdDate).toLocaleString("vi-VN") : "N/A"}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <span className={item.newsStatus === 1 ? "badge badge-success" : "badge badge-danger"}>
                                            {item.newsStatus === 1 ? "Active (1)" : "Inactive (0)"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => setSelectedArticle(item)}
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>
                                    Bạn chưa tạo bài viết nào phù hợp!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {selectedArticle && (
                <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
                    <div className="modal-box" style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedArticle.newsTitle}</h3>
                            <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>
                                ✕
                            </button>
                        </div>
                        <p style={{ fontWeight: "600", color: "#334155" }}>{selectedArticle.headline}</p>
                        <div
                            style={{
                                background: "#f8fafc",
                                padding: "12px",
                                borderRadius: "6px",
                                whiteSpace: "pre-line",
                                marginBottom: "12px",
                            }}
                        >
                            {selectedArticle.newsContent}
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setSelectedArticle(null)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
