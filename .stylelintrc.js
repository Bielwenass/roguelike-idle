module.exports = {
  // https://stylelint.io/user-guide/rules/list/
  extends: [
    'stylelint-config-sass-guidelines',
    'stylelint-config-idiomatic-order'
  ],
  rules: {
    // Disable alphabetical properties sorting - replaced by idiomatic
    'order/properties-alphabetical-order': null,

    // Allow all class names
    // https://stylelint.io/user-guide/rules/list/selector-class-pattern/
    'selector-class-pattern': null,

    // https://stylelint.io/user-guide/rules/list/max-nesting-depth/
    'max-nesting-depth': 5,

    // https://stylelint.io/user-guide/rules/list/selector-max-compound-selectors/
    'selector-max-compound-selectors': 5,

    // https://stylelint.io/user-guide/rules/list/selector-no-qualifying-type/
    'selector-no-qualifying-type': null,

    // Blocks always require newlines
    'block-opening-brace-newline-after': 'always',
    'block-closing-brace-newline-before': 'always',

    // https://stylelint.io/user-guide/rules/list/color-hex-length/
    'color-hex-length': 'long',

    // Allow the v-deep pseudo selector
    // https://stylelint.io/user-guide/rules/list/selector-pseudo-element-no-unknown
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ]
  }
}
