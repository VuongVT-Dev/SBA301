import React, { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "STATIONERY10") {
      setDiscount(cartTotal * 0.1);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code. Try 'STATIONERY10' for 10% off!");
    }
  };

  const shippingFee = cartTotal > 50 || cartTotal === 0 ? 0 : 5.99;
  const finalTotal = Math.max(0, cartTotal - discount + shippingFee);

  return (
    <div className="cart-page pb-5">
      <Breadcrumb title="Shopping Cart" />

      <div className="container-2">
        {cartItems.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border shadow-sm my-4">
            <i className="fa-light fa-cart-arrow-down fa-4x text-muted mb-3"></i>
            <h3 className="fw-700 mb-2">Your Cart is Currently Empty</h3>
            <p className="text-muted mb-4">
              Explore our wide variety of notebooks, pens, and desk supplies!
            </p>
            <Link to="/shop" className="cus-btn">
              <span className="btn-text">Return to Shop</span>
              <span>Return to Shop</span>
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* CART ITEMS TABLE */}
            <div className="col-lg-8">
              <div className="bg-white rounded-4 border p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <h5 className="fw-700 mb-0">Cart Items ({cartItems.length})</h5>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="btn btn-outline-danger btn-sm rounded-pill"
                  >
                    Clear All
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "contain",
                                  backgroundColor: "#f8f9fa",
                                  borderRadius: "8px",
                                }}
                              />
                              <div>
                                <Link
                                  to={`/product/${item.id}`}
                                  className="fw-600 text-dark text-decoration-none d-block"
                                >
                                  {item.name}
                                </Link>
                                <small className="text-muted">{item.category}</small>
                              </div>
                            </div>
                          </td>
                          <td className="fw-600">${item.price.toFixed(2)}</td>
                          <td>
                            <div className="input-group input-group-sm" style={{ width: "110px" }}>
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                className="form-control text-center fw-600"
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="fw-700 color-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="btn btn-link text-danger p-0"
                              title="Remove item"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* COUPON INPUT */}
                <div className="mt-4 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <form onSubmit={handleApplyCoupon} className="d-flex gap-2" style={{ maxWidth: "360px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Coupon: STATIONERY10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-dark text-nowrap rounded-3">
                      Apply
                    </button>
                  </form>
                  <Link to="/shop" className="btn btn-outline-secondary rounded-pill">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 border p-4 shadow-sm">
                <h5 className="fw-700 mb-4 pb-2 border-bottom">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-600">${cartTotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-success fw-600">FREE</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="border-top pt-3 d-flex justify-content-between align-items-baseline mb-4">
                  <h6 className="fw-700 mb-0">Total:</h6>
                  <h4 className="fw-700 color-primary mb-0">${finalTotal.toFixed(2)}</h4>
                </div>

                <div className="d-grid gap-2">
                  <Link to="/checkout" className="cus-btn text-center">
                    <span className="btn-text">Proceed to Checkout</span>
                    <span>Proceed to Checkout</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
