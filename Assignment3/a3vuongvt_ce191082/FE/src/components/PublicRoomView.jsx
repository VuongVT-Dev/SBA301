// Tác giả & coder: Thanh Vuong CE190182
import React, { useState, useEffect } from "react";
import api, { extractErrorMessage, formatCurrency } from "../services/api";

export default function PublicRoomView({ currentUser, onGoToLogin, onGoToDashboard }) {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedTypeId, setSelectedTypeId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);

    const fetchRoomsData = async (keyword = "", typeId = "") => {
        try {
            setLoading(true);
            setError("");
            const [roomRes, typeRes] = await Promise.all([
                api.getPublicRooms(keyword, typeId),
                api.getRoomTypes(),
            ]);
            setRooms(roomRes.data || []);
            setRoomTypes(typeRes.data || []);
        } catch (err) {
            setError(extractErrorMessage(err, "Không thể tải danh sách phòng!"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomsData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRoomsData(search, selectedTypeId);
    };

    return (
        <div className="public-container">
            <header className="public-header">
                <div>
                    <h1 style={{ margin: 0, fontSize: "22px" }}>FU Mini Hotel Management System</h1>
                    <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
                        Tra cứu thông tin phòng trực tuyến (Không cần đăng nhập)
                    </span>
                </div>
                <div>
                    {currentUser ? (
                        <button className="btn btn-primary" onClick={onGoToDashboard}>
                            Vào Bảng Điều Khiển ({currentUser.customerFullName})
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={onGoToLogin}>
                            Đăng nhập / Đăng ký
                        </button>
                    )}
                </div>
            </header>

            <div className="public-content">
                <form onSubmit={handleSearch} className="toolbar">
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm theo số phòng, mô tả, loại phòng..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="form-control"
                            style={{ width: "220px" }}
                            value={selectedTypeId}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedTypeId(val);
                                fetchRoomsData(search, val);
                            }}
                        >
                            <option value="">-- Tất cả loại phòng --</option>
                            {roomTypes.map((rt) => (
                                <option key={rt.roomTypeId} value={rt.roomTypeId}>
                                    {rt.roomTypeName}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-primary">
                            Tìm kiếm
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setSearch("");
                                setSelectedTypeId("");
                                fetchRoomsData("", "");
                            }}
                        >
                            Làm mới
                        </button>
                    </div>
                </form>

                {error && <div className="alert-error">{error}</div>}

                {loading ? (
                    <p>Đang tải danh sách phòng...</p>
                ) : rooms.length === 0 ? (
                    <div className="empty-box">Không tìm thấy thông tin phòng nào phù hợp!</div>
                ) : (
                    <div className="room-grid">
                        {rooms.map((room) => (
                            <div key={room.roomId} className="room-card">
                                <div>
                                    <div className="room-card-meta">
                                        <span className="badge badge-info">
                                            {room.roomType ? room.roomType.roomTypeName : "Chưa phân loại"}
                                        </span>
                                        <span className={room.roomStatus === 1 ? "badge badge-success" : "badge badge-danger"}>
                                            {room.roomStatus === 1 ? "Available (1)" : "Inactive (0)"}
                                        </span>
                                    </div>
                                    <h3 className="room-card-title">Phòng {room.roomNumber}</h3>
                                    <p className="room-card-price">{formatCurrency(room.roomPricePerDay)} / ngày</p>
                                    <p className="room-card-excerpt">
                                        {room.roomDetailDescription || "Đầy đủ tiện nghi tiêu chuẩn khách sạn."}
                                    </p>
                                    <div className="tag-list">
                                        <span className="tag-chip">Sức chứa tối đa: {room.roomMaxCapacity} người</span>
                                        {room.roomType?.typeNote && (
                                            <span className="tag-chip">{room.roomType.typeNote}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="room-card-footer">
                                    <span style={{ fontSize: "12.5px", color: "#475569" }}>
                                        Mã phòng: <b>#{room.roomId}</b>
                                    </span>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => setSelectedRoom(room)}
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={currentUser ? onGoToDashboard : onGoToLogin}
                                        >
                                            Đặt phòng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedRoom && (
                <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi tiết Phòng {selectedRoom.roomNumber}</h3>
                            <button className="modal-close-btn" onClick={() => setSelectedRoom(null)}>
                                ✕
                            </button>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Mã phòng (RoomID):</span>
                            <b>{selectedRoom.roomId}</b>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Số phòng (RoomNumber):</span>
                            <b>{selectedRoom.roomNumber}</b>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Loại phòng (RoomType):</span>
                            <span className="badge badge-info">
                                {selectedRoom.roomType ? selectedRoom.roomType.roomTypeName : "N/A"}
                            </span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Sức chứa tối đa:</span>
                            <span>{selectedRoom.roomMaxCapacity} khách</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Giá thuê / ngày:</span>
                            <b style={{ color: "#16a34a" }}>{formatCurrency(selectedRoom.roomPricePerDay)}</b>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Mô tả phòng:</span>
                            <span>{selectedRoom.roomDetailDescription || "N/A"}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Mô tả loại phòng:</span>
                            <span>{selectedRoom.roomType?.typeDescription || "N/A"}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Ghi chú loại phòng:</span>
                            <span>{selectedRoom.roomType?.typeNote || "N/A"}</span>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setSelectedRoom(null)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
