// 小程序端数据库操作
const db = wx.cloud.database()
// 获取应用实例
const app = getApp()

module.exports = {
    /**
     * 获取列表数据
     * @param {string} type - 列表类型
     * @param {string} page - 页数
     * @param {number} limit - 每页多少条，默认 20
     */
    async fetchGameList(type, page, limit = 20) {
        try {
            const res = await db
                .collection(type)
                .skip(limit * (page - 1)) // 跳过结果集中的前 xx 条，从第 xx + 1 条开始返回
                .limit(limit) // 限制返回数量为 xx 条
                .get()
            if (!res || !res.data) return null
            return res.data
        } catch (err) {
            console.error(err)
        }
    },

    /**
     * 获取详情数据
     * @param {string} gId - gId
     */
    async fetchGameDetail(gId) {
        try {
            const res = await db
                .collection('details')
                .where({
                    gId
                })
                .get()
            if (!res || !res.data || !res.data[0]) return null
            return res.data[0]
        } catch (err) {
            console.error(err)
        }
    },

    /**
     * 获取全局配置
     */
    async fetchConfig() {
        try {
            const res = await db.collection('config').get()
            if (!res || !res.data || !res.data[0]) return null
            return res.data[0]
        } catch (err) {
            console.error(err)
        }
    },

    /**
     * 获取订阅列表
     */
    async fetchSubscribeList() {
        const { userInfo } = app.globalData
        if (!userInfo) return

        try {
            const res = await db
                .collection('send')
                .where({
                    _openid: userInfo._id
                })
                .get()
            console.log(res)
            if (res.errMsg === 'collection.get:ok' && Array.isArray(res.data)) {
                app.globalData.subscribeList = res.data
            }
        } catch (err) {
            console.error(err)
        }
    },

    /**
     * 用户订阅状态更新
     * @param {string} userId - 用户 _id
     * @param {boolean} bool - 订阅状态，true => 要订阅，false => 要取消
     * @param {object} detail - 订阅游戏详情
     */
    async fetchUpdateSubscribeList(userId, bool, detail) {
        try {
            const _ = db.command
            if (bool) {
                // 添加订阅
                let data = {
                    gameId: detail._id,
                    title: detail.appName
                }
                await db.collection('send').add({ data })
                app.globalData.subscribeList.push(data)
            } else {
                // 取消订阅
                // 先查后删
                const res = await db
                    .collection('send')
                    .where({
                        _openid: userId,
                        gameId: detail._id
                    })
                    .get()
                const doc = res.data[0]
                await db
                    .collection('send')
                    .doc(doc._id)
                    .remove()
                const idx = app.globalData.subscribeList.findIndex(item => {
                    return item.userId === userId && item.gameId === detail._id
                })

                if (idx > -1) {
                    app.globalData.subscribeList.splice(idx, 1)
                }
            }
            wx.showToast({
                title: `${bool ? '' : '取消'}订阅成功`,
                icon: 'success',
                duration: 2000
            })
            return true
        } catch (err) {
            console.error(err)
        }
    }
}
