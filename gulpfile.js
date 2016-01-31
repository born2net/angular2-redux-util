var gulp = require('gulp');
var bump = require('gulp-bump');

// Override the tab size for indenting
// (or simply omit to keep the current formatting)
gulp.task('bump', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'PATCH', indent: 4 }))
        .pipe(gulp.dest('./'));
});