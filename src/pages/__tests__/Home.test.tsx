// src/pages/__tests__/Home.test.tsx
// Tests for Home component

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test/utils';
import { HomeComponent } from '../Home';
import { mockTMDBMovies } from '../../test/utils';

// Mock the TMDB service
vi.mock('../../services/tmdb', () => ({
  tmdbService: {
    getImageUrl: vi.fn().mockImplementation((path: string | null) => 
      path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.jpg'
    )
  }
}));

describe('Home Component', () => {
  const mockData = {
    trending: mockTMDBMovies.slice(0, 2).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
      category: 'trending' as const
    })),
    topRated: mockTMDBMovies.slice(0, 2).map(movie => ({
      id: movie.id + 10,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
      category: 'topRated' as const
    })),
    nowPlaying: mockTMDBMovies.slice(0, 2).map(movie => ({
      id: movie.id + 20,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
      category: 'nowPlaying' as const
    }))
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main heading', () => {
    render(<HomeComponent data={mockData} />);
    expect(screen.getByText('Browse Films')).toBeInTheDocument();
  });

  it('should render all movie sections', () => {
    render(<HomeComponent data={mockData} />);
    
    expect(screen.getByText('Trending')).toBeInTheDocument();
    expect(screen.getByText('Top Rated')).toBeInTheDocument();
    expect(screen.getByText('Now Playing')).toBeInTheDocument();
  });

  it('should render movie cards with correct titles', () => {
    render(<HomeComponent data={mockData} />);
    
    // Check that we have multiple instances of each movie title across sections
    const movie1Elements = screen.getAllByText('Test Movie 1');
    const movie2Elements = screen.getAllByText('Test Movie 2');
    
    expect(movie1Elements).toHaveLength(3); // One in each section
    expect(movie2Elements).toHaveLength(3); // One in each section
  });

  it('should render movie cards with correct links', () => {
    render(<HomeComponent data={mockData} />);
    
    // Check that we have links for all expected movies
    const allLinks = screen.getAllByRole('link');
    const hrefs = allLinks.map(link => link.getAttribute('href'));
    
    expect(hrefs).toContain('/film/1');
    expect(hrefs).toContain('/film/2');
    expect(hrefs).toContain('/film/11');
    expect(hrefs).toContain('/film/12');
    expect(hrefs).toContain('/film/21');
    expect(hrefs).toContain('/film/22');
  });

  it('should render movie posters when available', () => {
    render(<HomeComponent data={mockData} />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(6); // 2 movies × 3 sections
  });

  it('should render placeholder when no poster available', () => {
    const dataWithoutPosters = {
      ...mockData,
      trending: [{
        id: 1,
        title: 'No Poster Movie',
        poster: '',
        category: 'trending' as const
      }]
    };

    render(<HomeComponent data={dataWithoutPosters} />);
    
    const placeholder = screen.getByText('No Poster Movie').closest('.card')?.querySelector('.placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('should handle empty data gracefully', () => {
    const emptyData = {
      trending: [],
      topRated: [],
      nowPlaying: []
    };

    render(<HomeComponent data={emptyData} />);
    
    expect(screen.getByText('Browse Films')).toBeInTheDocument();
    expect(screen.getByText('Trending')).toBeInTheDocument();
    expect(screen.getByText('Top Rated')).toBeInTheDocument();
    expect(screen.getByText('Now Playing')).toBeInTheDocument();
  });

  it('should render carousel containers', () => {
    render(<HomeComponent data={mockData} />);
    
    const carousels = document.querySelectorAll('.carousel-container');
    expect(carousels).toHaveLength(3); // One for each section
  });
});
