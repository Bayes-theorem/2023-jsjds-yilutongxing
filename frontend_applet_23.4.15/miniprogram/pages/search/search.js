// pages/search/search.js
var text = ''
Page({
    data: {

    },
    adduserpost_record(e) {
        var app = getApp()
        const db = wx.cloud.database()
        db.collection('userpost')
            .where({
                post_id: e.currentTarget.dataset.pid,
                user_id: app.globalData.openid
            })
            .get()
            .then(res => {
                //console.log('长度', res.data.length)
                if (res.data.length == 0) {
                    db.collection('userpost')
                        .add({
                            data: {
                                agree: false,
                                collect: false,
                                post_id: e.currentTarget.dataset.pid,
                                user_id: app.globalData.openid
                            }
                        })
                        .then(res => {
                            console.log('添加成功', res)
                        })
                        .catch(reason => {
                            console.log('添加失败', reason)
                        })
                }
            })
            .catch(reason => {
                console.log('状态查询失败', reason)
            })
        wx.navigateTo({
            url: '../../pages/onepost/onepost?post_id=' + e.currentTarget.dataset.pid,
        })
    },
    see() {

        var that = this
        const db = wx.cloud.database()
        const school = db.collection('post')
        school.where({
            detail: {
                $regex: '.*' + text + '.*',
                $options: '1'
            },

        }).get({
            success: res => {
                console.log('匹配', res)
                if (res.data.length == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '暂时没找到对应答案',
                        showCancel: false,
                        success: function (res) {}
                    })
                    return;
                } else {
                    that.setData({
                        obj: res.data
                    })
                }
            }
        })
    },

    input_p(e) {
        text = e.detail.value
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const db = wx.cloud.database()
        const school = db.collection('post')
        school.where({
                //date: db.command.gte('2020-08-18').and(db.command.lte('2020-08-19')),
                //date: db.command.lte('2020-08-19')
                detail: {
                    $regex: '^超越很多人 情怀.*',
                    $options: '1'
                },
            })
            .orderBy("date", "asc")
            .limit(20)
            .get({
                success: res => {
                    console.log('< < <', res.data)
                }
            })
    },
})