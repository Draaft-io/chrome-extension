module.exports = {
  plugins: [
    require("postcss-easy-import")({ prefix: "_" }), // keep this first
    require("postcss-cssnext")({ /* ...options */ }),
    require("postcss-modules"), // scoping classnames
    require("postcss-nesting"),
    require("postcss-reporter"), // at the end
  ],
}
