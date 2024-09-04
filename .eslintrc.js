require("@ariesclark/eslint-config/eslint-patch");
process.env["ESLINT_PROJECT_ROOT"] = __dirname;

module.exports = {
	root: true,
	extends: [
		"@ariesclark/eslint-config",
		"@ariesclark/eslint-config/next",
		"plugin:eslint-plugin-next-on-pages/recommended",
		"@ariesclark/eslint-config/tailwindcss"
	],
	plugins: ["eslint-plugin-next-on-pages"],
	settings: {
		react: {
			version: "18"
		}
	}
};
