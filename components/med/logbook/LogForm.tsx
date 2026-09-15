/**
 * 3 adımlı log kayıt formu.
 * SRP — Yalnızca form UI ve step akışını yönetir.
 *       Veri ve submit state'i useLogbookForm hook'undan gelir (prop injection).
 */
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { QrCode as QrIcon, ScanBarcode, Search } from "lucide-react-native";
import { Field, Segmented, SelectField } from "./LogbookUiKit";
import type { LogbookFormState } from "./useLogbookForm";
import type { ProcedureProgress, Supervisor } from "@/lib/api/types";
import { colors } from "@/lib/theme";

type LogFormProps = {
  form: LogbookFormState;
  procedures: ProcedureProgress[];
  supervisors: Supervisor[];
  onTabSwitch: () => void; // "liste" sekmesine geçiş
};

export function LogForm({ form, procedures, supervisors, onTabSwitch }: LogFormProps) {
  const {
    step,
    procId,
    procQuery,
    encounterId,
    age,
    sex,
    roleLabel,
    supervisorId,
    submitting,
    formError,
    setStep,
    setProcId,
    setProcQuery,
    setEncounterId,
    setAge,
    setSex,
    setRoleLabel,
    setSupervisorId,
    submit,
  } = form;

  const selectedProc = procedures.find((p) => p.id === procId) ?? null;
  const suggestions = procedures.filter(
    (p) =>
      procQuery.length > 1 &&
      p.name.toLowerCase().includes(procQuery.toLowerCase()),
  );

  const handleSubmit = (method: "push" | "qr") => {
    submit(method, onTabSwitch);
  };

  return (
    <View style={styles.pad}>
      <Text style={styles.meta}>Adım {step}/3</Text>

      {/* ── Adım 1: Prosedür seçimi ── */}
      {step === 1 && (
        <>
          <Field label="1 · Prosedür seç">
            <View style={styles.searchWrap}>
              <View style={styles.searchIcon}>
                <Search size={16} color={colors.mutedForeground} />
              </View>
              <TextInput
                value={procQuery}
                onChangeText={setProcQuery}
                placeholder="Ara veya listeden seç"
                placeholderTextColor={colors.mutedForeground}
                style={styles.input}
              />
            </View>
            {selectedProc ? (
              <Text style={[styles.meta, { marginTop: 8 }]}>
                Seçili: {selectedProc.name}
              </Text>
            ) : null}
            <View style={{ marginTop: 8, gap: 6 }}>
              {(suggestions.length ? suggestions : procedures).map((s) => (
                <Pressable
                  key={s.id}
                  onPress={() => {
                    setProcId(s.id);
                    setProcQuery(s.name);
                  }}
                  style={[
                    styles.suggestionItem,
                    procId === s.id && { backgroundColor: colors.kou + "22" },
                  ]}
                >
                  <Text style={styles.suggestionText}>{s.name}</Text>
                </Pressable>
              ))}
            </View>
          </Field>
          <Pressable
            disabled={!procId}
            onPress={() => setStep(2)}
            style={[styles.primaryAction, !procId && { opacity: 0.5 }]}
          >
            <Text style={styles.primaryActionText}>Devam</Text>
          </Pressable>
        </>
      )}

      {/* ── Adım 2: Hasta & rol bilgileri ── */}
      {step === 2 && (
        <>
          <Field label="Encounter ID (HBYS Protokol No)">
            <View style={styles.rowGap}>
              <TextInput
                value={encounterId}
                onChangeText={setEncounterId}
                autoCapitalize="characters"
                style={[styles.inputPlain, styles.flex1]}
              />
              <Pressable style={styles.barcodeBtn}>
                <ScanBarcode size={16} color={colors.white} />
                <Text style={styles.barcodeText}>Barkod</Text>
              </Pressable>
            </View>
            <Text style={[styles.meta, { marginTop: 6 }]}>
              Hasta adı / TCKN girilmez (KVKK)
            </Text>
          </Field>

          <Field label="Hasta Demografisi">
            <Segmented
              options={["Pediatrik", "Yetişkin", "Geriatrik"]}
              value={age}
              onChange={setAge}
            />
            <View style={{ marginTop: 8 }}>
              <Segmented
                options={["Kadın", "Erkek"]}
                value={sex}
                onChange={setSex}
              />
            </View>
          </Field>

          <Field label="Öğrenci Rolü">
            <View style={styles.chipRow}>
              {["Gözlemledim", "Yardım Ettim", "Bizzat Yaptım"].map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setRoleLabel(r)}
                  style={[styles.chip, roleLabel === r && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      roleLabel === r && styles.chipTextActive,
                    ]}
                  >
                    {r}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Onaylayacak Öğretim Üyesi">
            <SelectField
              value={supervisors.find((s) => s.id === supervisorId)?.name ?? "—"}
              options={supervisors.map((s) => s.name)}
              onChange={(name) => {
                const s = supervisors.find((x) => x.name === name);
                if (s) setSupervisorId(s.id);
              }}
            />
          </Field>

          <View style={styles.formActions}>
            <Pressable onPress={() => setStep(1)} style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Geri</Text>
            </Pressable>
            <Pressable onPress={() => setStep(3)} style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Onay yöntemine geç</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* ── Adım 3: Onay yöntemi ── */}
      {step === 3 && (
        <>
          <Text style={styles.cardTitle}>{selectedProc?.name}</Text>
          <Text style={styles.meta}>
            {encounterId} · {roleLabel}
          </Text>
          {formError ? (
            <Text style={{ color: "#DC2626", marginTop: 8, fontWeight: "600" }}>
              {formError}
            </Text>
          ) : null}
          <View style={[styles.formActions, { marginTop: 16 }]}>
            <Pressable
              disabled={submitting}
              onPress={() => handleSubmit("push")}
              style={[styles.secondaryAction, submitting && { opacity: 0.5 }]}
            >
              <Text style={styles.secondaryActionText}>
                {submitting ? "Gönderiliyor…" : "Push ile onaya gönder"}
              </Text>
            </Pressable>
            <Pressable
              disabled={submitting}
              onPress={() => handleSubmit("qr")}
              style={[styles.primaryAction, submitting && { opacity: 0.5 }]}
            >
              <QrIcon size={16} color={colors.kouForeground} />
              <Text style={styles.primaryActionText}>QR oluştur & gönder</Text>
            </Pressable>
          </View>
          <Pressable onPress={() => setStep(2)} style={{ marginTop: 8 }}>
            <Text style={styles.secondaryActionText}>Forma dön</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16, gap: 16, paddingBottom: 24 },
  meta: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  searchWrap: { position: "relative" },
  searchIcon: { position: "absolute", left: 12, top: 12, zIndex: 1 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingLeft: 36,
    fontSize: 14,
    color: colors.foreground,
  },
  inputPlain: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.foreground,
  },
  suggestionItem: { paddingHorizontal: 12, paddingVertical: 8 },
  suggestionText: { fontSize: 12, color: colors.foreground },
  rowGap: { flexDirection: "row", gap: 8, alignItems: "center" },
  flex1: { flex: 1 },
  barcodeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    backgroundColor: colors.clinical,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  barcodeText: { fontSize: 12, fontWeight: "600", color: colors.white },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: { borderColor: colors.kou, backgroundColor: colors.kou },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.mutedForeground },
  chipTextActive: { color: colors.kouForeground },
  formActions: { gap: 8, paddingTop: 4 },
  secondaryAction: {
    borderRadius: 12,
    backgroundColor: colors.clinical05,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.clinical,
  },
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.kou,
    paddingVertical: 14,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.kouForeground,
  },
});
