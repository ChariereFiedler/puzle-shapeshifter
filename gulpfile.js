const fs = require('fs');
const path = require('path');
const gulp = require('gulp');

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
    gulp.watch(path.join(config.srcDirectory, './**/*.ts'), ['typescript']);
    gulp.watch(path.join(configTest.srcDirectory, './**/*.ts'), ['typescriptTest']);
});

gulp.task('build', ['typescript', 'typescriptTest']);


gulp.task('default', ['build','watch']);