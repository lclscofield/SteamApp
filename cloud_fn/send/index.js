// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    // env: cloud.DYNAMIC_CURRENT_ENV
    env: 'steam-dev-k3q3r'
})
// 数据库
const db = cloud.database()
const MAX_LIMIT = 100

async function getAll() {
    // 先取出集合记录总数
    console.log(123)
    const countResult = await db.collection('sends').count()
    const total = countResult.total
    console.log(countResult, total)
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
        const promise = db
            .collection('sends')
            .skip(i * MAX_LIMIT)
            .limit(MAX_LIMIT)
            .get()
        tasks.push(promise)
    }
    // 等待所有
    const list = (await Promise.all(tasks)).reduce((acc, cur) => {
        return acc.concat(cur)
    }).data
    // 转换数据结构，gameId: [ _openid... ]
    const all = new Map()
    list.forEach(item => {
        const val = all.get(item.gameId) || []
        val.push(item._openid)
        all.set(item.gameId, val)
    })
    return all
}

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const all = await getAll()
        console.log(all, all.keys())
        // 循环发送订阅消息
        for (let [key, value] of all.entries()) {
            console.log(1)
            const doc = (
                await db
                    .collection('all')
                    .doc(key.replace('detail', 'list'))
                    .get()
            ).data
            console.log(doc, value)
            // 推送
            if (doc && doc.discount > 0) {
                console.log(2)
                const vLen = value.length
                for (let j = 0; j < vLen; j++) {
                    console.log(3)
                    const userId = value[j]
                    const result = await cloud.openapi.subscribeMessage.send({
                        touser: userId, // 用户 openId
                        templateId: '0kqDNlU7yT_zzvoiX_Q5-UTdfVgLEvovD0RUTBdpDmY', // 模板 id
                        page: 'pages/detail/index?gId=' + doc.gId, // 点击详情跳转页面
                        data: {
                            thing1: {
                                value: '23'
                            },
                            amount4: {
                                value: doc.price
                            },
                            amount2: {
                                value: doc.strike
                            },
                            amount6: {
                                value: doc.discount
                            },
                            thing3: {
                                value: '您关注的游戏降价啦，点击查看详情'
                            }
                        },
                        miniprogramState: 'developer'
                    })
                    console.log(result)
                }
            }
        }
    } catch (err) {
        console.log(err)
        return err
    }
}
