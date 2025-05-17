module.exports = {
    transform: {},
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testEnvironment: 'node',
    verbose: true,
    setupFiles: ['<rootDir>/tests/setup.js'],
    testTimeout: 10000
}; 