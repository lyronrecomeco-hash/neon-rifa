import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
    if (isLightboxOpen) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval, isLightboxOpen]);

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextSlide, prevSlide]);

  return (
    <>
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
              className="relative w-full flex-shrink-0 aspect-[16/9] md:aspect-[21/9] cursor-pointer group"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={image}
                alt={`Prêmio ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              
              {/* Zoom indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="p-3 rounded-full glass shadow-glow">
                  <ZoomIn className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass hover:bg-primary/20 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
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
              onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
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

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-none bg-transparent shadow-none [&>button]:hidden">
          <div className="relative flex flex-col items-center justify-center">
            {/* Image counter */}
            <div className="absolute top-2 left-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium z-50">
              {currentIndex + 1} / {displayImages.length}
            </div>

            {/* Main image */}
            <img
              src={displayImages[currentIndex]}
              alt={`Prêmio ${currentIndex + 1}`}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            />

            {/* Navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-colors z-50"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/20 transition-colors z-50"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-4 p-2 rounded-xl bg-background/80 backdrop-blur-sm">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                  className={cn(
                    'w-14 h-10 rounded-lg overflow-hidden transition-all duration-300',
                    currentIndex === index
                      ? 'ring-2 ring-primary shadow-glow scale-110'
                      : 'opacity-50 hover:opacity-100'
                  )}
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
