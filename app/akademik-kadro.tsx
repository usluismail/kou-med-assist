/**
 * app/akademik-kadro.tsx — Anabilim dalı / öğretim üyesi dizini.
 */
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Mail, MapPin, Phone, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalSubHeader } from "@/components/landing/PortalSubHeader";
import { fetchFacultyDirectory } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { FacultyStaffMember } from "@/lib/api/types";
import { landingColors } from "@/lib/theme";

const FALLBACK: FacultyStaffMember[] = [
  {
    id: "fd-1",
    name: "Prof. Dr. Alparslan Kuş",
    title: "Prof. Dr.",
    department: "Dekanlık",
    office: "İdari Blok · 2. Kat",
    email: "dekan@kocaeli.edu.tr",
    phone: "+90 262 303 75 75",
    role: "dean",
  },
  {
    id: "fd-2",
    name: "Prof. Dr. Fatma Şahin",
    title: "Prof. Dr.",
    department: "Anatomi Anabilim Dalı",
    office: "B Blok · 214",
    email: "fatma.sahin@kocaeli.edu.tr",
    phone: "+90 262 303 72 00",
    role: "chair",
  },
  {
    id: "fd-4",
    name: "Doç. Dr. Ayşe Kaya",
    title: "Doç. Dr.",
    department: "Pediatri Anabilim Dalı",
    office: "C Blok · 210",
    email: "ayse.kaya@kocaeli.edu.tr",
    phone: "+90 262 303 73 20",
    role: "faculty",
  },
];

const ROLE_LABEL: Record<FacultyStaffMember["role"], string> = {
  dean: "Dekan",
  chair: "Anabilim Dalı Başkanı",
  faculty: "Öğretim Üyesi",
  advisor: "Danışman",
};

export default function AkademikKadroScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading } = usePublicResource(fetchFacultyDirectory);
  const [query, setQuery] = useState("");

  const items = data?.length ? data : FALLBACK;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) => {
      const hay = `${m.name} ${m.department} ${m.title}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const departments = useMemo(() => {
    const set = new Set(filtered.map((m) => m.department));
    return Array.from(set).sort();
  }, [filtered]);

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="FAKÜLTE" title="Akademik Kadro" />

      <View style={styles.searchWrap}>
        <Search size={16} color={landingColors.textMuted} strokeWidth={2.2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="İsim veya anabilim dalı ara"
          placeholderTextColor={landingColors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
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

              <View style={styles.actions}>
                {member.email ? (
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => Linking.openURL(`mailto:${member.email}`)}
                  >
                    <Mail size={14} color={landingColors.primary} strokeWidth={2.3} />
                    <Text style={styles.actionText}>E-posta</Text>
                  </Pressable>
                ) : null}
                {member.phone ? (
                  <Pressable
                    style={styles.actionBtn}
                    onPress={() => Linking.openURL(`tel:${member.phone}`)}
                  >
                    <Phone size={14} color={landingColors.primary} strokeWidth={2.3} />
                    <Text style={styles.actionText}>Ara</Text>
                  </Pressable>
                ) : null}
              </View>
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
    marginBottom: 12,
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
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: landingColors.primaryGlow,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionText: { fontSize: 12, fontWeight: "700", color: landingColors.primary },
  empty: {
    textAlign: "center",
    marginTop: 32,
    color: landingColors.textMuted,
    fontSize: 13,
  },
});
