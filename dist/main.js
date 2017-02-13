"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const commander = require("commander");
const gulp = require('gulp');
const path = require("path");
let properties = require('../package.json');
let hbsGulpTask = require('./../gulp_tasks/handlebars-compilation');
const markdown = require('gulp-markdown');
const del = require('del');
const handlebars = require('handlebars');
const frontMatter = require('gulp-front-matter');
const tap = require('gulp-tap');
const fs = require('fs');
const pdf = require('gulp-html-pdf');
const debug = require('gulp-debug');
console.log("--------------------------------------");
console.log(properties.name + " " + properties.version);
console.log("--------------------------------------");
commander
    .version(properties.version)
    .option('-s, --src <item>', 'The markdown files location to transform')
    .option('-d, --destination <item>', 'The generation destination')
    .option('-t, --templates <item>', 'The templates location')
    .parse(process.argv);
function compile(params) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Compilation running');
        let count = 0;
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
            file.contents = new Buffer(compile(templates[template]), "utf-8");
        }))
            .pipe(gulp.dest(path.join(params.dest, "html")))
            .pipe(debug({ title: 'To HTML : ' }))
            .pipe(pdf({
            "format": "A4",
            "border": {
                "top": "25mm",
                "right": "20mm",
                "bottom": "15mm",
                "left": "20mm"
            }
        }))
            .pipe(debug({ title: 'To PDF : ' }))
            .pipe(gulp.dest(path.join(params.dest, "pdf")));
    });
}
let params = {
    src: path.join(commander['src'] || './_toCompile/', '/**/*.md'),
    dest: commander['destination'] || './_compiled',
    templateLocation: commander['templates'] || './_templates'
};
function printArgs(params) {
    console.log("Sources : " + params.src || "");
    console.log("Destination : " + params.dest || "");
    console.log("Templates locations : " + params.templateLocation || "");
}
printArgs(params);
compile(params);
