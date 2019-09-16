exports.reply = function *(next) {
    var message = this.weixin

    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫二维码进来：' + message.EventKey + ' ' + message.ticket)
            }

            this.body = '哈哈，你订阅了个号'
            console.log('哈哈，你订阅了个号')
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关')
            this.body = ''
        } else if (message.Event === 'SCAN') {
            console.log('SCAN', message.EventKey)
            this.body = '你扫了个码：' + message.EventKey + '  ' + message.Ticket
        } else if (message.Event === 'CLICK') {
            console.log('点击菜单拉取消息时的事件推送')
            this.body = '你点击了菜单 ' + message.EventKey
        } else if (message.Event === 'VIEW') {
            console.log('点击菜单跳转链接时的事件推送')
            this.body = '跳转链接 ' + message.EventKey
        }
    } else if (message.MsgType === 'text') {
        var content = message.Content
        var reply = '你说的 ' + content + ' 太复杂了'

        if (content === '1') {
            reply = '天下第一练武术'
        } else if (content === '2') {
            reply = '天下第二也挺好'
        } else if (content === '3') {
            reply = '天下第三爱下棋'
        }

        this.body = reply
    } else if (message.MsgType === 'location') {
        console.log('上报地理位置',message.Location_X, message.Location_Y)
        this.body = '您上报的位置是: ' + message.Location_X + '/' + message.Location_Y + '-' + message.Label
    }

    yield next
}