// pages/mine/mine.js
const app = getApp()

import rq from "../../utils/https.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    name: '',
    department: null,
    departments: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let userInfo = wx.getStorageSync('userInfo')
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    // 判断是否已经登录
    if (wx.getStorageSync('userInfo')) {
      this.userCreate() // 更新当前用户
    }
  },
  // 新增或更新当前用户
  userCreate() {
    let that = this
    rq.request('POST', 'wx/user', this.data.userInfo, function (result) {
      console.log(result)
      // 存储到个人信息
      wx.setStorageSync('userInfo', that.data.userInfo)
      that.loadDepartment() // 加载用户信息
    })
  },
  getUserInfo(e) {
    console.log(e)
    if (!e.detail.userInfo) {
      console.log('用户拒绝授权');
      wx.showModal({
        title: '提示',
        content: '您拒绝了授权，将无法为您提供服务',
        showCancel: false,
      })
      return;
    }
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    }, function () {
      this.userCreate()
    })
  },
  loadDepartment() {
    let that = this
    rq.request('GET', 'sys/department', {}, function (result) {
      that.setData({
        departments: result
      }, function () {
        rq.request('GET', 'wx/wx', {}, function (res) {
          // 循环departments,department为id
          let department
          for (let i = 0; i < result.length; i++) {
            if (result[i].department_id === res.department_id) {
              department = i
              break;
            }
          }
          that.setData({
            name: res.name,
            department: department
          })
        })
      })
    })
  },

  nameInput(e) {
    this.setData({
      name: e.detail.value,
    })
  },
  bindPickerChange(e) {
    this.setData({
      department: e.detail.value
    })
  },
  formSubmit: function (e) {
    let params = e.detail.value
    if (!params.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if (params.department === null) {
      wx.showToast({
        title: '请选择公司',
        icon: 'none'
      })
      return
    } else {
      params.department = this.data.departments[parseInt(params.department)].department_id
    }
    rq.request('POST', 'wx/wx', e.detail.value, function (result) {
      if (result.code === 0) {
        wx.showToast({
          title: result.msg,
        })
      } else {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
      }
    })
  }
})