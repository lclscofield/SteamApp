module.exports = {
    /**
     * 登录
     * @param { param: { userInfo: {} } }
     */
    login(param) {
        return wx.cloud.callFunction({
            name: 'login',
            data: param || {
                userInfo: null
            }
        })
    }
}
