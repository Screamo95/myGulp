// Подключение плагинов
const gulp = require("gulp");
const del = require("del");
const cleanCSS = require(`gulp-clean-css`);
const rename = require(`gulp-rename`);
const babel = require(`gulp-babel`)
const uglify = require(`gulp-uglify`)
const concat = require(`gulp-concat`)
const sourcemaps = require(`gulp-sourcemaps`)
const autoprefixer = require(`gulp-autoprefixer`)
const imagemin = require(`gulp-imagemin`)
const htmlmin = require(`gulp-htmlmin`)
const newer = require(`gulp-newer`)

// Пути к фаилам
const paths = {
  html: {
    src: `src/*.html`,
    dest: `dist/`
  },
  styles: {
    src: `src/css/**`,
    dest: `dist/css/`
  },
  scripts: {
    src: `src/js/**`,
    dest: `dist/js/`
  },
  image: {
    src: `src/img/**`,
    dest: `dist/img`
  }
}

// Обрабока html
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(gulp.dest(paths.html.dest))
}

// Обработка стилей
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(autoprefixer({
			cascade: false
		}))
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(sourcemaps.write(`.`))
    .pipe(gulp.dest(paths.styles.dest))
}

// Обработка скриптов
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(sourcemaps.write(`.`))
    .pipe(gulp.dest(paths.scripts.dest))
}

// Обработка изображений
function img() {
  return gulp.src(paths.image.src, {
    encoding: false
  })
    .pipe(newer(paths.image.dest))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(paths.image.dest))
};

// Обработка папки fonts
function fonts() {
  return gulp.src(`src/fonts/**`)
    .pipe(newer(`dist/fonts`))
    .pipe(gulp.dest(`dist/fonts`))
};

// Очистка папки dist, кроме img
function clean() {
  return del([`dist/*`, `!dist/img`, `!dist/fonts`]);
};

// Отслеживание изменений
function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.image.src, img)
  gulp.watch(`src/fonts/**`, fonts)
}

// Основная сборка команд
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img, fonts), watch)

// Создание команд
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.fonts = fonts
exports.clean = clean
exports.watch = watch
exports.build = build
exports.default = build