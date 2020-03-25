const db = require('../../db/index')
const app = getApp()

Page({
    data: {
        detail: {}, // 游戏详情
        currentMediaIdx: 0, // 当前媒体元素
        media: [], // 媒体数据，包括图片和视频，视频在前
        isSubscribe: false, // 订阅状态
        showDialog: false // dialog 状态
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
        console.log(this.data.detail)
        const { imgs, videos } = this.data.detail
        const media = []

        const config = app.globalData.config
        if (config.showVideo) {
            videos.forEach(item => {
                media.push({
                    type: 'video',
                    src: item.src,
                    poster: item.poster
                })
            })
        }
        imgs.forEach(item => {
            media.push({
                type: 'img',
                src: item.imgMin,
                poster: item.imgMin,
                imgMax: item.imgMax
            })
        })
        this.setData({
            media
        })

        // 设置订阅状态
        this.subscribe()
    },

    // 设置订阅状态
    subscribe() {
        const userInfo = app.globalData.userInfo
        if (userInfo && userInfo.subscribe) {
            const isSubscribe = userInfo.subscribe.some(item => {
                return item.id === this.data.detail._id
            })
            this.setData({
                isSubscribe
            })
        }
    },

    // 订阅
    async subscribeMessage() {
        const userInfo = app.globalData.userInfo
        const { isSubscribe } = this.data
        // 提示去登录
        if (!userInfo) {
            this.setData({
                showDialog: true
            })
            return
        }
        if (!isSubscribe) {
            // 订阅成功后，保存数据
            wx.requestSubscribeMessage({
                tmplIds: ['0kqDNlU7yT_zzvoiX_Q5-UTdfVgLEvovD0RUTBdpDmY'],
                success: async res => {
                    console.log(res)
                    await this.switchSubscribe(true)
                }
            })
        } else {
            // 取消订阅
            await this.switchSubscribe(false)
        }
    },

    // 订阅状态变更
    async switchSubscribe(bool) {
        const userInfo = app.globalData.userInfo
        const subscribe = userInfo.subscribe || []
        const { detail } = this.data

        // 更新订阅状态，更新完成则变更状态
        if (bool) {
            subscribe.push({
                id: detail._id,
                title: detail.appName
            })
        } else {
            const idx = subscribe.findIndex(item => {
                return item.id === detail._id
            })
            if (idx === -1) return

            // 更新订阅状态，更新完成则变更状态
            subscribe.splice(idx, 1)
        }

        const isSure = await db.fetchUserSubscribe(userInfo.openId, subscribe, bool)
        isSure &&
            this.setData({
                isSubscribe: bool
            })
    },

    // 关闭 dialog
    close() {
        this.setData({
            showDialog: false
        })
    },

    // 去登录
    goUser() {
        wx.switchTab({
            url: '/pages/user/index'
        })
    },

    // 切换当前 media
    switchMedia(e) {
        console.log(e)
        const idx = e.currentTarget.id
        this.setData({
            currentMediaIdx: Number(idx)
        })
    },

    // 预览图片
    preview() {
        const { media, currentMediaIdx } = this.data
        const mediaImg = media.filter(item => {
            return item.type === 'img'
        })
        const urls = mediaImg.map(item => {
            return item.src
        })

        wx.previewImage({
            urls: urls,
            current: media[currentMediaIdx].src
        })
    }
})
