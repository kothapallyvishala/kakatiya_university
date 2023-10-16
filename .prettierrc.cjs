/** @type {import("prettier").Config} */
module.exports = {
  trailingComma: "none",
  semi: true,
  tabWidth: 2,
  singleQuote: false,
  bracketSpacing: true,
  jsxBracketSameLine: true,
  overrides: [
    {
      files: "*.svg",
      options: {
        parser: "html"
      }
    }
  ],
  plugins: [
    require.resolve("prettier-plugin-organize-imports"),
    require.resolve("prettier-plugin-tailwindcss")
  ]
};
