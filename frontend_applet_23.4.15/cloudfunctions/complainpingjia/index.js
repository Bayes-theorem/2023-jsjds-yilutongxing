// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event',event)
    return db.collection('complainbox').doc(event.id).update({
        data:{
            pingjiaDetail:event.pingjiaDetail,
            pingjiaLevel:event.pingjiaLevel
        }
    })
}