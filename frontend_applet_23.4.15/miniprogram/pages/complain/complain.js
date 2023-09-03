// pages/complain/complain.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        thishosname:"长海医院",
        thishosnumber:"123456"
    },

    jumptocomplainbox(){
        wx.navigateTo({
            url: '../complainbox/complainbox',
        })
    },
    jumptocomplainlist(){
        wx.navigateTo({
          url: '../complainlist/complainlist',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //需要从医院列表获取hospital_id
        /*const app = getApp()
        const db = wx.cloud.database();
        db.collection("hospital")
            .where({
                _id: app.globalData.hospital_id
            })
            .get()
            .then(res => {
                console.log(res)
                this.setData({
                    thishosname: res.data[0].name,
                    thishosnumber: res.data[0].number
                })
            })
            .catch(reason => {
                console.log('失败', reason)
            })*/
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