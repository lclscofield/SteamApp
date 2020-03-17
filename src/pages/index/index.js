//index.js
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
        tabs: [],
        activeTab: 0,
        page: 1,
        limit: 25
    },

    async onLoad() {
        const { page, limit } = this.data
        const db = wx.cloud.database()
        const res = await db
            .collection('gameListAll')
            .skip(10 * (page - 1)) // 跳过结果集中的前 10 条，从第 11 条开始返回
            .limit(limit) // 限制返回数量为 10 条
            .get()
        console.log(res)

        const tabs = list.map(item => {
            return {
                title: item.title,
                type: item.type,
                list: res.data
            }
        })
        this.setData({ tabs })
    },

    onTabCLick(e) {
        const index = e.detail.index
        this.setData({ activeTab: index })
    },

    onChange(e) {
        const index = e.detail.index
        this.setData({ activeTab: index })
    },

    onUpdateGameList (e) {
        console.log(222, e)
    }
})
