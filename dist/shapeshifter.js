"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const path = require("path");
const process = require("process");
const fs = require("fs");
const watch = require("node-watch");
const defaultConfig_1 = require("./config/defaultConfig");
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
function compile(params) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Compilation running');
        let templates = {};
        return gulp.src(params.src)
            .pipe(frontMatter({
            property: 'data',
            remove: true
        }).on('error', (e) => {
            console.log(e);
        }))
            .pipe(markdown())
            .pipe(tap(function (file) {
            let template = file.data.template;
            // Define a default template : page
            if (template === undefined) {
                template = "page";
            }
            // Use currently only hbs template
            let templatePath = path.join(params.templateLocation, template + '.hbs');
            // If the template defined by te user does not exist, we search in Shapeshifter default template.
            // Otherwise, the page template is used.
            if (!fs.existsSync(templatePath)) {
                templatePath = path.join(__dirname, template + ".hbs");
                if (!fs.existsSync(templatePath)) {
                    templatePath = path.join(__dirname, "../_templates/page.hbs");
                }
            }
            // Add templatePath as file.data
            file.data.templatePath = templatePath;
            // Compile markdown content as hbs template
            let compiledContent = handlebars.compile(file.contents.toString())({
                data: file.data
            });
            let data = fs.readFileSync(templatePath);
            templates[template] = handlebars.compile(data.toString());
            file.contents = new Buffer(templates[template]({
                data: file.data,
                content: compiledContent
            }), "utf-8");
        }))
            .pipe(gulp.dest(path.join(params.dest, "html")))
            .pipe(debug({ title: 'To HTML : ' }))
            .pipe(pdf(params.pdfConfig))
            .pipe(debug({ title: 'To PDF : ' }))
            .pipe(gulp.dest(path.join(params.dest, "pdf")));
    });
}
/**
 * Display the parameters in console
 * @param params The parameters to print
 */
function printArgs(params) {
    console.log("Sources : " + params.src || "");
    console.log("Destination : " + params.dest || "");
    console.log("Templates locations : " + params.templateLocation || "");
    if (params.watch) {
        console.log("Watcher enabled");
    }
    console.dir("PDF Options : ");
    console.dir(params.pdfConfig || {});
}
function getConfigFileParams() {
    let filepath = path.join(process.cwd(), "shapeshifter.config.js");
    let config = {};
    if (fs.existsSync(filepath)) {
        config = require(filepath);
    }
    return config;
}
function watchActions(params) {
    console.log("--------------------------------------");
    console.log("Watching : " + params.src);
    console.log("--------------------------------------");
    let tempParams = Object.assign(params);
    watch(params.src, (filename) => {
        console.log("--------------------------------------");
        console.log('Watcher : ' + filename + " changed");
        tempParams.src = filename;
        if (fs.existsSync(filename)) {
            compile(params);
        }
        else {
            console.log(filename + " does not exist anymore. Cannot compile it.");
        }
    });
}
/** The main process **/
(() => {
    commander
        .version(properties.version)
        .option('-s, --src <item>', 'The markdown files location to transform')
        .option('-d, --destination <item>', 'The generation destination')
        .option('-t, --templates <item>', 'The templates location')
        .option('-w, --watch', 'Watch each change and compile the document');
    commander
        .parse(process.argv);
    let configParams = getConfigFileParams();
    let finalParams = Object.assign(defaultConfig_1.config, configParams, commander);
    let dirSrc = finalParams.src;
    finalParams.src = path.join(dirSrc, '/**/*.md');
    console.log("--------------------------------------");
    console.log(properties.name + " " + properties.version);
    console.log("--------------------------------------");
    printArgs(finalParams);
    compile(finalParams).then(() => {
        if (finalParams.watch) {
            finalParams.src = dirSrc;
            watchActions(finalParams);
        }
    });
})();
