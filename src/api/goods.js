import base from './base';
import Page from '../utils/Page'

export default class goods extends base {
    static _createGoodsCategories(data) {
        const list = [];
        if (data != null) {
            list.push(...data.map(item => {
                return {
                    id: item.id,
                    title: item.name
                }
            }))
        }
        const selectedId = list.length > 0 ? list[0].id : null;
        return {
            list,
            selectedId,
            scroll: false
        }
    }

    // 处理折扣价格
    static _processGoodsDiscount(goods, discount) {
        const isDiscount = discount != null ? discount.categories.some(cid => cid == goods.innerCid) : false;
        if (!isDiscount) {
            return;
        }
        const rate = discount.rate / 100;
        const isSku = goods.goodsSkuInfo;
        if (isSku) {
            // 多规格数据处理
            const skuList = goods.goodsSkuInfo.goodsSkuDetails;
            skuList.forEach(item => {
                const detail = item.goodsSkuDetailBase;
                const price = detail.price;
                // 最低的价格作为原价
                if (item.originalPrice == null || price < item.originalPrice) {
                    item.originalPrice = price;
                }
                // 设置原价和当前价格
                detail.originalPrice = price;
                detail.price = (price * rate).toFixed(2);
            });
        } else {
            // 单规格数据处理
            goods.originalPrice = goods.sellPrice;
            goods.sellPrice = (goods.sellPrice * rate).toFixed(2);
        }
        // 折扣文本展现
        goods.discountRate = discount.rate / 10 + '折'
        goods.discountText = '会员折扣';
        goods.discount = true;
    }

    // 处理商品信息
    static _processGoodsData(item) {
        // 结构赋值
        const {name, sellPrice, originalPrice} = item;

        // 长名称处理
        if (name.length > 12) {
            item.simple_name = name.substring(0, 12) + '...';
        }
        // 长名称处理
        if (name.length > 30) {
            item.name = name.substring(0, 30) + '...';
        }

        // 销售价处理
        if (originalPrice == null || originalPrice == 0) {
            item.originalPrice = sellPrice;
        }

        // 处理图片
        this._processGoodsPreview(item);
        this._processSkuLabel(item);
        this._processGoodsPriceRange(item);
        this._processGoodsPriceLabel(item);
        this._processGoodsQuantity(item);
    }

    static _processGoodsPreview(item) {
        const images = item.images;
        // 图片处理
        if (images == null || images.length < 1) {
            item.imageUrl = '/images/icons/broken.png';
        } else if (images[0].url == null) {
            item.imageUrl = '/images/icons/broken.png';
        } else {
            item.imageUrl = images[0].url + '/medium';
        }
    }

    // 处理SKU标签
    static _processSkuLabel(detail) {
        const skuInfo = detail.goodsSkuInfo;
        if (!skuInfo) {
            return;
        }
        const skuLabels = [];
        for (let i = 1; i <= 3; i++) {
            const skuKey = skuInfo[`prop${i}`];
            const skuValueStr = skuInfo[`value${i}`];
            if (skuKey && skuValueStr) {
                const skuValues = skuValueStr.split(',');
                const sku = {
                    key: skuKey,
                    value: skuValues
                };
                skuLabels.push(sku);
            } else {
                break;
            }
        }
        detail.labels = skuLabels;
    }

    // 处理价格商品区间
    static _processGoodsPriceRange(detail) {
        if (!detail.goodsSkuInfo || !detail.goodsSkuInfo.goodsSkuDetails) {
            return;
        }
        const skuDetails = detail.goodsSkuInfo.goodsSkuDetails;
        let maxPrice = 0;
        let minPrice = Number.MAX_VALUE;

        for (let i in skuDetails) {
            const detail = skuDetails[i].goodsSkuDetailBase;
            maxPrice = Math.max(detail.price, maxPrice);
            minPrice = Math.min(detail.price, minPrice);
        }
        detail.maxPrice = maxPrice;
        detail.minPrice = minPrice;
    }

    // 处理价格展现标签 / 需要先调用区间处理
    static _processGoodsPriceLabel(detail) {
        let priceLable = detail.sellPrice;

        if (detail.maxPrice && detail.minPrice) {
            priceLable = detail.minPrice;
        }
        detail.priceLable = isNaN(detail.priceLable) ? priceLable : priceLable.toFixed(2);
    }

    // 处理数量（已购买）
    static _processGoodsQuantity(item) {
        item.num = 0;
    }
}