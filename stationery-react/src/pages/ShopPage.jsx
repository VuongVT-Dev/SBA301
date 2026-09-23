import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import ProductCard from "../components/product/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";
import { products } from "../data/products";
import { categories } from "../data/categories";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchCategory = searchParams.get("category") || "All";
  const searchKeyword = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(searchCategory);
  const [priceRange, setPriceRange] = useState(100);
  const [sortBy, setSortBy] = useState("default");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Update selected category when query param changes
  React.useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category"));
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;
        const matchesPrice = item.price <= priceRange;
        const matchesSearch =
          !searchKeyword ||
          item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.description.toLowerCase().includes(searchKeyword.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return a.id - b.id;
      });
  }, [selectedCategory, priceRange, searchKeyword, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setPriceRange(100);
    setSortBy("default");
    setSearchParams({});
  };

  return (
    <div className="shop-page pb-5">
      <Breadcrumb title="Shop Collection" />

      <div className="container-2">
        {/* TOP FILTER BAR */}
        <div className="card border-0 bg-light p-3 rounded-4 mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-outline-dark btn-sm rounded-pill d-flex align-items-center gap-2"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <i className="fa-solid fa-sliders"></i>
                <span>{showSidebar ? "Hide Filters" : "Show Filters"}</span>
              </button>
              <span className="text-muted small">
                Showing <strong>{filteredProducts.length}</strong> of {products.length} products
                {searchKeyword && ` for "${searchKeyword}"`}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <label htmlFor="sort-select" className="text-muted small text-nowrap">
                Sort by:
              </label>
              <select
                id="sort-select"
                className="form-select form-select-sm rounded-pill"
                style={{ width: "190px" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* SIDEBAR */}
          {showSidebar && (
            <div className="col-lg-3">
              <div className="sidebar-filter-wrap bg-white p-4 rounded-4 border shadow-sm sticky-top" style={{ top: "90px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-700 mb-0">Filters</h6>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-link text-danger p-0 small text-decoration-none"
                  >
                    Reset All
                  </button>
                </div>

                {/* CATEGORIES FILTER */}
                <div className="mb-4">
                  <h6 className="fw-600 mb-3 border-bottom pb-2">Categories</h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                    <li>
                      <button
                        type="button"
                        className={`btn btn-link text-decoration-none w-100 text-start p-0 d-flex justify-content-between ${
                          selectedCategory === "All" ? "fw-700 color-primary" : "text-dark"
                        }`}
                        onClick={() => setSelectedCategory("All")}
                      >
                        <span>All Categories</span>
                        <span className="text-muted small">({products.length})</span>
                      </button>
                    </li>
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category === cat.name).length;
                      return (
                        <li key={cat.id}>
                          <button
                            type="button"
                            className={`btn btn-link text-decoration-none w-100 text-start p-0 d-flex justify-content-between ${
                              selectedCategory === cat.name ? "fw-700 color-primary" : "text-dark"
                            }`}
                            onClick={() => setSelectedCategory(cat.name)}
                          >
                            <span>{cat.name}</span>
                            <span className="text-muted small">({count})</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* PRICE RANGE FILTER */}
                <div className="mb-4">
                  <h6 className="fw-600 mb-3 border-bottom pb-2">Max Price (${priceRange})</h6>
                  <input
                    type="range"
                    className="form-range"
                    min="5"
                    max="100"
                    step="5"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                  />
                  <div className="d-flex justify-content-between small text-muted">
                    <span>$5</span>
                    <span>${priceRange}</span>
                    <span>$100</span>
                  </div>
                </div>

                {/* PROMO MINI BANNER */}
                <div className="p-3 bg-sec rounded-4 text-center">
                  <small className="text-primary fw-600">SPECIAL PROMO</small>
                  <h6 className="fw-700 mt-1 mb-2">Free US Shipping</h6>
                  <p className="text-muted small mb-0">On all pen & paper bundle orders over $60</p>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS GRID */}
          <div className={showSidebar ? "col-lg-9" : "col-lg-12"}>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-4">
                <i className="fa-light fa-box-open fa-3x text-muted mb-3"></i>
                <h5 className="fw-600">No products found</h5>
                <p className="text-muted">Try changing or resetting your filters to see more results.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-primary rounded-pill px-4"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={
                      showSidebar
                        ? "col-xl-4 col-md-6 col-12"
                        : "col-xl-3 col-lg-4 col-md-6 col-12"
                    }
                  >
                    <ProductCard
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

export default ShopPage;
