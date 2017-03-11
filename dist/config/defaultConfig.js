"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    src: './_toCompile/',
    dest: './_compiled',
    templateLocation: './_templates',
    pdfConfig: { "format": "A4",
        watch: false,
        "border": {
            "top": "25mm",
            "right": "20mm",
            "bottom": "15mm",
            "left": "20mm"
        } }
};
