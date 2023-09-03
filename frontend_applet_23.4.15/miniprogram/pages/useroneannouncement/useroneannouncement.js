// pages/oneannouncement/oneannouncement.js]
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    currenttitle: "",
    thishosname: "",
    status: [],
    showModal: false
  },
  reason: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    var D = date.getDate();
    var t = Y + '-' + M + '-' + D;
    const db = wx.cloud.database();
    db.collection('disagreereason')
      .add({
        data: {
          announcement_id: this.data.status[0].announcement_id,
          user_id: app.globalData.openid,
          disagreereason: this.data.reason,
          date: t,
        }
      })
      .then(res => {
        console.log(res)
      })
      .catch(reason => {
        console.log('失败', reason)
      })
    this.hideModal();
  },
  inputreason(e) {
    this.setData({
      reason: e.detail.value
    })

  },
  getannouncementdetail(announcement_id) {
    wx.cloud.database().collection('announcement')
      .where({
        _id: announcement_id
      })
      .get()
      .then(res => {
        console.log(res)
        this.setData({
          list: res.data,
        })
        wx.setNavigationBarTitle({
          title: res.data[0].title
        })
      })
      .catch(reason => {
        console.log('失败', reason)
      })
  },

  getstatus(announcement_id) {
    var openid = app.globalData.openid
    const db = wx.cloud.database()
    db.collection('userannouncement')
      .where({
        announcement_id: announcement_id,
        user_id: openid
      })
      .get()
      .then(res => {
        console.log('状态查询成功', res)
        this.setData({
          status: res.data,
        })
      })
      .catch(reason => {
        console.log('状态查询失败', reason)
      })
  },

  onUpTap(annnouncement_id) {
    if (this.data.status[0].agree) {
      this.setData({
        ['list[0].agree']: this.data.list[0].agree - 1
      })
    } else {
      this.setData({
        ['list[0].agree']: this.data.list[0].agree + 1,
      })
      if (this.data.status[0].disagree) {
        this.setData({
          ['list[0].disagree']: this.data.list[0].disagree - 1
        })
        this.setData({
          ['status[0].disagree']: !this.data.status[0].disagree
        })
      }
    }
    this.setData({
      ['status[0].agree']: !this.data.status[0].agree
    })
    var upid = this.data.status[0]._id
    const db = wx.cloud.database()
    db.collection('userannouncement')
      .doc(upid)
      .update({
        data: {
          agree: this.data.status[0].agree,
          disagree: this.data.status[0].disagree
        }
      })
      .then(res => {
        console.log('修改成功', res)
      })
      .catch(reason => {
        console.log('修改失败', reason)
      })
    db.collection('announcement')
      .doc(this.data.status[0].announcement_id)
      .update({
        data: {
          agree: this.data.list[0].agree,
          disagree: this.data.list[0].disagree
        }
      })
      .then(res => {
        console.log('修改成功', res)
      })
      .catch(reason => {
        console.log('修改失败', reason)
      })
  },
  onDownTap(annnouncement_id) {
    if (this.data.status[0].disagree) {
      this.setData({
        ['list[0].disagree']: this.data.list[0].disagree - 1
      })

    } else {
      this.setData({
        ['list[0].disagree']: this.data.list[0].disagree + 1
      })
      if (this.data.status[0].agree) {
        this.setData({
          ['list[0].agree']: this.data.list[0].agree - 1
        })
        this.setData({
          ['status[0].agree']: !this.data.status[0].agree
        })
      }
    }
    this.setData({
      ['status[0].disagree']: !this.data.status[0].disagree
    })
    var upid = this.data.status[0]._id
    const db = wx.cloud.database()
    db.collection('userannouncement')
      .doc(upid)
      .update({
        data: {
          disagree: this.data.status[0].disagree,
          agree: this.data.status[0].agree
        }
      })
      .then(res => {
        console.log('修改成功', res)
      })
      .catch(reason => {
        console.log('修改失败', reason)
      })
    db.collection('announcement')
      .doc(this.data.status[0].announcement_id)
      .update({
        data: {
          disagree: this.data.list[0].disagree,
          agree: this.data.list[0].agree
        }
      })
      .then(res => {
        console.log('修改成功', res)
      })
      .catch(reason => {
        console.log('修改失败', reason)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      announcement_id
    } = options;
    this.getannouncementdetail(announcement_id);
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
        })
      })
      .catch(reason => {
        console.log('失败', reason)
      })
    this.getstatus(announcement_id);
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