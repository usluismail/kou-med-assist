import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type ToastTone = "info" | "success" | "error";

type ToastState = {
  message: string;
  tone: ToastTone;
} | null;

type ToastApi = {
  show: (message: string, tone?: ToastTone) => void;
  hide: () => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);

  const hide = useCallback(() => setToast(null), []);

  const show = useCallback((message: string, tone: ToastTone = "info") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const api = useMemo(() => ({ show, hide }), [show, hide]);

  const bg =
    toast?.tone === "success"
      ? colors.success
      : toast?.tone === "error"
        ? colors.danger
        : colors.clinical;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? (
        <View style={styles.wrap} pointerEvents="box-none">
          <Pressable
            onPress={hide}
            style={[styles.banner, { backgroundColor: bg }]}
          >
            <Text style={styles.text}>{toast.message}</Text>
          </Pressable>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      show: () => undefined,
      hide: () => undefined,
    };
  }
  return ctx;
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 28,
    zIndex: 100,
  },
  banner: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
