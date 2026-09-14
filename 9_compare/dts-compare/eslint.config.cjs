const globals = require('globals');
const plugin = require('@typescript-eslint/eslint-plugin');
module.exports = [{ignores: ['node_modules/**', 'dist/**', 'vendor/**']}, ...plugin.configs['flat/recommended'], require('eslint-plugin-prettier/recommended'), {files: ['**/*.ts'], languageOptions: {globals: {...globals.node, ...globals.jest}}, rules: {'no-console': 'error', '@typescript-eslint/no-namespace': 'off', '@typescript-eslint/explicit-module-boundary-types': 'off', '@typescript-eslint/no-explicit-any': 'warn'}}];
