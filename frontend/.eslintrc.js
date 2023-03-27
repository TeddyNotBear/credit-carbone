const path = require('path');

module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended',
    'prettier',
    'react-hooks',
    'plugin:import/typescript',
    'airbnb-typescript',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier', 'react-hooks'],
  rules: {
    'no-restricted-imports': ['error'],
    'default-case': 'off',
    'func-names': 'off',
    'global-require': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    'no-unused-vars': 'off', // using @typescript-eslint/no-unused-vars
    'no-use-before-define': 'off', // prevents bug 'React' was used before it was defined, @typescript-eslint version is used instead
    'no-unused-expressions': 'warn',
    'arrow-body-style': 'off', // allows us to use return immediately after arrow function opening bracket
    'no-shadow': 'off', // variables and interface properties are incorrectly reported. Used @typescript-eslint/no-shadow
    '@typescript-eslint/explicit-module-boundary-types': 'off', // most errors are related to default exports of function components returning ReactNode
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/camelcase': 'off',

    'no-param-reassign': 'error',
    radix: 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        trailingComma: 'es5',
        tabWidth: 2,
        bracketSpacing: true,
        semi: true,
        singleQuote: true,
        printWidth: 120,
      },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: true, classes: true, variables: false },
    ], // allows to place styled components at the bottom of files, to avoid visual pollution.

    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/promise-function-async': [
      'error',
      {
        allowedPromiseNames: ['Thenable'],
        checkArrowFunctions: true,
        checkFunctionDeclarations: true,
        checkFunctionExpressions: true,
        checkMethodDeclarations: true,
      },
    ],
    'import/no-unresolved': ['error'],
    'import/default': 'error',
    'import/named': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        pathGroups: [{ pattern: '@*/*', group: 'external' }],
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [
          ['builtin', 'external'],
          'internal',
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'import/prefer-default-export': 'off',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react/self-closing-comp': 'error',
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-array-index-key': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unused-state': 'error',
    'react/jsx-props-no-spreading': ['error', { html: 'ignore' }],

    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'react/no-multi-comp': 'off',
    'react/no-unused-prop-types': 'off',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/sort-comp': 'off',
    'react/default-props-match-prop-types': 'off',
    'react/static-property-placement': 'off',
    'react/display-name': 'off',
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['src/components/**/*.tsx'],
      rules: {
        'react/no-unescaped-entities': 'off',
        '@typescript-eslint/ban-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
  settings: {
    'import/extensions': 0,
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
      'json/json-with-comments-files': ['.vscode/**'],
      plugins: ['json-format'],
    },
  },
};