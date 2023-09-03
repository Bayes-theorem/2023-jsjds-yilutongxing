// app.js
import TIM from 'tim-wx-sdk/tim-wx-friendship.js';
import COS from "cos-wx-sdk-v5"
let tim,timEvent;
App({
  globalData:{
    hospital_id:"",
    userInfo:[],
    openid: 'o0_5V5VusBlaN6OAJ2LxTt4LWl68',//云ID
    userprofile:"https://thirdwx.qlogo.cn/mmopen/vi_32/0HcbScTXBo3f1M2pjPtzNicljcW7EruAJwnPnyXON1YEmwicIFCgMZiaNDqLb8o3TEWn07b1mp0tOK9qicOaBUV10A/132",//用户头像
    userID :"Serein",//用户名
    isTUIKit: true,
    headerHeight: 0,
    statusBarHeight: 0,
    SDKAppID: 1400630373,
    friends:{},//好友列表
    tim:'',
    timEvent:'',
    keywords:[],
    thisword:"",
    thissentiment:""
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud-2023-jisai-7ft7ahc87f5c949',
        traceUser: true,
      });
    }
   // this.globalData = {};
    this.getOpenid();
 //wx.setStorageSync('islogin', false)
  const SDKAppID = this.globalData.SDKAppID
  wx.setStorageSync(`TIM_${SDKAppID}_isTUIKit`, true)
 tim = TIM.create({ SDKAppID: this.globalData.SDKAppID }) 
 tim.setLogLevel(0);
    tim.registerPlugin({
      'cos-wx-sdk': COS
    });
 
 //tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })

  timEvent = TIM.EVENT
  this.globalData.timEvent=timEvent
 let timVersion = TIM.VERSION
 let timTypes = TIM.TYPES
  // 监听系统级事件
  tim.on(timEvent.SDK_NOT_READY, this.onSdkNotReady)
  tim.on(timEvent.KICKED_OUT, this.onKickedOut)
  tim.on(timEvent.ERROR, this.onTIMError)
  tim.on(timEvent.NET_STATE_CHANGE, this.onNetStateChange)
  tim.on(timEvent.SDK_RELOAD, this.onSDKReload)
  tim.on(timEvent.SDK_READY, this.onSDKReady)

  this.globalData.tim=tim;
  },
 
  // 获取用户openid
  getOpenid() { 
    wx.cloud.callFunction({
     name: 'getOpenID',
     complete: res => {
      console.log('云函数获取到的openid: ', res.result.openId)
 
      this.globalData.openid=res.result.openId

     // app.globalData.userInfo=res.result
    
   },
  })
},

  onSDKReady() {

  },
  onSdkNotReady() {

  },

  onKickedOut() {
    wx.showToast({
      title: '您被踢下线',
      icon: 'error',
    })
    wx.navigateTo({
      url: './pages/hospital/hospital',
    })
  },

  onTIMError() {
  },

  onNetStateChange() {

  },

  onSDKReload() {

  },

});
