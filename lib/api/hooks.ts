/**
 * lib/api/hooks.ts — Geriye dönük uyumluluk barrel.
 *
 * Bu dosya artık implementasyon içermiyor.
 * Tüm hook'lar `./hooks/` klasöründe domain'e göre ayrılmış durumda.
 *
 * Mevcut `@/lib/api/hooks` import'ları bu wrapper üzerinden çalışmaya devam eder.
 * Yeni kodlar doğrudan `@/lib/api/hooks/<domain>` import edebilir.
 */
export * from "./hooks/index";
