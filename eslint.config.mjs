import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'no-lonely-if': 1,
      'no-unused-vars': 1,
      'no-trailing-spaces': 1,
      'no-multi-spaces': 1,
      'no-multiple-empty-lines': 1,
      'space-before-blocks': ['warn', 'always'],
      'object-curly-spacing': [1, 'always'],
      'indent': ['warn', 2],
      'quotes': ['error', 'single'],
      'array-bracket-spacing': 1,
      'linebreak-style': 0,
      'no-unexpected-multiline': 'warn',
      'keyword-spacing': ['warn', { 'before': true }],
      'comma-dangle': ['warn', 'never'],
      'comma-spacing': 1,
      'arrow-spacing': 1,
      'no-undef': 1,
      'semi': ['error', 'always']
    }
  },
  pluginVue.configs['flat/essential']
]);
