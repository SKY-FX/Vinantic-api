module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "arrow-body-style": "warn",
    "class-methods-use-this": "off",
    "no-console": "off",
    "semi-spacing": "error",
    "no-multi-spaces": "error",
    "no-trailing-spaces": [2, { skipBlankLines: false }],
    "max-len": "off",
    "space-in-parens": "error",
    "no-useless-catch": "off",
    "indent": ["error", 2],
    "no-unused-vars": "off",
  },
};
