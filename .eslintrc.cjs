module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['standard-with-typescript', 'plugin:svelte/recommended', 'prettier'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
		{
			files: ['**/__tests__/**/*.[jt]s', '**/?(*.)+(spec|test).[jt]s'],
			extends: ['plugin:testing-library/dom', 'plugin:jest-dom/recommended'],
			rules: {
				'testing-library/prefer-await-for': 'error',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		extraFileExtensions: ['.svelte'],
	},
	rules: {},
}
