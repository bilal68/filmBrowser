import { useState, useRef, useEffect } from 'react';
import { imageOptimization } from '@/utils/imageOptimization';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  style?: React.CSSProperties;
  sizes?: string;
  srcSet?: string;
  quality?: 'low' | 'medium' | 'high' | 'original';
}

export default function LazyImage({ 
  src, 
  alt, 
  className, 
  placeholder = '/placeholder-movie.svg',
  onError,
  style,
  sizes,
  srcSet,
  quality = 'medium'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image URLs based on quality
  const getImageUrl = (baseSrc: string, size: string) => {
    return imageOptimization.getOptimizedUrl(baseSrc, size);
  };

  const getSrcSet = (baseSrc: string) => {
    return imageOptimization.generateSrcSet(baseSrc);
  };

  const getSizes = () => {
    if (sizes) return sizes;
    
    // Default responsive sizes based on quality
    switch (quality) {
      case 'low':
        return imageOptimization.getResponsiveSizes('thumbnail');
      case 'high':
        return imageOptimization.getResponsiveSizes('hero');
      default:
        return imageOptimization.getResponsiveSizes('card');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    onError?.(e);
  };

  const finalSrc = isInView ? getImageUrl(src, quality === 'low' ? 'thumbnail' : quality === 'high' ? 'large' : 'medium') : '';
  const finalSrcSet = isInView ? getSrcSet(src) : undefined;

  return (
    <div ref={imgRef} className={className} style={style}>
      {isInView && !hasError && (
        <img
          src={finalSrc}
          srcSet={finalSrcSet}
          sizes={getSizes()}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}
      {(!isLoaded || hasError) && (
        <div className="lazy-placeholder">
          <div className="placeholder-icon">🎬</div>
          <div className="placeholder-text">
            {hasError ? 'Image Error' : 'Loading...'}
          </div>
        </div>
      )}
    </div>
  );
}
