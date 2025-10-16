// Zustand store for wishlist management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistMovie {
  id: number;
  title: string;
  poster?: string;
  category: "trending" | "topRated" | "nowPlaying";
  addedAt: string;
}

interface WishlistState {
  movies: WishlistMovie[];
  addMovie: (movie: Omit<WishlistMovie, 'addedAt'>) => void;
  removeMovie: (movieId: number) => void;
  isInWishlist: (movieId: number) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      movies: [],
      
      addMovie: (movie) => {
        const { movies } = get();
        const existingMovie = movies.find(m => m.id === movie.id);
        
        if (!existingMovie) {
          set({
            movies: [
              ...movies,
              {
                ...movie,
                addedAt: new Date().toISOString()
              }
            ]
          });
        }
      },
      
      removeMovie: (movieId) => {
        const { movies } = get();
        set({
          movies: movies.filter(movie => movie.id !== movieId)
        });
      },
      
      isInWishlist: (movieId) => {
        const { movies } = get();
        return movies.some(movie => movie.id === movieId);
      },
      
      clearWishlist: () => {
        set({ movies: [] });
      },
      
      getWishlistCount: () => {
        const { movies } = get();
        return movies.length;
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ movies: state.movies }),
    }
  )
);

export const useWishlist = () => {
  if (typeof window === 'undefined') {
    return {
      movies: [],
      addMovie: () => {},
      removeMovie: () => {},
      isInWishlist: () => false,
      clearWishlist: () => {},
      getWishlistCount: () => 0
    };
  }
  
  return useWishlistStore();
};
