import { Link } from "react-router-dom";
import { useWishlist } from "@/stores/wishlistStore";
import LazyImage from "@/components/LazyImage";

export default function Wishlist() {
  const { movies, removeMovie, clearWishlist, getWishlistCount } = useWishlist();

  const handleRemoveMovie = (movieId: number) => {
    removeMovie(movieId);
  };

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <section className="wishlist">
      <div className="wishlist-header">
        <h1>My Wish List</h1>
        <div className="wishlist-actions">
          <span className="wishlist-count">{getWishlistCount()} movies</span>
          {movies.length > 0 && (
            <button 
              className="btn btn--wishlist"
              onClick={handleClearWishlist}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {movies.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">🎬</div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding movies you want to watch later!</p>
          <Link to="/" className="btn btn--primary">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="wishlist-item">
              <Link to={`/film/${movie.id}`} className="wishlist-item-link">
                {movie.poster ? (
                  <LazyImage 
                    src={`https://image.tmdb.org/t/p/w300${movie.poster}`} 
                    alt={movie.title}
                    className="wishlist-item-poster"
                    quality="medium"
                    sizes="(max-width: 768px) 200px, (max-width: 1024px) 250px, 300px"
                  />
                ) : (
                  <div className="wishlist-item-placeholder">
                    <div className="placeholder-icon">🎬</div>
                    <div className="placeholder-text">No Image</div>
                  </div>
                )}
              </Link>
              <div className="wishlist-item-info">
                <h3 className="wishlist-item-title">{movie.title}</h3>
                <p className="wishlist-item-category">
                  {movie.category === 'trending' ? 'Trending' : 
                   movie.category === 'topRated' ? 'Top Rated' : 'Now Playing'}
                </p>
                <p className="wishlist-item-date">
                  Added: {new Date(movie.addedAt).toLocaleDateString()}
                </p>
                <button 
                  className="btn btn--danger btn--small"
                  onClick={() => handleRemoveMovie(movie.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
