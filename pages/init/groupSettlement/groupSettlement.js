// pages/init/groupSettlement/groupSettlement.js
const common = require('../../../assets/tool/common.js')
const upload = require('../../../assets/request/upload.js')
const authorize = require('../../../assets/tool/authorize')
import WxValidate from '../../../assets/tool/WxValidate'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    height: 0,
    tempFilePaths: [],
    tempUrls: [],
    dialogShow: false,
    msgAuthorizationShow: false,
    requestId: [app.InfoId.joinGroup]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.newForm = {}
    this.initValidate()
  },
  //验证规则函数
  initValidate() {
    const rules = {
      groupName: {
        required: true,
        minlength: 6,
        maxlength: 24
      },
    }
    const messages = {
      groupName: {
        required: '请填写小组名称',
        minlength: '小组名称不少于6个字符',
        maxlength: '小组名称不大于24个字符'
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


    // wx.createSelectorQuery()
    // .select('#yy')
    // .fields({
    //   node: true,
    //   size: true,
    // })
    // .exec(res=> {
    //   console.log(res)
    // })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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

  // 选择图片
  chooseGroupLogo() {
    // {isCompress:false}
    // wx.chooseImage({
    //   count: 1,
    //   success:res=> {

    //   }
    // })
    common.chooseImage(1).then(res => {
      wx.createSelectorQuery()
        .select('#canvasLogo')
        .fields({
          node: true,
          size: true,
        })
        .exec(this.canvasLogo.bind(this))
      this.tempFilePaths = res.tempFilePaths
      this.setData({
        tempUrls: res.tempFilePaths
      })
    })
  },

  canvasLogo(res) {

    const width = res[0].width
    const height = res[0].height
    const canvas = res[0].node
    const ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // 画大圆
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 2, -Math.PI / 6, 5 * Math.PI / 3)
    // ctx.stroke();
    // A点
    let radius = width / 2
    let Ax = radius + radius * Math.sin(Math.PI / 6)
    let Ay = radius - radius * Math.cos(Math.PI / 6)
    let Bx = radius + radius * Math.cos(Math.PI / 6)
    let By = radius - radius * Math.sin(Math.PI / 6)
    let Cx = (Bx - Ax) / 2 + Ax
    let Cy = (By - Ay) / 2 + Ay
    let Cradius = Math.sqrt((Bx - Ax) ** 2 + (By - Ay) ** 2) / 2
    let horn = Math.asin((By - Cy) / Cradius)
    ctx.lineTo(Ax, Ay)
    ctx.arc(Cx, Cy, Cradius, horn + Math.PI, horn, true)
    ctx.closePath()
    // ctx.stroke();
    let logo = canvas.createImage()
    logo.src = this.tempFilePaths[0]
    logo.onload = (res) => {
      wx.getImageInfo({
        src: this.tempFilePaths[0],
        success: imgInfo => {
          console.log(imgInfo, 'imgInfo')
          let originWh
          if (imgInfo.height > imgInfo.width) {
            originWh = imgInfo.width
            ctx.clip()
            ctx.drawImage(logo, 0, (imgInfo.height - imgInfo.width) / 2, originWh, originWh, 0, 0, width, height)
            wx.canvasToTempFilePath({
              canvas,
              width,
              height,
              destWidth: width,
              destHeight: height,
              success: res => {
                console.log(res.tempFilePath)
                this.setData({
                  tempFilePaths: [res.tempFilePath]
                })
              }
            })
          } else {
            originWh = imgInfo.height
            ctx.clip()
            ctx.drawImage(logo, (imgInfo.width - imgInfo.height) / 2, 0, originWh, originWh, 0, 0, width, height)
            wx.canvasToTempFilePath({
              canvas,
              width,
              height,
              destWidth: width,
              destHeight: height,
              success: res => {
                console.log(res.tempFilePath)
                this.setData({
                  tempFilePaths: [res.tempFilePath]
                })
              }
            })
          }
        }
      })
    }
  },
  // 预览图片

  previewImage() {
    common.previewImage(this.data.tempUrls)
  },
  // 删除图片
  deleteImg() {
    common.vibrateShort().then(() => {
      common.Tip('删除图片', '提示', '确定', true).then(res => {
        if (res.confirm) {
          this.setData({
            tempFilePaths: []
          })
        }
      })
    })
  },
  // 上传图片
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'groups'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 进行校验
  validate(params) {
    return new Promise((resolve, reject) => {
      let tempFilePaths = this.data.tempFilePaths
      if (!tempFilePaths.length) return reject('请添加小组logo')
      if (!this.WxValidate.checkForm(params)) {
        console.log(this.WxValidate.errorList)
        const error = this.WxValidate.errorList[0].msg
        return reject(error)
      }

      resolve(params)
    })
  },
  // 创建小组
  createGroup(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.createGroup, data, {
        loading: false
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 去首页
  goHome() {
    app.switchData.isSwitchGroup = true
    wx.navigateBack({
      delta: 2,
    })
    // wx.switchTab({
    //   url: "/pages/home/home"
    // })
  },
  create(e) {
    if (app.userInfo) {
      this.formSubmit(e)

    } else {
      this.setData({
        dialogShow: true
      })
    }
  },
  // 提交表单
  async formSubmit(e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    let params = {
      ...this.newForm
    }
    try {
      params = await this.validate(params)
      common.showLoading('创建中')
      const imgUrls = await this.uploadImg(this.data.tempFilePaths)
      const result = await this.createGroup({
        ...params,
        userId: app.userInfo.id,
        groupLogo: imgUrls[0]
      })
      app.userInfo = result
      console.log(result)
      wx.hideLoading()
      common.Toast('创建成功', 1500, 'success')
      setTimeout(() => {
        this.goHome()
      }, 1500)
      // authorize.isSubscription().then(res => {
      //   if (res.mainSwitch && (!res.itemSettings || !res.itemSettings[app.InfoId.joinGroup])) {
      //     common.Tip('接下来将授权"申请加入小组"通知。授权时请勾选“总是保持以上选择,不再询问”，后续有其他用户加入本小组将会第一时间通知到您', '创建成功').then(res => {
      //       if (res.confirm) {
      //         authorize.alwaysSubscription([app.InfoId.joinGroup]).then(res => {
      //           this.goHome()
      //         })
      //       }
      //     })
      //   } else {
      //     common.Tip('小组已创建完成，快邀请您的伙伴加入吧!', '提示').then(res => {
      //       if (res.confirm) {
      //         authorize.alwaysSubscription([app.InfoId.joinGroup]).then(res => {
      //           this.goHome()
      //         })
      //       }
      //     })
      //   }
      // })
    } catch (err) {

      common.Tip(err)
      console.log(err)
      wx.hideLoading()
    }
  },
  async changeExamine(event) {
    // if (Number(event.detail.value)) {
    //   authorize.newSubscription(this.data.requestId, {
    //     cancelText: '取消'
    //   }).then((res) => {
    //     wx.hideLoading()
    //     if (res.type === 1) {
    //       common.Tip('为了更好通知到您，需要您授权相应权限，请接下来按照提示操作').then(res => {
    //         this.setData({
    //           msgAuthorizationShow: true
    //         })
    //         authorize.infoSubscribe(this.data.requestId).then(res => {
    //           this.setData({
    //             msgAuthorizationShow: false
    //           })
    //         })
    //       })
    //     } else if (res.type === -1) {
    //       if (res.result.confirm) {
    //         // 去开启
    //         wx.openSetting({
    //           success(res) {}
    //         })
    //       }
    //     }
    //   })
    // }
    this.newForm.examine = event.detail.value
  },
  changePrivate(event) {
    this.newForm.privates = event.detail.value
  },
  inputIntroduce(e) {
    this.newForm.introduce = e.detail.value
  },
  inputGroupName(e) {
    this.newForm.groupName = e.detail.value
  }
})