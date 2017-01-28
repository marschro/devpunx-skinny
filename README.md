# ABOUT
Skinny is a helper for express.js applications. Skinny builds a virtual express router based on a described structure of a website.
Skinny automatically builds a navigation and a breadcrumb object, that can be used in the template

Skinny currently works best with pug templates.

# INSTALL
```bash
npm install devpunx-skinny --save
```
# USE
You have to use express.js on order to work with Skinny.
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
    anotherPage: {
        meta: {},
        content: {
            h1: 'My other Page',
            article: 'welcome on this site',
            foo: "Bar"
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
* Every node must have a **content** object. You are free to define the property names. The properties can be directly accessed in the templates by their name. (**Do not use the reserved words root, meta or content !!!**)
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
