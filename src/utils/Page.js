import http from './Http'

export default class Pagination {
    constructor (url, processFunc) {
        // 数据访问地址
        this.url = url;
        // 数据集合
        this.list = [];
        // 起始数据
        this.start = 0;
        // 加载数据条数
        this.count = 10;
        // 数据处理函数
        this.processFunc = processFunc;
        // 正在加载中
        this.loading = false;
        // 参数
        this.params = [];
        // 是否底部
        this.reachBottom = false;
        // 是否为空
        this.empty = true;
        // 是否需要清除
        this.toClear = false;
    }
}