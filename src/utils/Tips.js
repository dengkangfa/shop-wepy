export default class Tips {
  static isLoading = false
  static pause = false

  static modal (content, title = '提示') {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title,
        content,
        showCancel: false,
        success: res => {
          resolve(res)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  }

  // 加载完毕
  static loaded() {
    if (this.isLoading) {
      this.isLoading = false;
      if (wx.hideLoading) {
        wx.hideLoading();
      } else {
        wx.hideNavigationBarLoading();
      }
    }
  }
}