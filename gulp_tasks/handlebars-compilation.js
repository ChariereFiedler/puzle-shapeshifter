const markdown = require('gulp-markdown');
const del = require('del');
const handlebars = require('handlebars');
const frontMatter = require('gulp-front-matter');
const tap = require('gulp-tap');
const fs = require('fs');
const path = require('path');

module.exports = function (gulp, params) {

    let taskName = params.taskName || 'compile';
    let src = path.join(params.src, '/**/*.md') || '_toCompile/*.md';
    let dest = params.dest || '_compiled';
    let templateLocation = params.templateLocation || './_templates';

    gulp.task(taskName , () => {
        let templates = {};
        return gulp.src(src)
            .pipe(frontMatter({
                property: 'data',
                remove: true
            }))
            .pipe(markdown())
            .pipe(tap(function (file) {

                let template = file.data.template;
                let compile = (template) => {
                    return template({
                        data: file.data,
                        content: file.contents.toString()
                    });
                };
                if (template !== undefined) {
                    if (templates[template] === undefined) {
                        let filepath = path.join(templateLocation, template + '.hbs');
                        console.log(filepath);
                        let data = fs.readFileSync(filepath);

                        templates[template] = handlebars.compile(data.toString());

                    }
                    file.contents = new Buffer(compile(templates[template]), "utf-8")
                }

            }))
            .pipe(gulp.dest(dest));
    });
};