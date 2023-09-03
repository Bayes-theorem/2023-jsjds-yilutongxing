// pages/my/my.js
const app = getApp()
const tim=app.globalData.tim;
const timEvent=app.globalData.timEvent;

Page({
    data: {
      userInfo: app.globalData.userInfo,
    user_id:app.globalData.openid

    },
  onLoad(){ 
    
this.findAvater()
  // this.tim.on(  this.timEvent.SDK_READY,this.findAvater,this)

  }, 
//上传头像
findAvater(){
  tim.on(timEvent.SDK_READY,function(){
setTimeout(()=>{
  var db = wx.cloud.database()
        db.collection('openidAndNickname')
          .where({
            user_id: app.globalData.openid
          })
          .get()
          .then(res => {
                        
     let promise = tim.updateMyProfile({
      avatar: res.data[0].user_profile,
      });
      promise.then(function(imResponse) {
      //  this.$store.commit("okkk",imResponse.data);
     console.log(imResponse.data); // 更新资料成功
    
      }).catch(function(imError) {
     //   this.$store.commit("updateMyProfile error",imError);  
      console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
      });
            }); 

          

},200)
  })
  const isSDKReady=timEvent.SDK_READY ? true:false
 // this.$store("toggltissdkready",isSDKReady);
 // if(isSDKReady){
  

        //  }
},

// 获取该 UserID 对应的个人资料
getuserProfile(e) {
  tim.getUserProfile({
     userIDList: ['Serein'],
   }).then((imRes) => {
     console.log("aaaaaaaaaaaa",imRes)
     if (imRes.data.length > 0) {
     
       this.setData({
         searchUser: imRes.data[0],
       });
       
     } else {
       wx.showToast({
         title: '用户不存在',
         icon: 'error',
       });
       this.setData({
         userID: '',
       });
     }
   });
 },


// 联系客服
jumptoconversation:function(param){
  var app=getApp();
let  to_user ='staff_service';
this.setData({
conversationInfomation:{
    userID : `admin`,   
  userSig : app.globalData.userSig,
   conversationID : "C2C" + to_user
}
});
  wx.navigateTo({
    url:`../TUI-Chat/chat?conversationInfomation=${JSON.stringify(this.data.conversationInfomation)}`
  });

  wx.navigateTo({
    url: '../conversation/conversation',
  })

}
})