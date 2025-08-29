module.exports = {
  root: true,
  extends: [
    '@react-native',
    '@react-native/typescript',
  ],
  rules: {
    'prettier/prettier': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
