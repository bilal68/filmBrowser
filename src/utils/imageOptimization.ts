// Image optimization utilities
export const imageOptimization = {
  // Check if browser supports WebP
  supportsWebP: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  },

  // Get optimized image URL with WebP support
  getOptimizedUrl: (baseUrl: string, size: string, format?: 'webp' | 'jpg'): string => {
    if (!baseUrl.includes('image.tmdb.org')) {
      return baseUrl;
    }

    // TMDB doesn't support WebP, but we can optimize size
    const sizeMap: Record<string, string> = {
      'thumbnail': 'w200',
      'small': 'w300', 
      'medium': 'w500',
      'large': 'w780',
      'original': 'original'
    };

    const tmdbSize = sizeMap[size] || 'w300';
    return baseUrl.replace(/\/w\d+/, `/${tmdbSize}`);
  },

  // Generate responsive srcSet for different screen sizes
  generateSrcSet: (baseUrl: string): string => {
    if (!baseUrl.includes('image.tmdb.org')) {
      return baseUrl;
    }

    const sizes = [
      { size: 'w200', width: '200' },
      { size: 'w300', width: '300' },
      { size: 'w500', width: '500' },
      { size: 'w780', width: '780' },
      { size: 'original', width: '1920' }
    ];

    return sizes.map(({ size, width }) => {
      const url = baseUrl.replace(/\/w\d+/, `/${size}`);
      return `${url} ${width}w`;
    }).join(', ');
  },

  // Get responsive sizes attribute
  getResponsiveSizes: (context: 'card' | 'hero' | 'thumbnail'): string => {
    const sizeMap = {
      card: '(max-width: 768px) 200px, (max-width: 1024px) 300px, 500px',
      hero: '(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px',
      thumbnail: '(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px'
    };

    return sizeMap[context] || sizeMap.card;
  },

  // Preload critical images
  preloadImage: (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  },

  // Batch preload images
  preloadImages: async (urls: string[]): Promise<void> => {
    const promises = urls.map(url => imageOptimization.preloadImage(url));
    await Promise.allSettled(promises);
  },

  // Get image dimensions from URL (for TMDB images)
  getImageDimensions: (url: string): { width: number; height: number } => {
    if (!url.includes('image.tmdb.org')) {
      return { width: 300, height: 450 }; // Default aspect ratio
    }

    const sizeMatch = url.match(/\/w(\d+)/);
    if (sizeMatch) {
      const width = parseInt(sizeMatch[1]);
      return { width, height: Math.round(width * 1.5) }; // 2:3 aspect ratio
    }

    return { width: 300, height: 450 };
  },

  // Calculate optimal image size based on container
  getOptimalSize: (containerWidth: number, devicePixelRatio: number = 1): string => {
    const effectiveWidth = containerWidth * devicePixelRatio;
    
    if (effectiveWidth <= 200) return 'w200';
    if (effectiveWidth <= 300) return 'w300';
    if (effectiveWidth <= 500) return 'w500';
    if (effectiveWidth <= 780) return 'w780';
    return 'original';
  }
};
