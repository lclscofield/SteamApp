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
                return item === this.data.detail._id
            })
            this.setData({
                isSubscribe
            })
        }
    },

    // 订阅
    subscribeMessage() {
        const userInfo = app.globalData.userInfo
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
                success: res => {
                    console.log(res)
                    this.setData({
                        isSubscribe: true
                    })
                }
            })
        } else {
            this.setData({
                isSubscribe: false
            })
        }
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
