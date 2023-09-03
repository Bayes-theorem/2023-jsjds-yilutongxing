// pages/wordpost/wordpost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  getposts() {
    var app=getApp();
    console.log(app.globalData.thisword)
    const db=wx.cloud.database()
    const _=db.command
    db.collection('post')
      .where({
        hospital_id: app.globalData.login_hospital_id,
        keywords:_.in([app.globalData.thisword])
      })
    .get()
    .then(res=>{
      console.log(res.data)
      this.setData({
        list:res.data
      })
    })  
  },
  adduserpost_record(e) {
    wx.navigateTo({
      url: '../../pages/onepost/onepost?post_id='+e.currentTarget.dataset.pid
      ,
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getposts();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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