import wepy from 'wepy';

export default class http {
    static async request (method, url, data, loading = true) {
        const param = {
            url,
            method,
            data
        };
        if (loading) {
            // 显示加载
        }
        console.info(`[http]request url=${url}`)
        const res = await wepy.request(param);
        if (this.isSuccess(res)) {
            return res.data.data;
        } else {
            throw this.requestException(res);
        }
    }

    static isSuccess (res) {
        const wxCode = res.statusCode;

        if (wxCode !== 200) {
            return false;
        }
        const wxData = res.data;
        return !(wxData && wxData.code !== 0);
    }

    static requestException(res) {
        const error = {};
        error.statusCode = res.statusCode;
        const wxData = res.data;
        const serverData = wxData.data;
        if (serverData) {
            error.serverCode = wxData.code;
            error.message = serverData.message;
            error.serverData = serverData;
        }
        return error;
    }

    static get(url, data, loading = true) {
        return this.request('GET', url, data, loading)
    }

    static put(url, data, loading = true) {
        return this.request('PUT', url, data, loading);
    }

    static post(url, data, loading = true) {
        return this.request('POST', url, data, loading);
    }

    static patch(url, data, loading = true) {
        return this.request('PATCH', url, data, loading);
    }

    static delete(url, data, loading = true) {
        return this.request('DELETE', url, data, loading);
    }
}