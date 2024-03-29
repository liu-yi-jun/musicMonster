// pages/home/home.js
let app = getApp()
let common = require('../../assets/tool/common')
let tool = require('../../assets/tool/tool')
let core = require('../../assets/tool/core')
let authorize = require('../../assets/tool/authorize')
let socket = require('../../assets/request/socket')
const {
  Tip
} = require('../../assets/tool/common')

let Style = [{
    index: 0,
    bottom: 85,
    scaleX: 0.2,
    scaleY: 0.1,
    opacity: 0,
  },
  {
    index: 1,
    bottom: 79,
    scaleX: 0.4,
    scaleY: 0.2,
    opacity: 1,
  },
  {
    index: 2,
    bottom: 68,
    scaleX: 0.5,
    scaleY: 0.3,
    opacity: 1,
  },
  {
    index: 3,
    bottom: 54,
    scaleX: 0.6,
    scaleY: 0.4,
    opacity: 1,
  },
  {
    index: 4,
    bottom: 36,
    scaleX: 0.8,
    scaleY: 0.6,
    opacity: 1,
  },
  {
    index: 5,
    bottom: 8,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
  },
  {
    index: 6,
    bottom: -50,
    scaleX: 1,
    scaleY: 1,
    opacity: 0,
  },

]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 点击第一个头像后显示光圈
    dynamicIsShow: false,
    // 控制右下角三角show
    tabBarBtnShow: false,
    // 打卡、课程功能板块
    functionBarShow: false,
    // 控制弹出框
    dialogShow: false,
    // 是否关注
    isFollow: false,
    // 小组信息
    groupInfo: {},
    groupNameTop: '',
    groupNamebuttom: '',
    style: JSON.parse(JSON.stringify(Style)),
    isNotData: false,
    styleLeight: 7,
    ableIndex: 1,
    SM_UpPointer: 0,
    SM_DownPointer: 0,
    MB_UpPointer: 0,
    MB_DownPointer: 0,
    MB_Index: 0,
    // 动态发布按钮
    switchIssue: false,
    showMember: [],
    pageSize: 20,
    pageIndex: 1,
    minID: 0,
    member: [],
    showContent: {},
    showVideo: false,
    homeGuide: false,
    leftGuide: true,
    bottomGuide: false,
    indexGuide: false,
    issueGuide: false,
    cross: false,
    showFakeTab: false,
    isLoop: false,
    lessMember: false,
    isShowGroup: false,
    isShowPull: false,
    showCode: false,
    msgAuthorizationShow: false,
    requestId: [app.InfoId.examine, app.InfoId.joinGroup]
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
    // let {
    //   groupId: myGroupId,
    //   groupDuty
    // } = app.userInfo


    // this.getGroupInfo(myGroupId)
    // this.groupPagingGetGroupdynamics(myGroupId).then(() => {
    //   this.urlPush()

    // })
    // if (groupDuty === -1) {
    //   let tip = '请求1小时后自动失效，可重新选择小组'
    //   common.Tip(tip, '等待审批')
    // }

    this.init()
  },
  init() {
    app.initLogin().then(() => {
      if (app.userInfo) {
        if (!app.TabBar.homeTabBar) {
          app.TabBar.homeTabBar = this.getTabBar()
        }
        let groupId = app.userInfo.groupId
        this.setData({
          myId: app.userInfo.id
        })
        socket.initSocketEvent()
        if (groupId) {
          // 获取信息
          this.getGroupInfo(groupId).then(() => {
            this.setData({
              isShowGroup: true
            })
          })
          this.groupPagingGetGroupdynamics(groupId).then(() => {
            this.urlPush()
          })
        } else {
          // 没有信息等待选择
          // this.getTabBar().setData({
          //   show: false
          // })
          this.setData({
            // tabBarBtnShow: true,
            isShowGroup: false,
            isShowPull: false
          })
        }
      } else {
        // 新用户
        // let codeCheck = wx.getStorageSync('codeCheck')
        // if (!codeCheck) {
        //   this.setData(({
        //     showCode: true
        //   }))
        // } else {
          app.globalData.codePass = true
        // }
      }
    })
  },
  // 

  // getServerUserInfo() {
  //   app.get(app.Api.getServerUserInfo, {

  //   }, {
  //     loading: false
  //   }).then(res => {
  //     if (res.userInfo) {
  //       // 有用户信息，存入app
  //       app.userInfo = res.userInfo
  //       let groupId = app.userInfo.groupId
  //       this.setData({
  //         myId: app.userInfo.id
  //       })
  //       socket.initSocketEvent()
  //       if (groupId) {
  //         // 获取信息
  //         this.getGroupInfo(groupId).then(() => {
  //           this.setData({
  //             isShowGroup: true
  //           })
  //         })
  //         this.groupPagingGetGroupdynamics(groupId).then(() => {
  //           this.urlPush()
  //         })
  //       } else {
  //         // 没有信息等待选择
  //         this.getTabBar().setData({
  //           show: false
  //         })
  //         this.setData({
  //           tabBarBtnShow: true,
  //           isShowGroup: false,
  //           isShowPull: false
  //         })
  //       }
  //     } else {
  //       // 没有用户信息等待用户授权
  //       // this.getTabBar().setData({
  //       //   show: false
  //       // })
  //       // this.setData({
  //       //   tabBarBtnShow: true
  //       // })
  //     }

  //   })
  // },


  // 获取分页动态
  groupPagingGetGroupdynamics(groupId) {
    let {
      member
    } = this.data
    return new Promise((resolve, reject) => {
      console.log('groupPagingGetGroupdynamics')
      let pageSize = this.data.pageSize
      let pageIndex = this.data.pageIndex
      app.get(app.Api.groupPagingGetGroupdynamics, {
        pageSize,
        minID: this.data.minID,
        pageIndex,
        groupId,
        userId: app.userInfo.id
      }, {
        loading: false
      }).then(res => {
        console.log('res.length', res.length)
        if (res.length < pageSize) {
          this.setData({
            isNotData: true
          })
          // return resolve()
        }
        this.data.minID = res.length ? res[res.length - 1].id : 0
        this.setData({
          member: this.data.member.concat(res),
          pageSize: pageSize,
          pageIndex: this.data.pageIndex + 1
        }, () => {
          resolve()
        })
      }).catch(err => reject(err))
    })
  },
  // 获取小组详情
  getGroupInfo(groupId) {
    return new Promise((resolve, reject) => {
      app.get(app.Api.getGroupInfo, {
        groupId,
        userId: app.userInfo.id
      }, {
        loading: false
      }).then((res) => {
        if (res === null) {
          return common.Tip('很抱歉，你所在的小组已被解散').then(result => {
            app.post(app.Api.passiveSwitchGroup, {
              userId: app.userInfo.id
            }).then((res) => {
              if (res.affectedRows) {
                this.switchGroup()
              }
            })
          })
        }
        console.log(res)
        let groupNameTop, groupNamebuttom = ''
        if (res.groupName.length > 7) {
          groupNameTop = res.groupName.substr(0, 7)
          groupNamebuttom = res.groupName.substr(7)
        } else {
          groupNameTop = res.groupName
        }
        resolve(res)
        this.setData({
          groupInfo: res,
          groupNameTop,
          groupNamebuttom,
          isShowPull: res.myGrouList.length ? true : false
        })
        app.groupInfo = res
        if (app.userInfo.groupDuty === -1) {
          let tip = '请联系管理员或组长通过审核'
          common.Tip(tip, '等待审核中')
        } else if (app.userInfo.groupDuty === 0 || app.userInfo.groupDuty === 1) {
          authorize.newSubscription(this.data.requestId, {
            cancelText: '取消'
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
                })
              })
            } else if (res.type === -1) {
              if (res.result.confirm) {
                // 去开启
                wx.openSetting({
                  success(res) {}
                })
              }
            }
          })
        }
      }).catch(err => reject(err))
    })
  },
  // 提取member到showMember
  urlPush() {
    let i = 0
    const showMember = this.data.showMember
    const styleLeight = this.data.styleLeight
    let member = this.data.member
    let SM_UpPointer = this.data.SM_UpPointer
    let SM_DownPointer = this.data.SM_DownPointer
    let MB_UpPointer = this.data.MB_UpPointer
    let MB_DownPointer = this.data.MB_DownPointer
    if (member.length < styleLeight - 2) {
      this.data.lessMember = true
    }
    if (member.length - 5 <= this.data.MB_Index) {
      // 但倒数第一个出现时开启循环
      if (!this.data.isLoop && !this.data.lessMember) {
        // wx.showToast({
        //   title: '为您开启循环模式',
        //   icon: 'none',
        // })
        this.data.isLoop = true
      }
    }
    for (i; i < styleLeight - 1; i++) {
      if (this.data.lessMember) {
        showMember.push(member[i])
        MB_DownPointer = MB_DownPointer + 1
      } else {
        showMember.push(member[i % member.length])
        MB_DownPointer = (MB_DownPointer + 1) % member.length
      }
    }
    if (!this.data.lessMember) {
      showMember[i] = member[member.length - 1]
    } else {
      showMember[i] = null
    }
    SM_UpPointer = i - 1
    MB_UpPointer = member.length - 2
    SM_DownPointer = i
    if (app.globalData.guide.home) {
      this.getTabBar().setData({
        show: false
      })
      this.setData({
        homeGuide: app.globalData.guide.home,
        // tabBarBtnShow: true,
        showFakeTab: true
      })

    }
    // this.getTabBar().setData({
    //   show: false
    // })

    this.setData({
      showMember,
      functionBarShow: false,
      switchIssue: false,
      member,
      // tabBarBtnShow: true,
      showContent: showMember[0],
      SM_UpPointer,
      SM_DownPointer,
      MB_DownPointer,
      MB_UpPointer,
      dynamicIsShow: app.globalData.guide.home ? false : (member.length ? true : false)
    }, () => {
      if (showMember[0] && showMember[0].mold === 1) {
        setTimeout(() => {
          this.setData({
            showVideo: true
          })
        }, 500)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
 0  */
  onReady: function () {
    // this.getmoveDistance()
    // console.log('1111111111111', wx.createSelectorQuery().in(this)
    //   .select('#canvasLogo'))
    // setTimeout(() => {
    //   this.socket.emit("getmessage");
    // }, 8000)

    // wx.createSelectorQuery().in(this)
    //   .select('#canvasLogo')
    //   .fields({
    //     node: true,
    //     size: true,
    //   })
    //   .exec(this.initCanvas.bind(this))

    // wx.createSelectorQuery().in(this)
    //   .select('#canvas')
    //   .fields({
    //     node: true,
    //     size: true,
    //   })
    //   .exec(res => {
    //     this.initCanvas.bind(this)
    //   })

  },
  initCanvas(res) {
    console.log(res)
    let groupLogo = this.data.groupInfo.groupLogo
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
    logo.src = groupLogo
    logo.onload = () => {
      ctx.clip()
      ctx.drawImage(logo, 0, 0, width, height)
    }
  },
  switchGroup() {
    app.switchData.isSwitchGroup = false
    this.data.minID = 0
    this.setData({
      dynamicIsShow: false,
      showMember: [],
      pageIndex: 1,
      ableIndex: 1,
      SM_UpPointer: 0,
      SM_DownPointer: 0,
      MB_UpPointer: 0,
      MB_DownPointer: 0,
      member: [],
      style: JSON.parse(JSON.stringify(Style)),
      isNotData: false,
      showVideo: false,
      lessMember: false,
      isLoop: false,
      MB_Index: 0,
    }, () => {
      this.init()
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.PageRefresh.homePageRefresh = this.switchGroup
    if (app.switchData.isModifyGroup) {
      app.switchData.isModifyGroup = false
      this.getGroupInfo(app.userInfo.groupId)
    }
    // if (!this.data.isShowGroup) {
    //   this.getTabBar().setData({
    //     show: false
    //   })
    //   this.setData({
    //     tabBarBtnShow: true
    //   })
    // }
    if (app.switchData.isSwitchGroup) {
      this.switchGroup()
    }
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
      if (app.userInfo) {
        this.getTabBar().setIsNew()
        if (!app.TabBar.homeTabBar) {
          app.TabBar.homeTabBar = this.getTabBar()
        }
      }

      // app.getNotice(this, app.userInfo.id)
    }
    if (app.switchData.refresh || app.dynamicDeleteBack) {
      this.pageRefresh()
    }
  },
  pageRefresh() {
    app.switchData.refresh = false
    app.dynamicDeleteBack = false
    this.data.minID = 0
    this.setData({
      dynamicIsShow: false,
      showMember: [],
      pageIndex: 1,
      ableIndex: 1,
      SM_UpPointer: 0,
      SM_DownPointer: 0,
      MB_UpPointer: 0,
      MB_DownPointer: 0,
      member: [],
      style: JSON.parse(JSON.stringify(Style)),
      isNotData: false,
      showVideo: false,
      lessMember: false,
      isLoop: false,
      MB_Index: 0
    }, () => {
      this.groupPagingGetGroupdynamics(this.data.groupInfo.id).then(() => {
        this.urlPush()
      })
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.stopPlayRecord()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  // 动态显示时-触碰开始事件
  dynamicTouchstart(e) {
    this.dynamicStartY = e.changedTouches[0].clientY
    this.dynamicStartX = e.changedTouches[0].clientX
  },
  // 动态显示时-触碰结束事件
  dynamicTouchend(e) {
    this.dynamicEndX = e.changedTouches[0].clientX
    this.dynamicEndY = e.changedTouches[0].clientY
    this.dynamicMoveRealize(e).then(() => {
      let {
        ableIndex,
        styleLeight,
        showMember,
        MB_Index,
        isNotData
      } = this.data
      let memberLeight = this.data.member.length
      let showContent = showMember[(ableIndex - 1) % styleLeight]
      this.setData({
        dynamicIsShow: true,
        showContent
      }, () => {
        if (showContent.mold === 1) {
          setTimeout(() => {
            this.setData({
              showVideo: true
            })
          }, 500)
        }
      })
      if (MB_Index + styleLeight * 2 >= memberLeight && !isNotData) {
        this.groupPagingGetGroupdynamics(this.data.groupInfo.id)
      }
    })
  },
  // 动态显示时-触碰结果
  dynamicMoveRealize(e) {
    return new Promise((resolve, reject) => {
      let dynamicEndX = this.dynamicEndX
      let dynamicEndY = this.dynamicEndY
      let dynamicStartX = this.dynamicStartX
      let dynamicStartY = this.dynamicStartY
      let memberLength = this.data.member.length
      let direction = tool.GetSlideDirection(dynamicStartX, dynamicStartY, dynamicEndX, dynamicEndY)
      if (direction === 1 || direction === 2) {
        this.setData({
          dynamicIsShow: false
        }, () => {
          setTimeout(() => {
            // 滑
            this.stopPlayRecord()
            if (direction === 1) {
              if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == 0) {
                return
              }
              this.upSilde().then(() => resolve())
              return
            } else if (direction === 2) {
              if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == memberLength - 1) {
                return
              }
              this.downSilde().then(() => resolve())
            }
          }, 210)
        })
      } else if (direction === 0) {
        this.dynamicDetail(e)
      }
    })
  },
  // 成员动态列-触碰开始事件
  touchstart(e) {
    this.tap(e)
    this.startY = e.changedTouches[0].clientY
    this.startX = e.changedTouches[0].clientX
    this.index = e.mark.index
  },
  // 成员动态列-触碰结束事件
  touchend(e) {
    this.endX = e.changedTouches[0].clientX
    this.endY = e.changedTouches[0].clientY
    this.moveRealize().then(() => {
      let {
        ableIndex,
        styleLeight,
        showMember,
        MB_Index,
        isNotData
      } = this.data
      let memberLeight = this.data.member.length
      let showContent = showMember[(ableIndex - 1) % styleLeight]
      this.setData({
        dynamicIsShow: true,
        showContent
      }, () => {
        if (showContent.mold === 1) {
          setTimeout(() => {
            this.setData({
              showVideo: true,
            })
          }, 500)
        }
      })
      if (MB_Index + styleLeight * 2 >= memberLeight && !isNotData) {
        this.groupPagingGetGroupdynamics(this.data.groupInfo.id)
      }
    })
  },
  // 成员动态列-触碰结果
  moveRealize() {
    return new Promise((resolve, reject) => {
      let endX = this.endX
      let endY = this.endY
      let startX = this.startX
      let startY = this.startY
      let memberLength = this.data.member.length
      let styleLeight = this.data.styleLeight
      if (Math.abs(endY - startY) > 5 || Math.abs(endX - startX) > 5) {
        // 滑
        if (startY - endY > 50) {
          if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == 0) {
            return
          }
          this.upSilde().then(() => resolve())
          return
        } else if (endY - startY > 50) {
          if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == memberLength - 1) {
            return
          }
          this.downSilde().then(() => resolve())
        }
      } else {
        // 点
        var i = 0
        let index = Number(this.index)
        let ableIndex = this.data.ableIndex
        console.log(index, ableIndex)
        if (!this.index) return
        if (index === ableIndex % styleLeight) {
          console.log('点击第一个')
          return resolve()
        } else {
          console.log('点击了其他')
          let number = index
          while (number < ableIndex) {
            number = number + styleLeight
          }
          // 超过不让点,改
          // if (number > memberLength) return
          // console.log(number)
          let p = Promise.resolve()
          let that = this
          for (i; i < number - ableIndex; i++) {
            (function (i) {
              p = p.then(() => that.downSilde()).then(() => {
                console.log('循环中')
                console.log(number - ableIndex - 1)
                console.log(i, 'i')
                if (i >= number - ableIndex - 1) {
                  console.log('出来了')
                  resolve()
                }
                return
              }).catch(err => reject(err))
            })(i)
          }
        }
      }
    })
  },
  // 上滑实现
  upSilde() {
    return new Promise((resolve, reject) => {
      var i = 0
      var temp
      let {
        style,
        showMember,
        member,
        styleLeight,
        SM_UpPointer,
        SM_DownPointer,
        MB_UpPointer,
        MB_DownPointer
      } = this.data
      temp = style[style.length - 1]
      i = style.length - 1
      for (i; i > 0; i--) {
        style[i] = style[i - 1]
      }
      style[i] = temp
      showMember[SM_UpPointer] = member[MB_UpPointer]
      let ableIndex = this.data.ableIndex
      if (ableIndex == 1) {
        ableIndex = styleLeight + 1
      }
      this.data.MB_Index = this.data.MB_Index - 1
      // 上滑出现下栏
      if (this.data.tabBarBtnShow) {
        this.getTabBar().setData({
          show: true
        })
        this.setData({
          tabBarBtnShow: false
        })
      }
      this.setData({
        showMember,
        SM_DownPointer: (SM_DownPointer - 1 == -1) ? styleLeight - 1 : (SM_DownPointer - 1) % styleLeight,
        SM_UpPointer: (SM_UpPointer - 1 == -1) ? styleLeight - 1 : (SM_UpPointer - 1) % styleLeight,
        MB_DownPointer: (MB_DownPointer - 1 == -1) ? member.length - 1 : (MB_DownPointer - 1) % member.length,
        MB_UpPointer: (MB_UpPointer - 1 == -1) ? member.length - 1 : (MB_UpPointer - 1) % member.length,
        ableIndex: ableIndex - 1,
        style
      }, () => resolve())
    })
  },
  // 下滑实现
  downSilde() {
    return new Promise((resolve, reject) => {
      var i = 0
      var temp
      let {
        style,
        showMember,
        member,
        styleLeight,
        SM_UpPointer,
        SM_DownPointer,
        MB_UpPointer,
        MB_DownPointer
      } = this.data
      console.log('向下滑')
      temp = style[0]
      for (i; i < style.length - 1; i++) {
        style[i] = style[i + 1]
      }
      style[i] = temp
      if (member.length - 5 <= this.data.MB_Index) {
        if (!this.data.isLoop && !this.data.lessMember) {
          wx.showToast({
            title: '为您开启循环模式',
            icon: 'none',
          })
          this.data.isLoop = true
        }
      }
      if (this.data.lessMember) {
        showMember[SM_DownPointer] = 0
      } else {
        showMember[SM_DownPointer] = member[MB_DownPointer]
      }
      let ableIndex = this.data.ableIndex
      if (ableIndex == styleLeight) {
        ableIndex = 0
      }
      this.data.MB_Index = this.data.MB_Index + 1
      // 下滑隐藏下栏
      if (!this.data.tabBarBtnShow) {
        this.getTabBar().setData({
          show: false
        })
        this.setData({
          tabBarBtnShow: true
        })
      }
      this.setData({
        showMember,
        SM_DownPointer: (SM_DownPointer + 1) % styleLeight,
        SM_UpPointer: (SM_UpPointer + 1) % styleLeight,
        MB_DownPointer: (MB_DownPointer + 1) % member.length,
        MB_UpPointer: (MB_UpPointer + 1) % member.length,
        ableIndex: ableIndex + 1,
        style
      }, () => {
        resolve()
      })
    })
  },
  // 拖动过程中触发的事件
  handleMovable(event) {
    let y = event.detail.y
    //  
    let translateZ = 1140 + 2.5 * y
    let rotateX = 50 - y / 28;
    this.setData({
      translateZ,
      rotateX
    })
  },
  // 发布按钮切换
  switchIssue() {
    if (app.userInfo.groupDuty === -1) {
      common.Tip('您还未成为该小组成员，暂不能发布动态')
    } else {
      this.setData({
        switchIssue: !this.data.switchIssue,
        dynamicIsShow: false,
        functionBarShow: false
      })
    }
    this.stopPlayRecord()
  },
  // 隐藏发布按钮
  putIssueBtn() {
    this.setData({
      switchIssue: false
    })
  },
  // 控制打卡，课程显示
  switchFunctionBar() {
    this.setData({
      functionBarShow: !this.data.functionBarShow,
      dynamicIsShow: false,
      switchIssue: false
    })
    this.stopPlayRecord()
  },
  // 点击空白区域收起所有
  tap(e) {
    let district = e.mark.district
    if (district) return;
    this.setData({
      dynamicIsShow: false,
      switchIssue: false,
      functionBarShow: false,
      tabBarBtnShow: true,
      showContent: {}
    })
    this.getTabBar().setData({
      show: false
    })
  },
  // tapStart(e) {
  //   let district = e.mark.district
  //   if (district) return;
  //   this.tapStartY = e.changedTouches[0].clientY
  //   this.tapStartX = e.changedTouches[0].clientX
  // },
  // tapEnd(e) {
  //   let district = e.mark.district
  //   if (district) return;
  //   let tapEndY = e.changedTouches[0].clientY
  //   let tapEndX = e.changedTouches[0].clientX
  //   let direction = tool.GetSlideDirection(this.tapStartX, this.tapStartY, tapEndX, tapEndY)
  //   if (direction == 2) {
  //     this.setData({
  //       isShowGroup: false,
  //       tabBarBtnShow: true
  //     })
  //     this.getTabBar().setData({
  //       show: false
  //     })
  //     this.stopPlayRecord()
  //   } else {

  //     this.setData({
  //       dynamicIsShow: false,
  //       switchIssue: false,
  //       functionBarShow: false,
  //       tabBarBtnShow: true,
  //       showContent: {}
  //     })
  //     this.getTabBar().setData({
  //       show: false
  //     })
  //   }

  // },
  // indexStart(e) {
  //   let district = e.mark.district
  //   if (district) return;
  //   this.indexStartY = e.changedTouches[0].clientY
  //   this.indexStartX = e.changedTouches[0].clientX
  // },
  // indexEnd(e) {
  //   let district = e.mark.district
  //   if (district) return;
  //   let indexEndY = e.changedTouches[0].clientY
  //   let indexEndX = e.changedTouches[0].clientX
  //   let direction = tool.GetSlideDirection(this.indexStartX, this.indexStartY, indexEndX, indexEndY)
  //   if (direction == 1) {
  //     if (this.data.isShowPull) {
  //       this.setData({
  //         isShowGroup: true
  //       })
  //     }
  //   } else {
  //     console.log(33333333333);
  //     this.getTabBar().setData({
  //       show: false
  //     })
  //     this.setData({
  //       tabBarBtnShow: true
  //     })
  //   }

  // },

  // 去评论
  goComment() {
    let {
      isLike,
      isStore,
      id
    } = this.data.showContent
    let param = {
      id,
      isLike,
      isStore,
      isComment: true,
      table: 'groupdynamics'
    }
    param = JSON.stringify(param)
    wx.navigateTo({
      url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
    })
  },
  // 去动态详情
  dynamicDetail(e) {
    let operation = e.mark.operation
    if (operation === "No") return
    let {
      isLike,
      isStore,
      id,
    } = this.data.showContent
    let param = {
      id,
      isLike,
      isStore,
      table: 'groupdynamics'
    }
    param = JSON.stringify(param)
    wx.navigateTo({
      url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
    })
  },
  // 关注
  follow() {
    let fansNumber = this.data.groupInfo.fansNumber
    let isFollow = this.data.groupInfo.isFollow
    this.setData({
      'groupInfo.isFollow': !isFollow,
      'groupInfo.fansNumber': !isFollow ? fansNumber + 1 : fansNumber - 1
    }, () => {
      core.operateFollow(app.Api.followGroup, {
        operate: this.data.groupInfo.isFollow,
        relation: {
          userId: app.userInfo.id,
          groupId: this.data.groupInfo.id,
        }
      })
    })
  },
  // 去课程
  goCourse() {
    wx.navigateTo({
      url: `/pages/home/course/course?showGroupId=${this.data.groupInfo.id}`,
    })
  },
  // 去小组管理
  goMassManagement() {
    wx.navigateTo({
      url: '/pages/home/massManagement/massManagement',
    })
  },
  // 去发布视频动态
  goUploadVideo() {
    common.chooseVideo().then(res => {
      let tempFilePath = JSON.stringify(res.tempFilePath)
      wx.navigateTo({
        url: `/pages/home/uploadVideo/uploadVideo?tempFilePath=${tempFilePath}`,
      })
    })

  },
  // 去发布图片动态
  goIssueImg() {
    common.chooseImage(9).then(res => {
      let tempFilePaths = JSON.stringify(res.tempFilePaths)
      wx.navigateTo({
        url: `/pages/home/issueImg/issueImg?tempFilePaths=${tempFilePaths}`,
      })
    })
  },
  // 去发布视频动态
  goUploadVoice() {
    wx.navigateTo({
      url: '/pages/home/uploadVoice/uploadVoice',
    })
  },
  // 去打卡
  goPuchCard() {
    wx.navigateTo({
      url: `/pages/home/puchCard/puchCard?showGroupId=${this.data.groupInfo.id}`,
    })
  },
  toLike() {
    let showContent = this.data.showContent
    showContent.isLike = !showContent.isLike
    showContent.isLike ? ++showContent.likes : --showContent.likes
    this.setData({
      showContent
    }, () => {
      core.operateLike(app.Api.groupdynamicsLike, {
        operate: showContent.isLike,
        relation: {
          userId: app.userInfo.id,
          themeId: showContent.id,
          nickName: app.userInfo.nickName,
        },
        extra: {
          otherId: showContent.userId,
          themeTitle: showContent.introduce
        }
      }).then(res => {
        if (!res) {
          common.Toast('该动态已不存在')
        }
      })
    })
  },
  // 动态详情页点击点赞会触发
  completeLike(commenetBarData) {
    let showContent = this.data.showContent
    showContent.isLike = commenetBarData.isLike
    showContent.likes = commenetBarData.likes
    this.setData({
      showContent
    })
  },
  // 动态详情页点击收藏会触发
  completeStore(commenetBarData) {
    let showContent = this.data.showContent
    showContent.isStore = commenetBarData.isStore
    showContent.store = showContent.store
    this.setData({
      showContent
    })
  },
  deleteDynamic(e) {
    common.showLoading('删除中')
    let {
      showMember,
      member,
      styleLeight,
      ableIndex
    } = this.data

    // showMember(ableIndex - 1) % styleLeight]
    app.post(app.Api.groupdynamicsDelete, {
      tableName: 'groupdynamics',
      id: this.data.showContent.id,
      groupId: app.groupInfo.id
    }, {
      loading: false
    }).then(res => {
      if (res.affectedRows) {
        // showMember.splice(ableIndex - 1, 1)
        // member.splice(pointer - 6, 1)
        // common.Toast('已删除')
        this.data.minID = 0
        this.setData({
          dynamicIsShow: false,
          showMember: [],
          pageIndex: 1,
          ableIndex: 1,
          SM_UpPointer: 0,
          SM_DownPointer: 0,
          MB_UpPointer: 0,
          MB_DownPointer: 0,
          member: [],
          style: JSON.parse(JSON.stringify(Style)),
          isNotData: false,
          showVideo: false,
          lessMember: false,
          isLoop: false,
          MB_Index: 0
        }, () => {
          this.groupPagingGetGroupdynamics(this.data.groupInfo.id).then(() => {
            this.urlPush()
          })
        })

        // return

        // showMember[pointer % styleLeight] = member[pointer]
        // this.setData({
        //   showMember,
        //   member,
        //   showContent: showMember[(ableIndex - 1) % styleLeight]
        // })
        common.Toast('已删除')
      }
    })
  },
  // 停止冒泡
  stopBubbling() {
    return
  },
  // 新手指导点击
  click(e) {
    let click = e.currentTarget.dataset.click
    if (click === 'leftGuide') {
      this.setData({
        leftGuide: false,
        issueGuide: true,
        functionBarShow: true,
      })
    } else if (click === 'issueGuide') {
      this.setData({
        issueGuide: false,
        // bottomGuide: true,
        switchIssue: true,
        indexGuide: true
      })
    } else {
      this.setData({
        bottomGuide: false,
        isShowGroup: false,
        indexGuide: false
      }, () => {
        setTimeout(() => {
          const showMember = this.data.showMember
          let member = this.data.member
          let guide = wx.getStorageSync('guide')
          guide.home = false
          app.globalData.guide.home = false
          wx.setStorageSync('guide', guide)
          this.setData({
            cross: true
          }, () => {
            // 过渡动画
            setTimeout(() => {
              this.setData({
                homeGuide: false,
              }, () => {
                setTimeout(() => {
                  this.getTabBar().setData({
                    show: true
                  })
                  this.setData({
                    isShowGroup: true,
                    switchIssue: false,
                    functionBarShow: false,
                    // tabBarBtnShow: true,
                    showContent: showMember[0],
                    dynamicIsShow: member.length ? true : false,
                    showFakeTab: false
                  })
                }, 1000);
              })
            }, 2000);
          })
        }, 1000);
      })

      // this.setData({
      //   bottomGuide: false,
      //   tabBarBtnShow: false,
      //   showFakeTab: true
      // }, () => {
      //   setTimeout(() => {
      //     const showMember = this.data.showMember
      //     let member = this.data.member
      //     let guide = wx.getStorageSync('guide')
      //     guide.home = false
      //     app.globalData.guide.home = false
      //     wx.setStorageSync('guide', guide)
      //     this.setData({
      //       cross: true
      //     }, () => {
      //       // 过渡动画
      //       setTimeout(() => {
      //         this.setData({
      //           homeGuide: false,
      //         }, () => {
      //           setTimeout(() => {
      //             this.setData({
      //               switchIssue: false,
      //               functionBarShow: false,
      //               tabBarBtnShow: true,
      //               showContent: showMember[0],
      //               dynamicIsShow: member.length ? true : false,
      //               showFakeTab: false
      //             })
      //           }, 1000);
      //         })
      //       }, 2000);
      //     })
      //   }, 1000);
      // })
    }
  },
  // 视频加载完成
  loadedmetadata(e) {
    this.setData({
      'showContent.videoLoad': true
    })
  },
  // 视频是否进入全屏模式,进入将下栏隐藏
  bindfullscreenchange: function (e) {
    let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
    if (!fullScreen) { //退出全屏
      console.log('退出全屏')
      if (this.show) {
        this.getTabBar().setData({
          show: true
        })
      }
    } else { //进入全屏
      console.log('进入全屏')
      this.show = this.getTabBar().data.show
      if (this.getTabBar().data.show) {
        this.getTabBar().setData({
          show: false
        })
      }
    }
  },

  toUnion() {
    if (!app.globalData.codePass) return
    wx.navigateTo({
      url: '/pages/home/alliance/alliance',
    })
  },
  toGroupSettlement() {
    if (!app.globalData.codePass) return
    if (app.userInfo) {
      // if (app.userInfo.isSettle) {
      //   wx.showModal({
      //     title: '提示',
      //     showCancel: false,
      //     content: '最多入驻一个小组哦~'
      //   })
      // } else {
      wx.navigateTo({
        url: '/pages/init/groupSettlement/groupSettlement',
      })
      // }
    } else {
      wx.navigateTo({
        url: '/pages/init/groupSettlement/groupSettlement',
      })
    }

  },
  toMyGroup() {
    if (!app.globalData.codePass) return
    wx.navigateTo({
      url: '/pages/home/myGroup/myGroup',
    })
  },
  cancelTabbar() {
    this.getTabBar().setData({
      show: false
    })
    this.setData({
      tabBarBtnShow: true
    })
  },
  pullPage() {

    this.setData({
      isShowGroup: !this.data.isShowGroup
    }, () => {
      // if (!this.data.isShowGroup) {
      //   this.getTabBar().setData({
      //     show: false
      //   })
      //   this.setData({
      //     tabBarBtnShow: true
      //   })
      // }
    })
    this.stopPlayRecord()
  },
  showMenu(e) {
    this.getTabBarShow = this.getTabBar().data.show
    if (app.userInfo.id === this.data.showContent.userId) {
      let list = this.data.list
      list[2] = {
        name: '删除',
        open_type: '',
        functionName: 'hadleDelete'
      }
      this.getTabBar().setData({
        show: false
      }, () => this.setData({
        list
      }, () => {
        this.selectComponent('#menu').show();
      }))

    } else {
      this.getTabBar().setData({
        show: false
      }, () => {
        this.selectComponent('#menu').show();
      })
    }
  },
  cancelMenu() {
    if (this.getTabBarShow) {
      this.getTabBar().setData({
        show: true
      })
    }
  },
  handleStore() {
    let showContent = this.data.showContent
    core.operateStore(app.Api['groupdynamicsStore'], {
      operate: true,
      relation: {
        userId: app.userInfo.id,
        themeId: showContent.id
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
    core.handleReport()
  },
  hadleDelete(e) {
    common.Tip('是否删除该动态', '提示', '确认', true).then(res => {
      if (res.confirm) {
        console.log('用户点击确定')
        this.deleteDynamic(e)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    })
  },
  stopPlayRecord() {
    let playRecord = this.selectComponent('#playRecord')
    playRecord && playRecord.endSound()
  },
  inputCode(e) {
    this.code = e.detail.value
  },
  complete() {
    console.log(this.code)
    if (this.code.length !== 6 && this.code.length !== 8) return common.Toast('请输入正确的邀请码！')
    app.post(app.Api.codeCheck, {
      code: this.code
    }, {
      loading: ['校验中...']
    }).then((res) => {
      console.log(res);
      if (res) {
        common.Toast('欢迎来到音乐世界！')
        app.globalData.codePass = true
        wx.setStorageSync('codeCheck', this.code)
        this.setData({
          showCode: false
        })
      } else {
        common.Toast('此邀请码无效！')
      }
    })
  },
})