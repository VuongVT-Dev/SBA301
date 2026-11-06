// Tác giả & coder: Thanh Vuong CE190182
import React, { useState, useEffect } from "react";
import api, { extractErrorMessage, formatCurrency } from "../services/api";

export default function BookingHistory({ currentUser }) {
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.getCustomerBookings(currentUser.customerId);
            setHistory(res.data || []);
        } catch (err) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.customerId) {
            fetchHistory();
        }
    }, [currentUser]);

    const filteredHistory = history.filter((b) => {
        const kw = search.toLowerCase().trim();
        if (!kw) return true;
        const matchId = String(b.bookingReservationId).includes(kw);
        const matchDate = b.bookingDate && b.bookingDate.toLowerCase().includes(kw);
        const matchRoom = (b.bookingDetails || []).some(
            (d) => d.room?.roomNumber && d.room.roomNumber.toLowerCase().includes(kw)
        );
        return matchId || matchDate || matchRoom;
    });

    return (
        <div>
            <div className="section-header">
                <h2>Lịch Sử Đặt Phòng Của Tôi (Booking Reservation History)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Danh sách các đơn đặt phòng của khách hàng <b>{currentUser.customerFullName}</b>.
                </p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="toolbar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Lọc theo mã đơn, ngày đặt hoặc số phòng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-secondary" onClick={fetchHistory}>
                    Làm mới
                </button>
            </div>

            {loading ? (
                <p>Đang tải lịch sử đặt phòng...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Mã Đơn (ID)</th>
                            <th>Ngày Đặt (BookingDate)</th>
                            <th>Các Phòng Đã Đặt (BookingDetail)</th>
                            <th>Tổng Tiền (TotalPrice)</th>
                            <th>Trạng Thái</th>
                            <th>Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item) => (
                                <tr key={item.bookingReservationId}>
                                    <td style={{ textAlign: "center" }}><b>#{item.bookingReservationId}</b></td>
                                    <td style={{ textAlign: "center" }}>{item.bookingDate || "N/A"}</td>
                                    <td>
                                        {item.bookingDetails && item.bookingDetails.length > 0 ? (
                                            <div className="tag-list">
                                                {item.bookingDetails.map((d) => (
                                                    <span key={`${d.bookingReservationId}-${d.roomId}`} className="tag-chip">
                                                        Phòng {d.room ? d.room.roomNumber : d.roomId} ({d.startDate} → {d.endDate})
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td style={{ textAlign: "right", fontWeight: "700", color: "#15803d" }}>
                                        {formatCurrency(item.totalPrice)}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <span className={item.bookingStatus === 1 ? "badge badge-success" : "badge badge-danger"}>
                                            {item.bookingStatus === 1 ? "Confirmed (1)" : "Cancelled (0)"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => setSelectedBooking(item)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                    Bạn chưa có đơn đặt phòng nào!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {selectedBooking && (
                <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div className="modal-box" style={{ maxWidth: "640px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi Tiết Đơn Đặt Phòng #{selectedBooking.bookingReservationId}</h3>
                            <button className="modal-close-btn" onClick={() => setSelectedBooking(null)}>
                                ✕
                            </button>
                        </div>
                        <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
                            <b>Ngày đặt:</b> {selectedBooking.bookingDate} | <b>Tổng cộng:</b>{" "}
                            <span style={{ color: "#15803d", fontWeight: "700" }}>
                                {formatCurrency(selectedBooking.totalPrice)}
                            </span>
                        </p>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Số Phòng</th>
                                    <th>Loại Phòng</th>
                                    <th>StartDate</th>
                                    <th>EndDate</th>
                                    <th>ActualPrice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(selectedBooking.bookingDetails || []).map((d) => (
                                    <tr key={`${d.bookingReservationId}-${d.roomId}`}>
                                        <td style={{ textAlign: "center" }}><b>Phòng {d.room?.roomNumber || d.roomId}</b></td>
                                        <td>{d.room?.roomType?.roomTypeName || "N/A"}</td>
                                        <td style={{ textAlign: "center" }}>{d.startDate}</td>
                                        <td style={{ textAlign: "center" }}>{d.endDate}</td>
                                        <td style={{ textAlign: "right", fontWeight: "600" }}>
                                            {formatCurrency(d.actualPrice)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setSelectedBooking(null)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
