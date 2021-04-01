// index.js
// 获取应用实例
const app = getApp()

import rq from "../../utils/https.js"

Page({
  data: {
    hasUserInfo: true,
    appointment_at: '',
    meal_type: '',
    meal_type_index: null,
    meal_types: [
      { value: 1, label: '早餐' },
      { value: 2, label: '午餐' },
      { value: 3, label: '晚餐' }
    ],
    startDay: '',
    endDay: '',
    booking: {},
    errMsg: '',
  },
  onLoad() {

  },
  onShow() {
    let that = this;
    this.setData({
      hasUserInfo: wx.getStorageSync('userInfo') && true
    })
    // todo 检查今天是否已经截止
    let today = this.parseDate(new Date())
    rq.request('GET', 'sys/booking', {}, function (result) {
      let dates = Object.keys(result)
      if (result[today][2] > 0) {
        dates.shift()
        let errMsg = '今日订餐已截止'
        if (result[today][2] === 2) {
          errMsg: '今日用餐已结束，请预约明天'
        }
        that.setData({
          errMsg: errMsg
        })
      }
      let booking = {}
      for (let i = 0; i < dates.length; i++) {
        booking[dates[i]] = result[dates[i]]
      }
      that.setData({
        booking: result,
        startDay: dates[0],
        endDay: dates[dates.length - 1]
      })
    })
  },
  example() {
    wx.navigateTo({
      url: '/example/index',
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
  toVerify() {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },
  bindDateChange(e) {
    // 查询当天的预约导出情况
    let booking = this.data.booking[e.detail.value];
    console.log(booking);
    let meal_types = [
      { value: 1, label: '早餐' },
      { value: 2, label: '午餐' },
      { value: 3, label: '晚餐' }
    ]
    for (let i = 0; i < booking.length; i++) {
      if (booking[i] > 0) {
        meal_types[i].label += '(已截止)'
      }
    }
    this.setData({
      appointment_at: e.detail.value,
      meal_types: meal_types
    })
  },
  bindMealChange(e) {
    this.setData({
      meal_type_index: e.detail.value
    })
  },
  formSubmit(e) {
    let params = e.detail.value
    if (!params.appointment_at) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
      return
    }

    if (params.meal_type_index === null) {
      wx.showToast({
        title: '请选择用餐类型',
        icon: 'none'
      })
      return
    } else {
      params.meal_type = this.data.meal_types[parseInt(params.meal_type_index)].value
    }
    delete params.meal_type_index
    // 创建预约
    rq.request('POST', 'wx/order', params, function (result) {
      if (result.code === 0) {
        wx.showToast({
          title: result.msg,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: result.msg,
          showCancel: false
        })
      }
    })
  }
})
