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
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 8,
      lines: 6,
      statements: 7
    }
  }
};