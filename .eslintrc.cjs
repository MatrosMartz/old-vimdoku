module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['standard-with-typescript', 'plugin:svelte/prettier', 'prettier'],
	plugins: ['simple-import-sort'],
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
				'testing-library/prefer-wait-for': 'error',
			},
		},
		{
			files: ['vite.config.ts', 'vitest.config.ts'],
			parserOptions: {
				project: './tsconfig.node.json',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		extraFileExtensions: ['.svelte'],
		sourceType: 'module',
		project: './tsconfig.json',
	},
	rules: {
		'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/member-ordering': [
			'error',
			{
				default: {
					memberTypes: [
						// Index signature
						'signature',
						'call-signature',

						// Fields
						'public-static-field',
						'protected-static-field',
						'private-static-field',
						'#private-static-field',

						'public-decorated-field',
						'protected-decorated-field',
						'private-decorated-field',

						'public-instance-field',
						'protected-instance-field',
						'private-instance-field',
						'#private-instance-field',

						'public-abstract-field',
						'protected-abstract-field',

						'public-field',
						'protected-field',
						'private-field',
						'#private-field',

						'static-field',
						'instance-field',
						'abstract-field',

						'decorated-field',

						'field',

						// Static initialization
						'static-initialization',

						// Constructors
						'public-constructor',
						'protected-constructor',
						'private-constructor',

						'constructor',

						// Getters
						'public-static-get',
						'protected-static-get',
						'private-static-get',
						'#private-static-get',

						'public-decorated-get',
						'protected-decorated-get',
						'private-decorated-get',

						'public-instance-get',
						'protected-instance-get',
						'private-instance-get',
						'#private-instance-get',

						'public-abstract-get',
						'protected-abstract-get',

						'public-get',
						'protected-get',
						'private-get',
						'#private-get',

						'static-get',
						'instance-get',
						'abstract-get',

						'decorated-get',

						'get',

						// Setters
						'public-static-set',
						'protected-static-set',
						'private-static-set',
						'#private-static-set',

						'public-decorated-set',
						'protected-decorated-set',
						'private-decorated-set',

						'public-instance-set',
						'protected-instance-set',
						'private-instance-set',
						'#private-instance-set',

						'public-abstract-set',
						'protected-abstract-set',

						'public-set',
						'protected-set',
						'private-set',
						'#private-set',

						'static-set',
						'instance-set',
						'abstract-set',

						'decorated-set',

						'set',

						// Methods
						'public-static-method',
						'protected-static-method',
						'private-static-method',
						'#private-static-method',

						'public-decorated-method',
						'protected-decorated-method',
						'private-decorated-method',

						'public-instance-method',
						'protected-instance-method',
						'private-instance-method',
						'#private-instance-method',

						'public-abstract-method',
						'protected-abstract-method',

						'public-method',
						'protected-method',
						'private-method',
						'#private-method',

						'static-method',
						'instance-method',
						'abstract-method',

						'decorated-method',

						'method',
					],
					optionalityOrder: 'optional-first',
					order: 'alphabetically',
				},
			},
		],
		'@typescript-eslint/method-signature-style': ['error', 'method'],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
	},
}
