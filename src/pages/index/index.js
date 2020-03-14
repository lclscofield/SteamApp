//index.js
const app = getApp()

Page({
    data: {
        tabs: [],
        activeTab: 0
    },

    onLoad() {
        const titles = ['折扣', '热门']
        const tabs = titles.map(item => ({ title: item }))
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
