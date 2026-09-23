import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ title, parent = { name: "Home", link: "/" } }) => {
  return (
    <section className="title-banner bg-sec py-4 mb-4">
      <div className="container-2">
        <div className="title-wrapper">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <h1 className="fw-700 medium-black text-sm-start text-center mb-2">
                {title}
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 justify-content-sm-start justify-content-center">
                  <li className="breadcrumb-item">
                    <Link to={parent.link} className="text-muted text-decoration-none">
                      {parent.name}
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-primary fw-600" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 d-sm-block d-none">
              <div className="text-end">
                <img
                  src="/assets/media/banner/title-banner-image.png"
                  alt={title}
                  style={{ maxHeight: "120px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
