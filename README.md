# Shapeshifter

## About

Generate easily html file from markdown document and handlebars
templates.

## Prerequisites

- Node > 6.2
- Npm
- Gulp

## Install

Install vendors

    $npm install

## Usage

The application takes all documents in the `_toCompile` folder and 
compiles them into the `dist` folder.

### Create a template

The template are located in the `_templates` folder.
They follow the `handlebars` format.

- See [HandlebarsJS](http://handlebarsjs.com/)

In your template, you can add variables which be replaced
during compilation step. The frontmatter variables are prefixed
by `data.*` expression.
    
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
        
The `content` variable define the **markdown document body**. 

The other variables are linked to the **markdown frontmatter**.

You are free to create variables you need. 
 

    

### Create a compilable document

The compilable documents are located in the `_toCompile` folders.

The needed frontmatter variable `template` is required. Define here
the template file used during the compilation step, without the `*.hbs` 
suffix.

Do not forget to add all frontmatter variables used by the template you
have defined.

Example:

    ---
    title: I'm the title
    author: Cédric Charière Fiedler
    template: page
    randomvar: random
    ---
    
    ## I'm a title !
    
    **I'm Bold**


### Build the documents

Open a console at project root

    $gulp
    
or

    $gulp build

### Clean the build

Open a console at project root

    $gulp clean