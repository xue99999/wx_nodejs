const Koa = require('koa')
const sha1 = require('sha1')

const app = new Koa()

const config = {
    wechat: {
        appID: 'wxfce84cd0de696efa',
        appSecret: 'c5e5a0064b97b32fd85c36edecf4af52',
        Token: 'xuejun123',
    }
}

app.use(function *(next) {
    console.log(this.query)
    const signature = this.query.signature
    const timestamp = this.query.timestamp
    const nonce = this.query.nonce
    const echostr = this.query.echostr
    const token = config.wechat.Token

    const str = [token, timestamp, nonce].sort().join('')

    const sha = sha1(str)

    if (sha === signature) {
        this.body = echostr + ''
    } else {
        this.body = 'wrong'
    }
})

app.listen(3000)
console.log('listen at 3000')

