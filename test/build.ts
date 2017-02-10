import * as chai from "chai";
let expect = chai.expect;

import * as mocha from "mocha";

import * as child_process from "child_process";
let execSync = child_process.execSync;

import * as fs from "fs";

describe("Gulp build", () => {
    it("test.md with page.hbs to test.html", ()=> {
        execSync("gulp compile");
        let result = fs.readFileSync("_compiled/test.html", "utf8");
        let norm = fs.readFileSync("test/dataset/test.html", "utf8");
        expect(result).to.equal(norm);
    });
});

