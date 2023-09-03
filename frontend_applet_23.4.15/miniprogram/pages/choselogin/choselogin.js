// pages/choselogin/choselogin.js
const app=getApp()
import { genTestUserSig } from '../../utils/GenerateTestUserSig'
import logger from '../../utils/logger';
const tim = app.globalData.tim;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showModal: false,
        username: "",
        password: "",
        userInfo: [],//微信号授权登录
        hasUserInfo: false, 
      canIUseGetUserProfile: false, 
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },



    jumptouserlogin(){
this.getUserProfile();
    },
    usernameInput: function (e) {
        this.setData({
          username: e.detail.value
        })
        console.log('username', e.detail.value)
      },
    
      passwordInput: function (e) {
        this.setData({
          password: e.detail.value
        })
        console.log('password', e.detail.value)
      },
      jumptohoslogin() {
     
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
      onConfirm: function () {
        const app = getApp()
        const db = wx.cloud.database()
        db.collection('hoslogindetail')
          .where({
            username: this.data.username
          })
          .get()
          .then(res => {
            console.log('1登录信息获取成功', res)
            app.globalData.login_hospital_id = res.data[0].hospital_id
            console.log('here登录hosid',app.globalData.login_hospital_id)
            this.setData({
              hoslogindata: res.data[0]
            })
            if (res.data.length == 1 && res.data[0].password == this.data.password) {
              this.hos_log_in();
              wx.showToast({
                title: '登录成功',
                success:wx.navigateTo({
                  url: '../../pages/allpages/allpages',
                })
              })
            } else {
              wx.showToast({
                title: '登录失败',
              })
            }
          })
          .catch(reason => {
            console.log('失败', reason)
          })
        this.setData({
          hashospitalInfo: true
        })
        this.hideModal();
      },

      //患者端登录
      getUserProfile(e) { 
        wx.getUserProfile({ 
          desc: '登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写 
          success: (res) => { 
              console.log("res.userInfo",res.userInfo)
            this.setData({ 
              userInfo: res.userInfo, 
              hasUserInfo: true
            })

            this.storeUserInfo();
              this.user_log_in();//tukit登录
            
              app.globalData.userInfo=res.userInfo
              app.globalData.userID=res.userInfo.nickName
            app.globalData.userprofile=res.userInfo.avatarUrl
            
            wx.switchTab({
              url: '../../pages/hospital/hospital',
            })

          },
        }) 
      
      },

      storeUserInfo(e){
        var db = wx.cloud.database();
        console.log("1212",this.data.userInfo)
        db.collection('openidAndNickname')
            .add({
                data: {
                    user_id:app.globalData.openid,
                    user_nickname:this.data.userInfo.nickName,
                    user_profile:this.data.userInfo.avatarUrl
                }
            })
            .then(res => {
                console.log(res)
            })
            .catch(reason => {
                console.log('失败', reason)
            })
     },
  
user_log_in(){
  var userID=this.data.userInfo.nickName//app.globalData.openid
  var userSig = genTestUserSig(userID).userSig;
  logger.log(`message | message  | userSig:${userSig} userID:${userID}`)
  let pageImResponse;
  let promise = tim.login({
    userID,
    userSig,
  });
  promise.then(function (imResponse) {
    pageImResponse = imResponse;
    console.log('------患者端登录成功', pageImResponse); // 登录成功 
  }).catch(function (imError) {
    console.warn('------login error:', imError); // 登录失败的相关信息
  });
  
    },

   

//医院端登录
hos_log_in(){
  if(app.globalData.login_hospital_id=="5b049cc861ea50e507a396124a50aeb6"){
    var userID="admin1"
  }
  else{
    var userID="admin2"
  }
  var userSig = genTestUserSig(userID).userSig;
  logger.log(`message | message  | userSig:${userSig} userID:${userID}`)
  let pageImResponse;
  let promise = tim.login({
    userID,
    userSig,
  });
  promise.then(function (imResponse) {
    pageImResponse = imResponse;
    console.log('------医院端登录成功', pageImResponse); // 登录成功 
  }).catch(function (imError) {
    console.warn('------login error:', imError); // 登录失败的相关信息
  });
  
    },

 
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      if (wx.getUserProfile) { 
        this.setData({ 
          canIUseGetUserProfile: true 
        }) 
      
      } 
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