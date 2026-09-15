import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import {
  Bell,
  CheckCircle2,
  Clock,
  DoorOpen,
  Megaphone,
  Send,
  XCircle,
} from "lucide-react-native";
import { LoadingBlock } from "../StateViews";
import { useFacultyAnnouncements, useSendAnnouncement } from "@/lib/api/hooks";
import { hapticSuccess } from "@/lib/haptics";
import { useToast } from "@/components/Toast";
import { colors } from "@/lib/theme";
import { styles } from "./styles";
import type { CreateAnnouncementInput } from "@/lib/api/types";

const AUDIENCE_OPTIONS = [
  { key: "all",     label: "Tüm Öğrenciler" },
  { key: "period_1", label: "Dönem 1" },
  { key: "period_2", label: "Dönem 2" },
  { key: "period_3", label: "Dönem 3" },
  { key: "period_4", label: "Dönem 4" },
  { key: "period_5", label: "Dönem 5" },
  { key: "period_6", label: "Dönem 6" },
];

const ACTION_TYPES: { key: string; label: string; icon: typeof Bell; color: string }[] = [
  { key: "cancelled",    label: "İptal",        icon: XCircle,   color: "#EF4444" },
  { key: "time_changed", label: "Saat Değişti",  icon: Clock,     color: colors.warning },
  { key: "room_changed", label: "Yer Değişti",   icon: DoorOpen,  color: "#3B82F6" },
  { key: "general",      label: "Genel",         icon: Megaphone, color: colors.primary },
];

/** Duyuru tipi rengini ACTION_TYPES'tan türet — duplicate map ortadan kalktı (OCP) */
function colorFor(key: string): string {
  return ACTION_TYPES.find((t) => t.key === key)?.color ?? colors.primary;
}

export function AnnouncementConsole() {
  const [audience, setAudience]     = useState<string[]>(["all"]);
  const [actionType, setActionType] = useState<string>("general");
  const [title, setTitle]           = useState("");
  const [body, setBody]             = useState("");
  const [sentInfo, setSentInfo]     = useState<{ count: number; title: string } | null>(null);
  const toast = useToast();

  /**
   * DIP — Geçmiş duyurular doğrudan apiRequest ile değil, hook üzerinden çekiliyor.
   * sentInfo değişince hook otomatik reload tetikler.
   */
  const history = useFacultyAnnouncements(sentInfo);

  /**
   * DIP — Gönderim işlemi doğrudan apiRequest ile değil, hook üzerinden yapılıyor.
   */
  const sender = useSendAnnouncement();

  const toggleAudience = (key: string) => {
    if (key === "all") { setAudience(["all"]); return; }
    setAudience((prev) => {
      const next = prev.filter((k) => k !== "all");
      return next.includes(key) ? next.filter((k) => k !== key) : [...next, key];
    });
  };

  const canSend = title.trim().length > 3 && body.trim().length > 5 && audience.length > 0;

  const handleSend = async () => {
    if (!canSend) return;
    const input: CreateAnnouncementInput = {
      targetAudience: audience.map((key) =>
        key === "all"
          ? { type: "all_interns" as const }
          : { type: "period_committee" as const, period: Number(key.replace("period_", "")) },
      ),
      actionType: actionType as CreateAnnouncementInput["actionType"],
      title: title.trim(),
      body: body.trim(),
    };
    try {
      const res = await sender.submit(input);
      setSentInfo({ count: (res as any).reachedCount ?? 0, title: res.title });
      setTitle(""); setBody("");
      hapticSuccess();
    } catch (e) {
      toast.show(sender.error ?? "Gönderilemedi", "error");
    }
  };

  const handleReset = () => setSentInfo(null);

  return (
    <View style={styles.annConsole}>
      {/* Gönderildi Ekranı */}
      {sentInfo ? (
        <View style={styles.annSection}>
          <View style={styles.sentBanner}>
            <CheckCircle2 size={28} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sentBannerText}>Duyuru Gönderildi!</Text>
              <Text style={styles.sentBannerSub}>"{sentInfo.title}" — {sentInfo.count} kişiye ulaştı</Text>
            </View>
          </View>
          <Pressable onPress={handleReset} style={[styles.sentReset, { marginTop: 12, alignSelf: "center" }]}>
            <Text style={styles.sentResetText}>+ Yeni Duyuru</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {/* Hedef Kitle */}
          <View style={styles.annSection}>
            <Text style={styles.annSectionTitle}>Hedef Kitle</Text>
            <View style={styles.audienceRow}>
              {AUDIENCE_OPTIONS.map(({ key, label }) => {
                const active = audience.includes(key);
                return (
                  <Pressable
                    key={key}
                    onPress={() => toggleAudience(key)}
                    style={[styles.audienceChip, active && styles.audienceChipActive]}
                  >
                    <Text style={[styles.audienceChipText, active && styles.audienceChipTextActive]}>
                      {active ? "✓ " : ""}{label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Duyuru Türü */}
          <View style={styles.annSection}>
            <Text style={styles.annSectionTitle}>Duyuru Türü</Text>
            <View style={styles.actionTypeRow}>
              {ACTION_TYPES.map(({ key, label, icon: Icon, color }) => {
                const active = actionType === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setActionType(key)}
                    style={[styles.actionTypeCard, active && styles.actionTypeCardActive]}
                  >
                    <Icon size={20} color={active ? color : colors.mutedForeground} />
                    <Text style={[styles.actionTypeLabel, active && { ...styles.actionTypeLabelActive, color }]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Mesaj Formu */}
          <View style={styles.annSection}>
            <Text style={styles.annSectionTitle}>Mesaj</Text>
            <TextInput
              style={styles.annInput}
              placeholder="Duyuru başlığı (örn: Anatomi Dersi İptal)"
              placeholderTextColor={colors.mutedForeground}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <TextInput
              style={[styles.annInput, styles.annTextarea]}
              placeholder="Açıklama... (neden, alternatif bilgi, vs.)"
              placeholderTextColor={colors.mutedForeground}
              value={body}
              onChangeText={setBody}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={handleSend}
              disabled={!canSend || sender.loading}
              style={[styles.annSendBtn, (!canSend || sender.loading) && styles.annSendBtnDisabled]}
            >
              {sender.loading
                ? <ActivityIndicator color={colors.white} size="small" />
                : <>
                    <Send size={16} color={colors.white} />
                    <Text style={styles.annSendBtnText}>Duyuru Gönder</Text>
                  </>
              }
            </Pressable>
          </View>
        </>
      )}

      {/* Geçmiş Duyurular */}
      <View style={styles.annSection}>
        <Text style={styles.annSectionTitle}>Gönderilen Duyurular</Text>
        {history.loading && <LoadingBlock label="Yükleniyor…" />}
        {!history.loading && (history.data ?? []).length === 0 && (
          <Text style={styles.historyEmpty}>Henüz duyuru gönderilmedi</Text>
        )}
        {(history.data ?? []).map((ann, i) => (
          <View key={ann.id} style={[styles.historyItem, i > 0 && styles.historyBorder]}>
            <View style={[styles.historyDot, { backgroundColor: colorFor(ann.actionType) }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.historyTitle} numberOfLines={2}>{ann.title}</Text>
              <Text style={styles.historyMeta}>
                {ann.targetAudience?.map((t) => t.type).join(", ")} · {new Date(ann.sentAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}


