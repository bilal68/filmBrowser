import { lazy, Suspense } from 'react';
import Layout from "@/components/Layout/Layout";

// Lazy load components
const Home = lazy(() => import("@/pages/Home"));
const FilmDetail = lazy(() => import("@/pages/FilmDetail"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));

// Loading component
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default [
  {
    path: "/",
    element: <Layout />,
    children: [
      { 
        index: true, 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ), 
        loader: async () => {
          const { tmdbService } = await import('@/services/tmdb');
          const [trending, topRated, nowPlaying] = await Promise.all([
            tmdbService.getTrendingMovies(),
            tmdbService.getTopRatedMovies(),
            tmdbService.getNowPlayingMovies()
          ]);
          
          return {
            trending: trending.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : undefined,
              category: 'trending' as const
            })),
            topRated: topRated.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : undefined,
              category: 'topRated' as const
            })),
            nowPlaying: nowPlaying.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : undefined,
              category: 'nowPlaying' as const
            }))
          };
        }
      },
      { 
        path: "film/:id", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <FilmDetail />
          </Suspense>
        ), 
        loader: async ({ params }) => {
          const id = Number(params.id);
          const category = id % 3 === 0 ? "nowPlaying" : id % 2 === 0 ? "topRated" : "trending";
          
          try {
            const { tmdbService } = await import('@/services/tmdb');
            const movie = await tmdbService.getMovieDetails(id);
            return { movie, category };
          } catch (error) {
            // Fallback movie data
            const fallbackMovie = {
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
      },
      { 
        path: "wishlist", 
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Wishlist />
          </Suspense>
        )
      },
    ],
  },
];
