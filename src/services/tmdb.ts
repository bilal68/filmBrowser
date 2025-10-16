// TMDB API service layer

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface TMDBConfig {
  apiKey: string;
  baseUrl: string;
  imageBaseUrl: string;
}

class TMDBService {
  private config: TMDBConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_TMDB_API_KEY || '',
      baseUrl: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
      imageBaseUrl: import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'
    };
  }

  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}?api_key=${this.config.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTrendingMovies(): Promise<TMDBMovie[]> {
    try {
      const response = await this.fetchFromAPI<TMDBResponse<TMDBMovie>>('/trending/movie/week');
      return response.results;
    } catch (error) {
      return this.getFallbackMovies('trending');
    }
  }

  async getTopRatedMovies(): Promise<TMDBMovie[]> {
    try {
      const response = await this.fetchFromAPI<TMDBResponse<TMDBMovie>>('/movie/top_rated');
      return response.results;
    } catch (error) {
      return this.getFallbackMovies('topRated');
    }
  }

  async getNowPlayingMovies(): Promise<TMDBMovie[]> {
    try {
      const response = await this.fetchFromAPI<TMDBResponse<TMDBMovie>>('/movie/now_playing');
      return response.results;
    } catch (error) {
      return this.getFallbackMovies('nowPlaying');
    }
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovie> {
    try {
      return await this.fetchFromAPI<TMDBMovie>(`/movie/${movieId}`);
    } catch (error) {
      return this.getFallbackMovie(movieId);
    }
  }

  getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'): string {
    if (!path) {
      return '/placeholder-movie.svg';
    }
    return `${this.config.imageBaseUrl}/${size}${path}`;
  }

  private getFallbackMovies(category: 'trending' | 'topRated' | 'nowPlaying'): TMDBMovie[] {
    const baseMovies = [
      {
        id: 1,
        title: `${category} Movie 1`,
        overview: 'A great movie description',
        poster_path: null,
        backdrop_path: null,
        release_date: '2024-01-01',
        vote_average: 8.5,
        vote_count: 1000,
        genre_ids: [28, 12],
        adult: false,
        original_language: 'en',
        original_title: `${category} Movie 1`,
        popularity: 100,
        video: false
      },
      {
        id: 2,
        title: `${category} Movie 2`,
        overview: 'Another great movie description',
        poster_path: null,
        backdrop_path: null,
        release_date: '2024-02-01',
        vote_average: 7.8,
        vote_count: 800,
        genre_ids: [35, 18],
        adult: false,
        original_language: 'en',
        original_title: `${category} Movie 2`,
        popularity: 90,
        video: false
      }
    ];

    return baseMovies.map(movie => ({
      ...movie,
      id: movie.id + (category === 'trending' ? 0 : category === 'topRated' ? 10 : 20)
    }));
  }

  private getFallbackMovie(id: number): TMDBMovie {
    return {
      id,
      title: `Movie #${id}`,
      overview: 'Movie description unavailable.',
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
  }
}

export const tmdbService = new TMDBService();
