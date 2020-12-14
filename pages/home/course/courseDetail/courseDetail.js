// pages/home/course/courseDetail/courseDetail.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'comment',
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    detail: {},
    // 评论栏数据
    commenetBarData: {},
    // 评论或者回复的参数
    param: {},
    // 评论分页
    commentPaging: {
      pageSize: 30,
      pageIndex: 1
    },
    // 评论的数据数组
    commentArr: [],
    IsNoData: false,
    datumUrls: [],
    // 是否播放
    isPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.getCourseDetail(id)
    this.getCourseCommont(id)
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // this.initAudio()
  },
  // // 初始化
  // initAudio() {
  //   wx.setInnerAudioOption({
  //     obeyMuteSwitch: false
  //   })
  //   this.innerAudioContext = wx.createInnerAudioContext()
  //   this.innerAudioContext.onPlay(() => {
  //     console.log('开始播放录音')
  //   })
  //   this.innerAudioContext.onTimeUpdate(() => {
  //     console.log('音频播放进度更新事件')
  //     let {
  //       duration,
  //       currentTime
  //     } = this.innerAudioContext
  //     console.log(duration, currentTime)
  //   })
  //   this.innerAudioContext.onEnded(() => {
  //     console.log('// 录音播放结束')
  //   })
  //   this.innerAudioContext.onPause(() => {
  //     console.log('onPause')
  //   })
  // },
  // 初始化声音条实例
  initSound() {
    // wx.setInnerAudioOption({
    //   obeyMuteSwitch: false
    // })
    this.innerSoundContext = wx.createInnerAudioContext()
    this.innerSoundContext.onPlay(() => {
      console.log('开始播放录音')
    })
    this.innerSoundContext.onTimeUpdate(() => {
      console.log('音频播放进度更新事件')
      let {
        duration,
        currentTime
      } = this.innerSoundContext
      console.log(duration, currentTime)
    })
    this.innerSoundContext.onEnded(() => {
      console.log('// 录音播放结束')
      this.setData({
        isPlay: false
      })
    })
    this.innerSoundContext.onStop(() => {
      this.setData({
        isPlay: false
      })
    })
    this.innerSoundContext.onPause(() => {
      console.log('onPause')
      this.innerSoundContext.stop()
    })
  },
  playRecord() {
    if (this.data.isPlay) return
    let tempRecordPath = this.data.tempRecordPath
    this.innerSoundContext && this.innerSoundContext.destroy()
    this.initSound()
    this.innerSoundContext.src = tempRecordPath
    this.innerSoundContext.play()
    this.setData({
      isPlay: true
    })
  },
  // playSound() {
  //   this.innerAudioContext.src = this.data.detail.voiceUrl
  //   this.innerAudioContext.play()
  // },
  getCourseCommont(id) {
    let commentPaging = this.data.commentPaging
    app.get(app.Api.courseCommont, {
      id,
      ...commentPaging
    }).then(res => {
      if (res.commentArr.length < commentPaging.pageSize) {
        this.setData({
          IsNoData: true
        })
      }
      commentPaging.pageIndex = commentPaging.pageIndex + 1
      this.setData({
        commentArr: this.data.commentArr.concat(res.commentArr),
        commentPaging
      })
    })
  },
  getCourseDetail(id) {
    app.get(app.Api.courseDetail, {
      id,
      userId: app.userInfo.id
    }).then(res => {
      let detail = res[0]
      this.setData({
        datumUrls: detail.pictureUrls,
        detail,
        commenetBarData: {
          otherId: detail.userId,
          themeTitle: detail.courseName,
          likes: detail.likes,
          share: detail.share,
          store: detail.store,
          isLike: detail.isLike,
          isStore: detail.isStore,
          themeId: detail.id,
          likeUrl: 'groupcourseLike',
          storeUrl: 'groupcourseStore'
        }
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
    this.innerSoundContext && this.innerSoundContext.destroy()
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
    setTimeout(() => {
      app.post(app.Api.share, {
        table: 'groupcourse',
        id: this.data.detail.id
      }).then(res => {
        console.log(res)
        this.setData({
          'detail.share': this.data.detail.share + 1,
          'commenetBarData.share': this.data.detail.share + 1
        })
      })
    }, 3000)

  },
  handlerGobackClick: app.handlerGobackClick,

  goPersonal() {
    let userId = this.data.detail.userId
    wx.navigateTo({
      url: `/pages/my/invitation/invitation?userId=${userId}`,
    })
  },
  switchBtn(e) {
    console.log(e)
    let current = e.currentTarget.dataset.current
    if (current === this.data.current) return
    this.setData({
      current,
    })
  },
  completeCommentOrReply(e) {
    let param = e.detail
    let commentArr = this.data.commentArr
    param.releaseTime = '刚刚'
    console.log(param)
    if (param.themeId) {
      // 属于评论的，将内容插入到commentArr的第一个
      this.data.detail.comment++
      this.setData({
        detail: this.data.detail
      })
      commentArr.unshift(param)
    } else {
      // 属于回复表，分两种情况
      let {
        commentindex,
        replyindex
      } = this.data.indexObject
      if (commentArr[commentindex].replyArr === undefined) commentArr[commentindex].replyArr = [];
      commentArr[commentindex].replyArr.unshift(param)
    }
    this.setData({
      commentArr
    })
  },
  completeLike(e) {
    let commenetBarData = e.detail.commenetBarData
    console.log(commenetBarData)
    let detail = this.data.detail
    detail.isLike = commenetBarData.isLike
    detail.likes = commenetBarData.likes
    this.setData({
      detail,
      commenetBarData
    })
  },
  completeStore(e) {
    let commenetBarData = e.detail.commenetBarData
    let detail = this.data.detail
    detail.isStore = commenetBarData.isStore
    detail.store = commenetBarData.store
    this.setData({
      detail,
      commenetBarData
    })
  },
  toComment(e) {
    // console.log(e.detail.showTextara)
    this.setData({
      showTextara: true,
      param: {
        theme: 'groupcourse',
        themeId: this.data.detail.id,
        commenterId: app.userInfo.id,
        commenterAvatar: app.userInfo.avatarUrl,
        commenterName: app.userInfo.nickName
      }
    })
  },
  toReply(e) {
    this.setData({
      showTextara: true,
      param: e.detail.param,
      indexObject: e.detail.indexObject
    })
  },
  scrolltolower() {
    if (!this.data.IsNoData) this.getCourseCommont(this.data.detail.id)
  }
})