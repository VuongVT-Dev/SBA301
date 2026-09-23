import React, { useState } from "react";
import Breadcrumb from "../components/common/Breadcrumb";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page pb-5">
      <Breadcrumb title="Contact Us" />

      <div className="container-2">
        {/* CONTACT CARDS */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 border text-center h-100 shadow-sm">
              <div className="fs-2 text-primary mb-3">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <h5 className="fw-700 mb-2">Our Boutique Store</h5>
              <p className="text-muted small mb-0">
                124 Main Boulevard, Soho Design District<br />New York, NY 10012, United States
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 border text-center h-100 shadow-sm">
              <div className="fs-2 text-primary mb-3">
                <i className="fa-solid fa-phone"></i>
              </div>
              <h5 className="fw-700 mb-2">Give Us a Call</h5>
              <p className="text-muted small mb-0">
                Toll Free: +1834 123 456 789<br />Mon - Sat: 9:00 AM - 7:00 PM EST
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 border text-center h-100 shadow-sm">
              <div className="fs-2 text-primary mb-3">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <h5 className="fw-700 mb-2">Send an Email</h5>
              <p className="text-muted small mb-0">
                Customer Support: support@stationerytales.com<br />Wholesale Inquiries: partner@stationerytales.com
              </p>
            </div>
          </div>
        </div>

        {/* FORM AND MAP */}
        <div className="row g-4 align-items-stretch">
          <div className="col-lg-6">
            <div className="bg-white rounded-4 border p-4 p-md-5 shadow-sm h-100">
              <span className="text-primary fw-600">GET IN TOUCH</span>
              <h3 className="fw-700 mb-3">Leave a Message</h3>
              <p className="text-muted mb-4">
                Have questions regarding your order, custom bulk gifting, or product recommendations? Fill out the form below and we will respond within 24 hours.
              </p>

              {submitted && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                  <i className="fa-solid fa-check-circle fs-5"></i>
                  <span>Your message has been sent successfully! We will get back to you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-600 small">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-600 small">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-600 small">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Order Inquiry / Custom Notebook"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-600 small">Your Message *</label>
                  <textarea
                    required
                    rows="4"
                    className="form-control"
                    placeholder="Write your question or request here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="cus-btn w-100 text-center">
                  <span className="btn-text">Send Message</span>
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="bg-white rounded-4 border p-2 shadow-sm h-100 overflow-hidden" style={{ minHeight: "450px" }}>
              <iframe
                title="Store Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1689240890123!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "12px", minHeight: "450px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
