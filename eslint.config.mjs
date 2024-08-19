import { env } from 'node:process'

import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': env.NODE_ENV === 'production' ? 'warn' : 'off',

    // TODO: DEPRECATED
    'no-trailing-spaces': 'error',

    'capitalized-comments': ['error', 'always'],

    'no-param-reassign': ['error', {
      props: false,
    }],

    // TODO: DEPRECATED
    'linebreak-style': 'off',

    // TODO: DEPRECATED
    'max-len': ['warn', {
      code: 120,
      ignoreComments: true,
      ignoreTemplateLiterals: true,
      ignoreStrings: true,
      ignoreUrls: true,
      ignoreRegExpLiterals: true,
    }],

    // https://astexplorer.net/
    'no-restricted-syntax': [
      'error',

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
      'ForInStatement',

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
      'LabeledStatement',

      // It already doesn't work in 'strict' mode.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with
      'WithStatement',
    ],

    // TODO: DEPRECATED
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: 'const',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: 'let',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: 'const',
        next: 'block',
      },
      {
        blankLine: 'always',
        prev: 'let',
        next: 'block',
      },
      {
        blankLine: 'always',
        prev: 'const',
        next: 'block-like',
      },
      {
        blankLine: 'always',
        prev: 'let',
        next: 'block-like',
      },
      {
        blankLine: 'always',
        prev: 'const',
        next: 'expression',
      },
      {
        blankLine: 'always',
        prev: 'let',
        next: 'expression',
      },

      // Newline before return
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },

      // Newline between imports and exports
      {
        blankLine: 'always',
        prev: 'import',
        next: 'export',
      },
    ],

    'import/no-extraneous-dependencies': 'error',
    'import/prefer-default-export': 'off',

    'import/extensions': ['error', 'never', {
      pattern: {
        ts: 'never',
      },
    }],

    'import/order': [
      'error',
      {
        'groups': [
          // 1. node "builtin" modules
          // Ex: 'fs', 'path'
          'builtin',

          // 2. "external" modules
          // Ex: 'axios', 'lodash'
          'external',

          // 3. "internal" modules
          // Ex: 'src/foo'
          'internal',

          // 4. modules from a "parent" directory
          // Ex: '../foo', '../../foo/qux'
          // AND
          // "sibling" modules from the same or a sibling's directory
          // Ex: './bar', './bar/baz'
          ['sibling', 'parent'],

          // 5. "index" of the current directory
          // Ex: './'
          'index',

          // 6. "type" imports
          // Ex: import type { Foo } from 'foo'
          'type',
        ],

        'pathGroups': [
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

        'pathGroupsExcludedImportTypes': ['builtin'],

        // Separate groups with newlines
        'newlines-between': 'always',

        // Sort imports alphabetically
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax
    // 'ts/consistent-type-imports': ['off'],

    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 1,
        },
        ObjectPattern: {
          multiline: true,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3,
        },
      },
    ],
  },
})
