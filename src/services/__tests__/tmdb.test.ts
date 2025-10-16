// src/services/__tests__/tmdb.test.ts
// Tests for TMDB service

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tmdbService } from '../tmdb';
import { mockTMDBMovies, mockTMDBMovie, mockFetchResponses } from '../../test/utils';

// Mock fetch
global.fetch = vi.fn();

describe('TMDB Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTrendingMovies', () => {
    it('should fetch trending movies successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchResponses.trending,
      });

      const result = await tmdbService.getTrendingMovies();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/trending/movie/week')
      );
      expect(result).toEqual(mockTMDBMovies);
    });

    it('should return fallback data when API fails', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('API Error'));

      const result = await tmdbService.getTrendingMovies();

      expect(result).toHaveLength(2);
      expect(result[0].title).toContain('trending');
    });
  });

  describe('getTopRatedMovies', () => {
    it('should fetch top rated movies successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchResponses.topRated,
      });

      const result = await tmdbService.getTopRatedMovies();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/top_rated')
      );
      expect(result).toEqual(mockTMDBMovies);
    });
  });

  describe('getNowPlayingMovies', () => {
    it('should fetch now playing movies successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchResponses.nowPlaying,
      });

      const result = await tmdbService.getNowPlayingMovies();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/now_playing')
      );
      expect(result).toEqual(mockTMDBMovies);
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details successfully', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFetchResponses.movieDetails,
      });

      const result = await tmdbService.getMovieDetails(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/1')
      );
      expect(result).toEqual(mockTMDBMovie);
    });

    it('should return fallback data when API fails', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('API Error'));

      const result = await tmdbService.getMovieDetails(999);

      expect(result.id).toBe(999);
      expect(result.title).toBe('Movie #999');
    });
  });

  describe('getImageUrl', () => {
    it('should return correct image URL', () => {
      const result = tmdbService.getImageUrl('/test-poster.jpg', 'w500');
      expect(result).toBe('https://image.tmdb.org/t/p/w500/test-poster.jpg');
    });

    it('should return placeholder for null path', () => {
      const result = tmdbService.getImageUrl(null);
      expect(result).toBe('/placeholder-movie.svg');
    });
  });
});
