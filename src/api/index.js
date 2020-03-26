// 小程序端数据库操作
const db = wx.cloud.database()
// 获取应用实例
const app = getApp()

module.exports = {
    /**
     * 登录
     *
     * @param {object} userInfo
     */
    async login(userInfo) {
        // 从缓存获取用户信息
        // wx.removeStorageSync('userInfo')
        // const userInfo = wx.getStorageSync('userInfo')

        try {
            // 获取用户 openId
            const res = await wx.cloud.callFunction({
                name: 'login'
            })
            if (res && res.result) {
                const openId = res.result
                const users = db.collection('users')

                // 从数据库读取用户信息，不存在则新增
                let doc = (
                    await users
                        .where({
                            _openid: openId
                        })
                        .get()
                ).data[0]

                // userInfo 参数存在时才是用户登录，新增用户
                if (!doc && userInfo) {
                    const resAdd = await users.add({
                        data: {
                            ...userInfo
                        }
                    })
                    doc = (await users.doc(resAdd._id).get()).data
                    console.log(doc)
                }
                app.globalData.userInfo = doc || null
                return doc
            }
        } catch (err) {
            console.error(err)
        }
    }
}
