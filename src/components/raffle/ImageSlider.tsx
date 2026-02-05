import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import prize1 from '@/assets/prize-1.jpg';
import prize2 from '@/assets/prize-2.jpg';
import prize3 from '@/assets/prize-3.jpg';

interface ImageSliderProps {
  images?: string[];
  autoPlayInterval?: number;
  className?: string;
}

export function ImageSlider({ images, autoPlayInterval = 4000, className }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const defaultImages = [prize1, prize2, prize3];

  const displayImages = images && images.length > 0 ? images : defaultImages;

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % displayImages.length);
  }, [currentIndex, displayImages.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + displayImages.length) % displayImages.length);
  }, [currentIndex, displayImages.length, goToSlide]);

  useEffect(() => {
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval]);

  return (
    <div className={cn('relative w-full overflow-hidden rounded-2xl', className)}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background/80 z-10 pointer-events-none" />
      
      {/* Images container */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayImages.map((image, index) => (
          <div
            key={index}
            className="relative w-full flex-shrink-0 aspect-[16/9] md:aspect-[21/9]"
          >
            <img
              src={image}
              alt={`Prêmio ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-primary/20 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-primary/20 transition-colors"
        aria-label="Próximo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {displayImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              currentIndex === index
                ? 'w-8 bg-primary shadow-glow'
                : 'bg-foreground/30 hover:bg-foreground/50'
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Decorative glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-primary/30 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
}
