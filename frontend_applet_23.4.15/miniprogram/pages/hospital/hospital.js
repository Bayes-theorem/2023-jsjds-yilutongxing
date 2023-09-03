Page({

    /**
     * 页面的初始数据
     */
    data: {
       list:[]
    },
    sethospital_id(e){
        var app = getApp()
        app.globalData.hospital_id=e.currentTarget.dataset.id,
        console.log("医院id",app.globalData.hospital_id)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onLoad: function () {
        wx.cloud.database().collection('hospital')
        .get()
        .then(res => {
            console.log('查询成功', res)
            this.setData({
                    list: res.data
                })
        })
        this.setData({
            msgList: [
              { url: "../../pages/zhinan/zhinan", title: "您有一份医疗纠纷处理指南请查收！" },
              { url: "../../pages/zhengce/zhengce", title: "医疗机构投诉接待处理“十应当”" },
            ]
          });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})