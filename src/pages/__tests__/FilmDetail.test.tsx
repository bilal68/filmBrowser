// src/pages/__tests__/Filmdetail.test.tsx
// Tests for Film Detail component

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils';
import { FilmDetailComponent } from '../Filmdetail';
import { mockTMDBMovie } from '../../test/utils';

// Mock the TMDB service
vi.mock('../../services/tmdb', () => ({
  tmdbService: {
    getImageUrl: vi.fn().mockImplementation((path: string | null) => 
      path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder.jpg'
    )
  }
}));

// Mock the wishlist store
vi.mock('../../stores/wishlistStore', () => ({
  useWishlist: () => ({
    addMovie: vi.fn(),
    removeMovie: vi.fn(),
    isInWishlist: vi.fn().mockReturnValue(false)
  })
}));

describe('Film Detail Component', () => {
  const mockData = {
    movie: {
      id: 1,
      title: 'Test Movie',
      overview: 'A great test movie with an interesting plot.',
      poster: 'https://image.tmdb.org/t/p/w500/test-poster.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/test-backdrop.jpg',
      releaseDate: '2024-01-01',
      rating: 8.5
    },
    category: 'trending' as const
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render movie title', () => {
    render(<FilmDetailComponent data={mockData} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('should render movie overview', () => {
    render(<FilmDetailComponent data={mockData} />);
    expect(screen.getByText('A great test movie with an interesting plot.')).toBeInTheDocument();
  });

  it('should render release date', () => {
    render(<FilmDetailComponent data={mockData} />);
    expect(screen.getByText('Released: 2024')).toBeInTheDocument();
  });

  it('should render rating', () => {
    render(<FilmDetailComponent data={mockData} />);
    expect(screen.getByText('⭐ 8.5/10')).toBeInTheDocument();
  });

  it('should render movie poster when available', () => {
    render(<FilmDetailComponent data={mockData} />);
    
    const poster = screen.getByRole('img');
    expect(poster).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/test-poster.jpg');
    expect(poster).toHaveAttribute('alt', 'Test Movie');
  });

  it('should render placeholder when no poster available', () => {
    const dataWithoutPoster = {
      ...mockData,
      movie: {
        ...mockData.movie,
        poster: ''
      }
    };

    render(<FilmDetailComponent data={dataWithoutPoster} />);
    
    const placeholder = screen.getByText('Test Movie').closest('.hero')?.querySelector('.placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('should render wishlist button', () => {
    render(<FilmDetailComponent data={mockData} />);
    
    const button = screen.getByRole('button', { name: /Add to Wish List/i });
    expect(button).toBeInTheDocument();
  });

  it('should handle wishlist toggle', () => {
    const mockAddMovie = vi.fn();
    const mockRemoveMovie = vi.fn();
    const mockIsInWishlist = vi.fn().mockReturnValue(false);

    vi.mocked(require('../../stores/wishlistStore').useWishlist).mockReturnValue({
      addMovie: mockAddMovie,
      removeMovie: mockRemoveMovie,
      isInWishlist: mockIsInWishlist
    });

    render(<FilmDetailComponent data={mockData} />);
    
    const button = screen.getByRole('button', { name: /Add to Wish List/i });
    fireEvent.click(button);

    expect(mockAddMovie).toHaveBeenCalledWith({
      id: 1,
      title: 'Test Movie',
      poster: 'https://image.tmdb.org/t/p/w500/test-poster.jpg',
      category: 'trending'
    });
  });

  it('should show remove button when movie is in wishlist', () => {
    const mockIsInWishlist = vi.fn().mockReturnValue(true);

    vi.mocked(require('../../stores/wishlistStore').useWishlist).mockReturnValue({
      addMovie: vi.fn(),
      removeMovie: vi.fn(),
      isInWishlist: mockIsInWishlist
    });

    render(<FilmDetailComponent data={mockData} />);
    
    expect(screen.getByText('Remove from Wish List')).toBeInTheDocument();
  });

  it('should handle missing optional data gracefully', () => {
    const minimalData = {
      movie: {
        id: 1,
        title: 'Minimal Movie',
        overview: 'Basic overview',
        poster: '',
        backdrop: '',
        releaseDate: '',
        rating: undefined
      },
      category: 'trending' as const
    };

    render(<FilmDetailComponent data={minimalData} />);
    
    expect(screen.getByText('Minimal Movie')).toBeInTheDocument();
    expect(screen.getByText('Basic overview')).toBeInTheDocument();
    expect(screen.queryByText(/Released:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
  });

  it('should apply correct theme class', () => {
    render(<FilmDetailComponent data={mockData} />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveClass('theme--trending');
  });
});
