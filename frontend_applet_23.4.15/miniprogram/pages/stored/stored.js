// pages/otherpage/otherpage.js
Page({
  data: {
    postlist: [],
    userprosile:""
  },

  getuserpost() {
    var app = getApp()
    console.log('here3333', app.globalData.openid)
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('userpost')
      .where({
        user_id: app.globalData.openid,
        collect: true
      })
      .get()
      .then(res => {
        console.log('userpost', res.data.post_id)
        db.collection('post')
          .where({
            _id: _.in(res.data.map(item => item.post_id))
          })
          .get()
          .then(res => {
            console.log('post', res)
            this.setData({
              postlist: res.data
            })
          })
          .catch(reason => {
            console.log('post查询失败', reason)
          })
      })
      .catch(reason => {
        console.log('失败', reason)
      })
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
      url: '../../pages/onepost/onepost?post_id=' + e.currentTarget.dataset.pid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserpost();
    //this.getotherpost(user_id);
    //this.getothercomment(user_id);
    //this.getcommentpost()
    var app = getApp()
    console.log(app.globalData.openid)
    this.setData({
      userprofile:app.globalData.userprofile
    })
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