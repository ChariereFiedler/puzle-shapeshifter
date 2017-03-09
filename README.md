# Puzle Shapeshifter

## About

With **Shapesifter**, merge markdown documents, handlebars templates and 
static html themes into static html files and / or pdf documents.

The tool is currently usable in state.

We work hard to provide you soon lot of cool features.
Do not hesitate to share your remarks or issues in [dedicated channel](https://github.com/ChariereFiedler/puzle-shapeshifter/issues).

## License

MIT

## Roadmap

- ~~Generate HTML files from gulp tasks~~
- ~~CLI support~~
- ~~Add default theme~~
- ~~ToPdf option~~
- Add options to select export
    - To PDF
    - To Html
- ~~Add custom options with dedicated config file per project~~
- Add a CLI command to init a config file
- Add custom options with dedicated config file per folder
- Fix issues:
    - PhantomJS Font Face support: not working yet
- Add themes support
- Add themes :
    - Reveal.JS
    - HTML5 Wrapper...
- Add plugins support

## Prerequisites

- Node > 6.2
- Npm
- Gulp

## Install

### Using as CLI tool

    $npm i -g puzle-shapeshifter

### Development

Install vendors

    $npm install

Install global tools

    $npm run installGlobal

## Test

Running tests

    $npm test

## Usage

Shapeshifter is provided as binary.

The application takes all documents in the source folder and
compiles them into a dist folder.

Shapeshifter can be executed like so :

    shapeshifter [options]

### CLI Options

- `-h`, `--help`        output usage information
- `-V`, `--version`     output the version number
- `-s`, `--src <item>`  the markdown files location, `_toCompile` by default
- `-d`, `--destination <item>` the generation destination, `_compiled` by default
- `-t`, `--templates <item>`    the templates location, `_templates` by default

### Use a config file

You can use a config file to define the compilation options.

First, create a `shapeshifter.config.js` file at your root project directory with
this structure :
```javascript
module.exports = {
    src:  './_toCompile/',
    dest: './_compiled2',
    templateLocation: './_templates',
    pdfConfig: {"format": "A3",
        "border": {
            "top": "25mm",            // default is 0, units: mm, cm, in, px
            "right": "20mm",
            "bottom": "15mm",
            "left": "20mm"
        }}
};
```

#### The config file options:

```javascript
module.exports = {
    src:  '',   // the markdown files location, `_toCompile` by default
    dest: '',   // the generation destination, `_compiled` by default
    templateLocation: '', // the templates location, `_templates` by default
    pdfConfig: {} // the pdf compilation options, see https://github.com/marcbachmann/node-html-pdf#options
};
```

For the pdf options, see the [node-html-pdf documentation](https://github.com/marcbachmann/node-html-pdf#options).

The config file override the default options.

**Warning** : the options given as command arguments override these defined in the 
config file.


## Create a template

The template are located by default in the `_templates` folder.
They follow the `handlebars` format.

- See [HandlebarsJS](http://handlebarsjs.com/)

In your template, you can add variables which be replaced
during compilation step. 

The frontmatter variables are prefixed
by `data.*` expression.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>{{data.title}}</title>
</head>
<body>

    <header>I'm the Header</header>
    <div>{{data.title}}</div>
    <div>{{{data.randomvar}}}</div>
    <article>I'm the article

        {{{content}}}

    </article>
</body>
</html>
```
        
The `content` variable define the **markdown document body**. 

The other variables are linked to the **markdown frontmatter**.

You are free to create variables you need. 

## Create a compilable document

The compilable documents are located in the `_toCompile` folders by default.

The frontmatter variable `template` is required. Define here
the template file used during the compilation step, without the `*.hbs` 
suffix.

Do not forget to add all frontmatter variables used by the template you
have defined.

Example:

```markdown
    ---
    title: I'm the title
    author: Cédric Charière Fiedler
    template: page
    randomvar: random
    ---
    
    ## I'm a title !
    
    **I'm Bold**
```