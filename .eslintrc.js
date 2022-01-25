module.exports = {
  extends: [
    'materya',
    'materya/typescript',
  ],

  overrides: [
    /* Global overrides */
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
      },
    },

    /* Test overrides */
    {
      env: {
        mocha: true,
      },
      extends: [
        'plugin:mocha/recommended',
      ],
      files: [
        '**/*.test.ts',
        'test/**/*',
      ],
      plugins: ['mocha'],
      rules: {
        '@typescript-eslint/no-explicit-any': ['off'],
        'func-names': ['off'],
        'import/no-extraneous-dependencies': ['error', {
          devDependencies: [
            '**/*.test.ts',
            'test/**/*',
          ],
        }],
        'mocha/no-mocha-arrows': ['off'],
        'mocha/no-setup-in-describe': ['off'],
        'prefer-arrow-callback': ['off'],
        'import/prefer-default-export': ['off'],
      },
    },
  ],

  rules: {
    /**
     * Naming Convention
     */
    '@typescript-eslint/naming-convention': ['error',
      {
        format: ['strictCamelCase'],
        leadingUnderscore: 'forbid',
        selector: 'default',
        trailingUnderscore: 'forbid',
      },

      /**
       * Match no-unused-vars config on explicit unused vars with a leading `_`
       */
      {
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
        modifiers: ['unused'],
        selector: ['variable', 'parameter'],
        trailingUnderscore: 'forbid',
      },

      /**
       * Allow `PascalCase` for specific library payload Keys
       * - aws
       * - PdfMake
       */
      {
        filter: {
          match: true,
          regex: '^(AccessKeyId|Authorization|Body|Bucket|Caveat|ContentDisposition|ContentType|Credentials|Expires|Key|Roboto|RoleArn|RoleSessionName|SecretAccessKey|SessionToken)$',
        },
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        selector: ['objectLiteralProperty'],
        trailingUnderscore: 'forbid',
      },

      /**
       * Allow `snake_case` for db payload & db types
       */
      {
        format: ['strictCamelCase', 'snake_case'],
        leadingUnderscore: 'forbid',
        selector: ['objectLiteralProperty', 'typeProperty'],
        trailingUnderscore: 'forbid',
      },

      /**
       * Special members convention as PascalCase
       */
      {
        format: ['StrictPascalCase'],
        selector: ['enumMember', 'typeLike'],
      },

      /**
       * Get loose on destructuring since we get payload of a lot of
       * different format.
       */
      {
        format: [
          'strictCamelCase',
          'snake_case',
          'StrictPascalCase',
          'UPPER_CASE',
        ],
        modifiers: ['destructured'],
        selector: 'variable',
      },
    ],

    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['db/**/*'],
    }],
    'import/no-unresolved': ['error', {
      ignore: [
        '@ustar_travel/discord-bot$', // local module import
        '^@/*', // tsconfig local paths mapping
      ],
    }],

    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 5 }],

    /**
     * JSDoc
     * Disabling too constraining rules atm
     * will figure out the right tuning later
     * Most of the handler function does not need params/returns
     */
    // TODO: replace with tsdoc or something else
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-jsdoc': 'off',
    // 'jsdoc/require-jsdoc': [
    //   'warn',
    //   {
    //     contexts: [
    //       'TSDeclareFunction:not(TSDeclareFunction + TSDeclareFunction)',
    //       'FunctionDeclaration:not(TSDeclareFunction + FunctionDeclaration)',
    //     ],
    //     require: {
    //       FunctionDeclaration: false,
    //     },
    //   },
    // ],
  },
}
