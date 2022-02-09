module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: [
        "plugin:react/recommended",
        "standard",
        "eslint:recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 13,
        sourceType: "module"
    },
    plugins: [
        "react",
        "@typescript-eslint"
    ],
    rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"]
    }
};
