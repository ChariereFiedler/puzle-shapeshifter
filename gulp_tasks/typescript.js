const ts = require("gulp-typescript");
const path = require('path');
let debug = require('gulp-debug');
/**
 * Add typescript compiler gulp task
 * @param gulp required to add task
 * @param config the task options with the following attributes
 * tsconfig: the path to the tsconfig.json file
 * buildDirectory: the compiled .js objects destination
 */
module.exports = function (gulp, config, taskName) {
    config.buildDirectory = config.buildDirectory || 'dist';
    config.srcDirectory = config.srcDirectory || 'src';
    taskName = taskName || '';

    const tsProject = ts.createProject(config.tscongif);

    console.log('Src: '+config.srcDirectory);
    console.log('Dist: '+config.buildDirectory);

    gulp.task('typescript' + taskName, () => {
        return gulp.src(path.join(config.srcDirectory,'/**/*.ts'))
            .pipe(tsProject())
            .js
            .pipe(debug())
            .pipe(gulp.dest(config.buildDirectory));
    });
};