const db = require('../../db/index')

Page({
    data: {
        detail: {} // 游戏详情
    },

    async onLoad(query) {
        console.log(query)
        const { gId } = query
        const res = await db.fetchGameDetail(gId)
    }
})
