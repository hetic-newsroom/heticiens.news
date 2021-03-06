module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			impliedStrict: true
		}
	},
	plugins: [
		'@typescript-eslint'
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	env: {
		node: true,
		es2020: true
	},
	rules: {
		indent: [2, 'tab', {
			/* eslint-disable-next-line @typescript-eslint/naming-convention */
			SwitchCase: 1
		}],
		semi: [2, 'never'],
		curly: [2, 'multi-line'],
		'linebreak-style': [2, 'unix'],
		quotes: [2, 'single', {
			avoidEscape: true,
			allowTemplateLiterals: true
		}],
		'no-warning-comments': 1,
		'object-curly-spacing': [1, 'always'],
		'array-bracket-spacing': [1, 'never'],
		'no-await-in-loop': 0,
		'@typescript-eslint/member-delimiter-style': [2, {
			multiline: {
				delimiter: 'none'
			},
			singleline: {
				delimiter: 'semi',
				requireLast: false
			}
		}],
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/naming-convention': [1,
			{
				selector: 'default',
				format: ['strictCamelCase', 'StrictPascalCase'],
				leadingUnderscore: 'allow'
			},
			{
				selector: 'variable',
				format: ['camelCase', 'UPPER_CASE'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},
			{
				selector: 'property',
				format: ['camelCase', 'UPPER_CASE'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},
			{
				selector: 'memberLike',
				modifiers: ['private'],
				format: ['camelCase'],
				leadingUnderscore: 'require'
			},
			{
				selector: 'typeLike',
				format: ['PascalCase']
			}
		]
	},
	overrides: [
		{
			files: ['*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 0
			}
		}
	]
}
