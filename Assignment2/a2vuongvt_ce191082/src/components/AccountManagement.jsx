import React, { useState, useEffect } from "react";
import api, { extractErrorMessage } from "../services/api";
import CrudModal from "./CrudModal";

export default function AccountManagement() {
    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedAccount, setSelectedAccount] = useState(null);

    const fetchAccounts = async (keyword = "") => {
        try {
            setLoading(true);
            const res = await api.getAccounts(keyword);
            setAccounts(res.data || []);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAccounts(search);
    };

    const handleCreate = async (formData) => {
        try {
            await api.createAccount({
                accountName: formData.accountName.trim(),
                accountEmail: formData.accountEmail.trim(),
                accountRole: Number(formData.accountRole),
                accountPassword: formData.accountPassword,
            });
            setMessage({ type: "success", text: "Thêm tài khoản mới thành công!" });
            fetchAccounts(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await api.updateAccount(selectedAccount.accountId, {
                accountName: formData.accountName.trim(),
                accountEmail: formData.accountEmail.trim(),
                accountRole: Number(formData.accountRole),
                accountPassword: formData.accountPassword,
            });
            setMessage({ type: "success", text: "Cập nhật tài khoản thành công!" });
            fetchAccounts(search);
        } catch (err) {
            throw new Error(extractErrorMessage(err));
        }
    };

    const handleDelete = async (account) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${account.accountName}" (${account.accountEmail}) không?`)) {
            return;
        }
        try {
            setMessage({ type: "", text: "" });
            await api.deleteAccount(account.accountId);
            setMessage({ type: "success", text: `Đã xóa tài khoản "${account.accountName}" thành công!` });
            fetchAccounts(search);
        } catch (err) {
            setMessage({ type: "error", text: extractErrorMessage(err) });
        }
    };

    const fields = [
        { name: "accountName", label: "Họ và Tên (AccountName)", required: true },
        { name: "accountEmail", label: "Email (AccountEmail)", type: "email", required: true },
        {
            name: "accountRole",
            label: "Vai trò (AccountRole)",
            type: "select",
            required: true,
            defaultValue: 2,
            options: [
                { value: 1, label: "Admin (Role = 1)" },
                { value: 2, label: "Staff (Role = 2)" },
            ],
        },
        {
            name: "accountPassword",
            label: "Mật khẩu (AccountPassword)",
            type: "password",
            required: true,
            minLength: 2,
        },
    ];

    return (
        <div>
            <div className="section-header">
                <h2>Quản Lý Tài Khoản</h2>
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
                        placeholder="Tìm theo tên hoặc email..."
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
                            fetchAccounts("");
                        }}
                    >
                        Tất cả
                    </button>
                </form>

                <button
                    className="btn btn-success"
                    onClick={() => {
                        setModalMode("create");
                        setSelectedAccount(null);
                        setIsModalOpen(true);
                    }}
                >
                    Thêm Tài Khoản
                </button>
            </div>

            {loading ? (
                <p>Đang tải danh sách tài khoản...</p> // loading for sure =)))
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>AccountID</th>
                            <th>Tên Tài Khoản</th>
                            <th>Email</th>
                            <th>Vai Trò (Role)</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.length > 0 ? (
                            accounts.map((acc) => (
                                <tr key={acc.accountId}>
                                    <td style={{ textAlign: "center" }}>{acc.accountId}</td>
                                    <td>{acc.accountName}</td>
                                    <td>{acc.accountEmail}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <span className={acc.accountRole === 1 ? "badge badge-warning" : "badge badge-info"}>
                                            {acc.accountRole === 1 ? "Admin (1)" : "Staff (2)"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => {
                                                setModalMode("update");
                                                setSelectedAccount(acc);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Sửa
                                        </button>{" "}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(acc)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    Không tìm thấy tài khoản nào như thế cả, nhớ nhầm đó
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <CrudModal
                isOpen={isModalOpen}
                mode={modalMode}
                title="Tài Khoản"
                initialData={selectedAccount}
                fields={fields}
                onClose={() => setIsModalOpen(false)}
                onSubmit={modalMode === "create" ? handleCreate : handleUpdate}
            />
        </div>
    );
}
