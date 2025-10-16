// src/test/utils.tsx
// Test utilities for React Testing Library

import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';

// Mock TMDB service responses
export const mockTMDBMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    overview: 'A great test movie',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [28, 12],
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie 1',
    popularity: 100,
    video: false
  },
  {
    id: 2,
    title: 'Test Movie 2',
    overview: 'Another great test movie',
    poster_path: '/test-poster2.jpg',
    backdrop_path: '/test-backdrop2.jpg',
    release_date: '2024-02-01',
    vote_average: 7.8,
    vote_count: 800,
    genre_ids: [35, 18],
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie 2',
    popularity: 90,
    video: false
  }
];

export const mockTMDBMovie = mockTMDBMovies[0];

// Mock fetch responses
export const mockFetchResponses = {
  trending: {
    page: 1,
    results: mockTMDBMovies,
    total_pages: 1,
    total_results: 2
  },
  topRated: {
    page: 1,
    results: mockTMDBMovies,
    total_pages: 1,
    total_results: 2
  },
  nowPlaying: {
    page: 1,
    results: mockTMDBMovies,
    total_pages: 1,
    total_results: 2
  },
  movieDetails: mockTMDBMovie
};

// Custom render function with router
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock TMDB service
export const mockTMDBService = {
  getTrendingMovies: vi.fn().mockResolvedValue(mockTMDBMovies),
  getTopRatedMovies: vi.fn().mockResolvedValue(mockTMDBMovies),
  getNowPlayingMovies: vi.fn().mockResolvedValue(mockTMDBMovies),
  getMovieDetails: vi.fn().mockResolvedValue(mockTMDBMovie),
  getImageUrl: vi.fn().mockImplementation((path: string | null) => 
    path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder.jpg'
  )
};

// Mock wishlist store
export const mockWishlistStore = {
  movies: [],
  addMovie: vi.fn(),
  removeMovie: vi.fn(),
  isInWishlist: vi.fn().mockReturnValue(false),
  clearWishlist: vi.fn(),
  getWishlistCount: vi.fn().mockReturnValue(0)
};
