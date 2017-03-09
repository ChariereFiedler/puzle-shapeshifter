module.exports = {
    src:  './_toCompile/',
    dest: './_compiled',
    templateLocation: './_templates',
    pdfConfig: {"format": "A4",
        "border": {
            "top": "25mm",            // default is 0, units: mm, cm, in, px
            "right": "20mm",
            "bottom": "15mm",
            "left": "20mm"
        }}
};