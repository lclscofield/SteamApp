const db = require('../../db/index')

Page({
    data: {
        detail: {}, // 游戏详情
        currentImg: '' // 当前主图
    },

    async onLoad(query) {
        console.log(query)
        const { gId } = query
        const res = await db.fetchGameDetail(gId)
        if (res) {
            this.setData({
                detail: res
            })
            wx.setNavigationBarTitle({
                title: res.appName || '详情'
            })
            this.init()
        }
    },

    // 初始化
    init() {
        
    }
})
