// pages/addpost/addpost.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        obtnArry:[
            {name:"环境",
             num:0,
             selected:false
            },
            {name:"流程",
             num:1,
             selected:false
            },
            {name:"药品",
             num:2,
             selected:false
            },
            {name:"服务",
             num:3,
             selected:false
            }
          ],
          idx:-1,
          title:"",
          detail:"",
    },
    gettitle(e){
      this.setData({
        title: e.detail.value
      })
      console.log('title',this.data.title)
    },
    getdetail(e){
      this.setData({
        detail:e.detail.value
      })
      console.log('detail',this.data.detail)
    },
    back(){
        wx.navigateTo({
          url: '../../pages/communicatingarea/communicatingarea',
        })
    },
    addpost_record: function(){
      wx.cloud.callFunction({
        name: "getsen",
        data: {
          text: this.data.detail
        },
      }).then(async res => {
        console.log(JSON.parse(res.result)["sentiment"])
        var sen=JSON.parse(res.result)["sentiment"].slice(2,-2)
        wx.cloud.callFunction({
          name: "getshuxing",
          data: {
            text: this.data.detail
          },
        }).then(async res => {
          console.log(JSON.parse(JSON.parse(res.result)["shuxing"])['result'][0])
          var shuxing=JSON.parse(JSON.parse(res.result)["shuxing"])['result'][0]
          const db=wx.cloud.database()
          var app=getApp();
          var timestamp=Date.parse(new Date());
          var date=new Date(timestamp);
          var Y=date.getFullYear();
          var M=date.getMonth()+1;
          var D=date.getDate();
          var t=Y+'-'+M+'-'+D;
          var app=getApp();
          db.collection('post')
          .add({
              data:{
                  agree:0,
                  collect:0,
                  comment:0,
                  date:t,
                  detail:this.data.detail,
                  hospital_id:app.globalData.hospital_id,
                  user_id:app.globalData.openid,
                  user_profile:app.globalData.userprofile,
                  score:parseFloat(sen),
                  shuxing:shuxing,
                  user_name:app.globalData.userID
                  }
          })
          .then(res=>{
              console.log('添加成功',res)
          })
          .catch(reason=>{
              console.log('添加失败',reason)
          })
        }).catch(res => {
          console.log(res)
          console.log("获取属性失败")
        })
        
      }).catch(res => {
        console.log(res)
        console.log("获取情感得分失败")
      })
      
        wx.navigateTo({
          url: '../../pages/allarea/allarea',
        })
    },
    dealTap:function(e){
        var idx= e.target.dataset.index ;
        let string = "obtnArry["+idx+"].selected";
        console.log(string);
        this.setData({
          [string]:!this.data.obtnArry[idx].selected
        })
        for(var i=0;i<4;i++){
          if(i!=idx){
            this.setData({
              ["obtnArry["+i+"].selected"]:false
            })
          }
        }
        this.setData({
          idx:idx
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