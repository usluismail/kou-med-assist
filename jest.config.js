/** @type {import('jest').Config} */
module.exports = {
  /**
   * Proje mimarisine göre iki ayrı Jest projesi:
   *
   * "unit"  → Saf TypeScript testleri (adapters, nav, storage, hooks/core)
   *           ts-jest ile Node ortamında çalışır — RN/Expo bağımlılığı yok.
   *
   * "components" → React Native bileşen testleri (gelecekte eklenecek)
   *                jest-expo preset, jsdom ortamı.
   *
   * Şu an yalnızca "unit" projesi aktif.
   */
  projects: [
    {
      displayName: "unit",
      testEnvironment: "node",
      testMatch: ["<rootDir>/__tests__/**/*.test.ts"],

      // ts-jest — doğrudan TypeScript derleme, Expo/RN pipeline'ı yok
      transform: {
        "^.+\\.tsx?$": ["ts-jest", {
          tsconfig: {
            // Test için daha gevşek ayarlar (örn. import.meta yok)
            module: "commonjs",
            esModuleInterop: true,
            strict: true,
          },
        }],
      },

      // @/ path alias
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },

      // RN/Expo modüllerini bu projede mock'la — import edilirse hata vermesin
      modulePathIgnorePatterns: [],
    },
  ],

  // Coverage — lib/ katmanını izle
  collectCoverageFrom: [
    "lib/**/*.ts",
    "!lib/**/*.d.ts",
    "!lib/**/__mocks__/**",
    "!lib/**/index.ts",      // barrel dosyalar — implementasyon yok
  ],

  verbose: true,
};
