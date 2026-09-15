import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { CheckCircle2, ClipboardCheck, Mic } from "lucide-react-native";
import { SwipeToApprove } from "../SwipeToApprove";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useApproveLog, useRequestRevision } from "@/lib/api/hooks";
import { relativeTimeTr } from "@/lib/api/labels";
import type { PendingApproval } from "@/lib/api/types";
import { hapticSuccess } from "@/lib/haptics";
import { colors } from "@/lib/theme";
import { styles } from "./styles";

export function ApprovalList({
  items,
  loading,
  error,
  onRetry,
  onChanged,
}: {
  items: PendingApproval[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onChanged: () => void;
}) {
  if (loading && !items) return <LoadingBlock label="Onaylar yükleniyor…" />;
  if (error && !items) return <ErrorBlock message={error} onRetry={onRetry} />;
  if (!items || items.length === 0) {
    return <EmptyBlock message="Bekleyen onay yok" />;
  }

  return (
    <View style={styles.listPad}>
      {items.map((item) => (
        <ApprovalCard key={item.id} item={item} onChanged={onChanged} />
      ))}
    </View>
  );
}

export function ApprovalCard({
  item,
  onChanged,
}: {
  item: PendingApproval;
  onChanged: () => void;
}) {
  /**
   * DIP — ApprovalCard doğrudan approveLog/requestRevision çağırmaz;
   * hook katmanı üzerinden erişir.
   */
  const approver = useApproveLog();
  const revisioner = useRequestRevision();

  const [note, setNote] = useState("");
  const [recording, setRecording] = useState(false);
  const [approved, setApproved] = useState(false);

  // İki hook'un loading ve error state'lerini birleştir
  const busy = approver.loading || revisioner.loading;
  const error = approver.error ?? revisioner.error;

  const dictate = () => {
    setRecording(true);
    setTimeout(() => {
      setNote("Teknik usulüne uygun, hasta iletişimi başarılı.");
      setRecording(false);
    }, 900);
  };

  const doApprove = async () => {
    if (busy) return;
    approver.reset();
    revisioner.reset();
    try {
      await approver.approve(item.id, { note: note || undefined });
      await hapticSuccess();
      setApproved(true);
      setTimeout(() => onChanged(), 600);
    } catch {
      // hata approver.error'da
    }
  };

  const doRevision = async () => {
    if (busy) return;
    approver.reset();
    revisioner.reset();
    const revisionNote = note.trim() || "Lütfen kaydı gözden geçirin.";
    try {
      await revisioner.request(item.id, revisionNote);
      onChanged();
    } catch {
      // hata revisioner.error'da
    }
  };

  const confettiColors = ["#10B981", "#008542", "#F59E0B", "#3B82F6"];

  return (
    <View style={[styles.card, approved && { opacity: 0.9 }]}>
      {approved && (
        <View style={styles.approvedBadge}>
          <CheckCircle2 size={12} color={colors.success} />
          <Text style={styles.approvedBadgeText}>APPROVED</Text>
        </View>
      )}
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <ClipboardCheck size={20} color={colors.kou} />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.studentName}
          </Text>
          <Text style={styles.cardSub} numberOfLines={1}>
            {item.procedureName}
          </Text>
          {item.studentPeriod != null ? (
            <Text style={styles.meta} numberOfLines={1}>
              Dönem {item.studentPeriod}
              {item.studentRotation ? ` · ${item.studentRotation}` : ""}
            </Text>
          ) : null}
          <Text style={styles.meta}>
            Protokol: {item.encounterId} · {relativeTimeTr(item.submittedAt)}
          </Text>
        </View>
      </View>

      <View style={styles.noteBox}>
        <View style={styles.noteHeader}>
          <Text style={styles.noteLabel}>Sesli Geri Bildirim</Text>
          <Pressable
            onPress={dictate}
            style={[styles.micBtn, recording && styles.micBtnRecording]}
          >
            <Mic size={16} color={colors.white} />
          </Pressable>
        </View>
        <Text style={styles.noteText}>
          {note || (recording ? "Dinleniyor…" : "Mikrofona dokunun (Talk-to-Text)")}
        </Text>
      </View>

      {error ? (
        <Text style={{ color: "#DC2626", marginTop: 8, fontWeight: "600" }}>
          {error}
        </Text>
      ) : null}

      <View style={{ marginTop: 12 }}>
        <SwipeToApprove approved={approved} onApprove={doApprove} />
      </View>

      {!approved ? (
        <Pressable
          onPress={doRevision}
          disabled={busy}
          style={{ marginTop: 10, alignItems: "center", paddingVertical: 8 }}
        >
          <Text style={{ color: colors.clinical, fontWeight: "700", fontSize: 13 }}>
            Düzeltme iste
          </Text>
        </Pressable>
      ) : null}

      {approved &&
        Array.from({ length: 14 }, (_, i) => (
          <View
            key={i}
            pointerEvents="none"
            style={[
              styles.confetti,
              {
                left: `${8 + i * 6.4}%`,
                top: `${20 + ((i * 37) % 60)}%`,
                backgroundColor: confettiColors[i % 4],
              },
            ]}
          />
        ))}
    </View>
  );
}
