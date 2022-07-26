module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@models/(.*)": "<rootDir>/src/models/$1",
  },
};
