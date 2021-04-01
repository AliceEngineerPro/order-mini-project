// app.js
import rq from "./utils/https.js"
App({
  onLaunch() {
    let that = this
    // // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    if(wx.getStorageSync('openid')){
      // 如果本地存了openid，以后就不需要再请求了
      this.getSetting()
    } else {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          rq.request('POST','wx/login', res, function(result) {
            wx.setStorageSync('openid', result.token.openid)
            that.getSetting();
          })
        }
      })
    }
  },
  getSetting(){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('userInfo', res.userInfo)
              // 可以将 res 发送给后台解码出 unionId
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                // 新增或修改当前用户
                rq.request('POST','wx/user',res.userInfo,function(result){
                  console.log(result)
                })
              }
            },
            fail: res => {
              console.log(res)
              console.log('用户拒绝授权')
            }
          })
        } else {
          // 用户未授权，出现弹框提示到个人中心授权
          wx.showModal({
            title:'提示',
            content: '系统内还没有您的信息，请先前往“我的”进行授权',
            showCancel: false,
          })
        }
      },
      fail: res => {
        console.log(res)
        console.log('用户拒绝授权')
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
