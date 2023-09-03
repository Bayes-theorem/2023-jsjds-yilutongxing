
import TIM from 'tim-wx-sdk/tim-wx-friendship.js';
const app = getApp();
const tim = app.globalData.tim;
const timEvent = app.globalData.timEvent;
Page({
  data: {
    friendList: [],
    friends:{},
    thisfriend_id:""
  },
 
  onLoad: function () {
//this.newFriendList();
    //this.updateFriend();
    this.getFriendList();
    this.alphabet_order_list = this.selectComponent('#alphabet_order_list')
  },

  getFriendList: function () {
    let that = this;
    let promise = tim.getFriendList();
    promise.then(function (imResponse) {
      that.setData({
        friendList: imResponse.data
      });
      console.log(imResponse.data[0].remark)
       that.getDataFriend(); 
    }).catch(function (imError) {
      console.warn('getFriendList error:', imError); // 获取好友列表失败的相关信息
    }) 
  },

  getDataFriend:function(){
    var list=[]
    var i=0;
   while(this.data.friendList[i]){ 
     if(this.data.friendList[i].remark){
       list.push({'remark':this.data.friendList[i].remark,
       'userId':this.data.friendList[i].userID})
     }
    else {
      list.push({'remark':this.data.friendList[i].userID,
      'userId':this.data.friendList[i].userID})
    }
    i++
   }
     this.setData({
       friends:list
     })
     app.globalData.friends=this.data.friends
   }, 
   
 
   otherpage(e) {

    var userId = e.currentTarget.dataset.uid

    var db = wx.cloud.database()
        db.collection('openidAndNickname')
          .where({
            user_nickname: userId  
          })
          .get()
          .then(res => {
            console.log('查询结果', res)
            var user_id=res.data[0].user_id
            var isFriend=true
         wx.navigateTo({
      url: '../../pages/otherpage/otherpage?isFriend=true&user_id=' + user_id ,
    }) 
            });
   
  },


  

  //跳转到好友申请页面
  jumptonewfriends(){
wx.navigateTo({
  url: "../newFriendsApplication/newFriendsApplication",
})
  }



})