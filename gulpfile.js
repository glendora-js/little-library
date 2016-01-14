var gulp = require('gulp'),
    notify = require('gulp-notify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    reactify = require('reactify')
;

var adminSrc = './react/admin/main.jsx';
var jsAdminDest = './public/js/admin';


//transform jsx to js
gulp.task('js', function(){
  
  return browserify(adminSrc)
        .transform(reactify)
        .bundle()
        .on('error', function(err){
          return notify().write(err);
        })
        .pipe(source('main.js'))
        .pipe(gulp.dest(jsAdminDest))
        .pipe(notify({ message : 'Admin JSX transformation complete'}));
});

gulp.task('default', ['js']);
