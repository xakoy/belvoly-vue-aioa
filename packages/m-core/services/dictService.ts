import { request } from '../utils/request'
import config from '../config'

/**
 * 查询子数据字典
 * @param {String} code
 * @param {*} callback
 */
function queryChild(code) {
    request(`${config.apiHost}/public/bua/dic/queryChild`, {
        method: 'GET',
        data: {
            code: code
        }
    })
}

export default {
    queryChild
}
