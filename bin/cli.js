#!/usr/bin/env node
'use strict';

const commander = require("commander");
const shapeshifter = require("../dist/shapeshifter");

let properties = require('../package.json');

commander
    .version(properties.version)
    .option('-s, --src <item>', 'The markdown files location to transform')
    .option('-d, --destination <item>', 'The generation destination')
    .option('-t, --templates <item>', 'The templates location')
    .option('-w, --watch', 'Watch each change and compile the document');

commander
    .parse(process.argv);

let app = new shapeshifter.Shapeshifter(commander);
console.log(app.toString());
app.run();
