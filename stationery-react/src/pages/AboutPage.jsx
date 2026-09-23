import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";

const AboutPage = () => {
  return (
    <div className="about-page pb-5">
      <Breadcrumb title="About Us" />

      <div className="container-2">
        {/* STORY SECTION */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-lg-6">
            <span className="text-primary fw-600">OUR STORY</span>
            <h2 className="fw-700 medium-black mb-3">
              Crafting Meaningful Tools for Mindful Thinkers
            </h2>
            <p className="text-muted mb-3" style={{ lineHeight: 1.8 }}>
              Founded in 2021, Stationery Tales was born out of a genuine love for tactile paper, deliberate handwriting, and personal stationery. In an increasingly fast-paced digital era, we believe that putting pen to paper remains the most profound way to process ideas, reflect on memories, and express human creativity.
            </p>
            <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>
              Each journal, pen, and desk organizer in our catalog is thoughtfully designed and ethically sourced from artisans around the globe who respect the heritage of papermaking and fine writing craftsmanship.
            </p>
            <Link to="/shop" className="cus-btn">
              <span className="btn-text">Explore Our Products</span>
              <span>Explore Our Products</span>
            </Link>
          </div>

          <div className="col-lg-6 text-center">
            <img
              src="/assets/media/products/large-image-1.png"
              alt="About Stationery Tales"
              className="img-fluid rounded-4 shadow-sm"
              style={{ maxHeight: "380px", objectFit: "contain" }}
              onError={(e) => {
                e.target.src = "/assets/media/banner/hero-image.png";
              }}
            />
          </div>
        </div>

        {/* METRICS / STATS */}
        <div className="p-5 bg-sec rounded-4 mb-5">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-6">
              <h2 className="fw-800 color-primary mb-1">15,000+</h2>
              <p className="text-muted fw-600 mb-0">Happy Customers</p>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-800 color-primary mb-1">450+</h2>
              <p className="text-muted fw-600 mb-0">Unique Products</p>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-800 color-primary mb-1">99.8%</h2>
              <p className="text-muted fw-600 mb-0">Positive Reviews</p>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-800 color-primary mb-1">28+</h2>
              <p className="text-muted fw-600 mb-0">Global Partners</p>
            </div>
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="mb-5">
          <div className="text-center mb-4">
            <span className="text-primary fw-600">WHAT WE STAND FOR</span>
            <h2 className="fw-700 medium-black">Our Core Values</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm">
                <div className="fs-2 text-primary mb-3">
                  <i className="fa-solid fa-leaf"></i>
                </div>
                <h5 className="fw-700 mb-2">Sustainable Materials</h5>
                <p className="text-muted small mb-0">
                  We prioritize FSC-certified recycled paper, non-toxic vegetable inks, and plastic-free packaging.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm">
                <div className="fs-2 text-primary mb-3">
                  <i className="fa-solid fa-feather-pointed"></i>
                </div>
                <h5 className="fw-700 mb-2">Artisanal Quality</h5>
                <p className="text-muted small mb-0">
                  Every notebook spine and pen nib undergoes individual hand inspection to ensure zero defect.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm">
                <div className="fs-2 text-primary mb-3">
                  <i className="fa-solid fa-heart"></i>
                </div>
                <h5 className="fw-700 mb-2">Customer First</h5>
                <p className="text-muted small mb-0">
                  From safe deliveries to easy 30-day returns, our support team treats every writer with care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
