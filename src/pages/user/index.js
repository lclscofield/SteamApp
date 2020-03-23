const api = require('../../api/index')

//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {},
        login: true
    },

    // 页面加载
    onLoad() {
        const userInfo = app.globalData.userInfo
        if (userInfo) {
            this.setData({
                userInfo
            })
        } else {
            this.setData({
                login: false
            })
        }
    },

    // 登录
    async login(res) {
        const userInfo = res.detail.userInfo
        if (userInfo) {
            const res = await api.login({ userInfo })
            if (res && res.result) {
                // 登录获取用户信息
                app.globalData.userInfo = res.result
                this.setData({
                    userInfo: res.result,
                    login: true
                })
            }
        }
    }
})
