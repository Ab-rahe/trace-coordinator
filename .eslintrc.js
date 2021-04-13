module.exports = {
    parser: `@typescript-eslint/parser`, // Specifies the ESLint parser

    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features

        sourceType: `module`, // Allows for the use of imports
    },

    extends: [
        // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        `plugin:@typescript-eslint/recommended`,
        // See https://github.com/prettier/eslint-config-prettier/blob/main/CHANGELOG.md#version-800-2021-02-21
        // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors
        // as ESLint errors. Make sure this is always the last configuration in the extends array.
        `plugin:prettier/recommended`,
    ],

    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        quotes: [`error`, `backtick`],
    },
};
