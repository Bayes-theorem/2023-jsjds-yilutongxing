import TIM from 'tim-wx-sdk/tim-wx-friendship.js';
const app=getApp()
Page({
    data: {
      otherpost: [],
      othercomment: [],
      commentpost: [],
      other_profile: "",
      myID:app.globalData.userID,
      user_id:"",//对方的openid
     this_user_id:app.globalData.openid,//我的openid
      user_nickname:"",
      showModal:false,
      aword:"",
      bword:"",
      cword:"",
      isFriend:false//判断双方是否已经加为好友
    },

//找到聊天昵称
    findNickName(user_id){
      const db = wx.cloud.database()
      db.collection('openidAndNickname')
        .where({
          user_id: user_id
        })
        .get()
        .then(res => {
          //console.log('条件查询成功', res)
          this.setData({
            user_nickname: res.data[0].user_nickname
          })
         if(JSON.stringify(app.globalData.friends).indexOf(`"userId":"${res.data[0].user_nickname}"`)!=-1){
  this.setData({
    isFriend:true
  })
} 
          });
         // this.isFriend();
            },

//发送好友申请
jumptoaddfriend() {
 // this.findNickName();
 this.setData({
   showModal: true
 })
 console.log('showModal', this.data.showModal)
},
hideModal: function () {
 this.setData({
   showModal: false
 });
},
onCancel: function () {
 this.hideModal();
},

  //加为好友
addFriends:function(){

  var tim=app.globalData.tim
  // 添加好友  
  let promise = tim.addFriend({
    to: this.data.user_nickname,
    source: 'AddSource_Type_Web',
    remark: this.data.bword,
    groupName: this.data.cword,
    wording: '',
    type: TIM.TYPES.SNS_ADD_TYPE_BOTH,
  });
  
  promise.then(function(imResponse) {
    // 添加好友的请求发送成功
    const { code } = imResponse.data;    
     wx.showToast({
      title: '发送成功', 
    });  

    if (code === 30539) {
      // 30539 说明 user1 设置了【需要经过自己确认对方才能添加自己为好友】，此时 SDK 会触发 TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED 事件
    } else if (code === 0) {
      tim.on(TIM.EVENT.FRIEND_LIST_UPDATED,this.updateFriend)//疑似没用
      // 0 说明 user1 设置了【允许任何人添加自己为好友】，此时 SDK 会触发 TIM.EVENT.FRIEND_LIST_UPDATED 事件
    }
  }).catch(function(imError) {
    console.warn('addFriend error:', imError); // 添加好友失败的相关信息
    wx.showToast({
      title: "已是好友关系",//？怎么把imError直接放进去
    });
  });
this.hideModal() 
  },

  

  ainput(e){
    if(e.detail.value){
       this.setData({
      aword:e.detail.value
    }) 
    }
   else{
    this.setData({
      aword:"我是"+this.data.myID
    }) 
   }
       } ,
       binput(e){
        if(e.detail.value){
          this.setData({
            bword:e.detail.value
          }) 
       }
      else{
       this.setData({
         bword:this.data.user_id
      })
    }
       
           } ,
           cinput(e){
            if(e.detail.value){
              this.setData({
                cword:e.detail.value
              }) 
           }
          else{
           this.setData({
             cword:"friend"
          })
        }
               } ,

    updateFriend:function(){
  // 更新好友
  let promise = tim.updateFriend({
    userID: 'user1',
    remark: 'anna'
    
  });
  promise.then(function(imResponse) {
   console.log(imResponse.data); // Friend 实例
  }).catch(function(imError) {
    console.warn('getFriendProfile error:', imError); // 更新失败
  });
    },

        //私信
   jumptoconversation:function(e){
   // this.findNickName()
let  to_user = this.data.user_nickname;
this.setData({
  conversationInfomation:{
      userID : app.globalData.userID,
      userSig : app.globalData.userSig,
     conversationID : "C2C" + to_user
  }  
})
    wx.navigateTo({
      url:`../TUI-Chat/chat?conversationInfomation=${JSON.stringify(this.data.conversationInfomation)}`
    });

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
          url: '../../pages/onepost/onepost?post_id='+e.currentTarget.dataset.pid
          ,
        })
    },
    getcommentpost() {
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('post')
        .where({
          _id: _.in(this.data.othercomment.map(item => item.post_id))
          //_id: _.in(["bf4a0bf261f4c57a0b089a232920cd2c","bf4a0bf261f4c57a0b089a232920cd2c"])
        })
        .get()
        .then(res => {
          console.log('评论过的帖子', res)
          this.setData({
            commentpost: res.data
          })
        })
        .catch(reason => {
          console.log('条件查询失败', reason)
        })
    },
    getothercomment(user_id) {
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('comment')
        .where({
          user_id: user_id
        })
        .get()
        .then(res => {
          console.log('条件查询成功', res)
          db.collection('post')
          .where({
            _id: _.in(res.data.map(item => item.post_id))
            //_id: _.in(["bf4a0bf261f4c57a0b089a232920cd2c","bf4a0bf261f4c57a0b089a232920cd2c"])
          })
          .get()
          .then(res => {
            console.log('评论过的帖子', res)
            this.setData({
              commentpost: res.data
            })
          })
          .catch(reason => {
            console.log('条件查询失败', reason)
          })
        })
        .catch(reason => {
          console.log('条件查询失败', reason)
        })
       console.log('othercomment', this.data.othercomment)
      /*console.log('othercomment',this.data.othercomment)
      db.collection('post')
      .where({
        _id: _.in(this.data.othercomment)
        //_id: _.in(["bf4a0bf261f4c57a0b089a232920cd2c","bf4a0bf261f4c57a0b089a232920cd2c"])
      })
      .get()
      .then(res => {
        console.log('评论过的帖子', res)
        this.setData({
          commentpost: res.data
        })
      })
      .catch(reason => {
        console.log('条件查询失败', reason)
      })*/
    },
  
    getotherpost(user_id) {
      const db = wx.cloud.database()
      db.collection('openidAndNickname')
      .where({
        user_id: user_id
      })
      .get()
      .then(res=>{
        console.log("1313",res)
        this.setData({
          other_profile: res.data[0].user_profile,
        })
      })
      db.collection('post')
        .where({
          user_id: user_id
        })
        .get()
        .then(res => {
          console.log('otherpost查询成功', res)
          this.setData({
            otherpost: res.data
          })
        })
        .catch(reason => {
          console.log('otherpost查询失败', reason)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     // console.log(options)
      const {
        user_id,
        isFriend
      } = options;

      this.setData({
        user_id:user_id,
        isFriend:isFriend
      })
      this.findNickName(user_id);//判断是否为好友
      this.getotherpost(user_id);
      this.getothercomment(user_id);
      this.getcommentpost();

      
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

