// pages/tool/tapPractice/tapPractice.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const common = require('../../../assets/tool/common')
const upload = require('../../../assets/request/upload')
const core = require('../../../assets/tool/core')
const authorize = require('../../../assets/tool/authorize')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    // 表示现在状态
    // 0未开始、1录音中、2等待播放、3播放中
    current: 0,
    // 录音时长，单位s
    recordTime: 60,
    // 每多少毫秒渲染一次
    interval: 100,
    // 录音本地路径
    tempFilePath: '',
    // 存放progress_box的宽高
    progressBox: {},
    // 录音完成后的时长
    duration: 0,
    // 声音条的最长与最短的宽度,单位rpx
    voiceBar: {
      minWidth: 110,
      maxWidth: 330,
    },
    // 播放条分页
    pagingTapRecord: {
      pageSize: 10,
      pageIndex: 1,
      isNoData: false,
    },
    // 控制切换
    flag: 'practice',
    tapDetail: {},
    tapRecord: [],
    cardCurrent: 0,
    imgheights: [],
    imgCurrent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getTapDetail(options.id)
  },


  toLike(e) {
    let {
      index,
      islike
    } = e.currentTarget.dataset
    let tapRecord = this.data.tapRecord
    let soundRow = tapRecord[index]
    soundRow.isLike = !islike
    soundRow.isLike ? ++soundRow.likes : --soundRow.likes
    this.setData({
      tapRecord
    }, () => {
      core.operateMultiple(app.Api.groupCardRecordLike, {
        operate: soundRow.isLike,
        relation: {
          userId: app.userInfo.id,
          themeId: soundRow.id
        }
      }, index)
    })

  },
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
      let tapRecord = this.data.tapRecord
      tapRecord[this.j].isPlay = false
      this.setData({
        tapRecord
      })
    })
    this.innerSoundContext.onStop(() => {
      let tapRecord = this.data.tapRecord
      tapRecord[this.j].isPlay = false
      this.setData({
        tapRecord
      })
    })
    this.innerSoundContext.onPause(() => {
      console.log('onPause')
      this.innerSoundContext.stop()
    })
  },

  playSound(e) {
    console.log(e)
    let {
      recordurl,
      j
    } = e.currentTarget.dataset
    let tapRecord = this.data.tapRecord
    let oldJ = this.j
    let flag = false
    if ((oldJ !== j)) {
      flag = true
    } else if (!tapRecord[j].isPlay) {
      flag = true
    }
    if (flag) {
      this.j = j
      if (oldJ !== undefined) {
        tapRecord[oldJ].isPlay = false
      }
      tapRecord[j].isPlay = true;
      this.setData({
        tapRecord
      })
      this.innerSoundContext && this.innerSoundContext.destroy()
      this.initSound()
      this.innerSoundContext.src = recordurl
      this.innerSoundContext.play()
    }

  },
  getTapDetail(id) {
    let pagingTapRecord = this.data.pagingTapRecord
    app.get(app.Api.getTapDetail, {
      pageSize: pagingTapRecord.pageSize,
      pageIndex: pagingTapRecord.pageIndex,
      tapId: id,
      userId: app.userInfo.id
    }).then(res => {
      console.log(res,111111111111);
      if (res.length < pagingTapRecord.pageSize) {
        this.setData({
          'pagingTapRecord.isNoData': true
        })
      }
      pagingTapRecord.pageIndex = pagingTapRecord.pageIndex + 1
      let tapRecord = this.initSoundWidth(res.tapRecord)
      if(res.tapDetail.tapVideoLink.includes('mp4')) {
        this.setData({
          mp4Video:true
        })
      }else {
        res.tapDetail.tapVideoLink = this.getParam(res.tapDetail.tapVideoLink, 'vid')
      }
   
      this.setData({
        pagingTapRecord,
        tapDetail: res.tapDetail,
        tapRecord: this.data.tapRecord.concat(tapRecord)
      })
    })
  },
  getParam(url, name) {
    if(url.includes('http')){
      try {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.split('?')[1].match(reg);
        if (r != null) {
          return r[2];
        }
        return ""; //如果此处只写return;则返回的是undefined
      } catch (e) {
        return ""; //如果此处只写return;则返回的是undefined
      }
    }else {
      return url
    }

  },

  // 处理声音条的宽度
  initSoundWidth(tapRecord) {
    const recordTime = this.data.recordTime
    const {
      minWidth,
      maxWidth
    } = this.data.voiceBar
    const changeRange = maxWidth - minWidth
    tapRecord.forEach((item, index) => {
      item.width = item.duration * changeRange / recordTime + minWidth
      item.width >= maxWidth ? item.width = maxWidth : item.width
    })
    return (tapRecord)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawProgressbg()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    authorize.authSettingRecord().then(() => {
      this.initialization()
      this.getProgressBoxInfo()
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.innerAudioContext.destroy()
    this.recorderManager.stop()
    this.innerSoundContext && this.innerSoundContext.destroy()
  },
  onHide() {
    this.innerSoundContext && this.innerSoundContext.stop()
  },
  handlerGobackClick: app.handlerGobackClick,
  // 预览图片
  previewImage(e) {
    console.log(e)
    let url = e.target.dataset.preview
    let tapPicLink = this.data.tapDetail.tapPicLink
    common.previewImage(tapPicLink, url)
  },
  switch (e) {
    let flag = e.target.dataset.flag
    this.setData({
      flag
    })
  },
  getProgressBoxInfo() {
    wx.createSelectorQuery().select('#progress_box').boundingClientRect(rect => {
      if (rect) {
        this.setData({
          progressBox: {
            width: rect.width,
            height: rect.height
          }
        })
      }
    }).exec()
  },
  // 初始化录音，与播放实例
  initialization() {
    // ios,即使是在静音模式下，也能播放声音
    // wx.setInnerAudioOption({
    //   obeyMuteSwitch: false
    // })
    this.recorderManager = wx.getRecorderManager()
    this.innerAudioContext = wx.createInnerAudioContext()
    this.recorderManager.onError((err) => {
      console.log(err, '// 录音失败的回调处理');
    });
    this.recorderManager.onStart(() => {
      console.log('// 录音开始')
      // 录音计数
      this.recordingCount(this.data.recordTime)
    })
    this.recorderManager.onStop((res) => {
      console.log('// 录音结束')
      wx.showToast({
        title: '录音结束',
        icon: 'success',
        duration: 2000
      })
      const tempFilePath = res.tempFilePath
      this.innerAudioContext.src = tempFilePath
      this.setData({
        tempFilePath,
        duration: Math.floor(res.duration / 1000)
      })
    })

    this.innerAudioContext.onPlay(() => {
      console.log('开始播放录音')
    })
    this.innerAudioContext.onTimeUpdate(() => {
      console.log('音频播放进度更新事件')
      // 播放计数
      this.playCount()
    })
    this.innerAudioContext.onEnded(() => {
      this.drawCircle(0)
      this.setData({
        current: 2
      })
      console.log('// 录音播放结束')
    })
    this.innerAudioContext.onPause(() => {
      console.log('// 音频播放暂停')
      if (this.data.current === 3) {
        this.setData({
          current: 2
        })
      }
    })
  },
  // 开始录音
  startRecord() {
    authorize.authSettingRecord().then(() => {
      this.innerSoundContext && this.innerSoundContext.stop()

      const options = {
        duration: this.data.recordTime * 1000,
        format: 'mp3'
      }
      this.setData({
        current: 1
      })
      wx.showToast({
        title: '开始录音',
        icon: 'success',
        mask: true,
        duration: 2000
      })
      setTimeout(() => {
        this.recorderManager.start(options)
      }, 2000)
    })
  },
  // 结束录音
  endRecord() {
    this.drawCircle(0)
    clearInterval(this.loop);
    this.recorderManager.stop()
    this.setData({
      current: 2
    })
  },
  // 播放录音
  startPlay() {
    this.innerAudioContext.play()
    this.setData({
      current: 3
    })
  },
  // 删除录音
  deleteSound() {
    wx.showModal({
      title: '提示',
      content: '是否删除该录音',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.innerAudioContext.stop()
          this.drawCircle(0)
          this.setData({
            current: 0,
            tempFilePath: '',
            duration: 0
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 暂停播放录音
  pausePlay() {
    this.innerAudioContext.pause()
    this.setData({
      current: 2
    })
  },
  drawProgressbg: function () {
    let {
      width,
      height
    } = this.data.progressBox
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg', this)
    if (!ctx) return
    ctx.setLineWidth(2); // 设置圆环的宽度
    ctx.setStrokeStyle('#757175'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(width / 2, height / 2, height / 2 - 1, 0.8 * Math.PI, 2.2 * Math.PI, false);
    //设置一个原点(36,36)，半径为35的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    let {
      width,
      height
    } = this.data.progressBox
    var ctx = wx.createCanvasContext('canvasProgress', this);
    ctx.setLineWidth(2);
    ctx.setStrokeStyle('#fff');
    ctx.setLineCap('round')
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, height / 2 - 1, 0.8 * Math.PI, (step + 0.8) * Math.PI, false);
    ctx.stroke();
    ctx.draw()
  },
  recordingCount: function (totalTime) {
    let count = 0
    const interval = this.data.interval
    const total = totalTime * 1000 / interval
    console.log(totalTime, interval, total)
    this.loop = setInterval(() => {
      console.log(count, 'count')
      if (count < total) {
        this.drawCircle(count * (1.4 / total))
        count++;
      } else {
        clearInterval(this.loop);
        this.drawCircle(0)
        this.recorderManager.stop()
        this.setData({
          current: 2
        })
      }
    }, interval)
  },
  playCount() {
    let {
      duration,
      currentTime
    } = this.innerAudioContext
    console.log(duration, currentTime)
    this.drawCircle(currentTime * (1.4 / duration))
  },
  // 发送录音
  async sendTapRecord() {
    try {
      common.showLoading('发送中')
      let recordUrl = await this.uploadTapRecord(this.data.tempFilePath)
      let result = await this.issueTapRecord(recordUrl)
      console.log('1111111111111111111', result)
      result[0].avatarUrl = app.userInfo.avatarUrl
      await this.setSoundRowArr(result[0])

      common.Toast('已发送')
      this.drawCircle(0)
      this.setData({
        current: 0,
        tempFilePath: '',
        duration: 0
      })
    } catch (err) {
      console.log(err)
      common.Toast(err)
    }
  },
  setSoundRowArr(soundRow) {
    return new Promise((resolve, reject) => {
      let tapRecord = this.data.tapRecord
      let soundRows = this.initSoundWidth([soundRow])
      if (tapRecord.length >= 4) {
        // 插入到第三下标
        tapRecord.splice(3, 0, soundRows[0])
      } else {
        // 插入到最后
        tapRecord.push(soundRows[0])
      }
      resolve()
      this.setData({
        tapRecord
      })
    })
  },
  // 上传录音
  uploadTapRecord(tempImgParh) {
    return new Promise((resolve, reject) => {
      let option = {
          userId: app.userInfo.id,
          type: 'voice',
          module: 'taprecord'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 发布录音
  issueTapRecord(recordUrl) {
    return new Promise((resolve, reject) => {
      let {
        tapDetail,
        duration
      } = this.data
      let {
        id,
        avatarUrl
      } = app.userInfo
      app.post(app.Api.issueTapRecord, {
        userid: id,
        tapId: tapDetail.id,
        recordUrl,
        duration
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  scrolltolower() {
    if (!this.data.pagingTapRecord.isNoData) {
      this.getTapDetail(this.data.tapDetail.id)
    }
  },
  imageLoad: function (e) { //获取图片真实宽度  
    var query = wx.createSelectorQuery();
    query.select('#MusicscoreWrap').boundingClientRect(rect => {
      console.log(rect.width)
      var imgwidth = e.detail.width
      var imgheight = e.detail.height
      var ratio = imgwidth / imgheight
      var viewHeight = rect.width / ratio
      var imgheight = viewHeight
      var imgheights = this.data.imgheights
      console.log("imgheights11", imgheights)
      //把每一张图片的对应的高度记录到数组里 +90是因为我给图片了一个width:100% 让图片宽撑满屏幕 如把100%去掉这个+90可去掉
      imgheights[e.target.dataset.index] = imgheight;
      console.log("imgheights22", imgheights)
      this.setData({
        imgheights: imgheights
      })
    }).exec()
  },
  bindchange: function (e) {
    this.setData({
      imgCurrent: e.detail.current
    })
  },
})