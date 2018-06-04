import base from './base';
import Page from '../utils/Page';

export default class coupon extends base {
    // 获取可领取、已领取的优惠卷
    static all() {
        const url = `${this.baseUrl}/coupons/all`;
        return this.get(url).then(({owned, show}) => {
            const pickCoupons = this.processCouponsList(show, this._processPickItem.bind(this));
            const ownCoupons = this.processCouponsList(owned, this._processCouponItem.bind(this));
            return {pickCoupons, ownCoupons};
        });
    }

    // 处理可以领取的优惠价
    static _processPickItem(coupon) {
        coupon.beginTime = this._convertTimestapeToDay(coupon.beginTime);
        coupon.dueTime = this._convertTimestapeToDay(coupon.dueTime);
        return coupon;
    }

    // 处理已拥有的优惠卷
    static _processCouponItem(data) {
        const root = data;
        if (data.coupon == null) {
            return null;
        }
        const coupon = data.coupon;

        coupon.status = root.status;
        coupon.id = root.id;
        coupon.couponId = root.couponId;
        coupon.acceptTime = root.acceptTime;
        coupon.usedTime = root.usedTime;
        coupon.beginTime = this._convertTimestapeToDay(coupon.beginTime);
        coupon.dueTime = this._convertTimestapeToDay(coupon.dueTime);
        this._processCouponDisplayFlag(coupon);
        return coupon;
    }

    // 处理卡券展示标签
    static _processCouponDisplayFlag(coupon) {
        if (coupon.status != 'NEVER_USED') {
            return;
        }
        const acceptTimeInterval = this._dayIntervalToNow(coupon.acceptTime);
        if (acceptTimeInterval <= 1) {
            coupon.isNew = true;
        }
        const dueTimeInterval = this._dayIntervalToNow(coupon.dueTime);
        if (dueTimeInterval>= -1) {
            coupon.isExpiring = true;
        }
    }

    // 计算时间间隔
    static _dayIntervalToNow(dateStr) {
        const MS_OF_DAY = 86400000;
        const date = Date.parse(dateStr);
        return Math.round((Date.now() - date) / MS_OF_DAY);
    }

    static processCouponsList(data, func) {
        if (data && data.length > 0) {
            return data.map(func);
        } else {
            return [];
        }
    }

    // 处理时间格式
    static _convertTimestapeToDay(timestape) {
        let temp = timestape;
        if (timestape.indexOf(' ') != -1) {
            temp = timestape.substring(0, timestape.indexOf(' '))
        }
        return temp.replace(/-/g, '.')
    }
}