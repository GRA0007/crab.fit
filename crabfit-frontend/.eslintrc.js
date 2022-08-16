/* eslint-env node */
module.exports = {
  'settings': {
    'react': {
      'version': 'detect'
    }
  },
  'env': {
    'browser': true,
    'es2021': true
  },
  'globals': {
    'process': true,
    'require': true,
    'gtag': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'eqeqeq': 2,
    'no-return-await': 1,
    'no-var': 2,
    'prefer-const': 1,
    'yoda': 2,
    'no-trailing-spaces': 1,
    'eol-last': [1, 'always'],
    'no-unused-vars': [
      1,
      {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }
    ],
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'jsx-quotes': [1, 'prefer-double'],
  }
}
