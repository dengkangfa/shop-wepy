import base from './base';
import Page from '../utils/Page'

export default class member extends base {
    static processDiscount(card, member) {
        if (member == null || card == null) {
            return null;
        }
        if (card.supplyDiscount != 1) {
            return null;
        }
        // 计算折扣
        const {discountRule, customDiscount} = member;
        if (discountRule == null) {
            return null;
        }
        let discount = 100;
        if (customDiscount > 0 && customDiscount <= 100) {
            // 自定义折扣
            discount = customDiscount;
        } else if (discountRule != null && discountRule.discount < 100) {
            // 等级折扣
            discount = discountRule.discount;
        }
        if (discount == null || discount >= 100 || discount <= 0) {
            return null;
        }
        const {discountCategoryList} = discountRule;
        if (discountCategoryList == null || discountCategoryList.length < 1) {
            return null;
        }
        const categories = discountRule.discountCategoryLists.map(item => item.categoryId);
        return {
            level: discountRule.levelName,
            categories,
            rate: discount
        };
    }
}