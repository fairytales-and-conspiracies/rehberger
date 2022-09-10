module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:@next/next/recommended',
    // 'next',
    // 'next/core-web-vitals',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', 'import', 'jsx-a11y'],
  rules: {
    'prettier/prettier': 'error',
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    // TODO figure these out below
    // 'react/no-unescaped-entities': 'warn',
    // 'no-unused-vars': 'warn',
    // 'no-multi-assign': 'warn',
    // 'jsx-a11y/click-events-have-key-events': 'warn',
    // 'react/jsx-props-no-spreading': 'warn',
    // 'prefer-template': 'warn',
    // 'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    // 'jsx-a11y/no-static-element-interactions': 'warn',
    // 'no-prototype-builtins': 'warn',
    // 'react/no-array-index-key': 'warn',
    // 'no-undef': 'warn',
    // eqeqeq: 'warn',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'import/order': [
      'off',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'object', 'index'],
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [
          ['@/components', './src/components'],
          ['@/context', './src/context'],
          ['@/contract', './src/contract'],
          ['@/lib', './src/lib'],
          ['@/models', './src/models'],
          ['@/pages', './src/pages'],
          ['@/static-data', './src/static-data'],
          ['@/styles', './src/styles'],
          ['@/utils', './src/utils'],
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
};
