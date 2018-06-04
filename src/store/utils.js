import {getStore} from 'wepy-redux';
import {SAVE} from './types/cache'
import config from '../api/config';
import coupon from '../api/coupon';

const store = getStore();
// 元数据
const meta = {};
// 是否调试
const IS_DEBUG = true;
// 超时时间
const CACHE_TIMEOUT = 5 * 60 * 1000;
// 嵌套字段，需要拆解缓存
const NESTED_KEY = ['config', 'member', 'coupon'];
// 初始化需要加载的字段
const INIT_KEY = ['config', 'coupon'];
// 加载状态
let isLoading = false;
// 等待队列
let loadingQueue = [];

// 初始化
const init = async () => {
    if (isLoading) {
        console.info('[store] store is loading, wait completed');
        return new Promise(resolve => {
            const callback = () => {
                resolve();
            }
            loadingQueue.push(callback);
        });
    } else {
        console.info('[store] start init store');
        isLoading = true;
        await use(...INIT_KEY);
        // 清空等待队列
        console.info('[store] store init completed');
        isLoading = false;
        loadingQueue.forEach(callback => callback());
        loadingQueue = [];
    }
}

// 取值构造器
const get = key => {
    return (state) => {
        return state.cache[key];
    }
}

// 保存数据
const save = (key, data) => {
    if (IS_DEBUG) {
        console.info(`[store] save key=${key}, data=`,data);
    }
    store.dispatch({
        type: SAVE,
        payload: {
            key: key,
            value: data
        }
    });
}

const use = async (...fields) => {
    const fetchFileds = fields.filter(field => !exists(field));
    if (fetchFileds.length > 0) {
        console.info(`[store] use store: fields=${fetchFileds}`);
        await load(fetchFileds);
    } else {
        console.info(`[store] use store: all fields cached`);
    }
}

/**
 * 加载指定字段的数据
 * @param fields
 * @returns {Promise.<void>}
 */
const load = async (fields) => {
    // 将字段构造Promise
    const fetchPromises = fields.map(field => fetch(field));
    // 获取所有数据
    const data = await Promise.all(fetchPromises);
    // 保存结果
    fields.forEach((field, index) => {
        const filedData = data[index];
        if (isNested(field)) {
            const keys = Object.keys(filedData);
            console.info(`[store] load [${field}] nest fields = ${keys}`);
            keys.forEach(key => save(key, filedData[key]));
        } else {
            save(field, filedData);
        }
    });
    // 保存元数据
    save('meta', meta);
};

const isNested = field => {
    return NESTED_KEY.some(key => key == field);
};

const reflesh = async (...fields) => {
    console.info(`[store] reflesh store: fields=${fields}`);
    await load(fields);
}

const fetch = (field) => {
    // 先更新无数据
    updateMeta(field);
    // 再获取Promise对象
    switch (field) {
        case 'config':
            return config.init();
        case 'member':
            return member.info();
        case 'notices':
            return shop.notices();
        case 'status':
            return shop.getStatus();
        case 'categories':
            return goods.categories();
        case 'coupon':
            return coupon.all();
        case 'reduce':
            return shop.reduces();
        case 'recommend':
            return goods.recommend().next();
        case 'version':
            return shop.chargeLimit();
    }
}

/**
 * 更新元数据
 * @param field
 */
const updateMeta = (field) => {
    if (meta[field] == null) {
        meta[field] = {};
        meta[field].init = true;
    }
    meta[field].updateTime = new Date().getTime();
}

const exists = key => {
    if (meta[key] == null || meta[key].init != true) {
        return false;
    }
    // 判断是否过期
    const updateTime = meta[key].updateTime;
    const interval = new Date().getTime() - updateTime;
    return interval < CACHE_TIMEOUT;
}

export default {get, save, use, refresh: reflesh, init}