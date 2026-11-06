// Tác giả & coder: Thanh Vuong CE190182
import React, { useState } from "react";
import "./App.css";
import PublicRoomView from "./components/PublicRoomView";
import Login from "./components/Login";
import CustomerManagement from "./components/CustomerManagement";
import RoomManagement from "./components/RoomManagement";
import BookingManagement from "./components/BookingManagement";
import CustomerBookingCreate from "./components/CustomerBookingCreate";
import BookingHistory from "./components/BookingHistory";
import ProfileManagement from "./components/ProfileManagement";

export default function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem("fuminihotel_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // screen: "public" | "login" | "dashboard"
    const [screen, setScreen] = useState("public");
    const [activeTab, setActiveTab] = useState(
        currentUser?.role === "STAFF" ? "rooms" : "book"
    );

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        localStorage.setItem("fuminihotel_user", JSON.stringify(user));
        setActiveTab(user.role === "STAFF" ? "rooms" : "book");
        setScreen("dashboard");
    };

    const handleProfileUpdated = (updatedUser) => {
        setCurrentUser(updatedUser);
        localStorage.setItem("fuminihotel_user", JSON.stringify(updatedUser));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem("fuminihotel_user");
        setScreen("public");
    };

    if (screen === "public") {
        return (
            <PublicRoomView
                currentUser={currentUser}
                onGoToLogin={() => setScreen("login")}
                onGoToDashboard={() => {
                    setActiveTab(currentUser?.role === "STAFF" ? "rooms" : "book");
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

    const isStaff = currentUser.role === "STAFF";
    const menuItems = isStaff
        ? [
              { key: "rooms", label: "Quản lý Phòng (Room Info)" },
              { key: "customers", label: "Quản lý Khách hàng (Customer)" },
              { key: "bookings", label: "Quản lý Đặt phòng (Booking)" },
          ]
        : [
              { key: "book", label: "Đặt phòng trực tuyến (Online Booking)" },
              { key: "history", label: "Lịch sử đặt phòng (History)" },
              { key: "profile", label: "Hồ sơ cá nhân (Profile)" },
          ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <h3>FUMiniHotel</h3>
                    <span className="role-pill">
                        {isStaff ? "STAFF PANEL" : "CUSTOMER PANEL"}
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
                        Xem trang Phòng công khai
                    </li>
                </ul>

                <div className="sidebar-footer">
                    <div style={{ fontSize: "12px", color: "#cbd5e1", marginBottom: "8px" }}>
                        Đang đăng nhập: <br />
                        <b style={{ color: "#fff" }}>{currentUser.customerFullName}</b>
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
                        Hệ Thống Quản Lý Khách Sạn (FUMiniHotelSystem - JWT Secured)
                    </span>
                    <span style={{ fontSize: "14px", color: "#475569" }}>
                        Xin chào, <b>{currentUser.customerFullName}</b> ({isStaff ? "Staff" : "Customer"})
                    </span>
                </header>

                <div className="content-card">
                    {isStaff && activeTab === "rooms" && <RoomManagement />}
                    {isStaff && activeTab === "customers" && <CustomerManagement />}
                    {isStaff && activeTab === "bookings" && <BookingManagement />}

                    {!isStaff && activeTab === "book" && (
                        <CustomerBookingCreate
                            currentUser={currentUser}
                            onBookingCreated={() => setActiveTab("history")}
                        />
                    )}
                    {!isStaff && activeTab === "history" && <BookingHistory currentUser={currentUser} />}
                    {!isStaff && activeTab === "profile" && (
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
