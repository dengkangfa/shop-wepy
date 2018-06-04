import wepy from 'wepy'
import base from './base'

export default class shop extends base {
    static TYPE = {
        '1': {
            key: '1',
            name: '在线商城',
            badgeText: '商城',
            basicName: '商品展示',
            basicBadgeText: '商城'
        },
        '2': {
            key: '2',
            name: '点外卖',
            badgeText: '外卖',
            basicName: '在线菜单',
            basicBadgeText: '菜单'
        }
    }

    // 获取店铺类型
    static type() {
        const type = wepy.$instance.globalData.shopType;
        return this.TYPE[type];
    }

    //处理公告
    static _processNotices(data) {
        return data == null || data.length < 1 ? [{content: '暂无公告'}] : data;
    }

    // 处理满减
    static _processReduce(data) {
        data.forEach(item => {
            item.showText = `满${item.limitPrice}减${item.fee}`;
        })
        const showText = data.map(v => v.showText).join(',');
        return {
            list: data, showText
        }
    }

    // 处理基本信息
    static _processInfo(data) {
        data.type = this.type();
        return data;
    }

    // 处理版本
    static _processVersion(data) {
        if (data == null) {
            // 没有初始化收费配置的情况下，开启所有权限
            return {
                isMember: true,
                isOrder: true
            }
        } else {
            const version = data.chargeVersion;
            data.isMember = [2, 3, 6, 7].some(value => value == version);
            data.isOrder = [4, 5, 6, 7].some(value => value == version);
            return data;
        }
    }

    // 处理状态
    static _processStatus(data) {
        if (data.beginTime == null || data.endTime == null) {
            return;
        }
        data.timeText = `周一至周日 ${data.beginTime}至${data.end}`;
        if (data.status == 'CLOSE') {
            data.closeTips = '店铺已休息，请稍后再来';
        } else if (data.status == 'NORMAL' && !data.open) {
            data.closeTips == '店铺已休息，请稍后再来';
        }
        return data;
    }
}