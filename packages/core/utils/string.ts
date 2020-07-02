/**
 * 字符串是否为null或者空
 * @param {String} value 输入字符串
 * @returns {Boolean} 判断结果
 */
function isNullOrEmpty(value) {
    return !value || value.length === 0
}

/**
 * 格式化字符串
 * @param str 要格式化的字符串
 * @param obj 值
 * @returns
 * @example
 *    "Hello, I'm {name}".format({name: 'luolong'})
 */
export function format(str, obj) {
    if (!obj) {
        return str
    }
    return str.replace(/\{([^}]+)\}/g, (match, key) => obj[key])
}

export default {
    isNullOrEmpty
}
