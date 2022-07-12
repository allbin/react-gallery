module.exports = {
  extends: ['@allbin/eslint-config-react'
  ],
  plugins: ['testing-library'
  ],
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
  },
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.eslint.json'
    ],
  },
  ignorePatterns: ['.eslintrc.js'
  ],
};
