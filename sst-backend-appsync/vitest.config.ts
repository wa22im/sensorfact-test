import { defineConfig } from "vitest/config";

const isCI = !!process.env["CI"];

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      enabled: isCI,
      provider: "istanbul",
      all: true,
      reporter: isCI ? ["cobertura", "text-summary"] : ["html", "text-summary"],
      reportsDirectory: "coverage/unit/",
      include: ["**/*.ts"],
      exclude: [
        "*.ts",
        "**/index.ts",
        "**/singletons/**",
        "**/*.test.ts",
        "**/__mocks__/**/*.ts",
      ],
    },
    reporters: isCI ? ["junit"] : ["default"],
    outputFile: {
      junit: "junit.xml",
    },
  },
});
