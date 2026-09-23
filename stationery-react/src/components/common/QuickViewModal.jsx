import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const QuickViewModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
    onClose();
  };

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      ></div>

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1060 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
            <div className="modal-body p-4 p-md-5 position-relative">
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-4"
                onClick={onClose}
                aria-label="Close"
              ></button>

              <div className="row g-4 align-items-center">
                <div className="col-md-6 text-center bg-light rounded-4 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                    style={{ maxHeight: "320px", objectFit: "contain" }}
                  />
                </div>

                <div className="col-md-6">
                  <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-2 rounded-pill">
                    {product.category}
                  </span>
                  <h4 className="fw-700 medium-black mb-2">{product.name}</h4>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="text-warning">
                      {"★".repeat(Math.round(product.rating || 5))}
                      {"☆".repeat(5 - Math.round(product.rating || 5))}
                    </div>
                    <span className="text-muted small">
                      ({product.reviewsCount || 10} customer reviews)
                    </span>
                  </div>

                  <div className="d-flex align-items-baseline gap-3 mb-3">
                    <h4 className="fw-700 color-primary mb-0">${product.price.toFixed(2)}</h4>
                    {product.oldPrice && (
                      <span className="text-muted text-decoration-line-through">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-muted mb-4">{product.description}</p>

                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="input-group" style={{ width: "130px" }}>
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="cus-btn flex-grow-1"
                    >
                      <span className="btn-text">Add to Cart</span>
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  <div className="border-top pt-3 text-muted small">
                    <p className="mb-1">
                      <strong>SKU:</strong> {product.sku || "ST-001"}
                    </p>
                    <p className="mb-0">
                      <strong>Availability:</strong>{" "}
                      <span className="text-success">In Stock (Ready to ship)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;
