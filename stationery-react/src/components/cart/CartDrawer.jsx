import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={() => setIsCartOpen(false)}
      ></div>

      <aside
        id="sidebar-cart"
        className="d-flex flex-column"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "380px",
          maxWidth: "100%",
          height: "100vh",
          backgroundColor: "#ffffff",
          zIndex: 1050,
          boxShadow: "-5px 0 25px rgba(0,0,0,0.15)",
          overflowY: "auto",
        }}
      >
        <div className="title-cart-block p-4 bg-lightest-gray d-flex align-items-center justify-content-between border-bottom">
          <h6 className="fw-600 mb-0">Shopping Cart ({cartCount})</h6>
          <button
            type="button"
            className="btn-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close"
          ></button>
        </div>

        <div className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-light fa-bag-shopping fa-3x text-muted mb-3"></i>
              <p className="text-muted">Your shopping cart is empty.</p>
              <Link
                to="/shop"
                onClick={() => setIsCartOpen(false)}
                className="cus-btn btn-sm mt-2"
              >
                <span className="btn-text">Explore Shop</span>
                <span>Explore Shop</span>
              </Link>
            </div>
          ) : (
            <ul className="product-list list-unstyled p-0 m-0">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="product-item mb-3 pb-3 border-bottom d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "65px",
                        height: "65px",
                        objectFit: "contain",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    />
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="h6 medium-black fw-600 mb-1 d-block text-truncate"
                        style={{ maxWidth: "160px" }}
                      >
                        {item.name}
                      </Link>
                      <p className="subtitle mb-1 text-muted" style={{ fontSize: "12px" }}>
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary py-0 px-2"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="fw-600" style={{ minWidth: "16px", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary py-0 px-2"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-link text-danger p-0"
                    title="Remove item"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-top bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-600">Subtotal:</span>
              <span className="fw-700 fs-5 color-primary">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="d-grid gap-2">
              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="cus-btn text-center"
              >
                <span className="btn-text">View Full Cart</span>
                <span>View Full Cart</span>
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="cus-btn-2 text-center"
              >
                <span className="btn-text">Proceed to Checkout</span>
                <span>Proceed to Checkout</span>
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
