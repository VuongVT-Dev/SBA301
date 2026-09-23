import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import { blogs } from "../data/blogs";

const BlogDetailPage = () => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id)) || blogs[0];

  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Eleanor Vance",
      date: "14 Oct, 2026",
      text: "This guide completely changed how I organize my morning pages. Using a fountain pen with medium nib really slowed down my anxious thoughts.",
    },
    {
      id: 2,
      name: "Marcus Thorne",
      date: "16 Oct, 2026",
      text: "Great point regarding brain dumping. A bleed-proof notebook makes all the difference.",
    },
  ]);

  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.comment) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        name: commentForm.name,
        date: "Just now",
        text: commentForm.comment,
      },
    ]);
    setCommentForm({ name: "", email: "", comment: "" });
  };

  const otherBlogs = blogs.filter((b) => b.id !== blog.id);

  return (
    <div className="blog-detail-page pb-5">
      <Breadcrumb
        title={blog.title}
        parent={{ name: "Blogs", link: "/blogs" }}
      />

      <div className="container-2">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-9">
            <article className="bg-white rounded-4 border p-4 p-md-5 shadow-sm mb-5">
              <div className="blog-header mb-4">
                <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-600 mb-2">
                  {blog.category}
                </span>
                <h1 className="fw-700 medium-black mb-3">{blog.title}</h1>
                <div className="d-flex align-items-center gap-4 text-muted small border-bottom pb-3">
                  <span><i className="fa-regular fa-user me-1"></i> By {blog.author}</span>
                  <span><i className="fa-regular fa-calendar me-1"></i> {blog.date}</span>
                  <span><i className="fa-regular fa-comment me-1"></i> {comments.length} Comments</span>
                </div>
              </div>

              <div className="blog-feature-image mb-4 text-center bg-light rounded-4 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="img-fluid w-100"
                  style={{ maxHeight: "450px", objectFit: "cover" }}
                />
              </div>

              <div className="blog-body text-dark" style={{ lineHeight: 1.9, fontSize: "16px" }}>
                <p className="lead text-muted mb-4">{blog.excerpt}</p>
                <div style={{ whiteSpace: "pre-line" }}>{blog.content}</div>
              </div>

              {/* TAGS & SHARE */}
              <div className="border-top pt-4 mt-5 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-600 small">Tags:</span>
                  {blog.tags &&
                    blog.tags.map((tag) => (
                      <span key={tag} className="badge bg-light text-dark border">
                        #{tag}
                      </span>
                    ))}
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="fw-600 small">Share:</span>
                  <a href="#share" className="text-dark"><i className="fa-brands fa-x-twitter"></i></a>
                  <a href="#share" className="text-dark"><i className="fab fa-facebook"></i></a>
                  <a href="#share" className="text-dark"><i className="fab fa-pinterest"></i></a>
                </div>
              </div>
            </article>

            {/* COMMENTS SECTION */}
            <div className="bg-white rounded-4 border p-4 p-md-5 shadow-sm mb-5">
              <h4 className="fw-700 mb-4">Reader Comments ({comments.length})</h4>

              <div className="d-flex flex-column gap-3 mb-5">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong className="text-dark">{c.name}</strong>
                      <small className="text-muted">{c.date}</small>
                    </div>
                    <p className="text-muted small mb-0">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* ADD COMMENT FORM */}
              <h5 className="fw-700 mb-3">Leave a Reply</h5>
              <form onSubmit={handleAddComment}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      className="form-control"
                      value={commentForm.name}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      required
                      placeholder="Your Email *"
                      className="form-control"
                      value={commentForm.email}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <textarea
                    required
                    rows="4"
                    placeholder="Write your constructive thoughts or questions here..."
                    className="form-control"
                    value={commentForm.comment}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, comment: e.target.value })
                    }
                  ></textarea>
                </div>
                <button type="submit" className="cus-btn">
                  <span className="btn-text">Post Comment</span>
                  <span>Post Comment</span>
                </button>
              </form>
            </div>

            {/* MORE ARTICLES */}
            {otherBlogs.length > 0 && (
              <div>
                <h4 className="fw-700 mb-4">You Might Also Enjoy</h4>
                <div className="row g-4">
                  {otherBlogs.map((item) => (
                    <div key={item.id} className="col-md-6">
                      <div className="bg-white rounded-4 border p-3 shadow-sm h-100 d-flex gap-3 align-items-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                        <div>
                          <small className="text-primary fw-600">{item.category}</small>
                          <h6 className="fw-600 mb-1">
                            <Link to={`/blog/${item.id}`} className="text-dark text-decoration-none text-truncate d-block" style={{ maxWidth: "240px" }}>
                              {item.title}
                            </Link>
                          </h6>
                          <small className="text-muted">{item.date}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
