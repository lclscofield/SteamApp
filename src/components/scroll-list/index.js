Component({
    // 这里定义了组件属性，属性值可以在组件使用时指定
    properties: {
        gameList: {
            // 游戏列表
            type: Array,
            value: []
        },
        page: {
            // 页数
            type: Number,
            value: 1
        }
    },

    methods: {
        updateGameList() {
            this.triggerEvent('update')
        }
    }
})
