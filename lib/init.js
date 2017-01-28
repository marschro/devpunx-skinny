'use strict'

const async = require('async')
const path  = require('path')

module.exports = function(arr){

    let predefined  = ['meta', 'content', 'root']
    let excludes    = arr ? predefined.concat(arr) : predefined
    let self        = this
    let i           = 0
    let tmp         = {}


    intitialize(self.datastruct, 0)

    function intitialize(obj, parentId) {
        i++
        async.forEachOfLimit(Object.keys(obj), 1, function(site, key, callback) {

            let isSite = excludes.indexOf(site) === -1

            if (site === 'root') {
                let alias = obj[site].meta && obj[site].meta.alias
                    ? obj[site].meta.alias
                    : 'Home'
                tmp[100] = { name:alias, href:'/', parentId:0, sub:{} }
                let data = JSON.parse(JSON.stringify(obj[site]))
                let template = data.meta && data.meta.template || 'default'
                self.makeTmpl(template)
                self.router.get('/', function(req, res) {
                    self.updateNav('/', function(err, navigation){
                        data.nav = navigation
                        res.render(template, data, function(err, html) {
                            if (err) throw new Error('This is serious!')
                            else res.send(html)
                        })
                    })
                })
            }

            if (isSite) {
                let alias = obj[site].meta && obj[site].meta.alias
                    ? obj[site].meta.alias
                    : site
                let hidden = obj[site].meta && obj[site].meta.hidden
                    ? true
                    : false
                let url = parentId
                    ? path.join(tmp[parentId].href, site)
                    : path.join('/', site)
                let id = parentId +''+ i*10 + key

                if (!hidden) tmp[id] = { id: id, name:alias, href:url, parentId:parentId, sub:{} }
                let data = JSON.parse(JSON.stringify(obj[site]))
                let template = data.meta && data.meta.template || 'default'
                self.makeTmpl(template)
                self.router.get(url, function(req, res) {
                    self.updateNav(url, function(err, navigation){
                        data.nav = navigation
                        res.render(template, data, function(err, html) {
                            if (err) throw new Error('This is serious!')
                            else res.send(html)
                        })
                    })
                })

                intitialize(obj[site], id)
                callback(null)
            }
            else callback(null)
        }, function(err){
            if (err) callback(err)
            i--
            if (i === 0) {
                buildNavigationObject(tmp)
            }
        })
    }

    function buildNavigationObject(obj) {
        for (let i in obj) {
            let myParent = obj[i].parentId
            if (myParent === 0) self.navigation[i] = obj[i]
            if (myParent !== 0) findParentAndInsert(self.navigation, myParent)

            function findParentAndInsert(level, pid) {
                for (let id in level) {
                    if (id === pid) {
                        level[id].sub[i] = obj[i]
                    }
                    if (level[id].sub) findParentAndInsert(level[id].sub, pid)
                }
            }
        }
    }
}

