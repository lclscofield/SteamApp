Component({
    options: {
        styleIsolation: 'apply-shared' // 样式隔离选项
    },
    // 这里定义了组件属性，属性值可以在组件使用时指定
    properties: {
        gameListWrap: {
            // 游戏列表，二维数组，里面的数组才是真实数据
            type: Array,
            value: []
        },
        page: {
            type: Number,
            value: 0
        },
        showEnd: {
            type: Boolean,
            value: false
        }
    },

    data: {
        showLoading: false
    },

    observers: {
        page: function() {
            this.setData({
                showLoading: false
            })
        }
    },

    lifetimes: {
        ready() {
            // 在组件实例进入页面节点树时执行
            console.log(this.data)
        }
    },

    methods: {
        // 更新列表数据
        updateGameList() {
            const { page, showEnd } = this.data
            if (showEnd) return

            if (page > 0) {
                this.setData({
                    showLoading: true
                })
            }
            this.triggerEvent('update')
        },

        // 跳转详情页
        goDetail(e) {
            const gId = e.currentTarget.id
            wx.navigateTo({
                url: '/pages/detail/index?gId=' + gId
            })
        }
    }
})
