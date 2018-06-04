import Tips from './Tips'
import wepy from 'wepy'

export default class WxUtils {
    static tabUrls = ['/pages/home/template', '/pages/goods/category', '/pages/goods/cart', '/pages/customer/index', '/pages/customer/index_template'];
    static mapUrls = {
        '/pages/shop/index': '/pages/home/template',
        '/pages/home/home': '/pages/home/template'
    };

    static isTab(url) {
        const type = wepy.$instance.globalData.shopType;
        return type == 1 && this.tabUrls.some(path => path == url);
    }

    static mapUrl(url) {
        const type = wepy.$instance.globalData.shopType;
        if (type == 1 && this.mapUrls[url]) {
            return this.mapUrls[url];
        } else {
            return url;
        }
    }

    static isSDKExipred() {
        const {SDKVersion} = wx.getSystemInfoSync()
        console.info(`[version] sdk ${SDKVersion}`)
        return SDKVersion == null || SDKVersion < '1.2.0'
    }

    // 如果能够后退（多层），则navigaetBack，否则调用redirectTo
    static backOrRedirect(url) {
        url = this.mapUrl(url);
        if (this.isTab(url)) {
            wx.switchTab({url})
        } else {
            const pages = getCurrentPages();
            // route在低版本不兼容
            const index = pages.findIndex(item => ('/' + item.__route__) == url);
            if (pages.length < 2 || index < 0) {
                wx.redirectTo({url})
            } else {
                const delta = pages.length - 1 - index;
                wx.navigateBack({delta});
            }
        }
    }

    static checkSDK() {
        if (this.isSDKExipred()) {
            Tips.modal('您的微信版本太低，为确保正常使用，请尽快升级')
        }
    }
}