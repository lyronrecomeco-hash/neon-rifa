export function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-xl glass">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-secondary/40 border-2 border-primary/30 flex items-center justify-center text-xs font-bold">
          01
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">Disponível</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-muted/20 border-2 border-border/20 flex items-center justify-center text-xs font-bold text-muted-foreground/40">
          02
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">Vendido</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-primary/30 border-2 border-raffle-selected shadow-neon flex items-center justify-center text-xs font-bold">
          03
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground">Selecionado</span>
      </div>
    </div>
  );
}
