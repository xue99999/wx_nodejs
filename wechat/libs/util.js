var fs = require('fs')
var Promise = require('bluebird')

exports.readFileAsync = function(fpath, encoding) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fpath, {encoding: encoding}, function(err, data) {
            if (err) reject(err)
            else resolve(data)
        })
    })
}


exports.writeFileAsync = function(fpath, data) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, data, function (err) {
            if (err) reject(err)
            else resolve()
        })
    })
}
