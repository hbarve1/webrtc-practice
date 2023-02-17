/* eslint-disable */
export default {
  displayName: 'peerconnection-change-codecs',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/peerconnection-change-codecs',
};
