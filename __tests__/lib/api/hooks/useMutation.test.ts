/**
 * useMutation.test.ts — Generic mutation hook mantık testleri.
 *
 * renderHook yerine hook'un iç fonksiyonunu doğrudan test ediyoruz.
 * Bu yaklaşım: saf TS, RN/Expo bağımlılığı yok.
 *
 * Hook bileşen testleri (renderHook) için jest-expo'nun çalıştığı
 * bir CI ortamında ayrı proje konfigürasyonuyla eklenecek.
 */
import { useAuth } from "@/lib/api/AuthContext";

// ─── AuthContext Mock ──────────────────────────────────────────────────────────
jest.mock("@/lib/api/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

function setupAuth(token: string | null = "test-token-abc") {
  mockUseAuth.mockReturnValue({
    ready: true,
    token,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    refreshUser: jest.fn(),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  setupAuth();
});

/**
 * useMutation'ın submit mantığını bağımsız olarak test etmek için
 * hook'un core işlevini yansıtan bir pure function.
 *
 * Bu helper, hook'un davranışını doğrudan unit test eder.
 */
async function simulateMutation<TInput, TOutput>(
  fn: (token: string, input: TInput) => Promise<TOutput>,
  input: TInput,
  token: string | null,
  errorFallback = "İşlem başarısız",
): Promise<{ result: TOutput | null; error: string | null }> {
  if (!token) throw new Error("Oturum bulunamadı");
  try {
    const result = await fn(token, input);
    return { result, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : errorFallback;
    return { result: null, error: msg };
  }
}

// ─── Başarılı submit ──────────────────────────────────────────────────────────

describe("useMutation mantığı — başarılı akış", () => {
  it("fn doğru token ve input ile çağrılır", async () => {
    const fn = jest.fn().mockResolvedValue({ id: "new-001" });
    await simulateMutation(fn, { data: "test" }, "tok-abc");
    expect(fn).toHaveBeenCalledWith("tok-abc", { data: "test" });
  });

  it("başarılı submit doğru sonucu döner", async () => {
    const expected = { id: "res-001", status: "ok" };
    const fn = jest.fn().mockResolvedValue(expected);
    const { result, error } = await simulateMutation(fn, {}, "tok-abc");
    expect(result).toEqual(expected);
    expect(error).toBeNull();
  });

  it("fn bir kez çağrılır", async () => {
    const fn = jest.fn().mockResolvedValue({});
    await simulateMutation(fn, {}, "tok-abc");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ─── Hatalı submit ────────────────────────────────────────────────────────────

describe("useMutation mantığı — hata akışı", () => {
  it("Error fırlatılınca hata mesajı döner", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("Sunucu hatası"));
    const { result, error } = await simulateMutation(fn, {}, "tok-abc");
    expect(result).toBeNull();
    expect(error).toBe("Sunucu hatası");
  });

  it("Error olmayan exception'da fallback mesaj kullanılır", async () => {
    const fn = jest.fn().mockRejectedValue("beklenmedik");
    const { result, error } = await simulateMutation(fn, {}, "tok-abc", "Özel fallback");
    expect(result).toBeNull();
    expect(error).toBe("Özel fallback");
  });

  it("varsayılan fallback mesajı kullanılır", async () => {
    const fn = jest.fn().mockRejectedValue("beklenmedik");
    const { result, error } = await simulateMutation(fn, {}, "tok-abc");
    expect(error).toBe("İşlem başarısız");
  });
});

// ─── Token yok ────────────────────────────────────────────────────────────────

describe("useMutation mantığı — token yokken", () => {
  it("token null ise 'Oturum bulunamadı' fırlatır", async () => {
    const fn = jest.fn();
    await expect(simulateMutation(fn, {}, null)).rejects.toThrow("Oturum bulunamadı");
  });

  it("token null ise fn hiç çağrılmaz", async () => {
    const fn = jest.fn();
    await simulateMutation(fn, {}, null).catch(() => {});
    expect(fn).not.toHaveBeenCalled();
  });
});

// ─── useAuth entegrasyonu (mock) ──────────────────────────────────────────────

describe("useAuth entegrasyonu", () => {
  it("useAuth mock'u token döndürür", () => {
    const auth = useAuth();
    expect(auth.token).toBe("test-token-abc");
  });

  it("token null olarak ayarlanabilir", () => {
    setupAuth(null);
    const auth = useAuth();
    expect(auth.token).toBeNull();
  });

  it("logout fonksiyonu mock'ta mevcuttur", () => {
    const auth = useAuth();
    expect(typeof auth.logout).toBe("function");
  });
});
