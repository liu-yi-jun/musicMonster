// components/home/group/groupList/groupList.js
let app = getApp()
let common = require('../../../../assets/tool/common')
const tool = require('../../../../assets/tool/tool')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groups: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialogShow: false,
    // 控制弹出框
    joinShow: false,
    applyShow: false,
    applyContent: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goOtherHome(event) {

      console.log('eventevent', event)
      if (app.userInfo) {
        let id = event.currentTarget.dataset.id
        let group = this.data.groups[event.currentTarget.dataset.index]
        if (group.isJoin === 1 || group.isJoin === -1) {
          app.switchData.isSwitchGroup = true
          app.post(app.Api.switchGroup, {
            groupId: group.id,
            groupName: group.groupName,
            groupDuty: group.groupDuty,
            userId: app.userInfo.id
          }).then((res) => {
            wx.navigateBack({
              delta: 2,
            })
          })
        } else {
          wx.navigateTo({
            url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
          })
        }
      } else {
        this.setData({
          dialogShow: true
        })
      }
    },
    joinGroup(groupInfo) {
      // 加入
      return new Promise((resolve, reject) => {
        app.post(app.Api.joinGroup, {
          groupId: groupInfo.id,
          groupName: groupInfo.groupName,
          userId: app.userInfo.id,
          examine: groupInfo.examine
        }).then(res => {
          app.userInfo = res.userInfo
          if (app.groupInfo) {
            app.groupInfo.myGrouList = res.myGrouList
          } else {
            app.groupInfo = {}
            app.groupInfo.myGrouList = res.myGrouList
          }
          resolve(res)
        }).catch(err => reject(err))
      })

    },
    showJoin(e) {
      let index = e.currentTarget.dataset.index
      let groupInfo = this.data.groups[index]
      this.groupInfo = groupInfo
      if (app.userInfo) {
        this.setData({
          joinShow: true
        })
      } else {
        this.setData({
          dialogShow: true
        })
      }
    },
    yesJoin() {
      let groupInfo = this.groupInfo
      if (groupInfo.examine) {
        this.setData({
          applyShow: true,
          joinShow: false
        })
      } else {
        this.setData({
          joinShow: false
        })
        this.joinGroup(groupInfo).then(res => {
          app.switchData.isSwitchGroup = true
          groupInfo.isJoin = 1 //通过
          groupInfo.groupDuty = 2 //组员
          this.setData({
            groups: this.data.groups
          })
          common.Tip(`恭喜您成功加入${groupInfo.groupName}`, '提示', '确认', true).then(res => {
            if(res.confirm) {
              wx.navigateBack({
                delta: 2,
              })
            }
          })
        })
      }
    },
    noJoin() {
      this.setData({
        joinShow: false
      })
    },
    cancelApply() {
      this.setData({
        applyShow: false
      })
    },
    inputApply(e) {
      let applyContent = e.detail.value
      this.setData({
        applyContent
      })
    },
    apply() {
      let applyContent = this.data.applyContent
      let groupInfo = this.groupInfo
      if (!applyContent) {
        common.Tip('请输入内容')
        return
      }
      this.joinGroup(groupInfo).then(res => {
        groupInfo.isJoin = -1 //审核中
        groupInfo.groupDuty = -1 //审核中
        let from = {
            userId: app.userInfo.id,
            nickName: app.userInfo.nickName
          },
          to = {
            userIdList: res.userIdList
          },
          message = {
            type: 1,
            jsonDate: {
              groupId: groupInfo.id,
              groupName: groupInfo.groupName,
              applyContent,
              isNew: 1,
              status: 0
            }
          }
        app.socket.emit("sendSystemMsg", from, to, message);
        app.switchData.isSwitchGroup = true
        this.setData({
          groups: this.data.groups,
          applyShow: false
        })
      })
    },
  }
})