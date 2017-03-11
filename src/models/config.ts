export class Config {
    get rootSrc(): string {
        return this._rootSrc;
    }

    set rootSrc(value: string) {
        this._rootSrc = value;
    }
    private _src: string;
    private _destination: string;
    private _templateLocation: string;
    private _watch : boolean;
    private _pdfConfig: Object;
    private _configFileLocation: string;
    private _rootSrc: string;


    constructor(
        src?: string,
        dest?: string,
        templateLocation?: string,
        watch?: boolean,
        pdfConfig?: Object,
        configFileLocation?: string
    ) {
        this._src = src || './_toCompile/';
        this._destination = dest || './_compiled';
        this._templateLocation = templateLocation || './_templates';
        this._watch = watch || false;
        this._pdfConfig = pdfConfig || {"format": "A4"};
        this._configFileLocation = configFileLocation || "shapeshifter.config.js";
    }

    static getDefault():Config {
        return new Config();
    }

    get src() {
        return this._src;
    }

    set src(value:string) {
        this._src = value;
    }

    get destination() {
        return this._destination;
    }

    set destination(value:string) {
        this._destination = value;
    }

    get templateLocation() {
        return this._templateLocation;
    }

    set templateLocation(value:string) {
        this._templateLocation = value;
    }

    get pdfConfig() {
        return this._pdfConfig;
    }

    set pdfConfig(value) {
        this._pdfConfig = value;
    }


    get watch(): boolean {
        return this._watch;
    }

    set watch(value: boolean) {
        this._watch = value;
    }

    get configFileLocation(): string {
        return this._configFileLocation;
    }

    set configFileLocation(value: string) {
        this._configFileLocation = value;
    }
}