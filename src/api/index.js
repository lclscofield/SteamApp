module.exports = {
    /**
     * 登录
     * @param { param: { userInfo: {} } }
     */
    async login(param) {
        // 从缓存获取用户信息
        // wx.removeStorageSync('userInfo')
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            return userInfo
        } else {
            // 登录获取用户信息
            const res = await wx.cloud.callFunction({
                name: 'login',
                data: param || {
                    userInfo: null
                }
            })
            if (res && res.result) {
                // 写入缓存
                wx.setStorageSync('userInfo', res.result)
                return res.result
            }
        }
    }
}
