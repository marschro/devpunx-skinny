'use strict'

let express     = require('express');
let path        = require('path');
let router      = express.Router();

/*
  Configurables:
  {
    tmplDir:    [absolute path to the directory],
    auth:       [some password],
    loginError: [Error message for wrong login credentials]
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
        this.auth       = obj.auth
            ? obj.auth
            : false
        this.loginError = obj.loginError || 'wrong password'
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