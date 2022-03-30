module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 关闭也OK
    'no-async-promise-executor': 'off',
    'vue/script-setup-uses-vars': 'off'
  },
  globals: {
    wx: 'readonly'
  }
}
