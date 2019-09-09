const path = require('path')
const Koa = require('koa')

const wechat = require('./wechat/g')
const util = require('./libs/util')
const wechat_file = path.join(__dirname, './config/wechat.txt')

const app = new Koa()

const config = {
    wechat: {
        appID: 'wxfce84cd0de696efa',
        appSecret: 'c5e5a0064b97b32fd85c36edecf4af52',
        token: 'xuejun123',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file, 'utf8')
        },
        saveAccessToken: function (data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file, data)
        }
    }
}

app.use(wechat(config.wechat))

app.listen(3000)
console.log('listen at 3000')

