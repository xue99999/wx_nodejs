var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var util = require('./util')

const prefix = 'https://api.weixin.qq.com/cgi-bin/token'
const getAccessTokenUrl = prefix + '?grant_type=client_credential'


function Wechat(opts) {
    var that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    this.getAccessToken()
        .then(function (data) {
            console.log(data)
            try {
                data = JSON.parse(data)
            } catch {
                return that.updateAccessToken()
            }

            if (that.isValidAccessToken(data)) {
                return Promise.resolve(data)
            } else {
                return that.updateAccessToken()
            }
        })
        .then(function (data) {
            that.access_token = data.access_token
            that.expires_in = data.expires_in

            that.saveAccessToken(data)
        })
}

Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
    var access_token = data.access_token
    var expires_in = data.expires_in
    var now = new Date().getTime()

    if (now < expires_in) {
        return true
    } else {
        return false
    }
}

Wechat.prototype.updateAccessToken = function () {
    var appID = this.appID
    var secret = this.appSecret
    var url = getAccessTokenUrl + '&appid=' + appID + '&secret=' + secret

    return new Promise(function (resolve, reject) {
        request({ url: url, json: true })
            .then(function(res) {
                var data = res.body
                var now = new Date().getTime()
                var expires_in = (data.expires_in - 20) * 1000 + now
                data.expires_in = expires_in
                resolve(data)
            })
    })
}

// 通过call调用此方法, this指向了调用方法作用域
Wechat.prototype.reply = function () {
    var content = this.body
    var message = this.weixin

    this.status = 200
    this.type = 'application/xml'
    this.body = util.tpl(content, message)
}

module.exports = Wechat