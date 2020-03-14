//index.js
const app = getApp()

const exp = {
    imgMin: 'https://media.st.dl.eccdnx.com/steam/apps/359550/header.jpg',
    title: "Tom Clancy's Rainbow Six® Siege",
    url: 'https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/',
    gId: '359550',
    released: '2015年12月1日',
    reviewImg: 'positive',
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
        activeTab: 0
    },

    onLoad() {
        const tabs = list.map(item => {
            return {
                title: item.title,
                type: item.type,
                list: Array(100).fill(exp)
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
    }
})
