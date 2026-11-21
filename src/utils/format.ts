/**
 * Preço fictício do filme, derivado da nota (mesma ideia do projeto original),
 * com piso de R$ 9,90 para filmes sem nota.
 */
export function moviePrice(voteAverage: number): number {
  const price = Math.round(voteAverage * 12 * 100) / 100;
  return Math.max(price, 9.9);
}

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function formatYear(date: string): string {
  return date ? date.slice(0, 4) : "—";
}

export function formatDate(date: string): string {
  if (!date) return "Sem data";
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m.toString().padStart(2, "0")}min` : `${m}min`;
}

export function formatRating(vote: number): string {
  return vote.toFixed(1).replace(".", ",");
}
