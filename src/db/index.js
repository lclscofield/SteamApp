// 小程序端数据库操作
const db = wx.cloud.database()

module.exports = {
    /**
     * 获取列表数据
     * @param {string} type - 列表类型
     * @param {string} page - 页数
     * @param {number} limit - 每页多少条，默认 20
     */
    async fetchGameList(type, page, limit = 20) {
        const res = await db
            .collection(type)
            .skip(limit * (page - 1)) // 跳过结果集中的前 xx 条，从第 xx + 1 条开始返回
            .limit(limit) // 限制返回数量为 xx 条
            .get()
        if (!res || !res.data) return null
        return res.data
    },

    /**
     * 获取详情数据
     * @param {string} gId - gId
     */
    async fetchGameDetail(gId) {
        const res = await db
            .collection('details')
            .where({
                gId
            })
            .get()
        if (!res || !res.data || !res.data[0]) return null
        return res.data[0]
    },

    /**
     * 获取全局配置
     */
    async fetchConfig() {
        const res = await db.collection('config').get()
        if (!res || !res.data || !res.data[0]) return null
        return res.data[0]
    },

    /**
     * 用户订阅状态更新
     */
}
