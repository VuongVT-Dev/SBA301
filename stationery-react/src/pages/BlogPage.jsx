import React, { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import BlogCard from "../components/blog/BlogCard";
import { blogs } from "../data/blogs";

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = ["All", "Journaling", "Productivity", "Workspace", "Calligraphy", "Art"];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTag === "All" ||
      blog.tags.includes(selectedTag) ||
      blog.category === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="blog-page pb-5">
      <Breadcrumb title="Our Journal & Articles" />

      <div className="container-2">
        <div className="row g-4">
          {/* MAIN BLOG GRID */}
          <div className="col-lg-8">
            {filteredBlogs.length === 0 ? (
              <div className="p-5 text-center bg-light rounded-4">
                <i className="fa-light fa-newspaper fa-3x text-muted mb-3"></i>
                <h5>No articles found</h5>
                <p className="text-muted">Try a different search query or tag filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("All");
                  }}
                  className="btn btn-outline-primary rounded-pill px-4"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} className="col-md-6 col-12">
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BLOG SIDEBAR */}
          <div className="col-lg-4">
            <div className="bg-white rounded-4 border p-4 shadow-sm sticky-top" style={{ top: "90px" }}>
              {/* SEARCH BOX */}
              <div className="mb-4">
                <h6 className="fw-700 mb-3 border-bottom pb-2">Search Articles</h6>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-primary" type="button">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </div>

              {/* TAGS FILTER */}
              <div className="mb-4">
                <h6 className="fw-700 mb-3 border-bottom pb-2">Popular Tags</h6>
                <div className="d-flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`btn btn-sm rounded-pill ${
                        selectedTag === tag ? "btn-primary" : "btn-light border"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* RECENT POSTS */}
              <div className="mb-4">
                <h6 className="fw-700 mb-3 border-bottom pb-2">Recent Posts</h6>
                <div className="d-flex flex-column gap-3">
                  {blogs.map((b) => (
                    <div key={b.id} className="d-flex align-items-center gap-3">
                      <img
                        src={b.image}
                        alt={b.title}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div>
                        <Link
                          to={`/blog/${b.id}`}
                          className="fw-600 text-dark text-decoration-none small text-truncate d-block"
                          style={{ maxWidth: "200px" }}
                        >
                          {b.title}
                        </Link>
                        <small className="text-muted">{b.date}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEWSLETTER MINI WIDGET */}
              <div className="p-3 bg-sec rounded-4 text-center">
                <h6 className="fw-700 mb-1">Weekly Stationery Digest</h6>
                <p className="text-muted small mb-3">
                  Get curated stationery reviews and journaling ideas straight to your inbox.
                </p>
                <Link to="/contact" className="cus-btn btn-sm d-inline-block">
                  <span className="btn-text">Subscribe Free</span>
                  <span>Subscribe Free</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
