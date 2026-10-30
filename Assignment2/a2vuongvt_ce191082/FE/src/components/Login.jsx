// Tác giả & coder: Thanh Vuong CE190182
import React, { useState } from "react";
import api, { extractErrorMessage } from "../services/api";

export default function Login({ onLoginSuccess, onBackToPublic }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
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

    const fillDemo = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setError("");
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "6px" }}>
                    Đăng Nhập FUNews
                </h2>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập mail"
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
                        {loading ? "Đang xác thực..." : "Đăng nhập"}
                    </button>
                </form>


                <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "8px" }}
                    onClick={onBackToPublic}
                >
                    Quay lại trang chủ
                </button>
            </div>
        </div>
    );
}
