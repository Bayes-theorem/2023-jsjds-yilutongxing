// pages/newFriendsApplication/newFriendsApplication.js
const app = getApp()
const tim=app.globalData.tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendApplicationList:{}
  },

    //新的朋友
    newFriendList(){
      let promise = tim.getFriendApplicationList();
  promise.then(function(imResponse) {
    // friendApplicationList - 好友申请列表 - [FriendApplication]
    // unreadCount - 好友申请的未读数
     const { friendApplicationList,
       unreadCount } = imResponse.data;
    // console.log("acccccccccccccc",friendApplicationList,unreadCount)
  }).catch(function(imError) {
    console.warn('getFriendApplicationList error:', imError); // 获取好友申请列表失败的相关信息
  });
   this.setData({
         friendApplicationList:friendApplicationList
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.newFriendList();

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