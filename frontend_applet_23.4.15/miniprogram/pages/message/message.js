//index.js
//获取应用实例
import logger from '../../utils/logger';
const app = getApp();
const tim=app.globalData.tim;
const timEvent=app.globalData.timEvent;
Page({
  data: {
    monwordlist: [],
    monnavbar: ['系统消息','会话消息' ],
    moncurrentTab: 0,
    monpostlist: [],
    monsensitivelist: [],
    monwordpost:[],

post_id_arr: [],
    commentlist: [],


    conversationList: [],
    conversationInfomation: {},
     showSelectTag: false,
    array: [
      { name: '发起会话' },
    ],
    index: Number,
    unreadCount: 0,
    transChenckID: '',
    //userInfo: {},
   // hasUserInfo: false,
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
   // userID:app.globalData.UserID,

    
  },
 
  onLoad: function () { 
    //this.findAvater()
    tim.on(timEvent.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated, this);
    this.getConversationList(); 
    this.getcomment()
    this.getmypost()


/*
if (app.globalData.userInfo) {
  this.setData({
    userInfo: app.globalData.userInfo,
    hasUserInfo: true,
  })
} else if (this.data.canIUse){
  app.userInfoReadyCallback = res => {
    this.setData({
      userInfo: res.userInfo,
      hasUserInfo: true
    })
  }
} ;
*/
  
   //插入用户id
  // this.addUser();
   //查询id
  //  this.queryUser();
   //添加好友
  // this.addFriends();
   //查询好友
  // this.Friendsget();

  

  },

   //上传头像
findAvater(){
  // const isSDKReady=timEvent.SDK_READY ? true:false
  // this.$store("toggltissdkready",isSDKReady);
   //if(isSDKReady){
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
 //this.getuserProfile();
        //   }
 },

//置顶tabbar
  monnavbarTap: function (e) {
    this.setData({
      moncurrentTab: e.currentTarget.dataset.idx
    })
  },
  

//会话列表
onUnload() {
  tim.off(timEvent.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated);
 },
 // 跳转到子组件需要的参数
 handleRoute(event) {
   const flagIndex = this.data.conversationList.findIndex(item => item.conversationID === event.currentTarget.id);
   this.setData({
     index: flagIndex,
   });
   this.getConversationList();
   this.data.conversationInfomation = { conversationID: event.currentTarget.id,
     unreadCount: this.data.conversationList[this.data.index].unreadCount };
   const url = `../TUI-Chat/chat?conversationInfomation=${JSON.stringify(this.data.conversationInfomation)}`;
   wx.navigateTo({
     url,
   });
 },

 // 更新会话列表
 onConversationListUpdated(event) {
   logger.log('| TUI-conversation | onConversationListUpdated | ok');
   this.setData({
     conversationList: event.data,
   });
 },
 // 获取会话列表
 getConversationList() {
  tim.getConversationList().then((imResponse) => {
     logger.log(`| TUI-conversation | getConversationList | getConversationList-length: ${imResponse.data.conversationList.length}`);
     this.setData({
       conversationList: imResponse.data.conversationList,
     });
   });
 },

 // 点击事件跳转
 handleOnTap(event) {
 wx.navigateTo({
   url: '../TUI-Conversation/create-conversation/create',
 })
 },

 // 点击空白区域关闭showMore弹窗
 handleEditToggle() {
  this.setData({
    showSelectTag: false,
  });
},

 transCheckID(event) {
   this.setData({
     transChenckID: event.detail.checkID,
   });
 },



 //系统消息
 getmypost() {
  const app=getApp()
   var user_id=app.globalData.openid
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('post')
      .where({
          user_id: user_id//"os3J05aSjNANHAh3ZQcfX0lUq-0M"
      })
      .get()
      .then(res => {
          this.setData({
              post_id_arr: res.data.map(item => item._id)
          })
          console.log('post_id_arr', this.data.post_id_arr)
          this.getcomment()
      })
      .catch(reason => {
          console.log('post_id_arr查询失败', reason)
      })
},
updatecomment(e) {
  var comment_id = e.currentTarget.dataset.comid
  var post_id = e.currentTarget.dataset.postid
  wx.cloud.database().collection('comment')
      .doc(comment_id)
      .update({
          data: {
              read: true
          }
      })
      .then(res => {
          console.log('update成功', res)
          this.onLoad()
      })
      .catch(reason => {
          console.log('update失败', reason)
      })
  wx.navigateTo({
      url: '../../pages/onepost/onepost?post_id=' + post_id,
  })
},
getcomment() {
  const db = wx.cloud.database()
  const _ = db.command
  console.log('getpost_id_arr', this.data.post_id_arr)
  db.collection('comment')
      .where({
          post_id: _.in(this.data.post_id_arr),
      })
      .orderBy('date', 'desc')
      .get()
      .then(res => {
          console.log('commentlist', res.data)
          this.setData({
              commentlist: res.data
          })
      })
      .catch(reason => {
          console.log('失败', reason)
      })
},



//本页面的功能函数
  //添加用户
  addUser:function(){
    let usersig = `eJwtjL0KgzAURt8la4vcGKNU6KIOHaSkv4ObJTf2EpRUpSil716r8k3fOXA*7JpfvDe2LGa*B2w7f9LY9GRoxqWuqVlFp23pHGkW8wAgFCAisRgcHLU4cSmlDwAL7an*szCQPBTT1gpVUzfh6umsGY*bQ6HOmbiZvCo0pmrcJXc3WIxej6bPCLrTnn1-KCox0g__`;
      wx.request({
        url: `https://console.tim.qq.com/v4/im_open_login_svc/account_import?sdkappid=1400630373&identifier=admin&usersig=${usersig}&random=777777&contenttype=json`,
        data: {
          "Identifier": "staff_service",
          "Nick": "人工客服",
          "FaceUrl": ""
        },
   
        method: "POST",
        dataType: "json",
        success: function (res) {
          console.log('添加人员ID',res)
          var obj = res;//我们这里打断点来看数据是否获取到了
        },
        fail: function (e) {
          console.log(e)
        },
        complete: function (obj) {

        }
      })
  },
  queryUser:function(){
    
    let usersig = `eJwtjL0KgzAURt8la4vcGKNU6KIOHaSkv4ObJTf2EpRUpSil716r8k3fOXA*7JpfvDe2LGa*B2w7f9LY9GRoxqWuqVlFp23pHGkW8wAgFCAisRgcHLU4cSmlDwAL7an*szCQPBTT1gpVUzfh6umsGY*bQ6HOmbiZvCo0pmrcJXc3WIxej6bPCLrTnn1-KCox0g__`;
    wx.request({
      url: `https://console.tim.qq.com/v4/im_open_login_svc/account_check?sdkappid=1400630373&identifier=admin&usersig=${usersig}&random=777777&contenttype=json`,
      data: {
        "CheckItem":
          [
            {
              "UserID": "user1"
            },
            {
              "UserID": "user2"
            }
          ]
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        console.log('查询人员ID', res)
        var obj = res;//我们这里打断点来看数据是否获取到了
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (obj) {

      }
    })
  },
  
  //添加朋友
  addFriends:function(){
    let usersig = `eJwtjL0KgzAURt8la4vcGKNU6KIOHaSkv4ObJTf2EpRUpSil716r8k3fOXA*7JpfvDe2LGa*B2w7f9LY9GRoxqWuqVlFp23pHGkW8wAgFCAisRgcHLU4cSmlDwAL7an*szCQPBTT1gpVUzfh6umsGY*bQ6HOmbiZvCo0pmrcJXc3WIxej6bPCLrTnn1-KCox0g__`;//admin的userSig。
    wx.request({
      url: `https://console.tim.qq.com/v4/sns/friend_add?sdkappid=1400630373&identifier=admin&usersig=${usersig}&random=777777&contenttype=json`,
      data: {
        "From_Account": "admin",// app.globalData.openid 
        "AddFriendItem":
          [
            {
              "To_Account": "user3",
              "Remark": "张三",
              "GroupName": "", // 添加好友时只允许设置一个分组，因此使用 String 类型即可
             // "AddSource": "校友圈好友",
              "AddWording": ""
            },
            {
              "To_Account": "user2",
              "Remark": "李四",
              "GroupName": "", // 添加好友时只允许设置一个分组，因此使用 String 类型即可
             // "AddSource": "a",
              "AddWording": " "
            }
           
          ],
        "AddType": "Add_Type_Both",
        "ForceAddFlags": 1
      },
     
      method: "POST",
      dataType: "json",
      success: function (res) {
        console.log('添加好友', res)
        var obj = res;//这里打断点来看数据是否获取到了
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (obj) {
      }
    }) 
    
  },
  //拉取朋友
  Friendsget:function(){
    let usersig = `eJwtjL0KgzAURt8la4vcGKNU6KIOHaSkv4ObJTf2EpRUpSil716r8k3fOXA*7JpfvDe2LGa*B2w7f9LY9GRoxqWuqVlFp23pHGkW8wAgFCAisRgcHLU4cSmlDwAL7an*szCQPBTT1gpVUzfh6umsGY*bQ6HOmbiZvCo0pmrcJXc3WIxej6bPCLrTnn1-KCox0g__`;//admin的userSig。
    wx.request({
   
      url: `https://console.tim.qq.com/v4/sns/friend_get?sdkappid=1400630373&identifier=admin&usersig=${usersig}&random=777777&contenttype=json`,
      data: {
          "From_Account": "os3J05bEYuelg9r9cHbmRckQgeWo",   
          "StartIndex": 0,
          "StandardSequence": 0,
          "CustomSequence": 0,
      
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
      //  console.log('拉取好友', res)
        var obj = res;//这里打断点来看数据是否获取到了
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function (obj) {
      }
    }) 
    
  },
  
})

