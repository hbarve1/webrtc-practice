/* eslint-disable */
export default {
  displayName: 'get-user-media-getdisplaymedia',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/get-user-media-getdisplaymedia',
};
