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
        title: '最新折扣',
        type: 'discount'
    },
    {
        title: '热门游戏',
        type: 'hot'
    },
    {
        title: '近期新品',
        type: 'new'
    }
]

Page({
    data: {
        tabs: [], // tab 数据
        activeTab: 0, // 当前 tab
        pages: [], // 各 tab 的页码
        showEndList: [], // 控制 tab 是否加载完毕
        gameListData: [] // 列表数据
    },

    async onLoad() {
        // 初始化
        const tabs = [],
            pages = [],
            showEndList = [],
            gameListData = []
        list.forEach(item => {
            pages.push(0)
            showEndList.push(false)
            tabs.push({
                title: item.title,
                type: item.type
            })
            gameListData.push([])
        })
        this.setData({ tabs, pages, showEndList, gameListData })

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
        // 根据当前类型获取对应数据
        console.log(type, page + 1)
        res = await db.fetchGameListDiscount(type, page + 1)

        if (res) {
            if (res.length < 20) {
                // 判断数据是否加载完
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
