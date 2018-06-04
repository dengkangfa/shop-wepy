import base from './base';
import wepy from 'wepy';

export default class auth extends base {
    static async login() {
        console.log('login')
        const loginCode = this.getConfig('login_code');
        if (loginCode != null && loginCode != '') {
            try {
                await this.checkLoginCode(loginCode);
            } catch (e) {
                console.warn('check login code fial', loginCode);
                await this.doLogin();
            }
        } else {
            console.warn('login code not exists', loginCode);
            await this.doLogin();
        }
    }

    /**
     * 执行登录操作
     * @returns {Promise.<void>}
     */
    static async doLogin() {
        const {code} = await wepy.login();
        const {third_session, login_code} = await this.session(code);
        await this.setConfig('login_code', login_code);
        await this.setConfig('third_session', third_session);
        await this.login();
    }

    /**
     * 获取会话
     * @param jsCode
     * @returns {Promise.<*>}
     */
    static async session(jsCode) {
        const shopCode = wepy.$instance.globalData.appCode;
        const url = `${this.baseUrl}/auth/session?code=${jsCode}&app_code=${shopCode}`;
        return await this.get(url);
    }

    /**
     * 读取权限值
     * @param key
     * @returns {*}
     */
    static getConfig(key) {
        return wepy.$instance.globalData.auth[key];
    }

    /**
     * 设置权限值
     * @param key
     * @param value
     * @returns {Promise.<void>}
     */
    static async setConfig(key, value) {
        await wepy.setStorage({key: key, data: value});
        wepy.$instance.globalData.auth[key] = value;
    }

    /**
     * 检查登录情况
     * @param loginCode
     * @returns {Promise.<*|Object>}
     */
    static async checkLoginCode(loginCode) {
        const url = `${this.baseUrl}/auth/check_session?login_code=${loginCode}`;
        const data = await this.get(url);
        return data.result;
    }
}