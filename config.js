module.exports = {
	config: {
		tailwindjs: "./tailwind.config.js",
		port: 9050
	},
	paths: {
		root: "./",
		src: {
			base: "./src",
			css: "./src/assets/css",
			js: "./src/js",
			img: "./src/assets/images",
			includeHtml: './src/html/include_html',
		},
		dist: {
			base: "./dist",
			css: "./dist/assets/css",
			cssFile: "ps_style_pc",
			js: "./dist/js",
			jsFile: "ps_script_pc",
			img: "./dist/assets/images"
		},
		build: {
			base: "./build",
			css: "./build/assets/css",
			cssFile: "ps_style_pc",
			js: "./build/js",
			jsLib: "./dist/js/lib",
			jsFile: "ps_script_pc",
			img: "./build/assets/images"
		}
	}
}