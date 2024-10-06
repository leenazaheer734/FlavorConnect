import gulp from 'gulp';
import gulpSass from 'gulp-sass'; // Correct import for gulp-sass
import * as sassCompiler from 'sass'; // Correct way to import Dart Sass
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';

// Initialize gulp-sass with the Dart Sass compiler
const sassPlugin = gulpSass(sassCompiler);

// Define paths for SASS and CSS files
const paths = {
  scss: {
    src: './src/styles/*.scss', // Include subdirectories for SCSS
    dest: './dist/css'           // Output directory for compiled CSS
  }
};

// 1. Compilation: Convert SASS to CSS with sourcemaps
gulp.task('sass', function () {
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sassPlugin({ outputStyle: 'expanded' }).on('error', sassPlugin.logError)) // Correct error handling
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest));
});

// 2. Autoprefixing: Add vendor prefixes
gulp.task('autoprefix', function () {
  return gulp.src(`${paths.scss.dest}/*.css`) // Input: compiled CSS
    .pipe(autoprefixer({ // Add vendor prefixes
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.scss.dest)); // Output: prefixed CSS
});

// 3. Compression: Minify the CSS files
gulp.task('minify', function () {
  return gulp.src(`${paths.scss.dest}/*.css`) // Input: CSS files from dest
    .pipe(cleanCSS({ compatibility: 'ie8' })) // Minify CSS
    .pipe(gulp.dest(paths.scss.dest)); // Output: minified CSS to same dest
});

// 4. Watching: Watch for changes in SASS files and recompile automatically
gulp.task('watch', function () {
  gulp.watch(paths.scss.src, gulp.series('sass', 'autoprefix', 'minify'));
});

// Default task: Compile, autoprefix, minify CSS, and set up watching
gulp.task('default', gulp.series('sass', 'autoprefix', 'minify', 'watch'));
