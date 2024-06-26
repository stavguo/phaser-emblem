import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    stylistic.configs.customize({
        // the following options are the default values
        indent: 4,
        quotes: 'single',
        semi: false,
        jsx: false,
        // ...
    }),
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
]
