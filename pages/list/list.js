// pages/list/list.js

import rq from "../../utils/https.js"
Page({
  data: {
    hasUserInfo: true,
    orders: [],
    booking: {},
    today:'',
  },
  onLoad: function (options) {
    let today = this.parseDate(new Date())
  },
  onShow: function () {
    let that = this
    let hasUserInfo = wx.getStorageSync('userInfo') && true
    this.setData({
      hasUserInfo: hasUserInfo
    })
    rq.request('GET', 'sys/booking', {}, function (result) {
      that.setData({
        booking: result
      })
    })
    if (hasUserInfo) {
      // 加载我的预约信息
      that.loadData()
    }
  },
  loadData(){
    // 加载我的预约信息
    let that = this
    rq.request('GET', 'wx/order', {}, function (result) {
      that.setData({
        orders: result
      })
    })
  },
  parseDate(date) {
    var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    return year + seperator + month + seperator + strDate;
  },
  cancel1(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    if(item.meals[0] === null){
      return
    }
    // 查询这个餐是否允许取消预约
    if (!this.data.booking[item.appointment_at] || this.data.booking[item.appointment_at][0] > 0) {
      // 如果不允许操作
      wx.showToast({
        title: "预约已截止，不允许取消",
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title:'提示',
      content:'确认取消预约'+item.appointment_at+'日的早餐？',
      showCancel:true,
      success: function (res) {
        if (res.confirm) {
          that.cancelBooking(item.meals[0])
        }
      }
    })
  },
  cancel2(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    if(item.meals[1] === null){
      return
    }
    // 查询这个餐是否允许取消预约
    if (!this.data.booking[item.appointment_at] || this.data.booking[item.appointment_at][1] > 0) {
      // 如果不允许操作
      wx.showToast({
        title: "预约已截止，不允许取消",
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title:'提示',
      content:'确认取消预约'+item.appointment_at+'日的午餐？',
      showCancel:true,
      success: function (res) {
        if (res.confirm) {
          that.cancelBooking(item.meals[1])
        }
      }
    })
  },
  cancel3(e) {
    let that = this
    let item = e.currentTarget.dataset.item
    if(item.meals[2] === null){
      return
    }
    // 查询这个餐是否允许取消预约
    if (!this.data.booking[item.appointment_at] || this.data.booking[item.appointment_at][2] > 0) {
      // 如果不允许操作
      wx.showToast({
        title: "预约已截止，不允许取消",
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title:'提示',
      content:'确认取消预约'+item.appointment_at+'日的晚餐？',
      showCancel:true,
      success: function (res) {
        if (res.confirm) {
          that.cancelBooking(item.meals[2])
        }
      }
    })
  },
  cancelBooking(id){
    console.log(id)
    let that = this
    rq.request('PUT', 'wx/order', {id:id}, function (result) {
      console.log(result)
      wx.showToast({
        title: result.msg,
      })
      that.loadData()
    })

  }
})