import * as commander from 'commander';
import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs';
import {config as defaultParams} from './config/defaultConfig';

const gulp = require('gulp');
const markdown = require('gulp-markdown');
const del = require('del');
const handlebars = require('handlebars');
const frontMatter = require('gulp-front-matter');
const tap = require('gulp-tap');

const pdf = require('gulp-html-pdf');
const debug = require('gulp-debug');

let properties = require('../package.json');
let hbsGulpTask = require('./../gulp_tasks/handlebars-compilation');


/**
 * The core app function. It invokes the compilations steps, using gulp tasks
 * @param params The app params :
 *  - src: The markdown files location to transform
 *  - dest: The generation destination
 *  - templateLocation: The templates location
 * @returns {Promise<any>} The gulp process result
 */
async function compile(params):Promise<any>{
    console.log('Compilation running');
    let templates = {};
    return gulp.src(params.src)
        .pipe(frontMatter({
            property: 'data',
            remove: true
        }).on('error', (e)=>{
            console.log(e);
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

            let filepath = "";
            if (template === undefined) {
                template = "page";
            }

            filepath = path.join(params.templateLocation, template + '.hbs');

            if (!fs.existsSync(filepath)) {
                filepath = path.join(__dirname, "../_templates/page.hbs");
            }
            let data = fs.readFileSync(filepath);
            templates[template] = handlebars.compile(data.toString());
            file.contents = new Buffer(compile(templates[template]), "utf-8")
        }))
        .pipe(gulp.dest(path.join(params.dest, "html")))
        .pipe(debug({title: 'To HTML : '}))
        .pipe(pdf(params.pdfConfig))
        .pipe(debug({title: 'To PDF : '}))
        .pipe(gulp.dest(path.join(params.dest, "pdf")));
}



/**
 * Display the parameters in console
 * @param params The parameters to print
 */
function printArgs(params) {
    console.log("Sources : " + params.src || "");
    console.log("Destination : " + params.dest || "");
    console.log("Templates locations : " + params.templateLocation || "");
    console.dir("PDF Options : ");
    console.dir(params.pdfConfig || {});
}

function getConfigFileParams(): Object{
    let filepath = path.join(process.cwd(), "shapeshifter.config.js");
    let config = {};
    if (fs.existsSync(filepath)) {
        config = require(filepath);
    }
    return config;
}

/** The main process **/
(()=> {

    commander
        .version(properties.version)
        .option('-s, --src <item>', 'The markdown files location to transform')
        .option('-d, --destination <item>', 'The generation destination')
        .option('-t, --templates <item>', 'The templates location');

    commander
        .parse(process.argv);

    let configParams = getConfigFileParams();
    let finalParams = Object.assign(defaultParams, configParams, commander);
    finalParams.src = path.join( finalParams.src, '/**/*.md');

    console.log("--------------------------------------");
    console.log(properties.name + " "+ properties.version);
    console.log("--------------------------------------");


    printArgs(finalParams);
    compile(finalParams);
})();