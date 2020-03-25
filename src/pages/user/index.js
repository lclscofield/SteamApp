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
            const fetchRes = await api.login({ userInfo })
            // 登录获取用户信息
            if (fetchRes) {
                app.globalData.userInfo = fetchRes
                this.setData({
                    userInfo: fetchRes,
                    login: true
                })
            }
        }
    },

    // 订阅
    subscribeMessage() {
        wx.requestSubscribeMessage({
            tmplIds: ['0kqDNlU7yT_zzvoiX_Q5-UTdfVgLEvovD0RUTBdpDmY'],
            success(res) {
                console.log(res)
            }
        })
    }
})
