/**
 * app/akademik-kadro.tsx — Anabilim dalı / öğretim üyesi dizini.
 */
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Copy, Mail, MapPin, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalSubHeader } from "@/components/landing/PortalSubHeader";
import { useToast } from "@/components/Toast";
import { fetchFacultyDirectory } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { FacultyStaffMember } from "@/lib/api/types";
import { landingColors } from "@/lib/theme";

type RoleFilter = "all" | FacultyStaffMember["role"];

const FALLBACK: FacultyStaffMember[] = [
  {
    id: "fd-1",
    name: "Prof. Dr. Alparslan Kuş",
    title: "Prof. Dr.",
    department: "Dekanlık",
    office: "İdari Blok · 2. Kat",
    email: "dekan@kocaeli.edu.tr",
    phone: null,
    role: "dean",
  },
];

const ROLE_LABEL: Record<FacultyStaffMember["role"], string> = {
  dean: "Dekan",
  chair: "Anabilim Dalı Başkanı",
  faculty: "Öğretim Üyesi",
  advisor: "Danışman",
};

const FILTER_CHIPS: { key: RoleFilter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "chair", label: "Başkan" },
  { key: "faculty", label: "Öğretim Üyesi" },
  { key: "dean", label: "Dekan" },
  { key: "advisor", label: "Danışman" },
];

/** Türkçe güvenli küçük harf + aksan sadeleştirme (İ/I/ı, Ş→s …) */
function foldTr(s: string) {
  return s
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function matchesQuery(member: FacultyStaffMember, query: string) {
  const q = foldTr(query.trim());
  if (!q) return true;
  const hay = foldTr(
    `${member.name} ${member.department} ${member.title} ${member.email ?? ""}`
  );
  // Kelime kelime: "elif yaka" → her parça geçmeli (ardışık tam cümle şart değil)
  return q.split(/\s+/).every((token) => token.length > 0 && hay.includes(token));
}

export default function AkademikKadroScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { data, loading } = usePublicResource(fetchFacultyDirectory);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const items = data?.length ? data : FALLBACK;

  const availableFilters = useMemo(() => {
    const present = new Set(items.map((m) => m.role));
    return FILTER_CHIPS.filter((c) => c.key === "all" || present.has(c.key as FacultyStaffMember["role"]));
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((m) => {
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      return matchesQuery(m, query);
    });
  }, [items, query, roleFilter]);

  const departments = useMemo(() => {
    const set = new Set(filtered.map((m) => m.department));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [filtered]);

  async function copyEmail(email: string) {
    try {
      await Clipboard.setStringAsync(email);
      toast.show("E-posta kopyalandı", "success");
    } catch {
      toast.show("Kopyalanamadı", "error");
    }
  }

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="FAKÜLTE" title="Akademik Kadro" />

      <View style={styles.searchWrap}>
        <Search size={16} color={landingColors.textMuted} strokeWidth={2.2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="İsim, anabilim dalı veya e-posta"
          placeholderTextColor={landingColors.textMuted}
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsScroll}
      >
        {availableFilters.map((chip) => {
          const active = roleFilter === chip.key;
          return (
            <Pressable
              key={chip.key}
              onPress={() => setRoleFilter(chip.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading && !data ? (
          <ActivityIndicator color={landingColors.primary} style={{ marginTop: 24 }} />
        ) : null}

        <Text style={styles.count}>
          {filtered.length} kişi · {departments.length} birim
        </Text>

        {filtered.map((member) => {
          const initials = member.name
            .split(" ")
            .filter((w) => w.length > 2 && !w.includes("."))
            .slice(-2)
            .map((w) => w[0])
            .join("");

          return (
            <View key={member.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials || "—"}</Text>
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.role}>{ROLE_LABEL[member.role]}</Text>
                  <Text style={styles.name}>{member.name}</Text>
                  <Text style={styles.dept}>{member.department}</Text>
                </View>
              </View>

              {member.office ? (
                <View style={styles.metaRow}>
                  <MapPin size={13} color={landingColors.primary} strokeWidth={2.3} />
                  <Text style={styles.metaText}>{member.office}</Text>
                </View>
              ) : null}

              {member.email ? (
                <Pressable
                  style={styles.emailRow}
                  onPress={() => copyEmail(member.email!)}
                  accessibilityRole="button"
                  accessibilityLabel={`${member.email} kopyala`}
                >
                  <Mail size={14} color={landingColors.primary} strokeWidth={2.3} />
                  <Text style={styles.emailText} numberOfLines={1}>
                    {member.email}
                  </Text>
                  <Copy size={14} color={landingColors.textMuted} strokeWidth={2.2} />
                </Pressable>
              ) : null}
            </View>
          );
        })}

        {!loading && filtered.length === 0 ? (
          <Text style={styles.empty}>Aramanıza uygun akademisyen bulunamadı.</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: landingColors.bg },
  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: landingColors.white,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: landingColors.text, padding: 0 },
  chipsScroll: { flexGrow: 0, marginBottom: 10, maxHeight: 44 },
  chips: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: landingColors.white,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: landingColors.primary,
    borderColor: landingColors.primary,
  },
  chipText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: landingColors.textSub,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  chipTextActive: { color: "#FFFFFF" },
  list: { paddingHorizontal: 16, gap: 10 },
  count: {
    fontSize: 12,
    fontWeight: "600",
    color: landingColors.textMuted,
    marginBottom: 4,
  },
  card: {
    backgroundColor: landingColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    padding: 16,
    gap: 10,
  },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: landingColors.primaryGlow,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "800",
    color: landingColors.primary,
  },
  role: {
    fontSize: 10,
    fontWeight: "800",
    color: landingColors.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
    color: landingColors.text,
    letterSpacing: -0.2,
  },
  dept: { fontSize: 12, color: landingColors.textSub, fontWeight: "500" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 12, fontWeight: "600", color: landingColors.textSub },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: landingColors.primaryGlow,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  emailText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: landingColors.primary,
  },
  empty: {
    textAlign: "center",
    marginTop: 32,
    color: landingColors.textMuted,
    fontSize: 13,
  },
});
