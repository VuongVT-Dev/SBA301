import React, { useState } from "react";
import CrudModal from "./CrudModal";

export default function UserManagement({ users, setUsers }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedUser, setSelectedUser] = useState(null);

    // Tìm kiếm theo username
    const displayedUsers = users.filter((u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    const handleCreate = (data) => {
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
            username: data.username,
            password: data.password || data.username,
            role: Number(data.role || 2),
            status: Number(data.status !== undefined ? data.status : 1),
        };
        setUsers([...users, newUser]);
    };

    const handleUpdate = (data) => {
        setUsers(
            users.map((item) =>
                item.id === selectedUser.id
                    ? {
                          ...item,
                          ...data,
                          role: Number(data.role),
                          status: Number(data.status),
                      }
                    : item
            )
        );
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?")) {
            setUsers(users.filter((item) => item.id !== id));
        }
    };

    // Khai báo fields cho CrudModal
    const fields = [
        { name: "username", label: "Tên Đăng Nhập", required: true },
        { name: "password", label: "Mật Khẩu", type: "password" },
        {
            name: "role",
            label: "Vai Trò",
            type: "select",
            options: [
                { value: 1, label: "Admin" },
                { value: 2, label: "Staff" },
            ],
        },
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
            <h2>Quản Lý Account / User</h2>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "6px", width: "250px" }}
                />
                <button
                    onClick={() => {
                        setModalMode("create");
                        setSelectedUser(null);
                        setIsModalOpen(true);
                    }}
                    style={{ backgroundColor: "#007bff", color: "#fff", border: "none", padding: "6px 12px", cursor: "pointer" }}
                >
                    + Thêm User
                </button>
            </div>

            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f2f2f2" }}>
                        <th>ID</th>
                        <th>Tên Đăng Nhập</th>
                        <th>Vai Trò</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedUsers.length > 0 ? (
                        displayedUsers.map((user) => (
                            <tr key={user.id} style={{ textAlign: "center" }}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>
                                    <span
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            backgroundColor: user.role === 1 ? "#e0e7ff" : "#f3f4f6",
                                            color: user.role === 1 ? "#4338ca" : "#374151",
                                        }}
                                    >
                                        {user.role === 1 ? "Admin" : "Staff"}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            backgroundColor: user.status === 1 ? "#dcfce7" : "#fee2e2",
                                            color: user.status === 1 ? "#16a34a" : "#dc2626",
                                        }}
                                    >
                                        {user.status === 1 ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setModalMode("update");
                                            setSelectedUser(user);
                                            setIsModalOpen(true);
                                        }}
                                        style={{ backgroundColor: "#fbbf24", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                                    >
                                        Sửa
                                    </button>{" "}
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                Không tìm thấy dữ liệu!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <CrudModal
                isOpen={isModalOpen}
                mode={modalMode}
                title="User"
                initialData={selectedUser}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
                fields={fields}
            />
        </div>
    );
}
