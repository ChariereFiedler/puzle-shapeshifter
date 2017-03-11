import * as chai from "chai";
let expect = chai.expect;

import * as mocha from "mocha";
import * as fs from "fs";
import {Shapeshifter} from "../dist/shapeshifter";

describe("Run default Shapeshifter task", () => {
    it("test.md with page.hbs to test.html", ()=> {

        new Shapeshifter().run().then(()=> {
            let result = fs.readFileSync("_compiled/test.html", "utf8");
            console.log("Result file loaded");
            let norm = fs.readFileSync("test/dataset/test.html", "utf8");
            console.log("Reference file loaded");
            expect(result).to.equal(norm);
        });

    });
});

