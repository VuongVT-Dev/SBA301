// Tác giả & coder: Thanh Vuong CE190182
import React, { useState, useEffect } from "react";
import api, { extractErrorMessage, formatCurrency } from "../services/api";

export default function BookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [viewBooking, setViewBooking] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState("create");
    const [editingId, setEditingId] = useState(null);

    const todayStr = new Date().toISOString().slice(0, 10);

    const [customerId, setCustomerId] = useState("");
    const [bookingDate, setBookingDate] = useState(todayStr);
    const [bookingStatus, setBookingStatus] = useState(1);
    const [detailRows, setDetailRows] = useState([]);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchAllData = async (keyword = "") => {
        try {
            setLoading(true);
            const [bookingRes, custRes, roomRes] = await Promise.all([
                api.getAllBookings(keyword),
                api.getCustomers(),
                api.getAllRooms(),
            ]);
            setBookings(bookingRes.data || []);
            setCustomers(custRes.data || []);
            setRooms(roomRes.data || []);
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

    const computeDays = (start, end) => {
        if (!start || !end) return 1;
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    };

    const getRoomPrice = (rId) => {
        const found = rooms.find((r) => Number(r.roomId) === Number(rId));
        return found ? Number(found.roomPricePerDay || 0) : 0;
    };

    const openCreateModal = () => {
        const firstCustomerId = customers[0]?.customerId || "";
        const firstRoomId = rooms[0]?.roomId || "";
        const price = getRoomPrice(firstRoomId);

        setFormMode("create");
        setEditingId(null);
        setCustomerId(firstCustomerId);
        setBookingDate(todayStr);
        setBookingStatus(1);
        setDetailRows([
            {
                roomId: firstRoomId,
                startDate: todayStr,
                endDate: todayStr,
                actualPrice: price,
            },
        ]);
        setFormError("");
        setIsFormOpen(true);
    };

    const openEditModal = (booking) => {
        setFormMode("update");
        setEditingId(booking.bookingReservationId);
        setCustomerId(booking.customer?.customerId || "");
        setBookingDate(booking.bookingDate || todayStr);
        setBookingStatus(booking.bookingStatus ?? 1);
        setDetailRows(
            (booking.bookingDetails || []).map((d) => ({
                roomId: d.roomId,
                startDate: d.startDate,
                endDate: d.endDate,
                actualPrice: d.actualPrice,
            }))
        );
        setFormError("");
        setIsFormOpen(true);
    };

    const handleDetailChange = (index, field, value) => {
        setDetailRows((prev) => {
            const next = [...prev];
            const updated = { ...next[index], [field]: value };
            if (field === "roomId" || field === "startDate" || field === "endDate") {
                const days = computeDays(updated.startDate, updated.endDate);
                const unitPrice = getRoomPrice(updated.roomId);
                updated.actualPrice = unitPrice * days;
            }
            next[index] = updated;
            return next;
        });
    };

    const handleAddRow = () => {
        const firstRoomId = rooms[0]?.roomId || "";
        setDetailRows((prev) => [
            ...prev,
            {
                roomId: firstRoomId,
                startDate: todayStr,
                endDate: todayStr,
                actualPrice: getRoomPrice(firstRoomId),
            },
        ]);
    };

    const handleRemoveRow = (index) => {
        if (detailRows.length <= 1) return;
        setDetailRows((prev) => prev.filter((_, idx) => idx !== index));
    };

    const computedTotalPrice = detailRows.reduce(
        (sum, r) => sum + Number(r.actualPrice || 0),
        0
    );

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        if (!customerId) {
            setFormError("Vui lòng chọn khách hàng!");
            return;
        }
        if (detailRows.length === 0) {
            setFormError("Đơn đặt phòng phải có ít nhất 1 phòng!");
            return;
        }
        const roomSet = new Set();
        for (const r of detailRows) {
            if (!r.roomId || !r.startDate || !r.endDate) {
                setFormError("Vui lòng chọn đầy đủ Phòng, Ngày bắt đầu và Ngày kết thúc!");
                return;
            }
            if (new Date(r.endDate) < new Date(r.startDate)) {
                setFormError("Ngày trả phòng (EndDate) không được nhỏ hơn Ngày nhận phòng (StartDate)!");
                return;
            }
            if (roomSet.has(Number(r.roomId))) {
                setFormError("Không được chọn trùng cùng 1 phòng nhiều lần trong cùng một đơn!");
                return;
            }
            roomSet.add(Number(r.roomId));
        }

        const payload = {
            customerId: Number(customerId),
            bookingDate,
            bookingStatus: Number(bookingStatus),
            bookingDetails: detailRows.map((d) => ({
                roomId: Number(d.roomId),
                startDate: d.startDate,
                endDate: d.endDate,
                actualPrice: Number(d.actualPrice),
            })),
        };

        try {
            setSubmitting(true);
            setFormError("");
            if (formMode === "create") {
                await api.createBooking(payload);
                setMessage({ type: "success", text: "Tạo đơn đặt phòng mới thành công!" });
            } else {
                await api.updateBooking(editingId, payload);
                setMessage({ type: "success", text: "Cập nhật đơn đặt phòng thành công!" });
            }
            setIsFormOpen(false);
            fetchAllData(search);
        } catch (err) {
            setFormError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (booking) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn đặt phòng #${booking.bookingReservationId} không?`)) {
            return;
        }
        try {
            setMessage({ type: "", text: "" });
            await api.deleteBooking(booking.bookingReservationId);
            setMessage({ type: "success", text: `Đã xóa đơn đặt phòng #${booking.bookingReservationId} thành công!` });
            fetchAllData(search);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        }
    };

    return (
        <div>
            <div className="section-header">
                <h2>Quản Lý Đặt Phòng (Booking Reservation & Details - Staff Role)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Quản lý các giao dịch đặt phòng (bao gồm danh sách nhiều phòng BookingDetail trong mỗi đơn).
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
                        placeholder="Tìm theo mã đơn, tên khách, số phòng..."
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

                <button className="btn btn-success" onClick={openCreateModal}>
                    + Tạo Đơn Đặt Phòng
                </button>
            </div>

            {loading ? (
                <p>Đang tải danh sách đặt phòng...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Mã Đơn (ID)</th>
                            <th>Khách Hàng</th>
                            <th>Ngày Đặt</th>
                            <th>Danh Sách Phòng (BookingDetail)</th>
                            <th>Tổng Tiền (TotalPrice)</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map((b) => (
                                <tr key={b.bookingReservationId}>
                                    <td style={{ textAlign: "center" }}><b>#{b.bookingReservationId}</b></td>
                                    <td>
                                        <div><b>{b.customer?.customerFullName || "N/A"}</b></div>
                                        <div style={{ fontSize: "12px", color: "#64748b" }}>{b.customer?.emailAddress}</div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>{b.bookingDate || "N/A"}</td>
                                    <td>
                                        {b.bookingDetails && b.bookingDetails.length > 0 ? (
                                            <div className="tag-list">
                                                {b.bookingDetails.map((d) => (
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
                                        {formatCurrency(b.totalPrice)}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <span className={b.bookingStatus === 1 ? "badge badge-success" : "badge badge-danger"}>
                                            {b.bookingStatus === 1 ? "Confirmed (1)" : "Cancelled (0)"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => setViewBooking(b)}
                                        >
                                            Chi tiết
                                        </button>{" "}
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => openEditModal(b)}
                                        >
                                            Sửa
                                        </button>{" "}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(b)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    Không tìm thấy đơn đặt phòng nào!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal Xem Chi Tiết BookingDetails */}
            {viewBooking && (
                <div className="modal-overlay" onClick={() => setViewBooking(null)}>
                    <div className="modal-box" style={{ maxWidth: "660px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Chi Tiết Đơn Đặt Phòng #{viewBooking.bookingReservationId}</h3>
                            <button className="modal-close-btn" onClick={() => setViewBooking(null)}>
                                ✕
                            </button>
                        </div>
                        <div style={{ marginBottom: "14px", fontSize: "14px" }}>
                            <p style={{ margin: "4px 0" }}>
                                <b>Khách hàng:</b> {viewBooking.customer?.customerFullName} ({viewBooking.customer?.emailAddress})
                            </p>
                            <p style={{ margin: "4px 0" }}>
                                <b>Ngày đặt:</b> {viewBooking.bookingDate} | <b>Tổng tiền:</b>{" "}
                                <span style={{ color: "#15803d", fontWeight: "700" }}>
                                    {formatCurrency(viewBooking.totalPrice)}
                                </span>
                            </p>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>RoomID</th>
                                    <th>Số Phòng</th>
                                    <th>Loại Phòng</th>
                                    <th>StartDate</th>
                                    <th>EndDate</th>
                                    <th>ActualPrice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(viewBooking.bookingDetails || []).map((d) => (
                                    <tr key={`${d.bookingReservationId}-${d.roomId}`}>
                                        <td style={{ textAlign: "center" }}>{d.roomId}</td>
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
                            <button className="btn btn-secondary" onClick={() => setViewBooking(null)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tạo / Sửa Đơn Đặt Phòng */}
            {isFormOpen && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{ maxWidth: "680px" }}>
                        <div className="modal-header">
                            <h3>
                                {formMode === "create"
                                    ? "Tạo Đơn Đặt Phòng Mới"
                                    : `Cập Nhật Đơn Đặt Phòng #${editingId}`}
                            </h3>
                            <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
                                ✕
                            </button>
                        </div>

                        {formError && <div className="alert-error">{formError}</div>}

                        <form onSubmit={handleSubmitBooking}>
                            <div className="form-group">
                                <label className="form-label">Khách Hàng (Customer) *</label>
                                <select
                                    className="form-control"
                                    value={customerId}
                                    onChange={(e) => setCustomerId(e.target.value)}
                                >
                                    {customers.map((c) => (
                                        <option key={c.customerId} value={c.customerId}>
                                            {c.customerFullName} - {c.emailAddress} (ID: {c.customerId})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: "flex", gap: "12px" }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Ngày Đặt (BookingDate) *</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Trạng Thái (BookingStatus)</label>
                                    <select
                                        className="form-control"
                                        value={bookingStatus}
                                        onChange={(e) => setBookingStatus(e.target.value)}
                                    >
                                        <option value={1}>Confirmed / Active (1)</option>
                                        <option value={0}>Cancelled / Inactive (0)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0" }}>
                                <label className="form-label" style={{ margin: 0 }}>
                                    Danh Sách Phòng Đặt (BookingDetail):
                                </label>
                                <button type="button" className="btn btn-sm btn-success" onClick={handleAddRow}>
                                    + Thêm phòng vào đơn
                                </button>
                            </div>

                            {detailRows.map((row, idx) => (
                                <div key={idx} className="detail-row-box">
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
                                        <div style={{ flex: "2 1 180px" }}>
                                            <label className="form-label">Phòng</label>
                                            <select
                                                className="form-control"
                                                value={row.roomId}
                                                onChange={(e) => handleDetailChange(idx, "roomId", e.target.value)}
                                            >
                                                {rooms.map((r) => (
                                                    <option key={r.roomId} value={r.roomId}>
                                                        Phòng {r.roomNumber} - {formatCurrency(r.roomPricePerDay)}/ngày
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ flex: "1 1 130px" }}>
                                            <label className="form-label">StartDate</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={row.startDate}
                                                onChange={(e) => handleDetailChange(idx, "startDate", e.target.value)}
                                            />
                                        </div>
                                        <div style={{ flex: "1 1 130px" }}>
                                            <label className="form-label">EndDate</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={row.endDate}
                                                onChange={(e) => handleDetailChange(idx, "endDate", e.target.value)}
                                            />
                                        </div>
                                        <div style={{ flex: "1 1 130px" }}>
                                            <label className="form-label">ActualPrice (VNĐ)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={row.actualPrice}
                                                onChange={(e) => handleDetailChange(idx, "actualPrice", e.target.value)}
                                            />
                                        </div>
                                        {detailRows.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleRemoveRow(idx)}
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div style={{ textAlign: "right", fontWeight: "700", fontSize: "15px", marginTop: "8px" }}>
                                Tổng cộng (TotalPrice):{" "}
                                <span style={{ color: "#15803d" }}>{formatCurrency(computedTotalPrice)}</span>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsFormOpen(false)}
                                    disabled={submitting}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? "Đang lưu..." : "Lưu Đơn Đặt Phòng"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
