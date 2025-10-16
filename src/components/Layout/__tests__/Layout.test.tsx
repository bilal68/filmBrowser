// src/components/Layout/__tests__/Layout.test.tsx
// Tests for Layout component

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../test/utils';
import Layout from '../Layout';

// Mock the wishlist store
const mockWishlistStore = {
  getWishlistCount: vi.fn().mockReturnValue(0)
};

vi.mock('../../../stores/wishlistStore', () => ({
  useWishlist: () => mockWishlistStore
}));

describe('Layout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header with site title', () => {
    render(<Layout />);
    
    expect(screen.getByText('Film Browser')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Layout />);
    
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Wish List/i })).toBeInTheDocument();
  });

  it('should render correct navigation URLs', () => {
    render(<Layout />);
    
    const homeLink = screen.getByRole('link', { name: /Home/i });
    const wishlistLink = screen.getByRole('link', { name: /Wish List/i });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(wishlistLink).toHaveAttribute('href', '/wishlist');
  });

  it('should display wishlist count', () => {
    mockWishlistStore.getWishlistCount.mockReturnValue(5);
    
    render(<Layout />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display zero wishlist count', () => {
    mockWishlistStore.getWishlistCount.mockReturnValue(0);
    
    render(<Layout />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render footer with current year', () => {
    render(<Layout />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear}`)).toBeInTheDocument();
  });

  it('should render main container', () => {
    render(<Layout />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should render header container', () => {
    render(<Layout />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should render footer container', () => {
    render(<Layout />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});
