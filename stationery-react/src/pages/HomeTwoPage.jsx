import React, { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/product/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";

const HomeTwoPage = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <div className="home-two-page">
      {/* HERO BANNER VARIANT 2 */}
      <section
        className="hero-banner-two py-5 text-white position-relative"
        style={{
          background: "linear-gradient(135deg, #1f2421 0%, #216869 100%)",
          minHeight: "520px",
        }}
      >
        <div className="container-2 py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-700 mb-3">
                NEW SEASON ARRIVALS 2026
              </span>
              <h1 className="display-4 fw-800 mb-3 text-white">
                Master Your Work & Art With Precision Tools
              </h1>
              <p className="lead text-white-50 mb-4">
                Explore Japanese fine-liners, acid-free archival sketchbooks, and bespoke leather desk accessories.
              </p>
              <div className="d-flex gap-3">
                <Link to="/shop" className="btn btn-warning btn-lg rounded-pill px-4 fw-700">
                  Shop Now
                </Link>
                <Link to="/contact" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-600">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <img
                src="/assets/media/products/large-image-1.png"
                alt="Banner"
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: "380px" }}
                onError={(e) => {
                  e.target.src = "/assets/media/banner/hero-image.png";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* THREE PROMO TILES */}
      <section className="py-5 bg-white">
        <div className="container-2">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light border h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="text-primary fw-600">BEST SELLERS</span>
                  <h4 className="fw-700 mt-2 mb-3">Notebooks & Planners</h4>
                  <p className="text-muted small">Up to 30% discount on luxury hardcover journals.</p>
                </div>
                <Link to="/shop" className="fw-700 color-primary text-decoration-none">
                  Shop Planners <i className="fa-solid fa-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="p-4 rounded-4 text-white border h-100 d-flex flex-column justify-content-between"
                style={{ backgroundColor: "#264653" }}
              >
                <div>
                  <span className="text-warning fw-600">NEW RELEASE</span>
                  <h4 className="fw-700 mt-2 mb-3 text-white">Calligraphy & Pens</h4>
                  <p className="text-white-50 small">Hand-tuned nibs with velvet ink flow.</p>
                </div>
                <Link to="/shop" className="fw-700 text-warning text-decoration-none">
                  Shop Pens <i className="fa-solid fa-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 bg-light border h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="text-primary fw-600">OFFICE ESSENTIALS</span>
                  <h4 className="fw-700 mt-2 mb-3">Desk & Workspace</h4>
                  <p className="text-muted small">Minimalist wooden trays and organization gear.</p>
                </div>
                <Link to="/shop" className="fw-700 color-primary text-decoration-none">
                  Shop Desk <i className="fa-solid fa-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS GRID */}
      <section className="py-5 bg-light">
        <div className="container-2">
          <div className="text-center mb-5">
            <span className="text-primary fw-600">TOP PICKS</span>
            <h2 className="fw-700 medium-black">Trending Stationery Products</h2>
          </div>

          <div className="row g-4">
            {products.map((product) => (
              <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-12">
                <ProductCard
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default HomeTwoPage;
