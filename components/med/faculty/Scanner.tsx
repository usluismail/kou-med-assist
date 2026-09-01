import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, TextInput, View } from "react-native";
import { ScanLine } from "lucide-react-native";
import { SwipeToApprove } from "../SwipeToApprove";
import { useAuth } from "@/lib/api/AuthContext";
import { approveLog, validateQrPayload } from "@/lib/api";
import type { PendingApproval } from "@/lib/api/types";
import { colors } from "@/lib/theme";
import { styles } from "./styles";

export function Scanner({ onApproved }: { onApproved?: () => void }) {
  const { token } = useAuth();
  const [payload, setPayload] = useState("");
  const [scanned, setScanned] = useState<PendingApproval | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanAnim]);

  const scanTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 180],
  });

  const validate = async () => {
    if (!token || !payload.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await validateQrPayload(token, payload.trim());
      if ("status" in res && res.status === "invalid") {
        setError(res.message || "QR geçersiz");
        setScanned(null);
      } else {
        setScanned(res as PendingApproval);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "QR doğrulanamadı");
      setScanned(null);
    } finally {
      setBusy(false);
    }
  };

  const approveScanned = async () => {
    if (!token || !scanned) return;
    setBusy(true);
    try {
      await approveLog(token, scanned.id);
      setScanned(null);
      setPayload("");
      onApproved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Onay başarısız");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.scannerPad}>
      <View style={styles.scannerFrame}>
        <View style={styles.scannerGlow} />
        <View style={styles.scannerTarget}>
          <View style={styles.scannerBorder} />
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY: scanTranslate }] }]}
          />
        </View>
        <Text style={styles.scanHint}>
          Öğrencinin QR kodunu çerçeveye hizalayın
        </Text>
        <TextInput
          value={payload}
          onChangeText={setPayload}
          placeholder="QR payload yapıştır (Sprint B — kamera sonra)"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          style={{
            marginTop: 12,
            width: "100%",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: colors.foreground,
            backgroundColor: colors.card,
          }}
        />
        <Pressable
          onPress={validate}
          disabled={busy || !payload.trim()}
          style={[styles.scanBtn, (busy || !payload.trim()) && { opacity: 0.5 }]}
        >
          <ScanLine size={16} color={colors.kouForeground} />
          <Text style={styles.scanBtnText}>
            {busy ? "Doğrulanıyor…" : "Payload doğrula"}
          </Text>
        </Pressable>
      </View>
      {error ? (
        <Text style={{ color: "#DC2626", fontWeight: "600", marginTop: 12 }}>
          {error}
        </Text>
      ) : null}
      {scanned && (
        <View style={styles.scanResult}>
          <Text style={styles.scanResultKicker}>QR Doğrulandı</Text>
          <Text style={styles.cardTitle}>{scanned.studentName}</Text>
          <Text style={styles.cardSub}>
            {scanned.procedureName} · {scanned.encounterId}
          </Text>
          <View style={{ marginTop: 12 }}>
            <SwipeToApprove approved={false} onApprove={approveScanned} />
          </View>
        </View>
      )}
    </View>
  );
}
