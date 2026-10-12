import React, { useState, useEffect } from "react";

export default function CrudModal({ isOpen, mode, initialData, onClose, onSubmit, fields, title = "Category" }) {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        if (mode === "update" && initialData) {
            setFormData(initialData);
        } else {
            setFormData({});
        }
        setError("");
    }, [mode, initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (fieldName, value) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
    };

    // Xử lý khi chọn file ảnh từ máy tính
    const handleFileChange = (fieldName, e) => {
        const file = e.target.files[0];
        if (file) {

            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, [fieldName]: imageUrl }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        for (let field of fields) {
            if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === "")) {
                setError(`Trường ${field.label} không được để trống!`);
                return;
            }
        }
        onSubmit(formData);
        onClose();
    };

    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "400px" }}>
                <h3>{mode === "create" ? `Tạo Mới ${title}` : `Cập Nhật ${title}`}</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    {fields.map((f) => (
                        <div key={f.name} style={{ marginBottom: "12px" }}>
                            <label>{f.label}: </label>

                            {f.type === "select" ? (
                                <select
                                    value={formData[f.name] ?? f.options[0]?.value}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                    style={{ width: "100%", padding: "6px" }}
                                >
                                    {f.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : f.type === "file" ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(f.name, e)}
                                        style={{ width: "100%", marginTop: "4px" }}
                                    />
                                    {formData[f.name] && (
                                        <img
                                            src={formData[f.name]}
                                            alt="Preview"
                                            style={{ width: "60px", height: "60px", objectFit: "cover", marginTop: "8px", borderRadius: "4px" }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <input
                                    type={f.type || "text"}
                                    value={formData[f.name] || ""}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                    style={{ width: "100%", padding: "6px" }}
                                />
                            )}
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit" style={{ backgroundColor: "#28a745", color: "#fff", border: "none", padding: "6px 12px" }}>Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
}