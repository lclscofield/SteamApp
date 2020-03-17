// 小程序端数据库操作
const db = wx.cloud.database()

module.exports = {
    /**
     * 获取用户信息
     */
    // async fetchUserInfo() {
    //     const res = await db
    //         .collection('users')
    //         .skip(10 * (page - 1)) // 跳过结果集中的前 10 条，从第 11 条开始返回
    //         .limit(limit) // 限制返回数量为 10 条
    //         .get()
    // }

    /**
     * 获取折扣列表
     * @param {string} page - 页数
     * @param {number} limit - 每页多少条，默认 20
     */
    async fetchGameListDiscount(page, limit = 20) {
        const res = await db
            .collection('gameListAll')
            .skip(limit * (page - 1)) // 跳过结果集中的前 xx 条，从第 xx + 1 条开始返回
            .limit(limit) // 限制返回数量为 xx 条
            .get()
        if (!res || !res.data) return null
        return res.data
    }
}
