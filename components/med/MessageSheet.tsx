import { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CheckCircle2, ChevronRight, Clock, MessageCircle, Send, X } from "lucide-react-native";
import { EmptyBlock, LoadingBlock } from "./StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import { sendMessage } from "@/lib/api/index";
import { useMessages } from "@/lib/api/hooks";
import { hapticSuccess } from "@/lib/haptics";
import { useToast } from "@/components/Toast";
import { colors } from "@/lib/theme";
import type { MessageCategory, MessageRecipientType } from "@/lib/api/types";

const RECIPIENTS: { key: MessageRecipientType; label: string }[] = [
  { key: "student_affairs", label: "Öğrenci İşleri" },
  { key: "advisor", label: "Danışman" },
  { key: "internship_supervisor", label: "Staj Sorumlusu" },
];

const CATEGORIES: { key: MessageCategory; label: string }[] = [
  { key: "grade_objection", label: "Not İtirazı" },
  { key: "excuse", label: "Mazeret / Rapor" },
  { key: "internship_change", label: "Staj Değişikliği" },
  { key: "advising", label: "Danışmanlık" },
  { key: "general", label: "Genel Soru" },
];

export function MessageSheet({
  open,
  onClose,
  defaultRecipient = "advisor",
}: {
  open: boolean;
  onClose: () => void;
  defaultRecipient?: MessageRecipientType;
}) {
  const { token } = useAuth();
  const messages = useMessages(open);
  const toast = useToast();

  const [tab, setTab] = useState<"new" | "history">("new");
  const [recipient, setRecipient] = useState<MessageRecipientType>(defaultRecipient);
  const [category, setCategory] = useState<MessageCategory>("general");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const canSend = body.trim().length > 5;

  const handleSend = async () => {
    if (!token || !canSend) return;
    setSending(true);
    try {
      await sendMessage(token, {
        recipientType: recipient,
        category,
        body: body.trim(),
      });
      hapticSuccess();
      setSentSuccess(true);
      messages.reload(); // update history
    } catch (e: any) {
      toast.show(e?.message ?? "Gönderilemedi", "error");
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setBody("");
    setSentSuccess(false);
    setTab("history");
  };

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s.modalRoot}>
        <View style={s.header}>
          <Text style={s.headerTitle}>İletişim Merkezi</Text>
          <Pressable onPress={onClose} style={s.closeBtn} hitSlop={8}>
            <X size={20} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          <View style={s.tabSwitch}>
        <Pressable
          style={[s.tabBtn, tab === "new" && s.tabBtnActive]}
          onPress={() => setTab("new")}
        >
          <Text style={[s.tabBtnText, tab === "new" && s.tabBtnTextActive]}>
            Yeni Mesaj
          </Text>
        </Pressable>
        <Pressable
          style={[s.tabBtn, tab === "history" && s.tabBtnActive]}
          onPress={() => setTab("history")}
        >
          <Text style={[s.tabBtnText, tab === "history" && s.tabBtnTextActive]}>
            Geçmiş Mesajlar
          </Text>
        </Pressable>
      </View>

      {tab === "new" && (
        <View style={s.content}>
          {sentSuccess ? (
            <View style={s.successCard}>
              <CheckCircle2 size={48} color={colors.primary} style={{ marginBottom: 16 }} />
              <Text style={s.successTitle}>Mesajınız İletildi</Text>
              <Text style={s.successSub}>
                İlgili birim en kısa sürede dönüş yapacaktır. Süreci "Geçmiş Mesajlar" sekmesinden takip edebilirsiniz.
              </Text>
              <Pressable style={s.resetBtn} onPress={handleReset}>
                <Text style={s.resetBtnText}>Tamam</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={s.label}>Kime Gönderilecek?</Text>
              <View style={s.row}>
                {RECIPIENTS.map((r) => {
                  const active = recipient === r.key;
                  return (
                    <Pressable
                      key={r.key}
                      style={[s.chip, active && s.chipActive]}
                      onPress={() => setRecipient(r.key)}
                    >
                      <Text style={[s.chipText, active && s.chipTextActive]}>
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[s.label, { marginTop: 16 }]}>Konu Kategorisi</Text>
              <View style={s.row}>
                {CATEGORIES.map((c) => {
                  const active = category === c.key;
                  return (
                    <Pressable
                      key={c.key}
                      style={[s.chip, active && s.chipActive]}
                      onPress={() => setCategory(c.key)}
                    >
                      <Text style={[s.chipText, active && s.chipTextActive]}>
                        {c.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[s.label, { marginTop: 16 }]}>Mesajınız</Text>
              <TextInput
                style={s.inputArea}
                placeholder="İsteğinizi detaylıca açıklayınız..."
                placeholderTextColor={colors.mutedForeground}
                value={body}
                onChangeText={setBody}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />

              <Pressable
                style={[s.submitBtn, (!canSend || sending) && s.submitBtnDisabled]}
                onPress={handleSend}
                disabled={!canSend || sending}
              >
                {sending ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Send size={16} color={colors.white} />
                    <Text style={s.submitBtnText}>Gönder</Text>
                  </>
                )}
              </Pressable>
            </>
          )}
        </View>
      )}

      {tab === "history" && (
        <View style={s.content}>
          {messages.loading && <LoadingBlock label="Mesajlar yükleniyor..." />}
          {!messages.loading && (messages.data?.length ?? 0) === 0 && (
            <EmptyBlock message="Henüz hiç mesaj göndermediniz." />
          )}
          {!messages.loading &&
            (messages.data ?? []).map((msg) => (
              <View key={msg.id} style={s.msgCard}>
                <View style={s.msgHeader}>
                  <Text style={s.msgSubject} numberOfLines={1}>
                    {msg.subject}
                  </Text>
                  {msg.status === "sent" ? (
                    <View style={[s.statusPill, { backgroundColor: colors.warning10 }]}>
                      <Clock size={10} color={colors.warning} />
                      <Text style={[s.statusText, { color: colors.warning }]}>Bekliyor</Text>
                    </View>
                  ) : msg.status === "replied" ? (
                    <View style={[s.statusPill, { backgroundColor: "#00854215" }]}>
                      <CheckCircle2 size={10} color={colors.primary} />
                      <Text style={[s.statusText, { color: colors.primary }]}>Cevaplandı</Text>
                    </View>
                  ) : (
                    <View style={[s.statusPill, { backgroundColor: colors.muted }]}>
                      <Text style={[s.statusText, { color: colors.mutedForeground }]}>
                        İletildi
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={s.msgBody} numberOfLines={2}>
                  {msg.body}
                </Text>
                <View style={s.msgFooter}>
                  <Text style={s.msgDate}>
                    {new Date(msg.sentAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  {msg.status === "replied" && (
                    <View style={s.replyLink}>
                      <Text style={s.replyLinkText}>Cevabı Gör</Text>
                      <ChevronRight size={14} color={colors.primary} />
                    </View>
                  )}
                </View>
              </View>
            ))}
        </View>
      )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalRoot: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.foreground },
  closeBtn: { padding: 4, backgroundColor: colors.muted, borderRadius: 999 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  tabSwitch: {
    flexDirection: "row",
    backgroundColor: colors.muted,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  tabBtnActive: { backgroundColor: colors.card, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  tabBtnText: { fontSize: 13, fontWeight: "600", color: colors.mutedForeground },
  tabBtnTextActive: { color: colors.primary },

  content: { minHeight: 300 },
  label: { fontSize: 13, fontWeight: "700", color: colors.foreground, marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    backgroundColor: colors.muted, borderWidth: 1, borderColor: "transparent",
  },
  chipActive: { backgroundColor: colors.kou10, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.mutedForeground },
  chipTextActive: { color: colors.primary },

  inputArea: {
    height: 120,
    backgroundColor: colors.muted,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 16,
  },
  submitBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14,
  },
  submitBtnDisabled: { backgroundColor: colors.muted },
  submitBtnText: { fontSize: 15, fontWeight: "700", color: colors.white },

  successCard: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 16 },
  successTitle: { fontSize: 20, fontWeight: "800", color: colors.foreground, marginBottom: 8 },
  successSub: { fontSize: 13, color: colors.mutedForeground, textAlign: "center", lineHeight: 20, marginBottom: 24 },
  resetBtn: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: colors.muted, borderRadius: 12 },
  resetBtnText: { fontSize: 14, fontWeight: "700", color: colors.foreground },

  msgCard: {
    padding: 14, borderRadius: 14, backgroundColor: colors.muted,
    marginBottom: 10, gap: 6,
  },
  msgHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  msgSubject: { fontSize: 13, fontWeight: "700", color: colors.foreground, flex: 1 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  statusText: { fontSize: 10, fontWeight: "700" },
  msgBody: { fontSize: 13, color: colors.mutedForeground, lineHeight: 18 },
  msgFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  msgDate: { fontSize: 11, color: colors.mutedForeground, fontWeight: "500" },
  replyLink: { flexDirection: "row", alignItems: "center", gap: 2 },
  replyLinkText: { fontSize: 12, fontWeight: "600", color: colors.primary },
});
