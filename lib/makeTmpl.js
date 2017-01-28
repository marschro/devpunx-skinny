'use strict'

const async = require('async')
const path  = require('path')
const fs    = require('fs')

module.exports = function(template) {

    let self          = this
    let name          = template || 'default'
    let templatePath  = path.join(self.tmplDir, name + self.tmplExt)

    if (self.tmplDir) {
        checkIfDirectoryExists(self.tmplDir, function(isDirectory){
            if (isDirectory) {
                checkIfTemplateExists(templatePath, function(exists){
                    if (!exists) {
                        createTemplate(templatePath)
                    }
                })
            }
        })
    }


    function checkIfDirectoryExists(directory, callback) {
        fs.stat(directory, function(err, stats) {
            if (err) {
                throw ('Template directory does not exist')
                callback(false)
            }
            else {
                if (stats.isDirectory()) callback(true)
            }
        })
    }

    function checkIfTemplateExists(file, callback) {
        fs.stat(file, function(err, stats) {
            if (err) {
                callback(false)
            }
            else {
                if (stats.isFile()) callback(true)
            }
        })
    }

    function createTemplate(file) {
        let templateName = file.split('/').pop()
        let info =
            `p As the template for this page did not exist, skinny created this template for you.
            p The template resides under ${templatePath}. Please edit the template for your needs.`
        let content = `h1 Edit template ${templateName}\n${info}`
        fs.writeFile(file, content, function (err) {
            if (err) throw err
        })
    }
}