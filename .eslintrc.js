module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      useStrict: true,
    },
    project: ['./tsconfig.json']
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-trailing-spaces': 'error',
    'no-param-reassign': ['error', { 'props': false }],
    'linebreak-style': 'off',

    // Max 120 symbols per line
    'max-len': ['warn', {
      code: 120,
      ignoreComments: true,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreRegExpLiterals: true,
    }],

    // Padding lines
    'padding-line-between-statements': ['error',

      // Newline after variable declarations
      {
        blankLine: 'always', prev: 'const', next: 'return',
      },
      {
        blankLine: 'always', prev: 'let', next: 'return',
      },
      {
        blankLine: 'always', prev: 'const', next: 'block',
      },
      {
        blankLine: 'always', prev: 'let', next: 'block',
      },
      {
        blankLine: 'always', prev: 'const', next: 'block-like',
      },
      {
        blankLine: 'always', prev: 'let', next: 'block-like',
      },
      {
        blankLine: 'always', prev: 'const', next: 'expression',
      },
      {
        blankLine: 'always', prev: 'let', next: 'expression',
      },

      // Newline before return
      {
        blankLine: 'always', prev: '*', next: 'return',
      },

      // Newline between imports and exports
      {
        blankLine: 'always', prev: 'import', next: 'export',
      },
    ],

    // Order imports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': ['error', {
      groups: [
        // 1. node "builtin" modules
        // ex: 'fs', 'path'
        'builtin',

        // 2. "external" modules
        // ex: 'axios', 'lodash'
        'external',

        // 3. "internal" modules
        // ex: 'src/foo'
        'internal',

        // 4. modules from a "parent" directory
        // ex: '../foo', '../../foo/qux'
        // AND
        // "sibling" modules from the same or a sibling's directory
        // ex: './bar', './bar/baz'
        ['sibling', 'parent'],

        // 5. "index" of the current directory
        // ex: './'
        'index',

        // 6. "type" imports
        // ex: import type { Foo } from 'foo'
        'type',
      ],
      pathGroups: [
        // Assign "type" group even without the "type" keyword in import
        {
          pattern: '{@/**,./**,../**,../../**,../../../**}/types/{/**,}',
          patternOptions: {
            dot: true,
          },
          group: 'type',
          position: 'before',
        },

        // Place utilities after the "type" group
        {
          pattern: '{@/**,./**,../**,../../**,../../../**}/utils{/**,}',
          group: 'type',
          position: 'after',
        },

        // Place assets before the "internal" group
        {
          pattern: '{@/**,./**,../**,../../**,../../../**}/assets/{/**,}',
          group: 'internal',
          position: 'before',
        },

        // Consider all other paths starting with @ as internal modules
        {
          pattern: '@/**',
          group: 'internal',
          position: 'before',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],

      // Separate groups with newlines
      'newlines-between': 'always',

      // Sort imports alphabetically
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],

    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': 'off',

    // https://github.com/import-js/eslint-plugin-import/blob/v2.24.2/docs/rules/prefer-default-export.md
    'import/prefer-default-export': 'off',

    // Newline conditions for objects
    // https://eslint.org/docs/rules/object-curly-newline
    'object-curly-newline': ['error', {
      ObjectExpression: {
        multiline: true, minProperties: 1,
      },
      ObjectPattern: {
        multiline: true,
      },
      ImportDeclaration: {
        multiline: true, minProperties: 3,
      },
      ExportDeclaration: {
        multiline: true, minProperties: 3,
      },
    }],
  },
};
