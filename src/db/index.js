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
     * @param {string} userId - 用户 openId
     * @param {string} subscribe - 订阅列表
     * @param {boolean} bool - 订阅状态，true => 要订阅，false => 要取消
     * @param {object} detail - 订阅游戏详情
     */
    async fetchUserSubscribe(userId, subscribe, bool, detail) {
        const _ = db.command
        try {
            // 更新用户订阅记录
            const res = await db
                .collection('users')
                .where({
                    openId: userId
                })
                .update({
                    data: {
                        subscribe: _.set(subscribe)
                    }
                })
            console.log('res', res)

            // 向订阅数据库添加记录或更新状态
            const resSend = await db
                .collection('send')
                .where({
                    userId: userId,
                    gameId: detail._id
                })
                .get()
            let isSure = false
            console.log('resSend', resSend)
            if (resSend && resSend.data) {
                if (resSend.data[0]) {
                    // 有数据则更新
                    const resUpdate = await db
                        .collection('send')
                        .where({
                            userId: userId,
                            gameId: detail._id
                        })
                        .update({
                            data: {
                                done: !bool // 判断是否已经订阅完成的字段，也可能是订阅取消
                            }
                        })
                    console.log('resUpdate', resUpdate)
                    if (resUpdate.errMsg === 'collection.update:ok') {
                        isSure = true
                    }
                } else {
                    // 无数据则添加
                    const resAdd = await db.collection('send').add({
                        data: {
                            userId: userId,
                            gameId: detail._id,
                            title: detail.appName,
                            done: !bool // 判断是否已经订阅完成的字段
                        }
                    })
                    console.log('resAdd', resAdd)
                    if (resAdd.errMsg === 'collection.add:ok') {
                        isSure = true
                    }
                }
            }

            // 数据处理
            if (res.errMsg === 'collection.update:ok' && isSure) {
                app.globalData.userInfo.subscribe = subscribe
                // 写入缓存
                // wx.setStorageSync('userInfo', app.globalData.userInfo)
                wx.showToast({
                    title: `${bool ? '' : '取消'}订阅成功`,
                    icon: 'success',
                    duration: 2000
                })
                return true
            }
        } catch (err) {
            console.log(err)
        }
    }
}
