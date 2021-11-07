/**
 *   Gulp with TailwindCSS - An CSS Utility framework                                
 *   Author : Manjunath G                                              
 *   URL : manjumjn.com | lazymozek.com
 *   Twitter : twitter.com/manju_mjn                                    
 **/

/*
  Usage:
  1. npm install //To install all dev dependencies of package
  2. npm run dev //To start development and server for live preview
  3. npm run prod //To generate minifed files for live server
*/

const {
  src,
  dest,
  task,
  watch,
  series,
  parallel
} = require('gulp');
const del = require('del'); //For Cleaning build/dist for fresh export
const options = require("./config"); //paths and other options from config.js
const browserSync = require('browser-sync').create();

const sass = require('gulp-sass'); //For Compiling SASS files
const postcss = require('gulp-postcss'); //For Compiling tailwind utilities with tailwind config
const autoprefixer = require('gulp-autoprefixer'); // -webkit
const concat = require('gulp-concat'); //For Concatinating js,css files
const uglify = require('gulp-terser'); //To Minify JS files
const imagemin = require('gulp-imagemin'); //To Optimize Images
const cleanCSS = require('gulp-clean-css'); //To Minify CSS files
const purgecss = require('gulp-purgecss'); // Remove Unused CSS from Styles
const fileinclude = require('gulp-file-include'); //파일인클루드 추가
const prettyHtml = require('gulp-pretty-html'); //추가

//Note : Webp still not supported in major browsers including forefox
//const webp = require('gulp-webp'); //For converting images to WebP format
//const replace = require('gulp-replace'); //For Replacing img formats to webp in html
const logSymbols = require('log-symbols'); //For Symbolic Console logs :) :P 

//Load Previews on Browser on dev
function livePreview(done) {
  browserSync.init({
    server: {
      baseDir: options.paths.dist.base
    },
    port: options.config.port || 5000
  });
  done();
}

// Triggers Browser reload
function previewReload(done) {
  console.log("\n\t" + logSymbols.info, "Reloading Browser Preview.\n");
  browserSync.reload();
  done();
}

//Development Tasks
function devHTML() {
  return src([
      `${options.paths.src.base}/**/*.html`,
      `!${options.paths.src.base}/**/_*.html`
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: options.paths.src.includeHtml
    }))
    .pipe(dest(options.paths.dist.base));
}

function devGuide() {
  return src([
      `${options.paths.src.guide}/**/*.*`,
      `!${options.paths.src.guide}/**/*.png`
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: options.paths.src.includeHtml
    }))
    .pipe(dest(options.paths.dist.guide));
}

function devGuideImages() {
  return src(`${options.paths.src.guideImg}/**/*.png`).pipe(dest(options.paths.dist.guideImg));
}

function devStyles() {
  const tailwindcss = require('tailwindcss');
  return src(`${options.paths.src.css}/**/*.scss`).pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(dest(options.paths.src.css))
    .pipe(postcss([
      tailwindcss(options.config.tailwindjs),
      require('autoprefixer'),
    ]))
    .pipe(autoprefixer())
    .pipe(concat({
      path: options.paths.dist.cssFile + '.css'
    }))
    .pipe(dest(options.paths.dist.css));
}

function devScripts() {
  return src([
      `${options.paths.src.js}/libs/**/*.js`,
      `${options.paths.src.js}/**/*.js`,
      `!${options.paths.src.js}/**/external/*`
    ]).pipe(concat({
      path: options.paths.dist.jsFile + '.js'
    }))
    .pipe(dest(options.paths.dist.js));
}

function devImages() {
  return src(`${options.paths.src.img}/**/*`).pipe(dest(options.paths.dist.img));
}

function watchFiles() {
  watch(`${options.paths.src.base}/**/*.html`, series(devHTML, devStyles, previewReload));
  watch(`${options.paths.src.guide}/**/*.*`, series(devGuide, previewReload));
  watch(`${options.paths.src.guideImg}/**/*.*`, series(devGuideImages, previewReload));
  watch([options.config.tailwindjs, `${options.paths.src.css}/**/*.scss`], series(devStyles, previewReload));
  watch(`${options.paths.src.js}/**/*.js`, series(devScripts, previewReload));
  watch(`${options.paths.src.img}/**/*`, series(devImages, previewReload));
  console.log("\n\t" + logSymbols.info, "Watching for Changes..\n");
}

function devClean() {
  console.log("\n\t" + logSymbols.info, "Cleaning dist folder for fresh start.\n");
  return del([options.paths.dist.base]);
}

//Production Tasks (Optimized Build for Live/Production Sites)
function prodHTML() {
  return src([
      `${options.paths.src.base}/**/*.html`,
      `!${options.paths.src.base}/**/_*.html`
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: options.paths.src.includeHtml
    }))
    .pipe(dest(options.paths.build.base));
}

function prodStyles() {
  return src(`${options.paths.dist.css}/**/*`)
    .pipe(purgecss({
      content: ['src/**/*.{html,js}'],
      defaultExtractor: content => {
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
        return broadMatches.concat(innerMatches)
      }
    }))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(dest(options.paths.build.css));
}

function prodScripts() {
  return src([
      `${options.paths.src.js}/libs/**/*.js`,
      `${options.paths.src.js}/**/*.js`
    ])
    .pipe(concat({
      path: options.paths.build.jsFile + '.js'
    }))
    .pipe(uglify())
    .pipe(dest(options.paths.build.js));
}

function prodImages() {
  return src(options.paths.src.img + '/**/*').pipe(imagemin()).pipe(dest(options.paths.build.img));
}

function prodClean() {
  console.log("\n\t" + logSymbols.info, "Cleaning build folder for fresh start.\n");
  return del([options.paths.build.base]);
}

function buildFinish(done) {
  console.log("\n\t" + logSymbols.info, `Production build is complete. Files are located at ${options.paths.build.base}\n`);
  done();
}

exports.default = series(
  devClean, // Clean Dist Folder
  parallel(devStyles, devScripts, devImages, devHTML, devGuide, devGuideImages), //Run All tasks in parallel
  livePreview, // Live Preview Build
  watchFiles // Watch for Live Changes
);

exports.prod = series(
  prodClean, // Clean Build Folder
  parallel(prodStyles, prodScripts, prodImages, prodHTML), //Run All tasks in parallel
  buildFinish
);