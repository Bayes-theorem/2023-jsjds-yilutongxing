// pages/onepost/onepost.js
Page({
  data: {
     list:[],
     comment:[],
     status:[],
     show:true,
     newcomment:"",
  },
  addcomment_record(){
      var app=getApp()
      var p_id=this.data.list[0]._id
      /*var newData={
        agree:0,
        disagree:0,
        content:this.data.newcomment,
        post_id:p_id,
        user_id:app.globalData.openid
      }
      this.data.comment.push(newData)
      console.log('comment',this.data.comment)*/
      wx.cloud.callFunction({
        name: "addComment",
        data: {
          val: this.data.newcomment
        },
      }).then(res => {
        console.log(res.result)
        app.globalData.thissentiment=res.result.Sentiment
        console.log(app.globalData.thissentiment)
        var timestamp=Date.parse(new Date());
      var date=new Date(timestamp);
      var Y=date.getFullYear();
      var M=date.getMonth()+1;
      var D=date.getDate();
      var t=Y+'-'+M+'-'+D;
        const db=wx.cloud.database()
      db.collection('comment')
      .add({
        data:{
           agree:0,
           disagree:0,
           content:this.data.newcomment,
           post_id:p_id,
           user_id:app.globalData.openid,
           user_profile:app.globalData.userprofile,
           sentiment:res.result.Sentiment,
           date:t,
           read:false
        }
      })
      .then(res=>{
        console.log('添加成功',res)
        this.getcomments(p_id);
        this.onCommentTap()
      if(app.globalData.thissentiment=="negative"){
        this.setData({
          ['list[0].negcomment']:this.data.list[0].negcomment+1,
        })
      }
      })
      .catch(reason=>{
        console.log('添加失败',reason)
      })
      }).catch(res => {
        console.log("获取情绪值失败")
      })
      this.setData({
        ['list[0].comment']:this.data.list[0].comment+1,
        ['list[0].attention']:this.data.list[0].attention+5
      })
      const db=wx.cloud.database()
      db.collection('post')
      .doc(p_id)
      .update({
        data:{
         comment:this.data.list[0].comment,
         attention:this.data.list[0].attention,
         negcomment:this.data.list[0].negcomment+1
        }
      })
      .then(res=>{
        console.log('修改成功',res)
      })
      .catch(reason=>{
        console.log('修改失败',reason)
      })
      //this.onLoad()
  },
  getnewcomment(e){
    this.setData({
      newcomment:e.detail.value
    })
    console.log('newcomment',this.data.newcomment)
  },
  onCommentTap(){
    this.setData({
      show:!this.data.show
    })
  },
  onCollectionTap(post_id){
    if(this.data.status[0].collect){
      this.setData({
        ['list[0].collect']:this.data.list[0].collect-1,
        ['list[0].attention']:this.data.list[0].attention-10
      })
    }else{
      this.setData({
        ['list[0].collect']:this.data.list[0].collect+1,
        ['list[0].attention']:this.data.list[0].attention+10
      })
    }
    this.setData({
      ['status[0].collect']:!this.data.status[0].collect
    })
     var upid=this.data.status[0]._id
     const db=wx.cloud.database()
     db.collection('userpost')
     .doc(upid)
     .update({
       data:{
        collect:this.data.status[0].collect
       }
     })
     .then(res=>{
       console.log('修改成功',res)
     })
     .catch(reason=>{
       console.log('修改失败',reason)
     })
     db.collection('post')
     .doc(this.data.status[0].post_id)
     .update({
       data:{
        collect:this.data.list[0].collect,
        attention:this.data.list[0].attention
       }
     })
     .then(res=>{
       console.log('修改成功',res)
     })
     .catch(reason=>{
       console.log('修改失败',reason)
     })
  },
  onUpTop(post_id){
    if(this.data.status[0].agree){
      this.setData({
        ['list[0].agree']:this.data.list[0].agree-1,
        ['list[0].attention']:this.data.list[0].attention-1
      })
    }else{
      this.setData({
        ['list[0].agree']:this.data.list[0].agree+1,
        ['list[0].attention']:this.data.list[0].attention+1
      })
    }
    this.setData({
      ['status[0].agree']:!this.data.status[0].agree
    })
     var upid=this.data.status[0]._id
     const db=wx.cloud.database()
     db.collection('userpost')
     .doc(upid)
     .update({
       data:{
         agree:this.data.status[0].agree
       }
     })
     .then(res=>{
       console.log('修改成功',res)
     })
     .catch(reason=>{
       console.log('修改失败',reason)
     })
     db.collection('post')
     .doc(this.data.status[0].post_id)
     .update({
       data:{
         agree:this.data.list[0].agree,
         attention:this.data.list[0].attention
       }
     })
     .then(res=>{
       console.log('修改成功',res)
     })
     .catch(reason=>{
       console.log('修改失败',reason)
     })
  },
  getstatus(post_id){
    var app=getApp()
    var openid=app.globalData.openid
    const db=wx.cloud.database()
     db.collection('userpost')
     .where({
       post_id:post_id,
       user_id:openid
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
  getcomments(post_id){
    var that=this
    wx.cloud.database().collection('comment')
      .where({
        post_id:post_id
      })
      .get()
      .then(res => {
        console.log('评论查询成功', res)
        that.setData({
          comment: res.data,
        })
      })
      .catch(reason => {
        console.log('评论查询失败', reason)
      })
},
  getpostdetail(post_id) {
      wx.cloud.database().collection('post')
        .where({
          _id: post_id
        })
        .get()
        .then(res => {
          console.log('条件查询成功', res)
          this.setData({
            list: res.data
          })
        })
        .catch(reason => {
          console.log('条件查询失败', reason)
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const {
          post_id
        } = options;
        this.setData({
          _options:options
        })
        this.getpostdetail(post_id);
        this.getcomments(post_id);
        this.getstatus(post_id);
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