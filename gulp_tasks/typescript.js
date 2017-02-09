const ts = require("gulp-typescript");
const path = require('path');
/**
 * Add typescript compiler gulp task
 * @param gulp required to add task
 * @param config the task options with the following attributes
 * tsconfig: the path to the tsconfig.json file
 * buildDirectory: the compiled .js objects destination
 */
module.exports = function (gulp, config, taskName) {
    config.buildDirectory = (config.tscongif.compilerOptions ? config.compilerOptions.outDir : false) || config.buildDirectory || 'dist';
    config.srcDirectory = config.srcDirectory || 'src';
    taskName = taskName || '';

    const tsProject = ts.createProject(config.tscongif);

    gulp.task('typescript' + taskName, () => {
        return gulp.src(path.join(config.srcDirectory))
            .pipe(tsProject())
            .js
            .pipe(gulp.dest(config.buildDirectory));
    });
};