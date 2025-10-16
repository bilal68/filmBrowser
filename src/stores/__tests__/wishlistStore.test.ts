// src/stores/__tests__/wishlistStore.test.ts
// Tests for wishlist store

import { describe, it, expect, beforeEach } from 'vitest';
import { useWishlistStore, WishlistMovie } from '../wishlistStore';

describe('Wishlist Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useWishlistStore.setState({ movies: [] });
  });

  describe('addMovie', () => {
    it('should add a movie to wishlist', () => {
      const movie: Omit<WishlistMovie, 'addedAt'> = {
        id: 1,
        title: 'Test Movie',
        poster: '/test-poster.jpg',
        category: 'trending'
      };

      useWishlistStore.getState().addMovie(movie);

      const state = useWishlistStore.getState();
      expect(state.movies).toHaveLength(1);
      expect(state.movies[0].id).toBe(1);
      expect(state.movies[0].title).toBe('Test Movie');
      expect(state.movies[0].addedAt).toBeDefined();
    });

    it('should not add duplicate movies', () => {
      const movie: Omit<WishlistMovie, 'addedAt'> = {
        id: 1,
        title: 'Test Movie',
        poster: '/test-poster.jpg',
        category: 'trending'
      };

      const { addMovie } = useWishlistStore.getState();
      addMovie(movie);
      addMovie(movie); // Try to add same movie again

      const state = useWishlistStore.getState();
      expect(state.movies).toHaveLength(1);
    });
  });

  describe('removeMovie', () => {
    it('should remove a movie from wishlist', () => {
      const movie: Omit<WishlistMovie, 'addedAt'> = {
        id: 1,
        title: 'Test Movie',
        poster: '/test-poster.jpg',
        category: 'trending'
      };

      const { addMovie, removeMovie } = useWishlistStore.getState();
      addMovie(movie);
      removeMovie(1);

      const state = useWishlistStore.getState();
      expect(state.movies).toHaveLength(0);
    });

    it('should handle removing non-existent movie', () => {
      const { removeMovie } = useWishlistStore.getState();
      removeMovie(999); // Try to remove non-existent movie

      const state = useWishlistStore.getState();
      expect(state.movies).toHaveLength(0);
    });
  });

  describe('isInWishlist', () => {
    it('should return true for movie in wishlist', () => {
      const movie: Omit<WishlistMovie, 'addedAt'> = {
        id: 1,
        title: 'Test Movie',
        poster: '/test-poster.jpg',
        category: 'trending'
      };

      const { addMovie, isInWishlist } = useWishlistStore.getState();
      addMovie(movie);

      expect(isInWishlist(1)).toBe(true);
    });

    it('should return false for movie not in wishlist', () => {
      const { isInWishlist } = useWishlistStore.getState();
      expect(isInWishlist(999)).toBe(false);
    });
  });

  describe('clearWishlist', () => {
    it('should clear all movies from wishlist', () => {
      const movies: Omit<WishlistMovie, 'addedAt'>[] = [
        { id: 1, title: 'Movie 1', poster: '/poster1.jpg', category: 'trending' },
        { id: 2, title: 'Movie 2', poster: '/poster2.jpg', category: 'topRated' }
      ];

      const { addMovie, clearWishlist } = useWishlistStore.getState();
      movies.forEach(movie => addMovie(movie));
      clearWishlist();

      const state = useWishlistStore.getState();
      expect(state.movies).toHaveLength(0);
    });
  });

  describe('getWishlistCount', () => {
    it('should return correct count of movies', () => {
      const movies: Omit<WishlistMovie, 'addedAt'>[] = [
        { id: 1, title: 'Movie 1', poster: '/poster1.jpg', category: 'trending' },
        { id: 2, title: 'Movie 2', poster: '/poster2.jpg', category: 'topRated' },
        { id: 3, title: 'Movie 3', poster: '/poster3.jpg', category: 'nowPlaying' }
      ];

      const { addMovie, getWishlistCount } = useWishlistStore.getState();
      movies.forEach(movie => addMovie(movie));

      expect(getWishlistCount()).toBe(3);
    });

    it('should return 0 for empty wishlist', () => {
      const { getWishlistCount } = useWishlistStore.getState();
      expect(getWishlistCount()).toBe(0);
    });
  });
});
