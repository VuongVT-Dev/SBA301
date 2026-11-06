// Tác giả & coder: Thanh Vuong CE190182
import React, { useState, useEffect } from "react";
import api, { extractErrorMessage, formatCurrency } from "../services/api";

export default function CustomerBookingCreate({ currentUser, onBookingCreated }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const todayStr = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    const [detailRows, setDetailRows] = useState([]);

    const computeDays = (start, end) => {
        if (!start || !end) return 1;
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    };

    const getRoomPrice = (list, rId) => {
        const found = list.find((r) => Number(r.roomId) === Number(rId));
        return found ? Number(found.roomPricePerDay || 0) : 0;
    };

    useEffect(() => {
        const loadRooms = async () => {
            try {
                setLoading(true);
                const res = await api.getPublicRooms();
                const activeRooms = (res.data || []).filter((r) => r.roomStatus === 1);
                setRooms(activeRooms);
                if (activeRooms.length > 0) {
                    const firstId = activeRooms[0].roomId;
                    const price = getRoomPrice(activeRooms, firstId);
                    setDetailRows([
                        {
                            roomId: firstId,
                            startDate: todayStr,
                            endDate: tomorrow,
                            actualPrice: price * computeDays(todayStr, tomorrow),
                        },
                    ]);
                }
            } catch (err) {
                setMessage({ type: "error", text: extractErrorMessage(err) });
            } finally {
                setLoading(false);
            }
        };
        loadRooms();
    }, []);

    const handleDetailChange = (index, field, value) => {
        setDetailRows((prev) => {
            const next = [...prev];
            const updated = { ...next[index], [field]: value };
            if (field === "roomId" || field === "startDate" || field === "endDate") {
                const days = computeDays(updated.startDate, updated.endDate);
                const unitPrice = getRoomPrice(rooms, updated.roomId);
                updated.actualPrice = unitPrice * days;
            }
            next[index] = updated;
            return next;
        });
    };

    const handleAddRoomRow = () => {
        if (rooms.length === 0) return;
        const usedIds = detailRows.map((d) => Number(d.roomId));
        const availableRoom = rooms.find((r) => !usedIds.includes(Number(r.roomId))) || rooms[0];
        const price = getRoomPrice(rooms, availableRoom.roomId);

        setDetailRows((prev) => [
            ...prev,
            {
                roomId: availableRoom.roomId,
                startDate: todayStr,
                endDate: tomorrow,
                actualPrice: price * computeDays(todayStr, tomorrow),
            },
        ]);
    };

    const handleRemoveRoomRow = (index) => {
        if (detailRows.length <= 1) return;
        setDetailRows((prev) => prev.filter((_, idx) => idx !== index));
    };

    const totalPrice = detailRows.reduce((sum, r) => sum + Number(r.actualPrice || 0), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (detailRows.length === 0) {
            setMessage({ type: "error", text: "Vui lòng chọn ít nhất 1 phòng để đặt!" });
            return;
        }
        const roomSet = new Set();
        for (const r of detailRows) {
            if (!r.roomId || !r.startDate || !r.endDate) {
                setMessage({ type: "error", text: "Vui lòng chọn đầy đủ Phòng, Ngày nhận phòng và Ngày trả phòng!" });
                return;
            }
            if (new Date(r.endDate) < new Date(r.startDate)) {
                setMessage({ type: "error", text: "Ngày trả phòng (EndDate) phải lớn hơn hoặc bằng Ngày nhận phòng (StartDate)!" });
                return;
            }
            if (roomSet.has(Number(r.roomId))) {
                setMessage({ type: "error", text: "Không được chọn trùng cùng 1 phòng nhiều lần trong cùng một đơn đặt phòng!" });
                return;
            }
            roomSet.add(Number(r.roomId));
        }

        try {
            setSubmitting(true);
            setMessage({ type: "", text: "" });
            const res = await api.createBooking({
                customerId: currentUser.customerId,
                bookingDate: todayStr,
                bookingStatus: 1,
                bookingDetails: detailRows.map((d) => ({
                    roomId: Number(d.roomId),
                    startDate: d.startDate,
                    endDate: d.endDate,
                    actualPrice: Number(d.actualPrice),
                })),
            });
            setMessage({
                type: "success",
                text: `Đặt phòng trực tuyến thành công! Mã đơn đặt phòng của bạn là #${res.data.bookingReservationId}.`,
            });
            if (onBookingCreated) {
                setTimeout(() => onBookingCreated(), 1200);
            }
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="section-header">
                <h2>Đặt Phòng Trực Tuyến (Online Booking Reservation - Customer Role)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Bạn có thể chọn đặt 1 hoặc nhiều phòng trong cùng một đơn đặt phòng (BookingReservation).
                </p>
            </div>

            {message.text && (
                <div className={message.type === "error" ? "alert-error" : "alert-success"}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <p>Đang tải danh sách phòng khả dụng...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="toolbar">
                        <span style={{ fontSize: "14px" }}>
                            Khách hàng đặt: <b>{currentUser.customerFullName}</b> ({currentUser.emailAddress})
                        </span>
                        <button type="button" className="btn btn-success" onClick={handleAddRoomRow}>
                            + Thêm Phòng Vào Đơn
                        </button>
                    </div>

                    {detailRows.map((row, idx) => {
                        const roomObj = rooms.find((r) => Number(r.roomId) === Number(row.roomId));
                        const days = computeDays(row.startDate, row.endDate);
                        return (
                            <div key={idx} className="detail-row-box">
                                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
                                    <div style={{ flex: "2 1 240px" }}>
                                        <label className="form-label">Chọn Phòng #{idx + 1}</label>
                                        <select
                                            className="form-control"
                                            value={row.roomId}
                                            onChange={(e) => handleDetailChange(idx, "roomId", e.target.value)}
                                        >
                                            {rooms.map((r) => (
                                                <option key={r.roomId} value={r.roomId}>
                                                    Phòng {r.roomNumber} ({r.roomType?.roomTypeName}) - {formatCurrency(r.roomPricePerDay)}/ngày (Tối đa {r.roomMaxCapacity} khách)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ flex: "1 1 150px" }}>
                                        <label className="form-label">Ngày Nhận Phòng (StartDate)</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={row.startDate}
                                            onChange={(e) => handleDetailChange(idx, "startDate", e.target.value)}
                                        />
                                    </div>

                                    <div style={{ flex: "1 1 150px" }}>
                                        <label className="form-label">Ngày Trả Phòng (EndDate)</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={row.endDate}
                                            onChange={(e) => handleDetailChange(idx, "endDate", e.target.value)}
                                        />
                                    </div>

                                    <div style={{ flex: "1 1 160px" }}>
                                        <label className="form-label">Thành Tiền ({days} ngày)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            readOnly
                                            style={{ backgroundColor: "#e2e8f0", fontWeight: "700", color: "#15803d" }}
                                            value={formatCurrency(row.actualPrice)}
                                        />
                                    </div>

                                    {detailRows.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleRemoveRoomRow(idx)}
                                        >
                                            Xóa phòng
                                        </button>
                                    )}
                                </div>
                                {roomObj && (
                                    <div style={{ marginTop: "6px", fontSize: "12.5px", color: "#475569" }}>
                                        Mô tả: {roomObj.roomDetailDescription}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div
                        style={{
                            marginTop: "16px",
                            padding: "14px 18px",
                            background: "#f8fafc",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div style={{ fontSize: "16px", fontWeight: "700" }}>
                            Tổng Tiền Đơn Đặt Phòng (TotalPrice):{" "}
                            <span style={{ color: "#15803d" }}>{formatCurrency(totalPrice)}</span>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Đang gửi đơn đặt phòng..." : "Xác Nhận Đặt Phòng"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
