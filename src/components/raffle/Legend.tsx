export function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-xl glass">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-primary/30 border border-primary/50" />
        <span className="text-sm text-muted-foreground">Disponível</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-muted/30 border border-border/30" />
        <span className="text-sm text-muted-foreground">Já comprado</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-raffle-selected/30 border border-raffle-selected shadow-neon" />
        <span className="text-sm text-muted-foreground">Selecionado</span>
      </div>
    </div>
  );
}
