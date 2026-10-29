import React, { useState, useEffect } from "react";

export default function CrudModal({
    isOpen,
    mode,
    title,
    initialData,
    fields,
    onClose,
    onSubmit,
}) {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const defaults = {};
        fields.forEach((f) => {
            if (mode === "update" && initialData && initialData[f.name] !== undefined) {
                defaults[f.name] = initialData[f.name];
            } else if (f.defaultValue !== undefined) {
                defaults[f.name] = f.defaultValue;
            } else if (f.type === "select" && f.options?.length > 0) {
                defaults[f.name] = f.options[0].value;
            } else if (f.type === "checkbox-group") {
                defaults[f.name] = [];
            } else {
                defaults[f.name] = "";
            }
        });
        setFormData(defaults);
        setError("");
        setSubmitting(false);
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxToggle = (name, optionValue) => {
        setFormData((prev) => {
            const current = Array.isArray(prev[name]) ? prev[name] : [];
            const exists = current.includes(optionValue);
            const next = exists
                ? current.filter((v) => v !== optionValue)
                : [...current, optionValue];
            return { ...prev, [name]: next };
        });
    };

    const validateForm = () => {
        for (const f of fields) {
            const val = formData[f.name];
            if (f.required) {
                if (val === undefined || val === null || val.toString().trim() === "") {
                    return `Trường "${f.label}" không được để trống!`;
                }
            }
            if (f.type === "email" && val) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val.toString().trim())) {
                    return `Trường "${f.label}" không đúng định dạng email!`;
                }
            }
            if (f.minLength && val && val.toString().trim().length < f.minLength) {
                return `Trường "${f.label}" phải có ít nhất ${f.minLength} ký tự!`;
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationMsg = validateForm();
        if (validationMsg) {
            setError(validationMsg);
            return;
        }
        try {
            setSubmitting(true);
            setError("");
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra khi lưu dữ liệu!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-header">
                    <h3>{mode === "create" ? `Thêm mới ${title}` : `Cập nhật ${title}`}</h3>
                    <button type="button" className="modal-close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {fields.map((f) => (
                        <div key={f.name} className="form-group">
                            <label className="form-label">
                                {f.label} {f.required && <span style={{ color: "#dc2626" }}>*</span>}
                            </label>

                            {f.type === "select" ? (
                                <select
                                    className="form-control"
                                    value={formData[f.name] ?? ""}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                >
                                    {f.options.map((opt) => (
                                        <option key={String(opt.value)} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : f.type === "textarea" ? (
                                <textarea
                                    className="form-control"
                                    rows={f.rows || 4}
                                    placeholder={f.placeholder || ""}
                                    value={formData[f.name] || ""}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                />
                            ) : f.type === "checkbox-group" ? (
                                <div className="checkbox-group">
                                    {f.options && f.options.length > 0 ? (
                                        f.options.map((opt) => {
                                            const checked = (formData[f.name] || []).includes(opt.value);
                                            return (
                                                <label key={opt.value} className="checkbox-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => handleCheckboxToggle(f.name, opt.value)}
                                                    />
                                                    <span>{opt.label}</span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <span style={{ fontSize: "13px", color: "#666" }}>
                                            Chưa có Tag nào.
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <input
                                    type={f.type || "text"}
                                    className="form-control"
                                    placeholder={f.placeholder || ""}
                                    value={formData[f.name] || ""}
                                    onChange={(e) => handleChange(f.name, e.target.value)}
                                />
                            )}
                        </div>
                    ))}

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Đang lưu..." : "Lưu thông tin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
