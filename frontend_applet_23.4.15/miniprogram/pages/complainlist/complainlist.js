// pages/complainlist/complainlist.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: []
    },
    tocomplaindetail(e) {
        var complain_id = e.currentTarget.dataset.com_id
        wx.navigateTo({
            url: '../../pages/complainjindu/complainjindu?complain_id=' + complain_id,
        })
    },
    getcomplain() {
        const app = getApp()
        //console.log('app.globalData.hospital_id', app.globalData.hospital_id)
        const db = wx.cloud.database();
        db.collection('complainbox')
            .where({
                hospital_id: app.globalData.hospital_id,
                user_id: app.globalData.openid
            })
            .orderBy('date', 'desc')
            .get()
            .then(res => {
                console.log(res)
                this.setData({
                    list: res.data
                })
            })
            .catch(reason => {
                console.log('失败', reason)
            })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getcomplain()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})