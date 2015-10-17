var gulp = require('gulp'),
	del = require('del'),
	inlinesource = require('gulp-inline-source'),
	compass = require('gulp-compass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	exec = require('child_process').exec;


gulp.task('clean', function () {
	return del([
		'./dist/*'
	])
})

gulp.task('scripts', function() {
  return gulp.src('app/js/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('compass:watch', function() {
	exec('compass watch');
});

gulp.task('compass:build', ['clean'], function() {
	exec('compass compile -e production --force');
});

gulp.task('inlinesource', ['compass:build'], function () {
    return gulp.src('./app/*.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy', function () {
	return gulp.src([
		'app/img/*.png', 
		'app/manifest.json'
		], {
            base: 'app'
        }).pipe(gulp.dest('dist'));
})

gulp.task('build', ['inlinesource'], function() {
    gulp.start('copy', 'scripts');
});

gulp.task('serve', ['compass:watch'], function() {
	browserSync.init({
		server: "app",
		index: "main.html"
	});

	gulp.watch('app/css/**/*.css').on('change', browserSync.reload);
	gulp.watch("app/*.html").on('change', browserSync.reload);
	gulp.watch('app/img/**/*').on('change', browserSync.reload);
});
