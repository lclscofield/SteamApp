//app.js

App({
    //全局变量
    globalData: {
        userInfo: null,
        config: {}, // app 配置
        subscribeList: [] // 订阅列表
    },
    // 程序初始化
    async onLaunch() {
        // 云环境初始化
        await wx.cloud.init({
            // dev 环境
            env: 'steam-dev-k3q3r',
            // prod 环境
            // env: 'steam-ze69m',
            traceUser: true
        })
        const api = require('./api/index')
        const db = require('./db/index')

        // 登录
        await api.login()
        console.log(this.globalData.userInfo)
        // 获取订阅列表
        if (this.globalData.userInfo) {
            await db.fetchSubscribeList()
        }

        // 获取配置
        const config = await db.fetchConfig()
        this.globalData.config = config
    }
})
