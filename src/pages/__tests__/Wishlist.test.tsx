// src/pages/__tests__/Wishlist.test.tsx
// Tests for Wishlist component

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils';
import Wishlist from '../Wishlist';
import { WishlistMovie } from '../../stores/wishlistStore';

// Mock the wishlist store
const mockWishlistStore = {
  movies: [] as WishlistMovie[],
  removeMovie: vi.fn(),
  clearWishlist: vi.fn(),
  getWishlistCount: vi.fn().mockReturnValue(0)
};

vi.mock('../../stores/wishlistStore', () => ({
  useWishlist: () => mockWishlistStore
}));

describe('Wishlist Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWishlistStore.movies = [];
    mockWishlistStore.getWishlistCount.mockReturnValue(0);
  });

  describe('Empty Wishlist', () => {
    it('should render empty state when no movies', () => {
      render(<Wishlist />);
      
      expect(screen.getByText('My Wish List')).toBeInTheDocument();
      expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
      expect(screen.getByText('Start adding movies you want to watch later!')).toBeInTheDocument();
      expect(screen.getByText('Browse Movies')).toBeInTheDocument();
    });

    it('should show correct count when empty', () => {
      render(<Wishlist />);
      
      expect(screen.getByText('0 movies')).toBeInTheDocument();
    });

    it('should not show clear button when empty', () => {
      render(<Wishlist />);
      
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });
  });

  describe('Wishlist with Movies', () => {
    const mockMovies: WishlistMovie[] = [
      {
        id: 1,
        title: 'Test Movie 1',
        poster: '/test-poster1.jpg',
        category: 'trending',
        addedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'Test Movie 2',
        poster: '/test-poster2.jpg',
        category: 'topRated',
        addedAt: '2024-01-02T00:00:00Z'
      }
    ];

    beforeEach(() => {
      mockWishlistStore.movies = mockMovies;
      mockWishlistStore.getWishlistCount.mockReturnValue(2);
    });

    it('should render movies in wishlist', () => {
      render(<Wishlist />);
      
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
    });

    it('should show correct count', () => {
      render(<Wishlist />);
      
      expect(screen.getByText('2 movies')).toBeInTheDocument();
    });

    it('should show clear button when movies exist', () => {
      render(<Wishlist />);
      
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should render movie posters when available', () => {
      render(<Wishlist />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w300/test-poster1.jpg');
      expect(images[1]).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w300/test-poster2.jpg');
    });

    it('should render movie categories', () => {
      render(<Wishlist />);
      
      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Top Rated')).toBeInTheDocument();
    });

    it('should render added dates', () => {
      render(<Wishlist />);
      
      expect(screen.getByText('Added: 01/01/2024')).toBeInTheDocument();
      expect(screen.getByText('Added: 02/01/2024')).toBeInTheDocument();
    });

    it('should render remove buttons', () => {
      render(<Wishlist />);
      
      const removeButtons = screen.getAllByText('Remove');
      expect(removeButtons).toHaveLength(2);
    });

    it('should handle remove movie', () => {
      render(<Wishlist />);
      
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);

      expect(mockWishlistStore.removeMovie).toHaveBeenCalledWith(1);
    });

    it('should handle clear wishlist', () => {
      // Mock confirm to return true
      window.confirm = vi.fn().mockReturnValue(true);
      
      render(<Wishlist />);
      
      const clearButton = screen.getByText('Clear All');
      fireEvent.click(clearButton);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to clear your wishlist?');
      expect(mockWishlistStore.clearWishlist).toHaveBeenCalled();
    });

    it('should not clear when confirm is cancelled', () => {
      // Mock confirm to return false
      window.confirm = vi.fn().mockReturnValue(false);
      
      render(<Wishlist />);
      
      const clearButton = screen.getByText('Clear All');
      fireEvent.click(clearButton);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to clear your wishlist?');
      expect(mockWishlistStore.clearWishlist).not.toHaveBeenCalled();
    });

    it('should render movie links', () => {
      render(<Wishlist />);
      
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/film/1');
      expect(links[1]).toHaveAttribute('href', '/film/2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle movies without posters', () => {
      const moviesWithoutPosters: WishlistMovie[] = [
        {
          id: 1,
          title: 'No Poster Movie',
          poster: '',
          category: 'trending',
          addedAt: '2024-01-01T00:00:00Z'
        }
      ];

      mockWishlistStore.movies = moviesWithoutPosters;
      mockWishlistStore.getWishlistCount.mockReturnValue(1);

      render(<Wishlist />);
      
      expect(screen.getByText('No Poster Movie')).toBeInTheDocument();
      const placeholder = screen.getByText('No Poster Movie').closest('.wishlist-item')?.querySelector('.wishlist-item-placeholder');
      expect(placeholder).toBeInTheDocument();
    });

    it('should handle different category types', () => {
      const moviesWithDifferentCategories: WishlistMovie[] = [
        {
          id: 1,
          title: 'Trending Movie',
          poster: '/poster1.jpg',
          category: 'trending',
          addedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          title: 'Now Playing Movie',
          poster: '/poster2.jpg',
          category: 'nowPlaying',
          addedAt: '2024-01-02T00:00:00Z'
        }
      ];

      mockWishlistStore.movies = moviesWithDifferentCategories;
      mockWishlistStore.getWishlistCount.mockReturnValue(2);

      render(<Wishlist />);
      
      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Now Playing')).toBeInTheDocument();
    });
  });
});
