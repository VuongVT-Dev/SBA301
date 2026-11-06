// Tác giả & coder: Thanh Vuong CE190182
import React, { useState, useEffect } from "react";
import api, { extractErrorMessage } from "../services/api";
import CrudModal from "./CrudModal";

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const fetchCustomers = async (keyword = "") => {
        try {
            setLoading(true);
            const res = await api.getCustomers(keyword);
            setCustomers(res.data || []);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomers(search);
    };

    const handleCreate = async (formData) => {
        try {
            await api.createCustomer({
                customerFullName: formData.customerFullName.trim(),
                emailAddress: formData.emailAddress.trim(),
                telephone: formData.telephone.trim(),
                customerBirthday: formData.customerBirthday || null,
                customerStatus: Number(formData.customerStatus),
                password: formData.password,
            });
            setMessage({ type: "success", text: "Thêm khách hàng mới thành công!" });
            fetchCustomers(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.updateCustomer(selectedCustomer.customerId, {
                customerFullName: formData.customerFullName.trim(),
                emailAddress: formData.emailAddress.trim(),
                telephone: formData.telephone.trim(),
                customerBirthday: formData.customerBirthday || null,
                customerStatus: Number(formData.customerStatus),
                password: formData.password,
            });
            setMessage({ type: "success", text: "Cập nhật thông tin khách hàng thành công!" });
            fetchCustomers(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleDelete = async (customer) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.customerFullName}" (${customer.emailAddress}) không?`)) {
            return;
        }
        try {
            setMessage({ type: "", text: "" });
            await api.deleteCustomer(customer.customerId);
            setMessage({ type: "success", text: `Đã xóa khách hàng "${customer.customerFullName}" thành công!` });
            fetchCustomers(search);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
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
            patternMessage: "Số điện thoại phải gồm từ 9 đến 12 chữ số!",
        },
        {
            name: "customerBirthday",
            label: "Ngày Sinh (CustomerBirthday)",
            type: "date",
            required: true,
            defaultValue: "1998-01-01",
        },
        {
            name: "customerStatus",
            label: "Trạng Thái (CustomerStatus)",
            type: "select",
            defaultValue: 1,
            options: [
                { value: 1, label: "Active (1)" },
                { value: 0, label: "Inactive (0)" },
            ],
        },
        {
            name: "password",
            label: "Mật khẩu (Password)",
            type: "password",
            required: true,
            minLength: 2,
        },
    ];

    return (
        <div>
            <div className="section-header">
                <h2>Quản Lý Khách Hàng (Customer Management - Staff Role)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Thêm, sửa, xóa và tìm kiếm thông tin khách hàng trong hệ thống FUMiniHotel.
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
                        placeholder="Tìm theo tên, email hoặc số điện thoại..."
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
                            fetchCustomers("");
                        }}
                    >
                        Tất cả
                    </button>
                </form>

                <button
                    className="btn btn-success"
                    onClick={() => {
                        setModalMode("create");
                        setSelectedCustomer(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Thêm Khách Hàng
                </button>
            </div>

            {loading ? (
                <p>Đang tải danh sách khách hàng...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>CustomerID</th>
                            <th>Họ và Tên</th>
                            <th>Email</th>
                            <th>Số Điện Thoại</th>
                            <th>Ngày Sinh</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((c) => (
                                <tr key={c.customerId}>
                                    <td style={{ textAlign: "center" }}>{c.customerId}</td>
                                    <td><b>{c.customerFullName}</b></td>
                                    <td>{c.emailAddress}</td>
                                    <td style={{ textAlign: "center" }}>{c.telephone}</td>
                                    <td style={{ textAlign: "center" }}>{c.customerBirthday || "N/A"}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <span className={c.customerStatus === 1 ? "badge badge-success" : "badge badge-danger"}>
                                            {c.customerStatus === 1 ? "Active (1)" : "Inactive (0)"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => {
                                                setModalMode("update");
                                                setSelectedCustomer(c);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Sửa
                                        </button>{" "}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(c)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    Không tìm thấy khách hàng nào phù hợp!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <CrudModal
                isOpen={isModalOpen}
                mode={modalMode}
                title="Khách Hàng"
                initialData={selectedCustomer}
                fields={fields}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
            />
        </div>
    );
}
