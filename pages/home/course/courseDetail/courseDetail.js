// pages/home/course/courseDetail/courseDetail.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const core = require('../../../../assets/tool/core')
const common = require('../../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
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
    isPlay: false,
    actIndex: 0,
    barList: [{
      name: '评论',
    }],
    list: [{
      name: '举报',
      open_type: '',
      functionName: 'handleReport'
    }],
    mp4Video: false,
    intoId: '',
    userId: 0,
    dialogShow:false,
    isHome:false
    // list: [{
    //   name: '分享',
    //   open_type: 'share',
    //   functionName: ''
    // }, {
    //   name: '收藏',
    //   open_type: '',
    //   functionName: 'handleStore'
    // }, {
    //   name: '举报',
    //   open_type: '',
    //   functionName: 'handleReport'
    // }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.id = options.id
    this.table = 'groupcourse'
    if (!app.userInfo) {
      this.setData({
        isHome: true
      })
      app.initLogin().then(() => {
        if (app.userInfo) {
          this.initCourseDetail()
        } else {
          this.setData({
            dialogShow: true
          })
        }
      })
    } else {
      this.initCourseDetail()
    }
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // this.initAudio()
  },
  initCourseDetail() {
    this.setData({
      userId: app.userInfo.id
    })
    this.getCourseDetail(this.id)
    this.getCourseCommont(this.id)
  },
  handleGetUserInfo() {
    this.initCourseDetail()
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
      if (detail.videoUrl.includes('mp4')) {
        this.setData({
          mp4Video: true
        })
      } else {
        this.setData({
          mp4Video: false
        })
      }
      if (detail.pictureUrls && detail.pictureUrls.length) {
        this.setData({
          barList: [{
              name: '评论',
            },
            {
              name: '课程资料',
            }
          ],
          actIndex: 1
        })
      } else {
        this.setData({
          barList: [{
            name: '评论',
          }],
          actIndex: 0
        })
      }
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
      console.log(app.myGrouList);
      if (app.myGrouList ) {
        app.myGrouList.forEach((item, index) => {
          if (item.groupId === detail.groupId && item.groupDuty !== -1) {
            return this.flag = true
          }
        })
      }
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
    if (app.addCourseBack) {
      this.data.commentArr = []
      this.data.commentPaging.pageIndex = 1
      this.data.IsNoData = false
      this.data.mp4Video = false
      this.getCourseDetail(this.id)
      this.getCourseCommont(this.id)
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
        id: this.data.detail.id,
        otherId: this.data.detail.userId,
        themeTitle: this.data.detail.courseName
      }).then(res => {
        console.log(res)
        this.setData({
          'detail.share': this.data.detail.share + 1,
          'commenetBarData.share': this.data.detail.share + 1
        })
      })
    }, 3000)
    return {
      title: '课程分享',
      path: `/pages/home/course/courseDetail/courseDetail?id=${this.id}`,
    }

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
    if (!param.isReply) {
      // 属于评论的，将内容插入到commentArr的第一个
      this.data.detail.comment++
      this.setData({
        detail: this.data.detail,
        intoId: 'comment'
      })
      commentArr.unshift(param)
    } else {
      // 属于回复表，分两种情况
      let {
        commentindex,
        replyindex
      } = this.data.indexObject
      if (commentArr[commentindex].replyArr === undefined) commentArr[commentindex].replyArr = [];
      commentArr[commentindex].replyArr.push(param)
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
    if (this.flag) {
      // console.log(e.detail.showTextara)
      this.setData({
        showTextara: true,
        param: {
          type: '课程',
          themeUserId: this.data.detail.userId,
          themeTitle: this.data.detail.courseName,
          theme: this.table,
          themeId: this.data.detail.id,
          commenterId: app.userInfo.id,
          commenterAvatar: app.userInfo.avatarUrl,
          commenterName: app.userInfo.nickName
        }
      })
    } else {
      common.Tip('您还未成为该小组成员，暂不能发表评论')
    }
  },
  toReply(e) {
    if (this.flag) {
      let param = e.detail.param
      param.theme = this.table
      param.themeId = this.data.detail.id
      param.themeTitle = this.data.detail.courseName
      param.isReply = true
      this.setData({
        showTextara: true,
        param,
        indexObject: e.detail.indexObject
      })
    } else {
      common.Tip('您还未成为该小组成员，暂不能回复评论')
    }
  },
  scrolltolower() {
    if (!this.data.IsNoData && this.data.actIndex == 0) this.getCourseCommont(this.data.detail.id)
  },
  showMenu(e) {
    if (app.userInfo.id === this.data.detail.userId) {
      let list = [{
        name: '编辑',
        open_type: '',
        functionName: 'handleEdit'
      }, {
        name: '删除',
        open_type: '',
        functionName: 'hadleDelete'
      }]
      this.setData({
        list
      }, () => {
        this.selectComponent('#menu').show();
      })
    } else {
      this.selectComponent('#menu').show();
    }
  },
  handleEdit(e) {
    let detail = JSON.stringify(this.data.detail)
    wx.navigateTo({
      url: `/pages/home/course/addCourse/addCourse?detail=${detail}&isEdit=1`,
    })
  },
  handleStore() {
    let detail = this.data.detail
    core.operateStore(app.Api['groupcourseStore'], {
      operate: true,
      relation: {
        userId: app.userInfo.id,
        themeId: detail.id
      },
    }).then(res => {
      if (res.modify) {
        common.Toast('收藏成功')
      } else {
        common.Toast('动态已存在')
      }
    })
  },
  handleReport() {
    core.handleReport({
      userId: app.userInfo.id,
      theme: this.table,
      themeId: this.data.detail.id
    })
  },
  hadleDelete(e) {
    common.Tip('是否删除该课程', '提示', '确认', true).then(res => {
      if (res.confirm) {
        console.log('用户点击确定')
        this.deleteDynamic(e)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    })
  },
  deleteDynamic(e) {
    common.showLoading('删除中')
    let tableName = 'groupcourse'
    let detail = this.data.detail
    app.post(app.Api[tableName + 'Delete'], {
      tableName,
      id: detail.id
    }, {
      loading: false
    }).then(res => {
      if (res.affectedRows) {
        common.Toast('已删除')
        setTimeout(() => {
          app.courseDeleteBack = true
          wx.navigateBack()
        }, 1500)
      } else {
        common.Toast('该课程已不存在')
      }
    })
  },
  followUser() {
    let detail = this.data.detail
    this.setData({
      'detail.isFollow': !detail.isFollow,
    }, () => {
      core.operateFollow(app.Api.followUser, {
        operate: detail.isFollow,
        relation: {
          userId: app.userInfo.id,
          otherId: detail.userId,
        },
        extra: {
          nickName:app.userInfo.nickName,
        }
      })
    })
  },
  //切换btn 
  switchBtn(e) {
    let actIndex = e.detail.actIndex
    if (actIndex === this.data.actIndex) return
    this.setData({
      actIndex
    })
  },
})