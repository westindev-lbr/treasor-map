import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm', 
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  coverageDirectory: './coverage',
  testMatch: [
    '**/?(*.)+(spec|test).ts'
  ],
  resetMocks: true,
  clearMocks: true,
  verbose: true
};

export default jestConfig;
