// Tác giả & coder: Thanh Vuong CE190182
import React, { useState } from "react";
import api, { extractErrorMessage } from "../services/api";
import CrudModal from "./CrudModal";

export default function ProfileManagement({ currentUser, onProfileUpdated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleUpdateProfile = async (formData) => {
        try {
            const res = await api.updateAccount(currentUser.accountId, {
                accountName: formData.accountName.trim(),
                accountEmail: formData.accountEmail.trim(),
                accountRole: currentUser.accountRole,
                accountPassword: formData.accountPassword,
            });
            onProfileUpdated(res.data);
            setMessage({ type: "success", text: "Cập nhật thông tin cá nhân thành công!" });
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const fields = [
        { name: "accountName", label: "Họ và Tên (AccountName)", required: true },
        { name: "accountEmail", label: "Email (AccountEmail)", type: "email", required: true },
        {
            name: "accountPassword",
            label: "Mật Khẩu (AccountPassword)",
            type: "password",
            required: true,
            minLength: 2,
        },
    ];

    return (
        <div>
            <div className="section-header">
                <h2>Hồ Sơ Cá Nhân (Manage Profile - Staff Role)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Xem và cập nhật thông tin tài khoản của bạn bằng Popup Dialog.
                </p>
            </div>

            {message.text && (
                <div className={message.type === "error" ? "alert-error" : "alert-success"}>
                    {message.text}
                </div>
            )}

            <div className="profile-card">
                <div className="profile-row">
                    <span className="profile-label">Account ID:</span>
                    <span>{currentUser.accountId}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Họ và Tên:</span>
                    <span><b>{currentUser.accountName}</b></span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Email đăng nhập:</span>
                    <span>{currentUser.accountEmail}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Vai trò:</span>
                    <span className="badge badge-info">
                        {currentUser.accountRole === 1 ? "Admin (1)" : "Staff (2)"}
                    </span>
                </div>

                <div style={{ marginTop: "20px" }}>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        Chỉnh Sửa Hồ Sơ (Popup Dialog)
                    </button>
                </div>
            </div>

            <CrudModal
                isOpen={isModalOpen}
                mode="update"
                title="Hồ Sơ Cá Nhân"
                initialData={currentUser}
                fields={fields}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleUpdateProfile}
            />
        </div>
    );
}
