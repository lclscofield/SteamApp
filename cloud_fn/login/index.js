// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取数据库引用
const db = cloud.database()
// 获取用户引用
const users = db.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID

    const docs = (
        await users
            .where({
                openId
            })
            .get()
    ).data

    // 不存在就返回 null
    let doc = null
    if (docs && docs.length) {
        doc = docs[0]
    } else if (event.userInfo) {
        // 新建用户
        const userInfo = {
            ...event.userInfo,
            openId
        }
        const res = await users.add({
            data: userInfo
        })
        doc = (await users.doc(res._id).get()).data
    }

    return doc
}
