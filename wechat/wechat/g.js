const sha1 = require('sha1')    
var getRawBody = require('raw-body')
var util = require('./util')

var Wechat = require('./wechat')


module.exports = function (opts, handle) {
    var wechat = new Wechat(opts)

    return function * (next) {
        var that = this
        const token = opts.token
        const signature = this.query.signature
        const timestamp = this.query.timestamp
        const nonce = this.query.nonce
        const echostr = this.query.echostr
    
        const str = [token, timestamp, nonce].sort().join('')
    
        const sha = sha1(str)

        if (this.mothod === 'GET') {
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'wrong'
            }
        } else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong'
                return false
            }

            let data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })

            var content = yield util.parseXMLAsync(data)

            console.log(content)

            var message = util.formatMessage(content.xml)
            console.log('---message---')
            console.log(message)

            this.weixin = message

            yield handle.call(this, next)

            wechat.reply.call(this)
        }
    }
}