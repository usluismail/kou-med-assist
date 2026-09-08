# Sayfa geçişleri (kou-e-tip-mobil → kou-med-assist)

## Kaynak (`app-shell.tsx`)

```ts
initial={{ opacity: 0, x: isHome ? -60 : 60 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: isHome ? 60 : -60 }}
transition={{ type: 'spring', stiffness: 300, damping: 30 }}
// AnimatePresence mode="wait"
```

## Bu uygulamada

`KouScreenTransition` — Reanimated ile aynı değerler:

- **focus (giriş):** `x: ±60 → 0`, opacity fade, spring 300/30, `WAIT_MS` gecikme (wait)
- **blur / beforeRemove (çıkış):** `x → ±60`, fade out
- Home: giriş soldan (−60), çıkış sağa (+60)
- Alt sayfa: giriş sağdan (+60), çıkış sola (−60)

Stack: `animation: "none"` — kart animasyonu yok; AppShell geçişi RN Animated ile (Expo Go uyumlu).
