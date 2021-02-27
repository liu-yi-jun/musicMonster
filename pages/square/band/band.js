// pages/square/band/band.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    pageSize: 10,
    pageIndex: 1,
    isNoData: false,
    bands: [],
    barList: [{
        name: '一起组乐队',
      }
    ],
    actIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getBands()
  },
  // 获取分页组队信息
  getBands() {
    let {
      pageSize,
      pageIndex
    } = this.data
    app.get(app.Api.getBands, {
      pageSize,
      pageIndex
    }).then(res => {
      console.log(res)
      if (res.length < pageSize) {
        this.setData({
          isNoData: true
        })
      }
      this.setData({
        bands: this.data.bands.concat(res),
        pageIndex: pageIndex + 1
      })
    })
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
    if (app.bandBack) {
      this.setData({
        bands: [],
        pageSize: 10,
        pageIndex: 1
      }, () => {
        this.getBands()
      })
      app.bandBack = false
    }
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

  },
  handlerGobackClick: app.handlerGobackClick,
  scrolltolower() {
    let {
      isNoData,
    } = this.data
    if (!isNoData) {
      this.getBands()
    }
  },
  goIssueTeam() {
    wx.navigateTo({
      url: '/pages/square/band/issueTeam/issueTeam',
    })
  },

  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (this.data.actIndex === actIndex) {
      return
    }
    this.setData({
      actIndex
    })
  },
})