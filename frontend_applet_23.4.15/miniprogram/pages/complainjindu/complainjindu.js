// pages/complainjindu/complainjindu.js
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        showModal: false,
        pingjiaDetail: "",
        pingjiaLevel: 0,
        starsBox: [1, 2, 3, 4, 5],
        complain_id: ""
    },
    getcomplaindetail(complain_id) {
        wx.cloud.database().collection('complainbox')
            .where({
                _id: complain_id
            })
            .get()
            .then(res => {
                console.log(res)
                this.setData({
                    list: res.data,
                })
            })
            .catch(reason => {
                console.log('失败', reason)
            })
    },
    changePic: function (e) {
        this.setData({
            pingjiaLevel: e.currentTarget.dataset.no
        })
        console.log('评级', this.data.pingjiaLevel);
    },
    inputpingjia(e) {
        //console.log('输入框', e.detail.value)
        this.setData({
            pingjiaDetail: e.detail.value
        })
        console.log('评价', this.data.pingjiaDetail)
    },
    onCancel: function () {
        this.hideModal();
    },
    onConfirm: function () {
        console.log('Confirm-text', this.data.pingjiaDetail)
        console.log('Confirm-level', this.data.pingjiaLevel)
        wx.cloud.callFunction({
            name: "complainpingjia",
            data: {
                id: this.data.complain_id,
                pingjiaDetail: this.data.pingjiaDetail,
                pingjiaLevel: this.data.pingjiaLevel
            }
        }).then(res => {
            console.log('调用云函数成功',res)
            this.getcomplaindetail(this.data.complain_id)
        }).catch(res => {
            console.log('调用云函数失败',res)
        })
        this.hideModal();
    },
    //弹出弹窗
    tanchuang() {
        this.setData({
            showModal: true
        })
    },
    //隐藏弹窗
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    preventTouchMove: function () {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            complain_id
        } = options;
        this.setData({
            complain_id: complain_id
        })
        this.getcomplaindetail(this.data.complain_id)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})