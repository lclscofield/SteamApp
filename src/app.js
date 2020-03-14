//app.js
const api = require('./api/index')

App({
    //全局变量
    globalData: {
        userInfo: null
    },
    // 程序初始化
    async onLaunch() {
        // 云环境初始化
        wx.cloud.init({
            // dev 环境
            env: 'steam-dev-k3q3r',
            // prod 环境
            // env: 'steam-ze69m',
            traceUser: true
        })
        // login
        const res = await api.login()
        console.log(res)
        if (res && res.result) {
            // 登录获取用户信息
            this.globalData.userInfo = res.result
        }
    }
})
