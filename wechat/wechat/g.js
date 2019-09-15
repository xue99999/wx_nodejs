const sha1 = require('sha1')    
var getRawBody = require('raw-body')
var util = require('./util')

var Wechat = require('./wechat')


module.exports = function (opts) {
    // var wechat = new Wechat(opts)

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


            if (message.MsgType === 'event') {
                if (message.Event === 'subscribe') {
                    var now = new Date().getTime()

                    // 注意，这里必须用外面的that, 否则消息无法送达公众号
                    that.status = 200
                    that.type = 'application/xml'
                    that.body = '<xml>' + 
                    '<ToUserName><![CDATA[' + message.FromUserName + ']]></ToUserName>' +
                    '<FromUserName><![CDATA[' + message.ToUserName + ']]></FromUserName>' +
                    '<CreateTime>' + now + '</CreateTime>' +
                    '<MsgType><![CDATA[text]]></MsgType>' +
                    '<Content><![CDATA[Hi, 欢迎关注我的公众号!]]></Content>' +
                    '</xml>'

                    return
                }
            }

        }
    }
}