const api = require('../../api/index')

//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {},
        login: false
    },

    // 页面加载
    onLoad() {
        const userInfo = app.globalData.userInfo
        if (userInfo) {
            this.setData({
                userInfo,
                login: true
            })
        }
    },

    // 登录
    async login(res) {
        wx.showLoading({
            title: '登录中',
            mask: true
        })
        const userInfo = res.detail.userInfo
        if (userInfo) {
            this.setData({
                loging: true
            })
            // 登录获取用户信息
            const doc = await api.login(userInfo)
            if (doc) {
                this.setData({
                    userInfo: doc,
                    login: true
                })
                wx.hideLoading()
            }
        }
    }
})
