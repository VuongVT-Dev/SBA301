import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card bg-white rounded-4 overflow-hidden border shadow-sm h-100 d-flex flex-column">
      <div className="blog-image-wrap position-relative overflow-hidden">
        <Link to={`/blog/${blog.id}`}>
          <img
            src={blog.image}
            alt={blog.title}
            className="img-fluid w-100"
            style={{
              height: "220px",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>
        <span
          className="badge bg-primary position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill fw-600"
        >
          {blog.category}
        </span>
      </div>

      <div className="blog-content-wrap p-4 d-flex flex-column flex-grow-1">
        <div className="blog-meta d-flex align-items-center gap-3 text-muted small mb-2">
          <span>
            <i className="fa-regular fa-calendar me-1"></i> {blog.date}
          </span>
          <span>
            <i className="fa-regular fa-user me-1"></i> {blog.author}
          </span>
        </div>

        <h5 className="fw-700 mb-3">
          <Link
            to={`/blog/${blog.id}`}
            className="text-dark text-decoration-none"
            style={{ lineHeight: "1.4" }}
          >
            {blog.title}
          </Link>
        </h5>

        <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: "1.6" }}>
          {blog.excerpt}
        </p>

        <div className="mt-auto border-top pt-3 d-flex align-items-center justify-content-between">
          <Link
            to={`/blog/${blog.id}`}
            className="fw-600 color-primary text-decoration-none d-flex align-items-center gap-2"
          >
            Read More <i className="fa-solid fa-arrow-right small"></i>
          </Link>
          <span className="text-muted small">
            <i className="fa-regular fa-comment me-1"></i> {blog.commentsCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
