import { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { NumberCard } from './NumberCard';
import { RaffleNumber } from '@/types/raffle';
import { cn } from '@/lib/utils';

interface NumberGridProps {
  totalNumbers: number;
  getNumberStatus: (num: number) => RaffleNumber['status'];
  onToggleNumber: (num: number) => void;
  numbersPerPage?: number;
}

export function NumberGrid({
  totalNumbers,
  getNumberStatus,
  onToggleNumber,
  numbersPerPage = 100,
}: NumberGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalNumbers / numbersPerPage);
  
  const visibleNumbers = useMemo(() => {
    const start = (currentPage - 1) * numbersPerPage + 1;
    const end = Math.min(currentPage * numbersPerPage, totalNumbers);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, numbersPerPage, totalNumbers]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2 animate-fade-in">
        {visibleNumbers.map((num) => (
          <NumberCard
            key={num}
            number={num}
            status={getNumberStatus(num)}
            onClick={() => onToggleNumber(num)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 flex-wrap">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg glass hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Primeira página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg glass hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 mx-2">
            {pageNumbers.map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={cn(
                    'min-w-[40px] h-10 rounded-lg font-medium transition-all',
                    currentPage === page
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'glass hover:bg-primary/20'
                  )}
                >
                  {page}
                </button>
              ) : (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  {page}
                </span>
              )
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg glass hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Próxima página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg glass hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page info */}
      <p className="text-center text-sm text-muted-foreground">
        Mostrando {visibleNumbers[0]} - {visibleNumbers[visibleNumbers.length - 1]} de {totalNumbers} números
      </p>
    </div>
  );
}
