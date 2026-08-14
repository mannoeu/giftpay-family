// Jest setup file — global mocks and config

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Silence noisy timers from react-native-reanimated and worklets in tests
jest.useFakeTimers();
