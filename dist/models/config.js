"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    get rootSrc() {
        return this._rootSrc;
    }
    set rootSrc(value) {
        this._rootSrc = value;
    }
    constructor(src, dest, templateLocation, watch, pdfConfig, configFileLocation) {
        this._src = src || './_toCompile/';
        this._destination = dest || './_compiled';
        this._templateLocation = templateLocation || './_templates';
        this._watch = watch || false;
        this._pdfConfig = pdfConfig || { "format": "A4" };
        this._configFileLocation = configFileLocation || "shapeshifter.config.js";
    }
    static getDefault() {
        return new Config();
    }
    get src() {
        return this._src;
    }
    set src(value) {
        this._src = value;
    }
    get destination() {
        return this._destination;
    }
    set destination(value) {
        this._destination = value;
    }
    get templateLocation() {
        return this._templateLocation;
    }
    set templateLocation(value) {
        this._templateLocation = value;
    }
    get pdfConfig() {
        return this._pdfConfig;
    }
    set pdfConfig(value) {
        this._pdfConfig = value;
    }
    get watch() {
        return this._watch;
    }
    set watch(value) {
        this._watch = value;
    }
    get configFileLocation() {
        return this._configFileLocation;
    }
    set configFileLocation(value) {
        this._configFileLocation = value;
    }
}
exports.Config = Config;
