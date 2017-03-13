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
const gulp = require("gulp");
const markdown = require("gulp-markdown");
const config_1 = require("./models/config");
//const markdown = require('gulp-markdown');
const del = require('del');
const handlebars = require('handlebars');
const frontMatter = require('gulp-front-matter');
const tap = require('gulp-tap');
const pdf = require('gulp-html-pdf');
const debug = require('gulp-debug');
let properties = require('../package.json');
class Shapeshifter {
    constructor(parameters) {
        this.parameters = parameters || config_1.Config.getDefault();
        this.parameters = Object.assign(config_1.Config.getDefault(), this.getParametersFromFile(), commander);
        this.parameters.rootSrc = this.parameters.src;
        this.parameters.src = path.join(this.parameters.src, '/**/*.md');
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(this.toString());
            return this.compile().then(() => {
                if (this.parameters.watch) {
                    let params = Object.assign(this.parameters);
                    return this.watch(this.parameters);
                }
                return;
            });
        });
    }
    watch(params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("--------------------------------------");
            console.log("Watching : " + params.rootSrc);
            console.log("--------------------------------------");
            let tempParams = Object.assign(params);
            return watch(params.rootSrc, (filename) => {
                console.log("--------------------------------------");
                console.log('Watcher : ' + filename + " changed");
                tempParams.src = filename;
                if (fs.existsSync(filename)) {
                    this.compile(params);
                }
                else {
                    console.log(filename + " does not exist anymore. Cannot compile it.");
                }
            });
        });
    }
    getParametersFromFile() {
        let config = null;
        console.log(this.parameters);
        console.log("Get Config File " + this.parameters.configFileLocation);
        if (this.parameters.configFileLocation != "") {
            let filepath = path.join(process.cwd(), this.parameters.configFileLocation);
            console.log("Filepath : " + filepath);
            if (fs.existsSync(filepath)) {
                console.log("Have found a config file at ${filepath}");
                config = require(filepath);
            }
        }
        return config;
    }
    /**
 * The core app function. It invokes the compilations steps, using gulp tasks
 * @param params The app params :
 *  - src: The markdown files location to transform
 *  - dest: The generation destination
 *  - templateLocation: The templates location
 * @returns {Promise<any>} The gulp process result
 */
    compile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params) {
                params = this.parameters;
            }
            console.log('Compilation running');
            let templates = {};
            return new Promise((resolve, reject) => {
                gulp.src(params.src)
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
                    .pipe(gulp.dest(path.join(params.destination, "html")))
                    .pipe(debug({ title: 'To HTML : ' }))
                    .pipe(pdf(params.pdfConfig))
                    .pipe(debug({ title: 'To PDF : ' }))
                    .pipe(gulp.dest(path.join(params.destination, "pdf")))
                    .on('end', resolve)
                    .on('error', reject);
            });
        });
    }
    /**
     * Return object info as string
     */
    toString() {
        let result = "--------------------------------------";
        result += "\n";
        result += "--------------------------------------";
        result += "\n";
        result += properties.name + " " + properties.version;
        result += "\n";
        result += "--------------------------------------";
        result += "\n";
        result += "Sources : " + this.parameters.src || "";
        result += "\n";
        result += "Destination : " + this.parameters.destination || "";
        result += "\n";
        result += "Templates locations : " + this.parameters.templateLocation || "";
        result += "\n";
        result += "Config file : " + this.parameters.configFileLocation || "";
        result += "\n";
        if (this.parameters.watch) {
            result += "Watcher enabled";
            result += "\n";
        }
        result += "PDF Options : ";
        result += "\n";
        result += JSON.stringify(this.parameters.pdfConfig) || {};
        result += "\n";
        return result;
    }
}
exports.Shapeshifter = Shapeshifter;
