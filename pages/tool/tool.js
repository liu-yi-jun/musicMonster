// pages/tool/tool.js
let tool = require('../../assets/tool/tool')
let common = require('../../assets/tool/common')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    // 控制右下角三角show
    tabBarBtnShow: false,
    circulars: [],
    limit: 50,
    isNotData: false,
    value: '',
    scrollTop: 0,
    taPPaging: {
      pageSize: 50,
      pageIndex: 1,
      isNotData: false
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toScrollTop() {
    this.setData({
      scrollTop: 0
    })
  },
  onLoad: function (options) {
    this.initrecorderManager()
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // this.getRandomTap()
    this.gettaps(this.data.value)

  },
  initrecorderManager() {
    console.log(1)
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onError((err) => {
      console.log(err, '// 录音失败的回调处理');
    });
    this.recorderManager.onStart(() => {
      console.log('// 录音开始')

    })
    this.recorderManager.onStop((res) => {
      console.log('// 录音结束')

    })
    this.recorderManager.onFrameRecorded((res) => {
      console.log(res.frameBuffer)
      let Array = new Int8Array(res.frameBuffer)
      let newArray
      if (Array.length >= 800) {
        // 切
        newArray = Array.subarray(0, 800)
      } else {
        // 加
        newArray = this.concatenate(Int8Array, Array, new Int8Array(800 - Array.length))
      }
      let endArry = []
      newArray.forEach(element => {
        endArry.push(element)
      })

      this.analysis(endArry)
    })

  },
  analysis(endArry) {
    app.post(app.Api.analysis, {
      endArry
    }).then(res => {
      console.log(res)
    })
  },
  concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
      totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  },
  start() {

    const options = {
      format: 'mp3',
      frameSize: 1,
      numberOfChannels: 1,
      sampleRate: 8000,
      duration: 60000
    }
    this.recorderManager.start(options)

  },
  gettaps(tapTitle) {
    let taPPaging = this.data.taPPaging
    app.get(app.Api.getTaps, {
      tapTitle,
      ...taPPaging
    }).then(res => {
      if (res.length < taPPaging.pageSize) {
        this.setData({
          'taPPaging.isNotData': true
        })
      }
      this.setData({
        'taPPaging.pageIndex': taPPaging.pageIndex + 1
      })
      this.init(res)
    })
  },
  getRandomTap() {
    app.get(app.Api.getRandomTap, {
      limit: this.data.limit
    }).then(res => {
      // console.log(res)
      this.init(res)
    })
  },
  init(circulars) {
    const deviceW = 750
    let randomWH, deg, delay, duration, circularLeft
    let direction, translate
    circulars.forEach((item, index) => {
        deg = tool.randomNumber(0, 360)
        duration = tool.randomNumber(1500, 2500)
        randomWH = tool.randomNumber(30, 180)
        circularLeft = tool.randomNumber(0, deviceW - randomWH)

        if (randomWH / 2 + circularLeft <= deviceW / 2) {
          direction = 'left'
        } else {
          direction = 'right'
        }
        translate = 50 / (deviceW / 2 - randomWH / 2) * circularLeft
        if (direction === 'left') {
          translate = -translate
        } else {
          translate = 100 - translate
        }


        item.style = `
    width: ${randomWH}rpx;
    height: ${randomWH}rpx;
    background: linear-gradient(${deg}deg, rgba(226, 145, 227, 1), rgba(0, 69, 207, 1));
    left: ${circularLeft}rpx;
    top: 0rpx;
    animation-duration: ${duration}ms;
    animation-name: shake;`

        item.TextStyle = `
    ${direction}: 50%;
    transform: translateX(${translate}%);
    `
      }),
      this.setData({
        circulars: this.data.circulars.concat(circulars)
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
      // app.getNotice(this, app.userInfo.id)
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
  // 控制bar栏
  tap() {
    this.setData({
      tabBarBtnShow: true
    })
    this.getTabBar().setData({
      show: false
    })
  },
  goTapPractice(e) {
    let circulars = this.data.circulars
    let index = e.currentTarget.dataset.index
    let id = circulars[index].id
    wx.navigateTo({
      url: `/pages/tool/tapPractice/tapPractice?id=${id}`,
    })
  },
  confirm(event) {
    this.setData({
      value: event.detail.value,
      circulars: [],
      taPPaging: {
        pageSize: 50,
        pageIndex: 1,
        isNotData: false
      },
    }, () => [
      this.gettaps(event.detail.value)
    ])

  },
  search(value) {
    app.get(app.Api.searchTap, {
      tapTitle: value,
      limit: this.data.limit
    }).then(res => {
      if (res.length < this.data.limit) {
        isNotData: true
      }
      this.init(res)
    })
  },
  scrolltolower() {
    let value = this.data.value
    let isNotData = this.data.taPPaging.isNotData
    if (!isNotData) {
      this.gettaps(value)
    }
  },
})