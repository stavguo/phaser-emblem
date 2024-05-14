import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from '@stylistic/eslint-plugin'


export default [
  {
    languageOptions: { globals: globals.node }
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
];