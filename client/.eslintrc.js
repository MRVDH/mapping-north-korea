module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    plugins: [
        'vuetify'
    ],
    rules: {
        'indent': ["error", 4],
        "semi": [2, "always"],
        'generator-star-spacing': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vuetify/no-deprecated-classes': 'error'
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
