import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/lib/api/AuthContext";
import { ToastProvider } from "@/components/Toast";
import { JsStack } from "@/components/navigation/JsStack";
import { KouScreenTransition } from "@/components/navigation/KouScreenTransition";
import { kouScreenOptions } from "@/lib/navigation/kouTransition";

/**
 * Root layout — sayfa geçişleri kou-e-tip-mobil AppShell ile aynı
 * (spring 300/30, ±60px, fade, wait).
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ToastProvider>
            <StatusBar style="dark" />
            <JsStack
              screenOptions={kouScreenOptions}
              screenLayout={({ children, route }) => (
                <KouScreenTransition routeName={route.name}>
                  {children}
                </KouScreenTransition>
              )}
            />
          </ToastProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
