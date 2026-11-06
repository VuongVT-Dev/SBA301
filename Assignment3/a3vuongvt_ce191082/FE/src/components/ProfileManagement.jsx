// Tác giả & coder: Thanh Vuong CE190182
import React, { useState } from "react";
import api, { extractErrorMessage } from "../services/api";
import CrudModal from "./CrudModal";

export default function ProfileManagement({ currentUser, onProfileUpdated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleUpdateProfile = async (formData) => {
        try {
            const res = await api.updateProfile(currentUser.customerId, {
                customerFullName: formData.customerFullName.trim(),
                emailAddress: formData.emailAddress.trim(),
                telephone: formData.telephone.trim(),
                customerBirthday: formData.customerBirthday || null,
                customerStatus: 1,
                password: formData.password,
            });
            onProfileUpdated({
                ...currentUser,
                customerFullName: res.data.customerFullName,
                emailAddress: res.data.emailAddress,
                telephone: res.data.telephone,
                customerBirthday: res.data.customerBirthday,
            });
            setMessage({ type: "success", text: "Cập nhật hồ sơ cá nhân thành công!" });
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const fields = [
        { name: "customerFullName", label: "Họ và Tên (CustomerFullName)", required: true },
        { name: "emailAddress", label: "Email (EmailAddress)", type: "email", required: true },
        {
            name: "telephone",
            label: "Số Điện Thoại (Telephone)",
            required: true,
            pattern: "^[0-9]{9,12}$",
            patternMessage: "Số điện thoại phải từ 9 đến 12 chữ số!",
        },
        {
            name: "customerBirthday",
            label: "Ngày Sinh (CustomerBirthday)",
            type: "date",
            required: true,
            defaultValue: currentUser.customerBirthday || "1998-01-01",
        },
        {
            name: "password",
            label: "Mật Khẩu Mới (Để trống nếu giữ nguyên)",
            type: "password",
            required: false,
        },
    ];

    return (
        <div>
            <div className="section-header">
                <h2>Hồ Sơ Cá Nhân (Manage Profile - Customer Role)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Xem và cập nhật thông tin tài khoản khách hàng của bạn bằng Popup Dialog.
                </p>
            </div>

            {message.text && (
                <div className={message.type === "error" ? "alert-error" : "alert-success"}>
                    {message.text}
                </div>
            )}

            <div className="profile-card">
                <div className="profile-row">
                    <span className="profile-label">Customer ID:</span>
                    <span><b>#{currentUser.customerId}</b></span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Họ và Tên:</span>
                    <span><b>{currentUser.customerFullName}</b></span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Email đăng nhập:</span>
                    <span>{currentUser.emailAddress}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Số điện thoại:</span>
                    <span>{currentUser.telephone || "N/A"}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Ngày sinh:</span>
                    <span>{currentUser.customerBirthday || "N/A"}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Vai trò:</span>
                    <span className="badge badge-info">Customer</span>
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
                initialData={{ ...currentUser, password: "" }}
                fields={fields}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleUpdateProfile}
            />
        </div>
    );
}
