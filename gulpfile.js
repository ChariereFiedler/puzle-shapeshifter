const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => {
    return del([
        'dist/**/*',
        'test/**/*.js'
    ])
});

/*---------------------------------------------*/
/* Typescript tasks
/*---------------------------------------------*/
const config = {
    buildDirectory: './dist',
    srcDirectory: './src',
    tscongif: './src/tsconfig.json'

};
require('./gulp_tasks/typescript')(gulp, config);

const configTest = {
    buildDirectory: './test',
    srcDirectory: './test',
    tscongif: './test/tsconfig.json'
};

require('./gulp_tasks/typescript')(gulp, configTest, "Test");

/*---------------------------------------------*/
/* Hbs Compilation */
/*---------------------------------------------*/

const hbsCompileParams = {
    taskName: 'compile',
    src: '_toCompile/*.md',
    dest: '_compiled',
    templateLocation: './_templates'
};

require('./gulp_tasks/handlebars-compilation')(gulp, hbsCompileParams);

/*---------------------------------------------*/
gulp.task('watch', ()=> {
    gulp.watch(path.join(config.srcDirectory, './**/*.ts'), gulp.series('typescript'));
    gulp.watch(path.join(configTest.srcDirectory, './**/*.ts'), gulp.series('typescriptTest'));
});

gulp.task('build', gulp.parallel('typescript', 'typescriptTest'));

gulp.task('default', gulp.series('build','watch'));