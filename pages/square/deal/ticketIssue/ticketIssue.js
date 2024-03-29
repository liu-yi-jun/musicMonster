// pages/square/deal/ticketIssue/ticketIssue.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
const common = require('../../../../assets/tool/common')
const upload = require('../../../../assets/request/upload')
const authorize = require('../../../../assets/tool/authorize.js')
import WxValidate from '../../../../assets/tool/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    avatarUrl: '',
    nickName: '',
    tempImagePaths: [],
    tempVideoPath: '',
    // 附近位置,
    index: 0,
    mks: [],
    dialogShow: true,
    money: 0,
    msgAuthorizationShow: false,
    requestId: [app.InfoId.like, app.InfoId.content, app.InfoId.band]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.newForm = {}
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getUserInfo()
    this.initValidate()
  },
  getUserInfo() {
    let {
      avatarUrl,
      nickName
    } = app.userInfo
    this.setData({
      avatarUrl,
      nickName
    })
  },
  //验证规则函数
  initValidate() {
    const rules = {
      title: {
        required: true,
      },
      activityTime: {
        required: true,
      },
      activityLocation: {
        required: true,
      },
      number: {
        required: true,
      },
      contact: {
        required: true,
      }
    }
    const messages = {
      title: {
        required: '请输入标题',
      },
      activityTime: {
        required: '请输入时间',
      },
      activityLocation: {
        required: '请输入地点',
      },
      number: {
        required: '请输入数量',
      },
      contact: {
        required: '请输入联系方式',
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  inputMoney(data) {
    this.setData({
      money: data.detail.money
    })
  },
  chooseImage(data) {
    this.setData({
      tempImagePaths: data.detail.tempImagePaths
    })
  },
  chooseVideo(data) {
    this.setData({
      tempVideoPath: data.detail.tempVideoPath
    })
  },
  // 获取定位
  getLocation() {
    authorize.getLocation(data => {
      if (data.err) return
      if (data.success) {
        const location = {
          latitude: data.latitude,
          longitude: data.longitude
        }
        tool.reverseGeocoder(location).then(data => {
          console.log(data)
          this.setData({
            mks: data.mks
          }, () => {
            wx.hideLoading()
          })
        }).catch(err => console.log(err))
      } else if (data.warning) {
        //用户拒绝位置信息授权
        console.log(data)
      }
    })
  },
  bindtopicPickerChange(e) {
    this.setData({
      topicIndex: e.detail.value
    })
  },
  previewImage(ev) {
    //查看对应的图片
    const id = ev.target.dataset.id;
    common.previewImage([this.data.tempImagePaths[id]])
  },
  // 进行校验
  validate(params) {
    let {
      tempVideoPath,
      tempImagePaths,
      mks,
      money
    } = this.data
    let location = ''
    return new Promise((resolve, reject) => {
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }
      if (!tempImagePaths.length) return reject('需要添加商品图片哦')
      if (!money) return reject('请添加转让票务的金额')
      if (mks.length) {
        location = mks[this.data.index].title
      }
      return resolve({
        userId: app.userInfo.id,
        pictureUrls: tempImagePaths || [],
        videoUrl: tempVideoPath || '',
        location,
        price: money,
        ...params
      })
    })
  },

  // 提交表单
  async formSubmit(e) {
    let params = {
      ...this.newForm
    }
    try {
      params = await this.validate(params)
      common.showLoading()
      authorize.newSubscription(this.data.requestId, {
        cancelText: '继续发布'
      }).then((res) => {
        wx.hideLoading()
        if (res.type === 1) {
          common.Tip('为了更好通知到您，需要您授权相应权限，请接下来按照提示操作').then(res => {
            this.setData({
              msgAuthorizationShow: true
            })
            authorize.infoSubscribe(this.data.requestId).then(res => {
              this.setData({
                msgAuthorizationShow: false
              })
              this.submitTeam(params)
            })
          })
        } else if (res.type === -1) {
          if (!res.result.confirm) {
            this.submitTeam(params)
          } else {
            // 去开启
            wx.openSetting({
              success(res) {}
            })
          }
        } else if (res.type === 0) {
          this.submitTeam(params)
        }
      })
    } catch (err) {
      console.log(err)
      common.Tip(err)
      wx.hideLoading()
    }
  },
  async submitTeam(params) {
    let {
      tempVideoPath,
      tempImagePaths
    } = this.data
    common.showLoading('发布中')
    if (tempVideoPath) params.videoUrl = await this.uploadVideo(tempVideoPath)
    if (tempImagePaths.length) params.pictureUrls = await this.uploadImg(tempImagePaths)
    const result = await this.ticketIssue(params)
    console.log(result)
    if (result.affectedRows) {
      this.godeal()
    }
    common.Toast('已发布')
  },
  godeal() {
    app.ticketIssueBack = true
    wx.navigateBack()
  },
  // 上传视频
  uploadVideo(tempImgParh) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'video',
          module: 'ticket'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadFile(app.Api.uploadImg, tempImgParh, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },

  // 上传图片
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      // app.userInfo.id
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'ticket'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 添加票务
  ticketIssue(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.ticketIssue, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => {
        wx.hideLoading()
        common.Tip(err)
        reject(err)
      } )
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
  inputTitle(e) {
    this.newForm.title = e.detail.value
  },
  inputAdditional(e) {
    this.newForm.additional = e.detail.value
  },
  inputActivityTime(e) {
    this.newForm.activityTime = e.detail.value
  },
  inputActivityLocation(e) {
    this.newForm.activityLocation = e.detail.value
  },
  inputNumber(e) {
    this.newForm.number = e.detail.value
  },
  inputContact(e) {
    this.newForm.contact = e.detail.value
  }
})