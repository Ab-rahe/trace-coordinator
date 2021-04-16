module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser

    parserOptions: {
        project: "tsconfig.json",

        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features

        sourceType: "module", // Allows for the use of imports
    },

    extends: [
        // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:@typescript-eslint/recommended",
        // See https://github.com/prettier/eslint-config-prettier/blob/main/CHANGELOG.md#version-800-2021-02-21
        // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors
        // as ESLint errors. Make sure this is always the last configuration in the extends array.
        "plugin:prettier/recommended",
    ],

    ignorePatterns: ["bin/", ".eslintrc.js", ".prettierrc.js"],

    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        quotes: ["error", "backtick"],
        "prefer-const": ["error"],
        // See https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
        "@typescript-eslint/naming-convention": [
            "error",
            { selector: "variableLike", format: ["camelCase"] },
            {
                selector: "variable",
                format: ["snake_case"],
            },
            {
                selector: "variable",
                types: ["boolean"],
                format: ["snake_case"],
                prefix: ["is", "should", "has", "can", "did", "will"],
            },
            {
                selector: "variable",
                types: ["function"],
                format: ["camelCase"],
            },
            {
                selector: "typeLike",
                format: ["PascalCase"],
            },
            {
                selector: "memberLike",
                format: ["camelCase", "snake_case"],
                modifiers: ["private"],
                leadingUnderscore: "require",
            },
            {
                selector: "parameter",
                modifiers: ["unused"],
                format: null,
                leadingUnderscore: "require",
                trailingUnderscore: "require",
            },
            {
                selector: "parameter",
                format: ["snake_case"],
            },
            {
                selector: "parameter",
                types: ["function"],
                format: ["camelCase"],
            },
        ],
    },
};
