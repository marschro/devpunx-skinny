'use strict'

let express     = require('express');
let path        = require('path');
let router      = express.Router();

/*
  Configurables:
  {
    file: path.join(__dirname, 'website'),
    tmplDir: path.join(__dirname, 'views'),
    tmplExt: '.pug' || '.jade'
  }
*/

class Builder {
    constructor(obj) {
        this.router = router;
        this.data
        this.datastruct = obj.file
            ? JSON.parse(JSON.stringify(require(obj.file)))
            : !function(){throw new Error("Structure-File not defined")}()
        this.tmplDir    = obj.tmplDir || path.join(process.cwd(), 'views')
        this.tmplExt   = obj.tmplExt || '.pug'
        this.navigation = {}
    }
}

Builder.prototype.init        = require('./lib/init')
Builder.prototype.updateNav   = require('./lib/updateNav')
Builder.prototype.makeTmpl    = require('./lib/makeTmpl')


module.exports = {
    builder:  Builder,
    router:   router
};