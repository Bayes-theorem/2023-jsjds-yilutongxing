// pages/complainbox/complainbox.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      // _problem:"",
      // _hope:"",
      // _name:"",
      // _phonenumber:""
      idx:-1,
    },
    sendtoproblem(e){
      this.setData({
      _problem:e.detail.value
      })
      console.log(this._problem)
    },
    sendtohope(e){
      this.setData({
      _hope:e.detail.value
      })
      console.log(this._hope)
    },
    sendtoname(e){
      this.setData({
      _name:e.detail.value
      })
      console.log(this._name)
    },
    sendtophonenumber(e){
      this.setData({
      _phonenumber:e.detail.value
      })
      console.log(this._phonenumber)
    },
    jumptosendsuccess:function(){
      var k=this.data.idx
      var timestamp=Date.parse(new Date());
      var date=new Date(timestamp);
      var Y=date.getFullYear();
      var M=date.getMonth()+1;
      var D=date.getDate();
      var t=Y+'-'+M+'-'+D;
      var app = getApp()
      const db = wx.cloud.database();
        db.collection('complainbox')
        .add({
          data:{
            problem:this.data._problem,
            hope:this.data._hope,
            name:this.data._name,
            phonenumber:this.data._phonenumber,
            hospital_id:app.globalData.hospital_id,
            user_id:app.globalData.openid,
            date:t,
            read:false
        } 
        })
        .then(res=>{
            console.log(res)
        })
        .catch(reason=>{
            console.log('失败',reason)
        })
        wx.navigateTo({
          url: '../sendsuccess/sendsucces',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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