import React, { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import { products } from "../data/products";
import { blogs } from "../data/blogs";
import ProductCard from "../components/product/ProductCard";
import BlogCard from "../components/blog/BlogCard";
import QuickViewModal from "../components/common/QuickViewModal";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const filteredProducts = products.filter((p) => {
    if (activeTab === "bestseller") return p.isBestSeller;
    if (activeTab === "new") return p.isNew;
    if (activeTab === "featured") return p.isFeatured;
    return true;
  });

  return (
    <div className="home-page">
      {/* HERO BANNER */}
      <section className="hero-banner bg-sec py-5" style={{ minHeight: "480px" }}>
        <div className="container-2">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <span className="badge bg-white text-primary px-3 py-2 rounded-pill fw-600 mb-3 shadow-sm">
                ✨ Handcrafted Stationery Collection 2026
              </span>
              <h1 className="display-4 fw-700 medium-black mb-3" style={{ lineHeight: 1.2 }}>
                Elevate Your Writing & Everyday Creativity
              </h1>
              <p className="lead text-muted mb-4">
                Discover bespoke leather journals, buttery smooth fountain pens, and aesthetic desk organizers designed to spark inspiration.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/shop" className="cus-btn">
                  <span className="btn-text">Shop Collection</span>
                  <span>Shop Collection</span>
                </Link>
                <Link to="/about" className="cus-btn-2">
                  <span className="btn-text">Learn Our Story</span>
                  <span>Learn Our Story</span>
                </Link>
              </div>
            </div>

            <div className="col-lg-6 text-center position-relative">
              <img
                src="/assets/media/banner/hero-image.png"
                alt="Stationery Tales"
                className="img-fluid"
                style={{ maxHeight: "420px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section className="py-4 border-bottom bg-white">
        <div className="container-2">
          <div className="row g-4 text-center text-md-start">
            <div className="col-md-3 col-6 d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded-circle text-primary fs-4">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div>
                <h6 className="fw-700 mb-1">Free Fast Delivery</h6>
                <small className="text-muted">On all orders over $50</small>
              </div>
            </div>

            <div className="col-md-3 col-6 d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded-circle text-primary fs-4">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h6 className="fw-700 mb-1">100% Safe Payments</h6>
                <small className="text-muted">Encrypted SSL checkout</small>
              </div>
            </div>

            <div className="col-md-3 col-6 d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded-circle text-primary fs-4">
                <i className="fa-solid fa-arrows-rotate"></i>
              </div>
              <div>
                <h6 className="fw-700 mb-1">30-Day Easy Returns</h6>
                <small className="text-muted">Hassle-free exchange</small>
              </div>
            </div>

            <div className="col-md-3 col-6 d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded-circle text-primary fs-4">
                <i className="fa-solid fa-headset"></i>
              </div>
              <div>
                <h6 className="fw-700 mb-1">24/7 Support</h6>
                <small className="text-muted">Dedicated expert team</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-5 bg-light">
        <div className="container-2">
          <div className="d-flex align-items-end justify-content-between mb-4">
            <div>
              <span className="text-primary fw-600">DISCOVER</span>
              <h2 className="fw-700 medium-black">Shop By Categories</h2>
            </div>
            <Link to="/shop" className="fw-600 color-primary text-decoration-none">
              View All Categories <i className="fa-solid fa-arrow-right small ms-1"></i>
            </Link>
          </div>

          <div className="row g-3">
            {categories.slice(0, 6).map((cat) => (
              <div key={cat.id} className="col-xl-2 col-lg-3 col-md-4 col-6">
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="text-decoration-none"
                >
                  <div className="category-card bg-white p-3 rounded-4 text-center border h-100 shadow-sm transition-all hover-shadow">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="img-fluid mb-3"
                      style={{ height: "70px", objectFit: "contain" }}
                    />
                    <h6 className="fw-600 medium-black text-truncate mb-1">{cat.name}</h6>
                    <small className="text-muted">{cat.itemCount} items</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS & TABS */}
      <section className="py-5 bg-white">
        <div className="container-2">
          <div className="text-center mb-4">
            <span className="text-primary fw-600">HANDPICKED FOR YOU</span>
            <h2 className="fw-700 medium-black mb-3">Featured Stationery Essentials</h2>
            <div className="d-inline-flex gap-2 p-1 bg-light rounded-pill border">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 ${
                  activeTab === "all" ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Products
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 ${
                  activeTab === "bestseller" ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setActiveTab("bestseller")}
              >
                Best Sellers
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 ${
                  activeTab === "new" ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setActiveTab("new")}
              >
                New Arrivals
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 ${
                  activeTab === "featured" ? "btn-primary" : "btn-light"
                }`}
                onClick={() => setActiveTab("featured")}
              >
                Staff Picks
              </button>
            </div>
          </div>

          <div className="row g-4">
            {filteredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
                <ProductCard
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/shop" className="cus-btn">
              <span className="btn-text">View All Stationery</span>
              <span>View All Stationery</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="py-5 bg-sec my-4">
        <div className="container-2">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-danger text-white px-3 py-2 rounded-pill fw-600 mb-3">
                LIMITED TIME OFFER - 25% OFF
              </span>
              <h2 className="display-6 fw-700 medium-black mb-3">
                The Executive Writing & Planner Gift Bundle
              </h2>
              <p className="text-muted mb-4">
                Curated for leaders, authors, and dreamers. Includes a handcrafted Italian leather journal, gold-nib fountain pen, and 3 bottles of premium pigment ink.
              </p>
              <Link to="/shop" className="cus-btn">
                <span className="btn-text">Claim Offer Now</span>
                <span>Claim Offer Now</span>
              </Link>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <img
                src="/assets/media/products/large-image-1.png"
                alt="Promo Bundle"
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: "340px", objectFit: "contain" }}
                onError={(e) => {
                  e.target.src = "/assets/media/banner/hero-image.png";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* LATEST BLOG POSTS */}
      <section className="py-5 bg-white">
        <div className="container-2">
          <div className="d-flex align-items-end justify-content-between mb-4">
            <div>
              <span className="text-primary fw-600">INSPIRATION & STORIES</span>
              <h2 className="fw-700 medium-black">From Our Journal</h2>
            </div>
            <Link to="/blogs" className="fw-600 color-primary text-decoration-none">
              View All Articles <i className="fa-solid fa-arrow-right small ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="col-lg-4 col-md-6 col-12">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
