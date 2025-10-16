import { useLoaderData } from "react-router-dom";
import type { TMDBMovie } from "../services/tmdb";
import { useWishlist } from "../stores/wishlistStore";

type Data = {
  movie: TMDBMovie;
  category: "trending" | "topRated" | "nowPlaying";
};

export async function loader({ params }: { params: { id: string } }): Promise<Data> {
  const id = Number(params.id);
  const category = id % 3 === 0 ? "nowPlaying" : id % 2 === 0 ? "topRated" : "trending";
  
  try {
    const { tmdbService } = await import("../services/tmdb");
    const movie = await tmdbService.getMovieDetails(id);
    return { movie, category };
  } catch (error) {
    // Fallback movie data
    const fallbackMovie: TMDBMovie = {
      id,
      title: `Movie #${id}`,
      overview: "Movie description unavailable.",
      poster_path: null,
      backdrop_path: null,
      release_date: '2024-01-01',
      vote_average: 7.5,
      vote_count: 500,
      genre_ids: [28],
      adult: false,
      original_language: 'en',
      original_title: `Movie #${id}`,
      popularity: 50,
      video: false
    };
    return { movie: fallbackMovie, category };
  }
}

export default function FilmDetail() {
  const { movie, category } = useLoaderData() as Data;
  const { addMovie, removeMovie, isInWishlist } = useWishlist();
  const isInWishlistMovie = isInWishlist(movie.id);
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : '/placeholder-movie.svg';
  
  const handleWishlistToggle = () => {
    if (isInWishlistMovie) {
      removeMovie(movie.id);
    } else {
      addMovie({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path || undefined,
        category: category
      });
    }
  };
  
  return (
    <section className={`film-detail theme--${category}`}>
      <div className="container">
        <div className="hero">
          <div className="hero-image-container">
            {movie.poster_path ? (
              <img 
                src={posterUrl} 
                alt={movie.title}
                className="hero-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`hero-placeholder ${movie.poster_path ? 'hidden' : ''}`}>
              <div className="placeholder-icon">🎬</div>
              <div className="placeholder-text">No Image Available</div>
            </div>
          </div>
          
          <div className="hero-meta">
            <h1>{movie.title}</h1>
            
            {movie.release_date && (
              <div className="release-date">
                Released: {new Date(movie.release_date).getFullYear()}
              </div>
            )}
            
            {movie.vote_average > 0 && (
              <div className="rating">
                ⭐ {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)
              </div>
            )}
            
            <p className="overview">{movie.overview}</p>
            
            <button 
              className={`btn ${isInWishlistMovie ? 'btn--wishlist' : `btn--${category}`}`}
              onClick={handleWishlistToggle}
            >
              {isInWishlistMovie ? 'Remove from Wish List' : 'Add to Wish List'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
