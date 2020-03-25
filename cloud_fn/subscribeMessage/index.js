// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        const result = await cloud.openapi.subscribeMessage.send({
            touser: 'OPENID', // 用户 openId
            templateId: '0kqDNlU7yT_zzvoiX_Q5-UTdfVgLEvovD0RUTBdpDmY', // 模板 id
            page: 'detail', // 点击详情跳转页面
            data: {},
            miniprogramState: 'developer'
        })
        console.log(result)
        return result
    } catch (err) {
        console.log(err)
        return err
    }
}
