// Tác giả & coder: Thanh Vuong CE190182
import React, { useState, useEffect } from "react";
import api, { extractErrorMessage, formatCurrency } from "../services/api";
import CrudModal from "./CrudModal";

export default function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

    const fetchAllData = async (keyword = "") => {
        try {
            setLoading(true);
            const [roomRes, typeRes] = await Promise.all([
                api.getAllRooms(keyword),
                api.getRoomTypes(),
            ]);
            setRooms(roomRes.data || []);
            setRoomTypes(typeRes.data || []);
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
            await api.createRoom({
                roomNumber: formData.roomNumber.trim(),
                roomTypeId: Number(formData.roomTypeId),
                roomMaxCapacity: Number(formData.roomMaxCapacity),
                roomPricePerDay: Number(formData.roomPricePerDay),
                roomStatus: Number(formData.roomStatus),
                roomDetailDescription: formData.roomDetailDescription.trim(),
            });
            setMessage({ type: "success", text: "Thêm phòng mới thành công!" });
            fetchAllData(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.updateRoom(selectedRoom.roomId, {
                roomNumber: formData.roomNumber.trim(),
                roomTypeId: Number(formData.roomTypeId),
                roomMaxCapacity: Number(formData.roomMaxCapacity),
                roomPricePerDay: Number(formData.roomPricePerDay),
                roomStatus: Number(formData.roomStatus),
                roomDetailDescription: formData.roomDetailDescription.trim(),
            });
            setMessage({ type: "success", text: "Cập nhật thông tin phòng thành công!" });
            fetchAllData(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleDelete = async (room) => {
        if (
            !window.confirm(
                `Bạn có chắc chắn muốn xóa phòng "${room.roomNumber}" không?\n(Lưu ý: Nếu phòng đã có trong BookingDetail, hệ thống sẽ chuyển trạng thái sang Inactive (0) thay vì xóa vĩnh viễn)`
            )
        ) {
            return;
        }
        try {
            setMessage({ type: "", text: "" });
            const res = await api.deleteRoom(room.roomId);
            setMessage({
                type: "success",
                text: res.data?.message || `Đã xử lý xóa phòng "${room.roomNumber}" thành công!`,
            });
            fetchAllData(search);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        }
    };

    const handleCreateRoomType = async (formData) => {
        try {
            await api.createRoomType({
                roomTypeName: formData.roomTypeName.trim(),
                typeDescription: formData.typeDescription ? formData.typeDescription.trim() : "",
                typeNote: formData.typeNote ? formData.typeNote.trim() : "",
            });
            setMessage({ type: "success", text: `Đã thêm loại phòng "${formData.roomTypeName}" thành công!` });
            const typeRes = await api.getRoomTypes();
            setRoomTypes(typeRes.data || []);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const roomFields = [
        { name: "roomNumber", label: "Số Phòng (RoomNumber)", required: true },
        {
            name: "roomTypeId",
            label: "Loại Phòng (RoomType)",
            type: "select",
            required: true,
            defaultValue: roomTypes[0]?.roomTypeId || "",
            options: roomTypes.map((rt) => ({
                value: rt.roomTypeId,
                label: `${rt.roomTypeName} (ID: ${rt.roomTypeId})`,
            })),
        },
        {
            name: "roomMaxCapacity",
            label: "Sức Chứa Tối Đa (RoomMaxCapacity)",
            type: "number",
            min: 1,
            required: true,
            defaultValue: 2,
        },
        {
            name: "roomPricePerDay",
            label: "Giá Phòng Mỗi Ngày (RoomPricePerDay - VNĐ)",
            type: "number",
            min: 1000,
            required: true,
            defaultValue: 500000,
        },
        {
            name: "roomStatus",
            label: "Trạng Thái Phòng (RoomStatus)",
            type: "select",
            defaultValue: 1,
            options: [
                { value: 1, label: "Active / Available (1)" },
                { value: 0, label: "Inactive / Deleted (0)" },
            ],
        },
        {
            name: "roomDetailDescription",
            label: "Mô Tả Chi Tiết (RoomDetailDescription)",
            type: "textarea",
            rows: 3,
            required: true,
        },
    ];

    const roomTypeFields = [
        { name: "roomTypeName", label: "Tên Loại Phòng (RoomTypeName)", required: true },
        { name: "typeDescription", label: "Mô Tả Loại Phòng (TypeDescription)", type: "textarea", rows: 2, required: true },
        { name: "typeNote", label: "Ghi Chú (TypeNote)", required: false },
    ];

    return (
        <div>
            <div className="section-header">
                <h2>Quản Lý Thông Tin Phòng (Room Management - Staff Role)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Quy tắc xóa: Xóa vĩnh viễn nếu phòng chưa thuộc giao dịch thuê nào; nếu phòng đã có trong BookingDetail thì chỉ đổi trạng thái sang Inactive (0).
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
                        placeholder="Tìm theo số phòng, loại phòng, mô tả..."
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
                    <button className="btn btn-secondary" onClick={() => setIsTypeModalOpen(true)}>
                        + Thêm Loại Phòng
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => {
                            setModalMode("create");
                            setSelectedRoom(null);
                            setIsModalOpen(true);
                        }}
                    >
                        + Thêm Phòng Mới
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Đang tải danh sách phòng...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>RoomID</th>
                            <th>Số Phòng</th>
                            <th>Loại Phòng (RoomType)</th>
                            <th>Sức Chứa</th>
                            <th>Giá / Ngày</th>
                            <th>Mô Tả Chi Tiết</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length > 0 ? (
                            rooms.map((r) => (
                                <tr key={r.roomId}>
                                    <td style={{ textAlign: "center" }}>{r.roomId}</td>
                                    <td style={{ textAlign: "center" }}><b>Phòng {r.roomNumber}</b></td>
                                    <td>
                                        <span className="badge badge-info">
                                            {r.roomType ? r.roomType.roomTypeName : "N/A"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>{r.roomMaxCapacity} người</td>
                                    <td style={{ textAlign: "right", fontWeight: "600", color: "#15803d" }}>
                                        {formatCurrency(r.roomPricePerDay)}
                                    </td>
                                    <td>{r.roomDetailDescription}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <span className={r.roomStatus === 1 ? "badge badge-success" : "badge badge-danger"}>
                                            {r.roomStatus === 1 ? "Active (1)" : "Inactive (0)"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => {
                                                setModalMode("update");
                                                setSelectedRoom({
                                                    ...r,
                                                    roomTypeId: r.roomType ? r.roomType.roomTypeId : "",
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Sửa
                                        </button>{" "}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(r)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>
                                    Không tìm thấy thông tin phòng nào!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <CrudModal
                isOpen={isModalOpen}
                mode={modalMode}
                title="Phòng"
                initialData={selectedRoom}
                fields={roomFields}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
            />

            <CrudModal
                isOpen={isTypeModalOpen}
                mode="create"
                title="Loại Phòng (RoomType)"
                initialData={null}
                fields={roomTypeFields}
                onClose={() => setIsTypeModalOpen(false)}
                onSubmit={handleCreateRoomType}
            />
        </div>
    );
}
