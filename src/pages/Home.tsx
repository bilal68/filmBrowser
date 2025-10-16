import { Link, useLoaderData } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { tmdbService, type TMDBMovie } from "@/services/tmdb";
import LazyImage from "@/components/LazyImage";
import { performanceUtils } from "@/utils/performance";

type Movie = {
  id: number;
  title: string;
  poster?: string;
  category: "trending" | "topRated" | "nowPlaying";
};

type LoaderData = { trending: Movie[]; topRated: Movie[]; nowPlaying: Movie[] };

function convertTMDBToMovie(tmdbMovie: TMDBMovie, category: Movie["category"]): Movie {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    poster: tmdbService.getImageUrl(tmdbMovie.poster_path, 'w300'),
    category
  };
}

export async function loader(): Promise<LoaderData> {
  try {
    const [trendingMovies, topRatedMovies, nowPlayingMovies] = await Promise.all([
      tmdbService.getTrendingMovies(),
      tmdbService.getTopRatedMovies(),
      tmdbService.getNowPlayingMovies()
    ]);

    return {
      trending: trendingMovies.slice(0, 10).map(movie => convertTMDBToMovie(movie, "trending")),
      topRated: topRatedMovies.slice(0, 10).map(movie => convertTMDBToMovie(movie, "topRated")),
      nowPlaying: nowPlayingMovies.slice(0, 10).map(movie => convertTMDBToMovie(movie, "nowPlaying"))
    };
  } catch (error) {
    return {
      trending: [
        { id: 1, title: "Trending Movie 1", poster: "", category: "trending" },
        { id: 2, title: "Trending Movie 2", poster: "", category: "trending" }
      ],
      topRated: [
        { id: 3, title: "Top Rated Movie 1", poster: "", category: "topRated" },
        { id: 4, title: "Top Rated Movie 2", poster: "", category: "topRated" }
      ],
      nowPlaying: [
        { id: 5, title: "Now Playing Movie 1", poster: "", category: "nowPlaying" },
        { id: 6, title: "Now Playing Movie 2", poster: "", category: "nowPlaying" }
      ]
    };
  }
}

// SSR-compatible component that accepts data as props
export function HomeComponent({ data }: { data?: LoaderData }) {
  const loaderData = data || (typeof window !== 'undefined' ? useLoaderData() as LoaderData : { trending: [], topRated: [], nowPlaying: [] });
  const { trending, topRated, nowPlaying } = loaderData;
  
  // Aggressive reset approach
  useEffect(() => {
    // Reset scroll position
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      
      // Force multiple layout recalculations
      const forceLayoutReset = () => {
        window.dispatchEvent(new Event('resize'));
      };
      
      // Immediate reset
      forceLayoutReset();
      
      // Multiple delayed resets to catch different timing scenarios
      const timeouts = [
        setTimeout(forceLayoutReset, 50),
        setTimeout(forceLayoutReset, 100),
        setTimeout(forceLayoutReset, 200),
        setTimeout(forceLayoutReset, 500)
      ];
      
      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, []);
  
  const renderSection = (title: string, items: Movie[], category: Movie["category"]) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(6);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    
    useEffect(() => {
      // Aggressive reset to beginning when section mounts
      setCurrentIndex(0);
      setVisibleItems(6); // Reset to default
      
      const updateVisibleItems = () => {
        if (carouselRef.current) {
          const containerWidth = carouselRef.current.offsetWidth;
          const itemWidth = 180 + 16; // card width + gap
          const newVisibleItems = Math.floor(containerWidth / itemWidth);
          // Ensure we show at least 6 movies to fill the row properly
          setVisibleItems(Math.max(6, newVisibleItems));
        }
      };
      
      // Multiple calculations to ensure proper layout
      updateVisibleItems();
      
      const timeouts = [
        setTimeout(updateVisibleItems, 50),
        setTimeout(updateVisibleItems, 100),
        setTimeout(updateVisibleItems, 200),
        setTimeout(updateVisibleItems, 500)
      ];
      
      const handleResize = performanceUtils.throttle(() => {
        updateVisibleItems();
      }, 100);
      
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
      }
      
      return () => {
        timeouts.forEach(clearTimeout);
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', handleResize);
        }
      };
    }, []);
    
    const maxIndex = Math.max(0, items.length - visibleItems);
    
    const scrollLeft = () => {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    };
    
    const scrollRight = () => {
      setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    };
    
    // Touch event handlers for swipe navigation
    const handleTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };
    
    const handleTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };
    
    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;
      
      if (isLeftSwipe) {
        scrollRight();
      } else if (isRightSwipe) {
        scrollLeft();
      }
    };
    
    const visibleMovies = items.slice(currentIndex, currentIndex + visibleItems);
    
    return (
      <div className={`section theme--${category}`}>
        <div className="section-header">
          <h2>{title}</h2>
        </div>
        <div className="section-content">
          <div className="carousel-container">
            <div 
              className="carousel" 
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {visibleMovies.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/film/${movie.id}`}
                  className="card"
                  data-category={category}
                >
                  {movie.poster ? (
                    <LazyImage 
                      src={movie.poster} 
                      alt={movie.title}
                      className="card-image"
                      quality="medium"
                      sizes="(max-width: 768px) 200px, (max-width: 1024px) 300px, 500px"
                    />
                  ) : (
                    <div className="placeholder">
                      <div className="placeholder-icon">🎬</div>
                      <div className="placeholder-text">No Image</div>
                    </div>
                  )}
                  <span className="card-title">{movie.title}</span>
                </Link>
              ))}
            </div>
            
            {currentIndex > 0 && (
              <button 
                className="carousel-nav carousel-nav--left"
                onClick={scrollLeft}
                aria-label="Previous movies"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
            )}
            
            {currentIndex < maxIndex && (
              <button 
                className="carousel-nav carousel-nav--right"
                onClick={scrollRight}
                aria-label="Next movies"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="home">
      <div className="home-header">
        <h1>Browse Films</h1>
        <p>Discover trending, top-rated, and now playing movies</p>
      </div>
      
      <div className="home-sections">
        {renderSection("Trending", trending, "trending")}
        {renderSection("Top Rated", topRated, "topRated")}
        {renderSection("Now Playing", nowPlaying, "nowPlaying")}
      </div>
    </section>
  );
}

export default function Home() {
  return <HomeComponent />;
}
