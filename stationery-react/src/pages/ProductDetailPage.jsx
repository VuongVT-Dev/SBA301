import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import ProductCard from "../components/product/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find((p) => p.id === Number(id)) || products[0];
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="product-detail-page pb-5">
      <Breadcrumb
        title={product.name}
        parent={{ name: "Shop", link: "/shop" }}
      />

      <div className="container-2">
        <div className="bg-white rounded-4 border p-4 p-lg-5 shadow-sm mb-5">
          <div className="row g-5 align-items-center">
            {/* PRODUCT IMAGE GALLERY */}
            <div className="col-lg-6">
              <div className="main-image-wrap bg-light rounded-4 p-4 text-center mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-600 mb-2">
                {product.category}
              </span>
              <h2 className="fw-700 medium-black mb-3">{product.name}</h2>

              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="text-warning fs-6">
                  {"★".repeat(Math.round(product.rating || 5))}
                  {"☆".repeat(5 - Math.round(product.rating || 5))}
                </div>
                <span className="text-muted small">
                  ({product.reviewsCount || 10} Customer Reviews)
                </span>
                <span className="badge bg-success-subtle text-success">
                  In Stock
                </span>
              </div>

              <div className="d-flex align-items-baseline gap-3 mb-4">
                <h3 className="fw-700 color-primary mb-0">${product.price.toFixed(2)}</h3>
                {product.oldPrice && (
                  <span className="text-muted text-decoration-line-through fs-5">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
                {product.description}
              </p>

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
                    className="form-control text-center fw-600"
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

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`btn p-3 rounded-circle border shadow-sm ${
                    isFavorite ? "btn-danger text-white" : "btn-white text-dark"
                  }`}
                  title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <i className={isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                </button>
              </div>

              <div className="d-grid mb-4">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="cus-btn-2 text-center"
                >
                  <span className="btn-text">Buy It Now</span>
                  <span>Buy It Now</span>
                </button>
              </div>

              <div className="border-top pt-3 text-muted small d-flex flex-column gap-2">
                <div>
                  <strong>SKU:</strong> <span className="text-dark">{product.sku || "ST-001"}</span>
                </div>
                <div>
                  <strong>Category:</strong>{" "}
                  <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-primary text-decoration-none">
                    {product.category}
                  </Link>
                </div>
                <div>
                  <strong>Shipping:</strong> <span className="text-dark">Free delivery on orders over $50. Estimated delivery in 2-4 business days.</span>
                </div>
              </div>
            </div>
          </div>

          {/* TABS SECTION */}
          <div className="mt-5 pt-4 border-top">
            <ul className="nav nav-tabs border-bottom-0 gap-2 mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link rounded-pill px-4 fw-600 ${
                    activeTab === "description" ? "active bg-primary text-white" : "text-muted"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link rounded-pill px-4 fw-600 ${
                    activeTab === "specs" ? "active bg-primary text-white" : "text-muted"
                  }`}
                  onClick={() => setActiveTab("specs")}
                >
                  Specifications
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link rounded-pill px-4 fw-600 ${
                    activeTab === "reviews" ? "active bg-primary text-white" : "text-muted"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Customer Reviews ({product.reviewsCount || 10})
                </button>
              </li>
            </ul>

            <div className="p-4 bg-light rounded-4">
              {activeTab === "description" && (
                <div>
                  <h5 className="fw-700 mb-3">Product Overview</h5>
                  <p className="text-muted mb-3" style={{ lineHeight: 1.8 }}>
                    Designed with utmost precision for stationery enthusiasts, journaling practitioners, and creative professionals. Each detail has been carefully inspected to ensure premium craftsmanship, tactile elegance, and long-lasting durability.
                  </p>
                  <ul className="text-muted d-flex flex-column gap-2 mb-0">
                    <li><i className="fa-solid fa-check text-success me-2"></i> Acid-free archival materials preventing discoloration over time.</li>
                    <li><i className="fa-solid fa-check text-success me-2"></i> Ergonomic design for fatigue-free daily writing and sketching.</li>
                    <li><i className="fa-solid fa-check text-success me-2"></i> Eco-friendly responsibly sourced packaging.</li>
                  </ul>
                </div>
              )}

              {activeTab === "specs" && (
                <div>
                  <h5 className="fw-700 mb-3">Technical Specifications</h5>
                  <table className="table table-bordered bg-white">
                    <tbody>
                      <tr>
                        <td className="fw-600" style={{ width: "30%" }}>Material</td>
                        <td>Premium wood, faux leather & German steel components</td>
                      </tr>
                      <tr>
                        <td className="fw-600">Weight</td>
                        <td>320 grams</td>
                      </tr>
                      <tr>
                        <td className="fw-600">Dimensions</td>
                        <td>21 cm × 14.8 cm × 1.8 cm</td>
                      </tr>
                      <tr>
                        <td className="fw-600">Origin</td>
                        <td>Imported / Hand-inspected</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h5 className="fw-700 mb-3">Customer Feedback</h5>
                  <div className="d-flex flex-column gap-3">
                    <div className="p-3 bg-white rounded-3 border">
                      <div className="d-flex justify-content-between mb-1">
                        <strong>Olivia Bennett</strong>
                        <span className="text-warning">★★★★★</span>
                      </div>
                      <p className="text-muted small mb-0">
                        "The paper thickness is incredible—no bleed even with wet fountain pen ink! Highly recommend Stationery Tales."
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-3 border">
                      <div className="d-flex justify-content-between mb-1">
                        <strong>Jonathan Reed</strong>
                        <span className="text-warning">★★★★★</span>
                      </div>
                      <p className="text-muted small mb-0">
                        "Beautiful packaging and solid build. Makes a wonderful executive gift."
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-5">
            <h3 className="fw-700 medium-black mb-4">Related Products</h3>
            <div className="row g-4">
              {relatedProducts.map((p) => (
                <div key={p.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
                  <ProductCard
                    product={p}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
