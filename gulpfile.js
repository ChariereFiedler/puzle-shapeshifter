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


const configCli = {
    buildDirectory: './bin',
    srcDirectory: './bin',
    tscongif: './tsconfig.json'

};
require('./gulp_tasks/typescript')(gulp, configCli, "Cli");

const configTest = {
    buildDirectory: './test',
    srcDirectory: './test',
    tscongif: './tsconfig.json'
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

/*---------------------------------------------*/
gulp.task('watch', ()=> {
    gulp.watch(path.join(config.srcDirectory, './**/*.ts'), gulp.series('typescript'));
    gulp.watch(path.join(configTest.srcDirectory, './**/*.ts'), gulp.series('typescriptTest'));
    gulp.watch(path.join(configCli.srcDirectory, './**/*.ts'), gulp.series('typescriptCli'));
});

gulp.task('build', gulp.parallel('typescript', 'typescriptTest', 'typescriptCli'));

gulp.task('default', gulp.series('build','watch'));