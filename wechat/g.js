const sha1 = require('sha1')

module.exports = function (opts) {
    return function * (next) {
        console.log(this.query)
        const token = opts.token
        const signature = this.query.signature
        const timestamp = this.query.timestamp
        const nonce = this.query.nonce
        const echostr = this.query.echostr
    
        const str = [token, timestamp, nonce].sort().join('')
    
        const sha = sha1(str)
    
        if (sha === signature) {
            this.body = echostr + ''
        } else {
            this.body = 'wrong'
        }
    }
}