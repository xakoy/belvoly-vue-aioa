import { request } from '../utils/request'
import config from '../config'

function upload(uploadData) {
    return request(`${config.apiHost}/sharedservice/blob/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: uploadData
    })
}

/**
 * 更新附件业务关联表
 * @method updateRelevance
 *
 */
function updateRelevance(updateRelevanceData) {
    return request(`${config.apiHost}/sharedservice/blob/updateRelevance`, {
        method: 'POST',
        data: updateRelevanceData
    })
}

function remove(id) {
    return request(`${config.apiHost}/sharedservice/blob/delete/${id}`, {
        method: 'POST'
    })
}

/**
 * 删除业务数据关联附件
 * @method deleteRelevance
 */
const removeRelevance = function(deleteRelevanceData: { refTableId: string; refTableName: string }) {
    return request(`${config.apiHost}/sharedservice/blob/delete?refTableId=${deleteRelevanceData.refTableId}&refTableName=${deleteRelevanceData.refTableName}`, {
        method: 'POST'
    })
}

/**
 * 查询附件列表
 * @method query
 *
 */
const query = function(queryData) {
    return request(`${config.apiHost}/sharedservice/blob/query`, {
        method: 'GET',
        data: queryData
    })
}

export default {
    upload,
    remove,
    updateRelevance,
    removeRelevance,
    query
}
