import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-area bg-sec pt-80 pb-40" style={{ marginTop: "60px" }}>
      <div className="container-2">
        <div className="row row-gap-4">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="footer-about">
              <Link to="/" className="d-inline-block mb-24">
                <img src="/assets/media/logo.png" alt="Stationery Tales" />
              </Link>
              <p className="mb-24">
                Stationery Tales is your premier destination for handcrafted notebooks, luxury pens, and inspiring desk essentials designed to elevate your everyday writing experience.
              </p>
              <div className="footer-contact-info mb-20">
                <p className="fw-600 mb-8"><i className="fa fa-map-marker-alt text-primary me-2"></i> Dat gay gay </p>
                <p className="fw-600 mb-8"><i className="fa fa-phone text-primary me-2"></i> +1834 123 456 789</p>
                <p className="fw-600"><i className="fa fa-envelope text-primary me-2"></i> info@stationerytales.com</p>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-sm-6 col-6">
            <h6 className="medium-black fw-700 mb-24">Quick Links</h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/shop">Shop Collection</Link></li>
              <li><Link to="/blogs">Journal & Blogs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-sm-6 col-6">
            <h6 className="medium-black fw-700 mb-24">Customer Care</h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/wishlist">My Wishlist</Link></li>
              <li><Link to="/checkout">Checkout Order</Link></li>
              <li><Link to="/contact">Shipping & Returns</Link></li>
              <li><Link to="/contact">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="col-lg-5 col-md-12 col-sm-12">
            <h6 className="medium-black fw-700 mb-24">Sign Up To Newsletter</h6>
            <p className="mb-24">
              Sign up for exclusive updates, new arrivals, calligraphy workshops & insider discounts.
            </p>
            {subscribed ? (
              <div className="alert alert-success">
                Thank you for subscribing! Check your inbox soon for your 10% discount code.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="newsletter-container mb-24 d-flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="form-control"
                  style={{ borderRadius: "30px", padding: "12px 20px" }}
                />
                <button type="submit" className="cus-btn border-0">
                  <span className="btn-text">Subscribe</span>
                  <span>Subscribe</span>
                </button>
              </form>
            )}

            <div className="payment-cards d-flex align-items-center gap-16 mt-3">
              <div className="card-block"><img src="/assets/media/icons/card-1.png" alt="Payment" /></div>
              <div className="card-block"><img src="/assets/media/icons/card-2.png" alt="Payment" /></div>
              <div className="card-block"><img src="/assets/media/icons/card-3.png" alt="Payment" /></div>
              <div className="card-block"><img src="/assets/media/icons/card-4.png" alt="Payment" /></div>
              <div className="card-block"><img src="/assets/media/icons/card-5.png" alt="Payment" /></div>
            </div>
          </div>
        </div>

        <div className="hr-line line-2 my-4" style={{ borderTop: "1px solid #e0e0e0" }}></div>

        <div className="footer-bottom-bar d-flex align-items-center flex-wrap justify-content-between">
          <p className="dark-gray mb-0">
            © 2026 All Rights Reserved <span className="color-primary fw-600">STATIONERY TALES</span>.
          </p>
          <div className="social-links d-flex gap-3">
            <a href="#twitter" className="text-dark"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="#facebook" className="text-dark"><i className="fab fa-facebook"></i></a>
            <a href="#instagram" className="text-dark"><i className="fab fa-instagram"></i></a>
            <a href="#pinterest" className="text-dark"><i className="fab fa-pinterest"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
