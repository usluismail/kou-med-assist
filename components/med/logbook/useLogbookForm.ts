/**
 * useLogbookForm — form state ve submit mantığı.
 *
 * SRP — Bu hook yalnızca form state yönetimi ve submit logic'i içerir.
 * DIP — createLog'u doğrudan değil, useCreateLog hook'u üzerinden çağırır.
 */
import { useCallback, useEffect, useState } from "react";
import { useCreateLog } from "@/lib/api/hooks";
import { hapticSuccess } from "@/lib/haptics";
import type { QrInfo } from "../LogbookScreen";

type FormStep = 1 | 2 | 3;

/** API'ya gönderilecek display label → api değer dönüşümleri */
const AGE_TO_API: Record<string, "child" | "adult" | "geriatric"> = {
  Pediatrik: "child",
  Yetişkin: "adult",
  Geriatrik: "geriatric",
};
const SEX_TO_API: Record<string, "f" | "m"> = {
  Kadın: "f",
  Erkek: "m",
};
const ROLE_TO_API: Record<string, "observed" | "assisted" | "performed"> = {
  Gözlemledim: "observed",
  "Yardım Ettim": "assisted",
  "Bizzat Yaptım": "performed",
};

export type LogbookFormState = {
  step: FormStep;
  procId: string | null;
  procQuery: string;
  encounterId: string;
  age: string;
  sex: string;
  roleLabel: string;
  supervisorId: string;
  submitting: boolean;
  formError: string | null;
  // Setters
  setStep: (s: FormStep) => void;
  setProcId: (id: string | null) => void;
  setProcQuery: (q: string) => void;
  setEncounterId: (id: string) => void;
  setAge: (a: string) => void;
  setSex: (s: string) => void;
  setRoleLabel: (r: string) => void;
  setSupervisorId: (id: string) => void;
  // Actions
  submit: (method: "push" | "qr", onSuccess: () => void) => Promise<void>;
  resetForm: () => void;
};

export function useLogbookForm(
  onQrCreated: (info: QrInfo) => void,
  supervisorList: { id: string; name: string }[],
  onLogReload: () => void,
  onProceduresReload: () => void,
): LogbookFormState {
  const { submit: createLog, loading: submitting } = useCreateLog();

  const [step, setStep] = useState<FormStep>(1);
  const [procId, setProcId] = useState<string | null>(null);
  const [procQuery, setProcQuery] = useState("");
  const [encounterId, setEncounterId] = useState("ENC-2026-");
  const [age, setAge] = useState("Yetişkin");
  const [sex, setSex] = useState("Kadın");
  const [roleLabel, setRoleLabel] = useState("Bizzat Yaptım");
  const [supervisorId, setSupervisorId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // İlk süpervizörü otomatik seç
  useEffect(() => {
    if (!supervisorId && supervisorList[0]) {
      setSupervisorId(supervisorList[0].id);
    }
  }, [supervisorId, supervisorList]);

  const resetForm = useCallback(() => {
    setStep(1);
    setProcId(null);
    setProcQuery("");
    setEncounterId("ENC-2026-");
    setAge("Yetişkin");
    setSex("Kadın");
    setRoleLabel("Bizzat Yaptım");
    setFormError(null);
  }, []);

  const submit = useCallback(
    async (method: "push" | "qr", onSuccess: () => void) => {
      if (!procId || !supervisorId) return;
      const enc = encounterId.trim();
      if (enc.length < 5) {
        setFormError("Encounter ID girin (hasta adı / TCKN yok)");
        return;
      }
      setFormError(null);
      try {
        const created = await createLog({
          procedureId: procId,
          encounterId: enc,
          ageGroup: AGE_TO_API[age] ?? "adult",
          sex: SEX_TO_API[sex] ?? "f",
          role: ROLE_TO_API[roleLabel] ?? "performed",
          supervisorId,
          approvalMethod: method,
        });
        await hapticSuccess();
        onLogReload();
        onProceduresReload();
        if (method === "qr" && created.qrPayload) {
          onQrCreated({
            payload: created.qrPayload,
            procedureName: created.procedureName,
            encounterId: created.encounterId,
          });
        }
        resetForm();
        onSuccess();
      } catch (e) {
        setFormError(e instanceof Error ? e.message : "Kayıt gönderilemedi");
      }
    },
    [
      procId,
      supervisorId,
      encounterId,
      age,
      sex,
      roleLabel,
      createLog,
      onQrCreated,
      onLogReload,
      onProceduresReload,
      resetForm,
    ],
  );

  return {
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
    resetForm,
  };
}
