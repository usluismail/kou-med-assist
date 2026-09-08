/**
 * Stack kart animasyonu kapalı (`animation: "none"`).
 * Geçiş KouScreenTransition (Reanimated = AppShell) ile yapılır.
 */
export const kouScreenOptions = {
  headerShown: false,
  animation: "none" as const,
  gestureEnabled: true,
  gestureDirection: "horizontal" as const,
  detachInactiveScreens: false,
  // Şeffaf kart: WAIT sırasında alttaki çıkış animasyonu görünsün
  cardStyle: { backgroundColor: "transparent" },
  cardOverlayEnabled: false,
};
