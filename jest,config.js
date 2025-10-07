module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/server.ts",
        "!src/config/**/*.ts",
    ],
    testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
};