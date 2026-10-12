import React, { useState } from "react";
import Login from "./components/Login";
import CategoryManagement from "./components/CategoryManagement";
import NewsManagement from "./components/NewsManagement";
import UserManagement from "./components/UserManagement";
import { initialCategories, initialNews, initialUsers } from "./data/mockData";

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");

    const [categories, setCategories] = useState(initialCategories);
    const [news, setNews] = useState(initialNews);
    const [users, setUsers] = useState(initialUsers);

    // Nếu chưa đăng nhập, hiển thị màn hình Login
    if (!currentUser) {
        return <Login users={users} onLoginSuccess={(user) => setCurrentUser(user)} />;
    }

    // Danh sách menu: Nếu là Staff (role !== 1) thì ẩn menu 'users'
    const menuList = currentUser.role === 1
        ? ["dashboard", "category", "news", "users", "settings"]
        : ["dashboard", "category", "news", "settings"];

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar Menu */}
            <div style={{ width: "220px", background: "#333", color: "#fff", padding: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                    <img src="/logo.jpg" alt="FUNews Logo" style={{ width: "36px", height: "36px", borderRadius: "4px", objectFit: "cover" }} />
                    <h3 style={{ margin: 0 }}>FUNews Admin</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {menuList.map((tab) => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: "10px",
                                cursor: "pointer",
                                background: activeTab === tab ? "#555" : "transparent",
                                marginBottom: "4px",
                                textTransform: "capitalize",
                            }}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
                <button onClick={() => { setCurrentUser(null); setActiveTab("dashboard"); }} style={{ marginTop: "20px", width: "100%" }}>
                    Logout
                </button>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: "20px" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ccc", paddingBottom: "10px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src="/logo.jpg" alt="FUNews Logo" style={{ width: "36px", height: "36px", borderRadius: "4px", objectFit: "cover" }} />
                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>FUNews Management System</span>
                    </div>
                    <span>
                        Xin chào, <b>{currentUser.username}</b> ({currentUser.role === 1 ? "Admin" : "Staff"})
                    </span>
                </header>

                {activeTab === "dashboard" && (
                    <div>
                        <h2>Dashboard</h2>
                        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
                            <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", minWidth: "160px" }}>
                                <h4 style={{ margin: "0 0 8px 0" }}>Categories</h4>
                                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{categories.length}</p>
                            </div>
                            <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", minWidth: "160px" }}>
                                <h4 style={{ margin: "0 0 8px 0" }}>News Articles</h4>
                                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{news.length}</p>
                            </div>
                            <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", minWidth: "160px" }}>
                                <h4 style={{ margin: "0 0 8px 0" }}>Users</h4>
                                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{users.length}</p>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "category" && <CategoryManagement categories={categories} setCategories={setCategories} />}
                {activeTab === "news" && <NewsManagement news={news} setNews={setNews} categories={categories} />}
                {activeTab === "users" && <UserManagement users={users} setUsers={setUsers} />}
                {activeTab === "settings" && <div><h2>Settings</h2><p>Hệ thống quản lý tin tức FUNews - Phiên bản 1.0</p></div>}
            </div>
        </div>
    );
}