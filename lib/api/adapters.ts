/**
 * Backend JSON ↔ UI modeli.
 * Hoca farklı alan adları verince map burada yapılır; ekranlar değişmez.
 * Şimdilik identity (mock sözleşme = UI sözleşmesi).
 */
export function adaptIdentity<T>(data: T): T {
  return data;
}
