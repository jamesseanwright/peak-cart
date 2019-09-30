'use strict';

const unitTestMatch = 'src(/.*)?/__tests__/.*.test.ts$';
const e2eTestMatch = 'e2e/e2e.test.ts$';
const isE2eRun = process.env.MODE === 'e2e';

module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: isE2eRun ? e2eTestMatch : unitTestMatch,
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
      diagnostics: false,
    },
  },
};
