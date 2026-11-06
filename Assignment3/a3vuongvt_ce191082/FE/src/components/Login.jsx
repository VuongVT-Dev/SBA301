// Tác giả & coder: Thanh Vuong CE190182
import React, { useState } from "react";
import api, { extractErrorMessage } from "../services/api";

export default function Login({ onLoginSuccess, onBackToPublic }) {
    const [tab, setTab] = useState("login"); // "login" | "register"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [regData, setRegData] = useState({
        customerFullName: "",
        emailAddress: "",
        telephone: "",
        customerBirthday: "2000-01-01",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ Email và Mật khẩu!");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const res = await api.login(email.trim(), password);
            onLoginSuccess(res.data);
        } catch (err) {
            setError(extractErrorMessage(err, "Đăng nhập thất bại!"));
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!regData.customerFullName.trim() || !regData.emailAddress.trim() || !regData.telephone.trim() || !regData.password.trim()) {
            setError("Vui lòng nhập đầy đủ thông tin đăng ký bắt buộc!");
            return;
        }
        if (!/^[0-9]{9,12}$/.test(regData.telephone.trim())) {
            setError("Số điện thoại phải từ 9 đến 12 chữ số!");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const res = await api.register({
                customerFullName: regData.customerFullName.trim(),
                emailAddress: regData.emailAddress.trim(),
                telephone: regData.telephone.trim(),
                customerBirthday: regData.customerBirthday || null,
                password: regData.password,
            });
            onLoginSuccess(res.data);
        } catch (err) {
            setError(extractErrorMessage(err, "Đăng ký tài khoản thất bại!"));
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (demoEmail, demoPass) => {
        setTab("login");
        setEmail(demoEmail);
        setPassword(demoPass);
        setError("");
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "12px" }}>
                    FUMiniHotel System
                </h2>

                <div className="tab-switcher">
                    <button
                        type="button"
                        className={`btn ${tab === "login" ? "btn-primary" : "btn-secondary"}`}
                        style={{ flex: 1 }}
                        onClick={() => {
                            setTab("login");
                            setError("");
                        }}
                    >
                        Đăng Nhập
                    </button>
                    <button
                        type="button"
                        className={`btn ${tab === "register" ? "btn-primary" : "btn-secondary"}`}
                        style={{ flex: 1 }}
                        onClick={() => {
                            setTab("register");
                            setError("");
                        }}
                    >
                        Đăng Ký Khách Hàng
                    </button>
                </div>

                {error && <div className="alert-error">{error}</div>}

                {tab === "login" ? (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Nhập email đăng nhập"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mật khẩu:</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }} disabled={loading}>
                            {loading ? "Đang xác thực JWT..." : "Đăng nhập"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit}>
                        <div className="form-group">
                            <label className="form-label">Họ và Tên *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nguyễn Văn A"
                                value={regData.customerFullName}
                                onChange={(e) => setRegData({ ...regData, customerFullName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="email@example.com"
                                value={regData.emailAddress}
                                onChange={(e) => setRegData({ ...regData, emailAddress: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Số điện thoại (9-12 số) *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="0901234567"
                                value={regData.telephone}
                                onChange={(e) => setRegData({ ...regData, telephone: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ngày sinh</label>
                            <input
                                type="date"
                                className="form-control"
                                value={regData.customerBirthday}
                                onChange={(e) => setRegData({ ...regData, customerBirthday: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mật khẩu *</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu"
                                value={regData.password}
                                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-success" style={{ width: "100%", marginTop: "8px" }} disabled={loading}>
                            {loading ? "Đang tạo tài khoản..." : "Đăng ký tài khoản"}
                        </button>
                    </form>
                )}

                <div className="demo-box">
                    <div style={{ fontWeight: "700", marginBottom: "6px" }}>Tài khoản mẫu (Bấm để điền nhanh):</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        <button
                            type="button"
                            className="btn btn-sm btn-warning"
                            onClick={() => fillDemo("admin@FUMiniHotelSystem.com", "@1")}
                        >
                            Staff (application.properties)
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => fillDemo("EmmaWilliam@FUNewsManagement.org", "@1")}
                        >
                            Customer: Emma William
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => fillDemo("OliviaJames@FUNewsManagement.org", "@1")}
                        >
                            Customer: Olivia James
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={onBackToPublic}
                >
                    Quay lại trang xem phòng công khai
                </button>
            </div>
        </div>
    );
}
