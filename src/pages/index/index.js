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
        gameListData: [] // 列表数据
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
        this.setData({ activeTab: idx })
    },

    // 更新数据
    async onUpdateGameList() {
        // const { test } = this.data
        // const testList = []
        // for (let i = 0; i < 20; i++) {
        //     testList.push(123)
        // }
        // const testListStr = `test[${test.length}]`
        // this.setData({
        //     [testListStr]: testList
        // })
        const { tabs, activeTab, gameListData, pages } = this.data
        const { type } = tabs[activeTab]
        const page = pages[activeTab]

        let res = null
        if (type === 'discount') {
            res = await db.fetchGameListDiscount(page + 1)
        }
        const updateList = `gameListData[${activeTab}][${page}]`
        const updatePage = `pages[${activeTab}]`
        this.setData({
            [updateList]: res,
            [updatePage]: page + 1
        })
    }
})
