//index.js
const db = require('../../db/index')
const app = getApp()

const exp = {
    imgHeaderUrl: 'https://media.st.dl.eccdnx.com/steam/apps/359550/header.jpg',
    title: "Tom Clancy's Rainbow Six® Siege",
    url: 'https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/',
    gId: '359550',
    released: '2015年12月1日',
    review: 'positive',
    sys: ['win', 'mac', 'linux'],
    discount: 60,
    price: 88,
    strike: 35
}

const list = [
    {
        title: '实时优惠',
        type: 'discount'
    },
    {
        title: '最热游戏',
        type: 'hot'
    },
    {
        title: '热门新品',
        type: 'new'
    }
]

Page({
    data: {
        tabs: [], // tab 数据
        activeTab: 0, // 当前 tab
        pages: [0, 0, 0],
        gameListData: [], // 列表数据
        showEndList: [false, false, false]
    },

    async onLoad() {
        // 初始化
        const tabs = list.map(item => {
            return {
                title: item.title,
                type: item.type,
                list: []
            }
        })
        this.setData({ tabs })

        this.onUpdateGameList()
    },

    onTabCLick(e) {
        this.setActiveTab(e.detail.index)
    },

    onChange(e) {
        this.setActiveTab(e.detail.index)
    },

    // 设置激活的 tab
    setActiveTab(idx) {
        const { pages } = this.data
        const page = pages[idx]

        this.setData({ activeTab: idx })
        if (page === 0) {
            this.onUpdateGameList()
        }
    },

    // 更新数据
    async onUpdateGameList() {
        const { tabs, activeTab, pages, showEndList } = this.data
        const { type } = tabs[activeTab]
        const page = pages[activeTab]
        const showEnd = showEndList[activeTab]

        // 无数据后不再拉接口
        if (showEnd) return

        let res = null
        // if (type === 'discount') {
            res = await db.fetchGameListDiscount(page + 1)
        // }
        if (res) {
            if (res.length < 20) { // 判断数据是否加载完
                const showEndListStr = `showEndList[${activeTab}]`
                this.setData({
                    [showEndListStr]: true
                })
            }
        }
        const updateListStr = `gameListData[${activeTab}][${page}]`
        const updatePageStr = `pages[${activeTab}]`
        this.setData({
            [updateListStr]: res,
            [updatePageStr]: page + 1
        })
    }
})
