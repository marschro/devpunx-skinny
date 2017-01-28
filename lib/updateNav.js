'use strict'

var async = require('async')

module.exports = function(path, callback){

    var self = this
    let i = 0
    let breadcrumbs = []

    findAndUpdate(self.navigation, path)

    function findAndUpdate(obj, path) {
        i++
        async.each(obj, function(item, callback) {
            item.status = item.href === path
                ? 'active'
                : 'inactive'

            if (item.href === path) {
                breadcrumbs.push({
                    name:item.name,
                    href:item.href,
                    current:true
                })
            }

            let parents = path.split('/')
            parents.unshift('')
            parents.splice(0, 1)
            let pUrls = []
            for (let c = parents.length-1; c >= 1; c--) {
                if (c > 1) {
                    let tmp = JSON.parse(JSON.stringify(parents))
                    pUrls.push(tmp.splice(0, c).join('/'))
                }
                else proceed()
            }

            function proceed() {
                let isParent = pUrls.indexOf(item.href) !== -1
                    ? pUrls.indexOf(item.href)
                    : false

                item.status = isParent !== false
                    ? 'active-path'
                    : item.status

                if (isParent !== false) {
                    breadcrumbs.push({name:item.name, href:item.href})
                }

                if (item.sub) {
                    findAndUpdate(item.sub, path)
                    callback(null)
                }
            }
        }, function(err) {
            if (err) callback(err, null)
            i--
            if (i === 0) {
                callback(null, {menu:obj, breadcrumbs:breadcrumbs})
            }
        })
    }
}