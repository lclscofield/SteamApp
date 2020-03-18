Component({
    // 这里定义了组件属性，属性值可以在组件使用时指定
    properties: {
        gameListWrap: {
            // 游戏列表，二维数组，里面的数组才是真实数据
            type: Array,
            value: []
        },
        tabIdx: {
            type: Number,
            value: 0
        }
    },

    lifetimes: {
        ready: function() {
            // 在组件实例进入页面节点树时执行
            console.log(this.data)
        }
    },

    methods: {
        updateGameList() {
            this.triggerEvent('update')
        }
    }
})
