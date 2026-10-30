// Tác giả & coder: Thanh Vuong CE190182
import React, { useState } from "react";
import "./App.css";
import PublicNewsView from "./components/PublicNewsView";
import Login from "./components/Login";
import AccountManagement from "./components/AccountManagement";
import CategoryManagement from "./components/CategoryManagement";
import NewsManagement from "./components/NewsManagement";
import ProfileManagement from "./components/ProfileManagement";
import NewsHistory from "./components/NewsHistory";

export default function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem("funews_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // screen: "public" | "login" | "dashboard"
    const [screen, setScreen] = useState("public");
    const [activeTab, setActiveTab] = useState(
        currentUser?.accountRole === 1 ? "accounts" : "news"
    );

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        localStorage.setItem("funews_user", JSON.stringify(user));
        setActiveTab(user.accountRole === 1 ? "accounts" : "news");
        setScreen("dashboard");
    };

    const handleProfileUpdated = (updatedUser) => {
        setCurrentUser(updatedUser);
        localStorage.setItem("funews_user", JSON.stringify(updatedUser));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem("funews_user");
        setScreen("public");
    };

    if (screen === "public") {
        return (
            <PublicNewsView
                currentUser={currentUser}
                onGoToLogin={() => setScreen("login")}
                onGoToDashboard={() => {
                    setActiveTab(currentUser?.accountRole === 1 ? "accounts" : "news");
                    setScreen("dashboard");
                }}
            />
        );
    }

    if (screen === "login" || !currentUser) {
        return (
            <Login
                onLoginSuccess={handleLoginSuccess}
                onBackToPublic={() => setScreen("public")}
            />
        );
    }

    const isAdmin = currentUser.accountRole === 1;
    const menuItems = isAdmin
        ? [
              { key: "accounts", label: "Quản lý Tài khoản (Account)" },
          ]
        : [
              { key: "news", label: "Quản lý Bài viết (News & Tags)" },
              { key: "categories", label: "Quản lý Danh mục (Category)" },
              { key: "history", label: "Lịch sử Bài viết của tôi" },
              { key: "profile", label: "Hồ sơ cá nhân (Profile)" },
          ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <h3>FUNews System</h3>
                    <span className="role-pill">
                        {isAdmin ? "ADMIN PANEL" : "STAFF PANEL"}
                    </span>
                </div>

                <ul className="sidebar-menu">
                    {menuItems.map((item) => (
                        <li
                            key={item.key}
                            className={`sidebar-item ${activeTab === item.key ? "active" : ""}`}
                            onClick={() => setActiveTab(item.key)}
                        >
                            {item.label}
                        </li>
                    ))}
                    <li
                        className="sidebar-item"
                        onClick={() => setScreen("public")}
                    >
                        🌐 Xem Trang Tin Công Khai
                    </li>
                </ul>

                <div className="sidebar-footer">
                    <div style={{ fontSize: "12px", color: "#cbd5e1", marginBottom: "8px" }}>
                        Đang đăng nhập: <br />
                        <b style={{ color: "#fff" }}>{currentUser.accountName}</b>
                    </div>
                    <button className="btn btn-danger" style={{ width: "100%" }} onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-area">
                <header className="topbar">
                    <span style={{ fontWeight: "700", fontSize: "16px", color: "#1e293b" }}>
                        Hệ Thống Quản Lý Tin Tức Đại Học FPT (FUNewsManagementSystem)
                    </span>
                    <span style={{ fontSize: "14px", color: "#475569" }}>
                        Xin chào, <b>{currentUser.accountName}</b> ({isAdmin ? "Admin" : "Staff"})
                    </span>
                </header>

                <div className="content-card">
                    {isAdmin && activeTab === "accounts" && <AccountManagement />}
                    {!isAdmin && activeTab === "categories" && <CategoryManagement />}
                    {!isAdmin && activeTab === "news" && <NewsManagement currentUser={currentUser} />}
                    {!isAdmin && activeTab === "history" && <NewsHistory currentUser={currentUser} />}
                    {!isAdmin && activeTab === "profile" && (
                        <ProfileManagement
                            currentUser={currentUser}
                            onProfileUpdated={handleProfileUpdated}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
