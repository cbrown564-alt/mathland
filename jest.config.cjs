/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    // `isolatedModules` matches the Vite/esbuild build: it transpiles each file
    // in isolation without cross-file type-checking. This keeps the test gate
    // aligned with what actually ships (the build does not run tsc), and avoids
    // blocking the suite on pre-existing unused-var debt in component files.
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        isolatedModules: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        target: 'ES2020'
      }
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Standalone example apps under src/interactive/examples share package names and
  // are not part of the main test surface — ignore them for module resolution.
  modulePathIgnorePatterns: ['<rootDir>/src/interactive/examples/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/index.ts',
    // Research prototypes and standalone example apps — not part of the Jest surface.
    '!src/interactive/examples/**',
    // Large interactive lesson demos — manually/integration tested, not in Jest yet.
    '!src/interactive/components/**',
    // Tier 2 template system — not yet under unit test.
    '!src/tier2/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 4,
      functions: 8,
      lines: 6,
      statements: 7
    }
  }
};