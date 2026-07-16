/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/../tests"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
        // Skip full TS type checking in tests (ts-jest handles transpilation)
        diagnostics: false,
      },
    ],
  },
  // Resolve modules from backend/node_modules
  moduleDirectories: ["node_modules", "<rootDir>/node_modules"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // Ensure the session cleanup timer doesn't keep jest alive
  forceExit: true,
};
