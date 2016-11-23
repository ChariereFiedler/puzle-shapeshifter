const fs = require('fs');
const path = require('path');


const gulp = require('gulp');
const markdown = require('gulp-markdown');
const del = require('del');
const handlebars = require('handlebars');
const frontMatter = require('gulp-front-matter');
const tap = require('gulp-tap');
const Q = require('q');

gulp.task('build:clean', () => {
    return del([
        'dist/**/*'
    ])
});

gulp.task('handlebars:compile', () => {

});

gulp.task('build', () => {
    let templates = {};
    return gulp.src('_blogs/*.md')
        .pipe(frontMatter({
            property: 'data',
            remove: true
        }))
        .pipe(markdown())
        .pipe(tap(function (file) {
            console.log(JSON.stringify(file.contents.toString()));
            let template = file.data.template;
            let compile = (template) => {
                return template({
                    data : file.data,
                    content: file.contents.toString()
                });
            };
            if(template !== undefined) {
                console.log('Defined');
                if(templates[template] === undefined) {
                    let filepath = path.join('./_templates', template + '.hbs');
                    console.log(filepath);
                    let data = fs.readFileSync(filepath);

                    templates[template] = handlebars.compile(data.toString());

                }
                file.contents = new Buffer(compile(templates[template]), "utf-8")
            }

            //console.log(JSON.stringify(file));
        }))
        .pipe(tap((file) => {
            console.log(JSON.stringify(file));

            console.log(file._contents.toString());
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);