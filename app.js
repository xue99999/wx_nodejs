const Koa = require('koa')

const wechat = require('./wechat/g')

const app = new Koa()

const config = {
    wechat: {
        appID: 'wxfce84cd0de696efa',
        appSecret: 'c5e5a0064b97b32fd85c36edecf4af52',
        token: 'xuejun123',
    }
}

app.use(wechat(config.wechat))

app.listen(3000)
console.log('listen at 3000')

