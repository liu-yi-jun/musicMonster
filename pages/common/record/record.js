// pages/common/record/record.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const authorize = require('../../../assets/tool/authorize.js')
const upload = require('../../../assets/request/upload')
const common = require('../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    // 控制录音当前显示的图片
    current: 0,
    // 录音四张图
    soundRecordSrcArr: [
      '/images/uploadVoice/soundRecord.png',
      '/images/uploadVoice/soundRecording.png',
      '/images/uploadVoice/play.png',
      '/images/uploadVoice/playing.png'
    ],
    // 录音当前显示图
    soundRecordSrc: '/images/uploadVoice/soundRecord.png',
    // 路音本地路径
    tempFilePath: '',
    // 控制width-none
    // true：不显示左边，false显示左边
    widthNone: true,
    // 控制clip-auto
    // false：遮掉左边部分
    // true：不遮掉
    clipAuto: false,
    // 控制录音圆环
    recordRotate: 0,
    // 控制录音时间
    recordTime: 0,
    // 录音限制时间
    limitTime: 300000,
    duration: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)

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
    authorize.authSettingRecord().then(() => {
      this.initialization()
    })
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
    this.innerAudioContext.stop()
    this.recorderManager.stop()
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
  // 初始化
  initialization() {
    // ios,即使是在静音模式下，也能播放声音
    wx.setInnerAudioOption({
      obeyMuteSwitch: false
    })
    this.recorderManager = wx.getRecorderManager()
    this.innerAudioContext = wx.createInnerAudioContext()
    this.recorderManager.onError((err) => {
      console.log(err, '// 录音失败的回调处理');
    });
    this.recorderManager.onStart(() => {
      console.log('// 开始录音')
      this.startRecord()
    })
    this.recorderManager.onStop((res) => {
      clearInterval(this.loop)
      this.setData({
        widthNone: true,
        clipAuto: false,
        recordRotate: 0,
        soundRecordSrc: this.data.soundRecordSrcArr[2],
        current: 2
      })
      const tempFilePath = res.tempFilePath
      this.innerAudioContext.src = tempFilePath
      this.setData({
        tempFilePath,
        duration: Math.floor(res.duration / 1000)
      })
    })

    this.innerAudioContext.onError((res) => {
      console.log(res, '// 播放音频失败的回调')
    })
    this.innerAudioContext.onTimeUpdate(() => {
      console.log('音频播放进度更新事件')
      this.playStart()
    })
    this.innerAudioContext.onEnded(() => {
      console.log('// 音频播放结束')
      this.playEnd()
    })
    this.innerAudioContext.onPause(() => {
      console.log('// 音频播放暂停')
      this.setData({
        soundRecordSrc: this.data.soundRecordSrcArr[2],
        current: 2
      })
    })

  },
  // 录音播放开始
  playStart() {
    let {
      duration,
      currentTime
    } = this.innerAudioContext
    console.log(duration, currentTime)
    if (duration / 2 <= currentTime && this.data.widthNone === true) {
      console.log('超过一半了')
      this.setData({
        widthNone: false,
        clipAuto: true
      })
    }
    this.setData({
      recordRotate: 360 * currentTime / duration,
    })
  },
  // 录音播放结束
  playEnd() {
    this.setData({
      recordRotate: 0,
      widthNone: true,
      clipAuto: false,
      soundRecordSrc: this.data.soundRecordSrcArr[2],
      current: 2
    })
  },

  // 点击图片调用
  soundRecord() {
    authorize.authSettingRecord().then(() => {
    let current = this.data.current
    switch (current) {
      case 0: {
        wx.showToast({
          title: '开始录音',
          icon: 'success',
          mask: true,
          duration: 2000
        })
        // 开始录音
        const options = {
          duration: this.data.limitTime,
          format: 'mp3'
        }
        setTimeout(() => {
          console.log('// 开始录音')
          this.recorderManager.start(options)

        }, 2000)
        current++
        break
      }
      case 1: {
        this.recorderManager.stop()
        wx.showToast({
          title: '录音结束',
          icon: 'success',
          duration: 2000
        })
        console.log('// 结束录音')
        // current++
        clearInterval(this.loop)
        return
      }
      case 2: {
        // 开始播放录音
        console.log('// 开始播放录音')
        this.innerAudioContext.play()
        current++
        break
      }
      case 3: {
        // this.pauseRing()
        // 暂停播放录音
        console.log('// 暂停播放录音')
        this.innerAudioContext.pause()
        current--
        break
      }
    }
    this.setData({
      soundRecordSrc: this.data.soundRecordSrcArr[current],
      current
    })
  })
  },
  // 重录
  remake() {
    wx.showModal({
      title: '提示',
      content: '是否删除该录音',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.innerAudioContext.stop()
          this.setData({
            soundRecordSrc: this.data.soundRecordSrcArr[0],
            current: 0,
            recordRotate: 0,
            recordTime: 0,
            tempFilePath: '',
            widthNone: true,
            clipAuto: false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 开始录音
  startRecord() {
    let recordRotate = this.data.recordRotate;
    let limitTime = this.data.limitTime
    let recordTime = this.data.recordTime
    this.loop = setInterval(() => {
      recordTime++;
      if (recordTime >= limitTime / 2000 && this.data.widthNone === true) {
        this.setData({
          widthNone: false,
          clipAuto: true
        })
      }
      this.setData({
        recordRotate: 360000 / limitTime * recordTime,
        recordTime
      })
    }, 1000)
  },
  confirm() {
    this.recorderManager.stop()
    clearInterval(this.loop)
    setTimeout(() => {
      let {
        tempFilePath,
        duration
      } = this.data
      var pages = getCurrentPages();
      var lastpage = pages[pages.length - 2]
      lastpage.recordResult({
        tempFilePath,
        duration
      })
      wx.navigateBack({
        delta: 1,
      })
    }, 1500)

  }
})