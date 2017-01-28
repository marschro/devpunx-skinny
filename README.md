# ABOUT
Skinny is a helper for express.js applications. Skinny builds a virtual express router based on a described structure of a website.
Skinny automatically builds a navigation and a breadcrumb object, that can be used in the template

Skinny currently works best with pug templates.

# INSTALL
```bash
npm install devpunx-skinny --save
```
# USE
You have to use express.js in order to work with Skinny.
Skinny does not integrate express.js for you.

Skinny has three parts:
1. **The website structure definition** - a javascript object, that defines the structure of your website
1. **The Skinny-Builder** - this builds the virtual router based on the website structure object
2. **The Skinny-Router** - this is the virtual router that can easily be integrated in your express.js app

In order to use it correctly you have to build a valid site structure first

## 1. Structure definition
```javascript
module.exports = {
    root: {
        meta: {
            title: 'My Homepage',
            description: 'This is some description',
            template: 'landing',
            alias: 'Home'
        },
        content: {
            h1: 'Hello World',
            article: 'welcome on this site',
            foo: "Bar"
        }
    },
    products: {
        meta: {
            alias: 'Another Page'
        },
        content: {
            h1: 'My other Page',
            article: 'welcome on this site',
            foo: 'lorem ipsum...'
        },
        'assorted-candy': {
            meta: {
                alias: 'Another Page'
            },
            content: {},
        },
        gummybears: {
            meta: {
                alias: 'Another Page'
            },
            content: {
                h1: 'Gummy Bears'
            },
        },
    },
    '*': {
        meta: {
            title: '404 - Not Found',
            description: 'We have not found what you were looking for',
            template : 'error',
            hidden: true
        },
        content: {
            h1: 'Sorry - 404 - not found'
        }
    }
}
```
**Important conventions:**
* It is important that your first object node has to be named **root** like in the example above.
* Every node must have a **meta** object. This node has four optional properties:
    * **title** - this can be used to define a title for the node
    * **description** - describes the node
    * **template** - this is the name of the template that shall be used for rendering the node. If the template does not exist it will be created as an empty template with the given name. If you do not define the template attribute a _"default"_ template is created and used for that node
    * **alias** - the name used in the navigation and the breadcrumb menu
    * **hidden** - the node will not show up in the navigation (exclude from navigation)
* The **content** node object is directly piped through to the templates. You are free to define the property names. The properties can be directly accessed in the templates by their name. (**Do not use the reserved words root, meta or content in the content node !!!**)
* If a node contains an object that is not named **meta** or **content**, Skinny identifies it as a new sub-page. In our example the gummybears page will have the url _/products/gummybears_.
* You can **nest pages** as much as you want. But do not forget to respect the structure in rendering the nav object (described below)
* It is useful to define the last entry as a **fallback** if the desired url was not found (as shown in the example on the last node **'*'**).


**Usage of content nodes in templates**
```javascript
// content of default.pug
h1=content.h1
p=content.article
p=content.foo
```


## 2. Build the virtual router with Skinny-Builder

``` javascript
// Require the Skinny-Builder
const Skinny = require('devpunx-skinny').builder

// Construct the virtual router  
var myWebsite = new Skinny({
    file: path.join(__dirname, 'website'),
    tmplDir: path.join(__dirname, 'views'),
    tmplExt: '.pug'
});

// initialize the virtual router
myWebsite.init()
```
Constructing the virtual router takes three properties:
* **file** - the absolute path to the structure-file as string
* **tmplDir** - the absolute path to the template directory as string
* **tmplExt** - the extension for the templates that are internally created as string

Do not forget to init the router. Initializing the router creates not only the router but even the navigation object and the breadcrumb menu
The navigation menu and the breadcrumb menu can be accessed in the templates via the _nav_ object
* nav.menu
* nav.breadcrumbs


## 3. Use the Skinny Router in your express.js app

```javascript
const skinnyRouter  = require('devpunx-skinny').router

app.use(skinnyRouter)

```

# EXAMPLE
You can checkout this example to get a more detailed view on how to use Skinny
https://github.com/marschro/devpunx-skinny-example

## Example app - skinny with express.js
```javascript
'use strict'

const http          = require('http')
const express       = require('express')
const logger        = require('morgan')
const path          = require('path')
const pug           = require('pug')
const bodyParser    = require('body-parser')
const cookieParser  = require('cookie-parser')

// Require the Skinny-Builder and Skinny-Router
const Skinny        = require('devpunx-skinny').builder
const skinnyRouter  = require('devpunx-skinny').router

// Construct a new Builder
var myWebsite = new Skinny({
  file: path.join(__dirname, 'website'),
  tmplDir: path.join(__dirname, 'views'),
  tmplExt: '.pug'
});

// Initialize Skinny - creates virtual router, menu and breadcrumb navigation
myWebsite.init()

var app = express()

// view engine setup - Skinny currently only supports .jade and .pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('port', 3000)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// use the Skinny-Router like a regular express router
app.use(skinnyRouter)


// ...run the server
let server = http.createServer(app)

server.listen(app.get('port'))
server.on('error', onError)
server.on('listening', onListening)

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }
}
function onListening() {
  let addr = server.address()
  let port = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log(`\n==> Service is up and running on ${port}`)
}
```