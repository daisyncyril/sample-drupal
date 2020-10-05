// Load plugins
const gulp = require("gulp");
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('gulp-merge');
const autoprefixer = require("gulp-autoprefixer");
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');

function cssLint() {
  return gulp.src('sass/main.scss', { sourcemaps: true })
  .pipe(sassLint())
  .pipe(sassLint.format())
  .pipe(sassLint.failOnError());
}

function css() {
  return gulp.src('sass/main.scss', { sourcemaps: true })
    //.pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'uncompressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(uglifycss({"max-line-len": 80}))
    .pipe(rename('styles.min.css'))
    //.pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css', { sourcemaps: './maps' }));
}

function js() {
	return gulp.src(['libs/main.js'], {base: 'libs/', sourcemaps: true})
	//.pipe(sourcemaps.init())
	.pipe(concat('site.js'))
	.pipe(uglify())
  .pipe(rename('main.min.js'))
	//.pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest('./js/', { sourcemaps: './maps' }));
}

function watch() {
	gulp.watch('./sass/**/*.scss', buildCss);
	gulp.watch('./libs/*.js', js);
}

// define complex tasks
const buildCss = gulp.series(cssLint, css);
const build = gulp.parallel(buildCss, js);

// export tasks
exports.css = buildCss;
exports.js = js;
exports.watch = watch;
exports.build = build;
exports.default = build;
