//Author: Thanh Vuong CE190182
import React, { useState } from "react";

export default function Login({ users, onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // 1. Validate empty
        if (!username.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ Username và Password!");
            return;
        }

        // 2. Tìm tài khoản trong danh sách users (so khớp cả username và password)
        const foundUser = users.find(
            (u) =>
                u.username.toLowerCase() === username.trim().toLowerCase() &&
                ((u.password && u.password.toLowerCase() === password.trim().toLowerCase()) ||
                    u.username.toLowerCase() === password.trim().toLowerCase())
        );

        if (foundUser) {
            // Đăng nhập thành công, truyền thông tin user (gồm cả role) ra ngoài
            onLoginSuccess(foundUser);
        } else {
            setError("Tài khoản hoặc mật khẩu không chính xác!");
        }
    };

    return (
        <div style={{ maxWidth: "360px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>Đăng Nhập System</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "12px" }}>
                    <label>Username: </label>
                    <input
                        type="text"
                        placeholder="Admin hoặc Staff1"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>
                <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}>
                    Login
                </button>
            </form>
        </div>
    );
}