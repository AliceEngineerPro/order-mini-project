var app = getApp()

/**
 * 地址
 */
// const domainName = 'http://localhost:8000';//本地地址
const domainName = 'https://order.chenxiaoxiang.top';//测试地址
// const domainName = 'https://oa.wangdian.cn'; //线上地址


function url(){
  return domainName;
}

function request(method, url, data, cb) {
    var cmmnData = {} //公用参数(扩展)
    data = Object.assign(data, cmmnData)

    let header =  {
      'content-type': 'application/json;charset=UTF-8',
      // 'Authorization': 'Bearer ' + accessToken
    }
    let openid = wx.getStorageSync('openid')
    if(openid){
      header.openid = openid
    }

    //发送请求
    wx.request({
      url: domainName + '/' + url,
      data: data,
      header: header,
      method: method,
      dataType: 'json',
      success: function(res) {
        cb(res.data)
      },
      fail: function(res) {
        console.log(res)
        console.log('接口请求失败')
      }
    })
}

// export const url = url;
// export const request = request;

module.exports = {
  url: url,
  request: request,
}