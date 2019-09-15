var xml2js = require('xml2js')
var Promise = require('bluebird')
var tpl = require('./tpl')

var parser = new xml2js.Parser()

exports.parseXMLAsync = function (data) {
    return new Promise(function (resolve, reject) {
        parser.parseString(data, function (err, content) {
            if (err) reject(err)
            else resolve(content)
        })
    })
}

function formatMessage(data) {
    var message = {}

    if (typeof data === 'object') {
        var keys = Object.keys(data)

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]
            var item = data[key]

            if (item.length === 0 || !(item instanceof Array)) {
                continue
            } 

            if (item.length === 1) {
                var val = item[0]

                if (typeof val === 'object') {
                    message[key] = formatMessage(val)
                } else {
                    message[key] = val.trim()
                }
            } else {
                // item长度既不是0，也不是1， 说明是数组
                message[key] = []

                for (var j = 0; j < item.length; j ++) {
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    }

    return message
}

exports.formatMessage = formatMessage

exports.tpl = function(content, message) {
    var info = {}
    var type = 'text'
    var toUserName = message.ToUserName
    var fromUserName = message.FromUserName

    // 数组格式，属于图文消息
    if (Array.isArray(content)) {
        type = 'news'
    }

    type = content.type || type
    info.content = content
    info.toUserName = fromUserName
    info.fromUserName = toUserName
    info.createTime = new Date().getTime()
    info.msgType = type

    return tpl.compile(info)
}