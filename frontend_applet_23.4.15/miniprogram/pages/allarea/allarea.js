// pages/allarea/allarea.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wordlist: [],
        navbar: ['交流区', '投诉区', '公示区'],
        currentTab: 0,
        postlist: [],
        sensitivelist: [],
        list: [],
        choice: [{
                'method': '按时间排序'
            },
            {
                'method': '按热度排序'
            }
        ],
        idx: -1,
        thishosname: "",
        thishosnumber: "",
        annlist: [],
        conversationList: [],
        conversationInfomation: {},
        show:0,
        detail:"",
        sen:0,
        guanhuai:{},
        lianxu:{},
        thishosname:"长海医院",
        thishosnumber:"123456"
    },
    jumptocomplainbox(){
        wx.navigateTo({
            url: '../complainbox/complainbox',
        })
    },
    jumptocomplainlist(){
        wx.navigateTo({
          url: '../complainlist/complainlist',
        })
    },
    navbarTap: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.idx
        })
    },
    // 交流区
    otherpage(e) {
        var user_id = e.currentTarget.dataset.uid
        console.log('uid', user_id)
        wx.navigateTo({
            url: '../../pages/otherpage/otherpage?isFriend=false&user_id=' + user_id,
        })
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
            url: '../../pages/onepost/onepost?post_id=' + e.currentTarget.dataset.pid,
        })
    },
    add(e) {
        console.log(this.data.isNull)
        var app = getApp()
        const db = wx.cloud.database()
        if (this.data.isNull == true) {
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
            this.setData({
                isNull: false
            })
        }

    },
    jumptoaddpost() {
        this.setData({
            show:1
        })
    },
    quxiao(){
        this.setData({
            show:0
        })
    },
    fabu(){
        wx.cloud.callFunction({
            name: "getlianxu",
            data: {
              text: this.data.detail
            },
          }).then(async res => {
            console.log("连续：",JSON.parse(JSON.parse(res.result)["lianxv"]))
            var lianxu=JSON.parse(JSON.parse(res.result)["lianxv"])
            wx.cloud.callFunction({
                name: "getguanhuai",
                data: {
                    text: this.data.detail
                },
                }).then(async res => {
                console.log("关怀：",JSON.parse(JSON.parse(res.result)["guanhuai"]))
                var guanhuai=JSON.parse(JSON.parse(res.result)["guanhuai"])
                wx.cloud.callFunction({
                    name: "getsen",
                    data: {
                      text: this.data.detail
                    },
                  }).then(async res => {
                    console.log("情感：",JSON.parse(res.result)["sentiment"])
                   var sen=JSON.parse(JSON.parse(res.result)["sentiment"])

                   wx.cloud.callFunction({
                    name: "getshuxing",
                    data: {
                      text: this.data.detail
                    },
                  }).then(async res => {
                    console.log("属性：",JSON.parse(JSON.parse(res.result)["shuxing"])['result'][0])
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
                            user_name:app.globalData.userID,
                            guanhuai:guanhuai,
                            lainxu:lianxu
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
                }).catch(reason=>{
                    console.log('获取关怀失败',reason)
                })
        }).catch(reason=>{
                console.log('获取连续失败',reason)
            })
        
                
        

          

         this.setData({
            show:0
        })
        
    },
    getdetail(e){
        this.setData({
          detail:e.detail.value
        })
        console.log('detail',this.data.detail)
      },
    jumptosearch() {
        wx.navigateTo({
            url: '../../pages/search/search',
        })
    },
    getposts(hospital_id) {
        wx.cloud.database().collection('post')
            .where({
                hospital_id: hospital_id
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
    goIndex(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            idx: index
        })
        var app = getApp()
        const db = wx.cloud.database()
        if (index == 0) {
            db.collection('post')
                .where({
                    hospital_id: app.globalData.hospital_id
                })
                .orderBy("date", "asc")
                .get()
                .then(res => {
                    console.log('按照时间排序成功', res)
                    this.setData({
                        list: res.data
                    })
                })
                .catch(reason => {
                    console.log('按照时间排序失败', reason)
                })
        } else {
            db.collection('post')
                .where({
                    hospital_id: app.globalData.hospital_id
                })
                .orderBy("collect", "desc")
                .get()
                .then(res => {
                    console.log('按照收藏排序成功', res)
                    this.setData({
                        list: res.data
                    })
                })
                .catch(reason => {
                    console.log('按照收藏排序失败', reason)
                })
        }
    },
    // 投诉区
    // jumptocomplainbox: function (param) {
    //     wx.navigateTo({
    //         url: '../complain/complain',
    //     })
    // },

    // 联系医院客服
    jumptoconversation: function (e) {
        var app = getApp();
        var hospital_id = app.globalData.hospital_id;
        console.log(hospital_id)
        if (hospital_id == "5b049cc861ea50e507a396124a50aeb6") {
            let to_user = 'admin1';
            this.setData({
                conversationInfomation: {
                    userID: app.globalData.openid,
                    userSig: app.globalData.userSig,
                    conversationID: "C2C" + to_user
                }
            })
        } else {
            let to_user = 'admin2';
            this.setData({
                conversationInfomation: {
                    userID: app.globalData.openid,
                    userSig: app.globalData.userSig,
                    conversationID: "C2C" + to_user
                }
            })
        }

        wx.navigateTo({
            url: `../TUI-Chat/chat?conversationInfomation=${JSON.stringify(this.data.conversationInfomation)}`
        });


    },
    // 公示区
    adduserannouncement_record(e) {
        var app = getApp()
        const db = wx.cloud.database()
        db.collection('userannouncement')
            .where({
                announcement_id: e.currentTarget.dataset.pid,
                user_id: app.globalData.openid
            })
            .get()
            .then(res => {
                //console.log('长度', res.data.length)
                if (res.data.length == 0) {
                    db.collection('userannouncement')
                        .add({
                            data: {
                                agree: false,
                                disagree: false,
                                announcement_id: e.currentTarget.dataset.pid,
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
    },
    onLoad: function () {
        var app = getApp()
        this.getposts(app.globalData.hospital_id);
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
                    thishosnumber: res.data[0].number
                })
            })
            .catch(reason => {
                console.log('失败', reason)
            })
        db.collection('announcement')
            .where({
                hospital_id: app.globalData.hospital_id
            })
            .get()
            .then(res => {
                console.log(res)
                this.setData({
                    annlist: res.data
                })
            })
            .catch(reason => {
                console.log('失败', reason)
            })
        db.collection("hospital")
            .where({
                _id: app.globalData.hospital_id
            })
            .get()
            .then(res => {
                console.log(res)
                wx.setNavigationBarTitle({
                    title: res.data[0].name
                })
            })

    },
});