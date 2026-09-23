import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <>
      <header className="bg-sec">
        <div className="container-2">
          <div className="header-top row align-items-center row-gap-sm-2 row-gap-3">
            <div className="col-lg-4 d-lg-block d-none">
              <div className="our-number">
                <p className="fw-500 medium-black">Need help? Call Us:</p>
                <p className="fw-700 color-primary">+1834 123 456 789</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-5 col-6">
              <div className="text-start text-lg-center">
                <Link to="/" className="header-logo">
                  <img src="/assets/media/logo.png" alt="Stationery Tales" />
                </Link>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-6">
              <div className="header-end">
                <div className="header-buttons d-flex align-items-center gap-12">
                  {/* Wishlist Link */}
                  <Link to="/wishlist" className="button-block position-relative" title="Wishlist">
                    <i className="fa-regular fa-heart" style={{ fontSize: "18px" }}></i>
                    {wishlistCount > 0 && (
                      <span
                        className="badge bg-danger rounded-pill position-absolute"
                        style={{ top: "-6px", right: "-8px", fontSize: "10px" }}
                      >
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Cart Button */}
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="button-block cart-button position-relative border-0 bg-transparent"
                    title="Cart"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                    >
                      <path
                        d="M17.486 16.1063C17.0463 13.0299 15.9738 5.52124 15.9738 5.52124C15.9366 5.26112 15.7138 5.06792 15.4511 5.06792H13.1514V3.33377C12.9821 -1.11295 6.60775 -1.10957 6.4401 3.33377V5.06792H4.14048C3.87772 5.06792 3.65498 5.26112 3.61781 5.52124C3.61781 5.52124 2.54527 13.0299 2.1056 16.1063C2.03749 16.5828 2.17934 17.0645 2.49469 17.428C2.81003 17.7915 3.26685 18 3.74801 18H15.8436C16.3247 18 16.7815 17.7915 17.0969 17.428C17.4122 17.0646 17.5541 16.5828 17.486 16.1063ZM7.4961 3.33377C7.61208 0.286388 11.9805 0.288675 12.0954 3.33377V5.06792H7.4961V3.33377ZM16.2993 16.736C16.1845 16.8682 16.0184 16.944 15.8436 16.944H3.74801C3.57308 16.944 3.40701 16.8682 3.29233 16.736C3.17772 16.6039 3.12619 16.4289 3.15094 16.2557C3.52566 13.6339 4.36002 7.79284 4.59842 6.12389H6.44014V7.29249C6.46611 7.99228 7.47037 7.99175 7.4961 7.29249V6.12389H12.0954V7.29249C12.1214 7.99228 13.1257 7.99175 13.1514 7.29249V6.12389H14.9932C15.2316 7.79284 16.066 13.6339 16.4406 16.2557C16.4654 16.4289 16.4138 16.6039 16.2993 16.736Z"
                        fill="#1E1F20"
                      />
                    </svg>
                    {cartCount > 0 && (
                      <span
                        className="badge bg-primary rounded-pill position-absolute"
                        style={{ top: "-6px", right: "-8px", fontSize: "10px" }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="drop-container d-sm-block d-none">
                  <div className="wrapper-dropdown medium-black">
                    <span className="selected-display medium-black">
                      <span>
                        <img src="/assets/media/icons/usd.png" alt="" />
                      </span>{" "}
                      USD ($)
                    </span>
                  </div>
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="main-menu__toggler border-0 bg-transparent d-lg-none"
                >
                  <img src="/assets/media/icons/menu-2.png" alt="menu" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="container-2">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-7 d-lg-flex d-none">
                <nav className="navigation d-flex align-items-center">
                  <div className="menu-button-right">
                    <div className="main-menu__nav">
                      <ul className="main-menu__list">
                        <li className="dropdown">
                          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                            Home <i className="fa-light fa-chevron-down"></i>
                          </NavLink>
                          <ul className="sub-menu">
                            <li><Link to="/">Home 1</Link></li>
                            <li><Link to="/home-2">Home 2</Link></li>
                          </ul>
                        </li>

                        <li>
                          <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                            About Us
                          </NavLink>
                        </li>

                        <li className="dropdown">
                          <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>
                            Shop <i className="fa-light fa-chevron-down"></i>
                          </NavLink>
                          <ul className="sub-menu">
                            <li><Link to="/shop">Shop Grid</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/checkout">Checkout</Link></li>
                          </ul>
                        </li>

                        <li className="dropdown">
                          <NavLink to="/blogs" className={({ isActive }) => (isActive ? "active" : "")}>
                            Blogs <i className="fa-light fa-chevron-down"></i>
                          </NavLink>
                          <ul className="sub-menu">
                            <li><Link to="/blogs">Blog Grid</Link></li>
                            <li><Link to="/blog/1">Featured Article</Link></li>
                          </ul>
                        </li>

                        <li>
                          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                            Contact Us
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>

              <div className="col-xl-4 col-lg-5 col-md-12 order-lg-3 order-3">
                <form onSubmit={handleSearch}>
                  <div className="search-block">
                    <input
                      type="search"
                      className="input-search form-control"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for stationery, pens, notebooks..."
                    />
                    <button type="submit" id="magnifying-btn" className="button-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M8.11719 0C12.593 0 16.2344 3.64137 16.2344 8.11719C16.2344 10.1445 15.4873 12.0007 14.2539 13.4247L19.8284 18.9998C20.0572 19.2286 20.0572 19.5996 19.8284 19.8284C19.5995 20.0573 19.2286 20.0572 18.9997 19.8284L13.4254 14.2534C12.0012 15.4871 10.1448 16.2344 8.11719 16.2344C3.64137 16.2344 0 12.593 0 8.11719C0 3.64137 3.64137 0 8.11719 0ZM8.11719 15.0625C11.9469 15.0625 15.0625 11.9468 15.0625 8.11719C15.0625 4.28754 11.9468 1.17188 8.11719 1.17188C4.28754 1.17188 1.17188 4.28754 1.17188 8.11719C1.17188 11.9468 4.28754 15.0625 8.11719 15.0625Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-nav__wrapper ${mobileMenuOpen ? "expanded" : ""}`}>
        <div
          className="mobile-nav__overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div className="mobile-nav__content">
          <span
            className="mobile-nav__close"
            onClick={() => setMobileMenuOpen(false)}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-times"></i>
          </span>
          <div className="logo-box mb-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img src="/assets/media/logo.png" alt="logo" />
            </Link>
          </div>
          <ul className="list-unstyled d-flex flex-column gap-3 mb-4">
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="fw-600">
                Home 1
              </Link>
            </li>
            <li>
              <Link to="/home-2" onClick={() => setMobileMenuOpen(false)} className="fw-600">
                Home 2
              </Link>
            </li>
            <li>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="fw-600">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="fw-600">
                Cart ({cartCount})
              </Link>
            </li>
            <li>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="fw-600">
                Wishlist ({wishlistCount})
              </Link>
            </li>
            <li>
              <Link to="/blogs" onClick={() => setMobileMenuOpen(false)} className="fw-600">
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="fw-600">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="fw-600">
                Contact Us
              </Link>
            </li>
          </ul>

          <ul className="mobile-nav__contact list-unstyled">
            <li>
              <i className="fas fa-envelope me-2"></i>
              <a href="mailto:support@stationerytales.com">support@stationerytales.com</a>
            </li>
            <li>
              <i className="fa fa-phone-alt me-2"></i>
              <a href="tel:+1834123456">+1834 123 456 789</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
