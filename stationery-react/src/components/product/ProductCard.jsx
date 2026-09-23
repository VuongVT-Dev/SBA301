import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="product-card-block h-100 bg-white p-3 rounded-4 border position-relative d-flex flex-column justify-content-between transition-all shadow-sm">
      {/* Badge */}
      {product.badge && (
        <span
          className="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill fw-600"
          style={{
            backgroundColor:
              product.badge.toLowerCase().includes("sale") || product.badge.includes("%")
                ? "#e63946"
                : "#2a9d8f",
            color: "#ffffff",
            zIndex: 2,
            fontSize: "12px",
          }}
        >
          {product.badge}
        </span>
      )}

      {/* Product Image and Overlay Actions */}
      <div className="product-image-container position-relative overflow-hidden rounded-3 mb-3 bg-light text-center p-3">
        <Link to={`/product/${product.id}`} className="d-block">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid"
            style={{
              height: "190px",
              width: "100%",
              objectFit: "contain",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        {/* Hover Action Buttons */}
        <div
          className="action-buttons-group position-absolute d-flex gap-2 justify-content-center w-100"
          style={{
            bottom: "12px",
            left: "0",
            zIndex: 3,
          }}
        >
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="btn btn-sm btn-white shadow-sm rounded-circle p-2"
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#ffffff",
              color: isFavorite ? "#e63946" : "#333",
            }}
          >
            <i className={isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            className="btn btn-sm btn-white shadow-sm rounded-circle p-2"
            title="Quick view"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#ffffff",
              color: "#333",
            }}
          >
            <i className="fa-regular fa-eye"></i>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn btn-sm btn-primary shadow-sm rounded-circle p-2"
            title="Add to cart"
            style={{
              width: "36px",
              height: "36px",
            }}
          >
            <i className="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="product-info-wrapper">
        <p className="text-muted small mb-1">{product.category}</p>
        <h6 className="medium-black fw-600 mb-2 text-truncate" title={product.name}>
          <Link to={`/product/${product.id}`} className="text-dark text-decoration-none">
            {product.name}
          </Link>
        </h6>

        <div className="d-flex align-items-center gap-1 mb-2 text-warning small">
          {"★".repeat(Math.round(product.rating || 5))}
          <span className="text-muted ms-1">({product.reviewsCount || 10})</span>
        </div>

        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
          <div className="price-box">
            <span className="fw-700 color-primary fs-6">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-muted text-decoration-line-through small ms-2">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-600"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
