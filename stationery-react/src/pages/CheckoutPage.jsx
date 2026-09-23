import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "cod",
    notes: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setOrderPlaced(true);
    clearCart();
  };

  const shippingFee = cartTotal > 50 || cartTotal === 0 ? 0 : 5.99;
  const finalTotal = cartTotal + shippingFee;

  if (orderPlaced) {
    return (
      <div className="checkout-page pb-5">
        <Breadcrumb title="Order Confirmation" />
        <div className="container-2 text-center py-5">
          <div className="bg-white p-5 rounded-4 border shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
            <div className="text-success display-3 mb-3">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2 className="fw-700 mb-2">Thank You for Your Order!</h2>
            <p className="text-muted mb-4">
              Your order #ST-{Math.floor(100000 + Math.random() * 900000)} has been placed successfully. A confirmation email has been dispatched to <strong>{formData.email || "your email"}</strong>.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/" className="cus-btn">
                <span className="btn-text">Back to Home</span>
                <span>Back to Home</span>
              </Link>
              <Link to="/shop" className="cus-btn-2">
                <span className="btn-text">Continue Shopping</span>
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page pb-5">
      <Breadcrumb title="Checkout" />

      <div className="container-2">
        {cartItems.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border shadow-sm my-4">
            <h4 className="fw-700 mb-2">No items in your cart to checkout</h4>
            <p className="text-muted mb-4">Please add items to your cart first.</p>
            <Link to="/shop" className="cus-btn">
              <span className="btn-text">Browse Shop</span>
              <span>Browse Shop</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="row g-4">
              {/* BILLING INFORMATION */}
              <div className="col-lg-7">
                <div className="bg-white rounded-4 border p-4 p-md-5 shadow-sm">
                  <h5 className="fw-700 mb-4 pb-2 border-bottom">Shipping & Billing Details</h5>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-600">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-600">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-600">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-600">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-600">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="form-control"
                      placeholder="House number and street name"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-600">Town / City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        className="form-control"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-600">Postcode / ZIP *</label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        className="form-control"
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-600">Order Notes (Optional)</label>
                    <textarea
                      name="notes"
                      rows="3"
                      className="form-control"
                      placeholder="Notes about your order, e.g. special delivery instructions."
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY & PAYMENT */}
              <div className="col-lg-5">
                <div className="bg-white rounded-4 border p-4 p-md-5 shadow-sm sticky-top" style={{ top: "90px" }}>
                  <h5 className="fw-700 mb-4 pb-2 border-bottom">Your Order</h5>

                  <ul className="list-unstyled mb-4 d-flex flex-column gap-3">
                    {cartItems.map((item) => (
                      <li key={item.id} className="d-flex justify-content-between align-items-center">
                        <div className="text-truncate me-3" style={{ maxWidth: "220px" }}>
                          <span className="fw-600 text-dark">{item.name}</span>
                          <small className="text-muted d-block">Qty: {item.quantity}</small>
                        </div>
                        <span className="fw-600 color-primary text-nowrap">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-top pt-3 mb-4 d-flex flex-column gap-2 small">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Subtotal:</span>
                      <span className="fw-600">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Shipping:</span>
                      <span>{shippingFee === 0 ? <strong className="text-success">Free</strong> : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="d-flex justify-content-between border-top pt-2 fs-6">
                      <strong>Total:</strong>
                      <strong className="color-primary fs-5">${finalTotal.toFixed(2)}</strong>
                    </div>
                  </div>

                  <h6 className="fw-700 mb-3">Payment Method</h6>
                  <div className="d-flex flex-column gap-2 mb-4">
                    <label className="border rounded-3 p-3 d-flex align-items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                      />
                      <span>Cash on Delivery (COD)</span>
                    </label>

                    <label className="border rounded-3 p-3 d-flex align-items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleChange}
                      />
                      <span>Credit or Debit Card</span>
                    </label>
                  </div>

                  <button type="submit" className="cus-btn w-100 text-center">
                    <span className="btn-text">Place Order (${finalTotal.toFixed(2)})</span>
                    <span>Place Order</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
