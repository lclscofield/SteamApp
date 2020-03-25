const db = require('../../db/index')
const app = getApp()

Page({
    data: {
        detail: {}, // 游戏详情
        currentMediaIdx: 0, // 当前媒体元素
        media: [] // 媒体数据，包括图片和视频，视频在前
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
        const { media, currentMediaIdx} = this.data
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
