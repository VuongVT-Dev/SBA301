// Tác giả & coder: Thanh Vuong CE190182
import React, {useState, useEffect} from "react";
import api, {extractErrorMessage} from "../services/api";

export default function PublicNewsView({currentUser, onGoToLogin, onGoToDashboard}) {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedArticle, setSelectedArticle] = useState(null);

    const fetchActiveNews = async (keyword = "") => {
        try {
            setLoading(true);
            setError("");
            const res = await api.getPublicNews(keyword);
            setArticles(res.data || []);
        } catch (err) {
            setError(extractErrorMessage(err, "Không thể tải danh sách tin tức!"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveNews();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchActiveNews(search);
    };

    return (
        <div className="public-container">
            <header className="public-header">
                <div>
                    <h1 style={{margin: 0, fontSize: "22px"}}>FUNews Management System</h1>
                </div>
                <div>
                    {currentUser ? (
                        <button className="btn btn-primary" onClick={onGoToDashboard}>
                            Vào trang Quản trị ({currentUser.accountName})
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={onGoToLogin}>
                            Đăng nhập
                        </button>
                    )}
                </div>
            </header>

            <div className="public-content">
                <form onSubmit={handleSearch} className="toolbar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm gì đó đi :D"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div style={{display: "flex", gap: "8px"}}>
                        <button type="submit" className="btn btn-primary">
                            Tìm kiếm
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setSearch("");
                                fetchActiveNews("");
                            }}
                        >
                            Làm mới
                        </button>
                    </div>
                </form>

                {error && <div className="alert-error">{error}</div>}

                {loading ? (
                    <p>Đang tải bản tin...</p> // khi bấm làm mới hiển thị loading này
                ) : articles.length === 0 ? (
                    <div className="empty-box">Không có bài viết nào như vậy đâu :D</div>
                ) : (
                    <div className="news-grid">
                        {articles.map((item) => (
                            <div key={item.newsArticleId} className="news-card">
                                <div className="news-card-meta">
                                    <span className="badge badge-info">
                                        {item.category ? item.category.categoryName : "Chưa phân loại"}
                                    </span>
                                    <span style={{fontSize: "12px", color: "#64748b"}}>
                                        {item.createdDate ? new Date(item.createdDate).toLocaleDateString("vi-VN") : ""}
                                    </span>
                                </div>
                                <h3 className="news-card-title">{item.newsTitle}</h3>
                                <p className="news-card-headline">{item.headline}</p>
                                <p className="news-card-excerpt">
                                    {item.newsContent && item.newsContent.length > 140
                                        ? item.newsContent.slice(0, 140) + "..."
                                        : item.newsContent}
                                </p>

                                {item.tags && item.tags.length > 0 && (
                                    <div className="tag-list">
                                        {item.tags.map((t) => (
                                            <span key={t.tagId} className="tag-chip">
                                                #{t.tagName}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="news-card-footer">
                                    <span style={{fontSize: "12px", color: "#475569"}}>
                                        Tác giả: <b>{item.createdBy ? item.createdBy.accountName : "N/A"}</b>
                                    </span>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => setSelectedArticle(item)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedArticle && (
                <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
                    <div className="modal-box" style={{maxWidth: "650px"}} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedArticle.newsTitle}</h3>
                            <button className="modal-close-btn" onClick={() => setSelectedArticle(null)}>
                                ✕
                            </button>
                        </div>
                        <p style={{fontWeight: "600", color: "#334155", marginTop: 0}}>
                            {selectedArticle.headline}
                        </p>
                        <div
                            style={{
                                background: "#f8fafc",
                                padding: "14px",
                                borderRadius: "6px",
                                lineHeight: 1.6,
                                whiteSpace: "pre-line",
                                marginBottom: "12px",
                            }}
                        >
                            {selectedArticle.newsContent}
                        </div>
                        {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                            <div className="tag-list">
                                {selectedArticle.tags.map((t) => (
                                    <span key={t.tagId} className="tag-chip">
                                        #{t.tagName}
                                    </span>
                                ))}
                            </div>
                        )}
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
