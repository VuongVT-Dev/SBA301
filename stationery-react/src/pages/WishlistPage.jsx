import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="wishlist-page pb-5">
      <Breadcrumb title="My Wishlist" />

      <div className="container-2">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border shadow-sm my-4">
            <i className="fa-light fa-heart fa-4x text-muted mb-3"></i>
            <h3 className="fw-700 mb-2">Your Wishlist is Empty</h3>
            <p className="text-muted mb-4">
              Save your favorite notebooks, pens, and art supplies here to revisit anytime.
            </p>
            <Link to="/shop" className="cus-btn">
              <span className="btn-text">Discover Products</span>
              <span>Discover Products</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-4 border p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <h5 className="fw-700 mb-0">Wishlist Items ({wishlistItems.length})</h5>
              <button
                type="button"
                onClick={clearWishlist}
                className="btn btn-outline-danger btn-sm rounded-pill"
              >
                Clear All Wishlist
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock Status</th>
                    <th>Action</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {wishlistItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "contain",
                              backgroundColor: "#f8f9fa",
                              borderRadius: "8px",
                            }}
                          />
                          <div>
                            <Link
                              to={`/product/${item.id}`}
                              className="fw-600 text-dark text-decoration-none d-block"
                            >
                              {item.name}
                            </Link>
                            <small className="text-muted">{item.category}</small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-700 color-primary">${item.price.toFixed(2)}</td>
                      <td>
                        <span className="badge bg-success-subtle text-success">
                          In Stock
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="btn btn-primary btn-sm rounded-pill px-3"
                        >
                          + Add to Cart
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          className="btn btn-link text-danger p-0"
                          title="Remove from wishlist"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
