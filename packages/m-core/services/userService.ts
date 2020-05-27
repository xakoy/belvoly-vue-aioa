import { request } from '../utils/request'
import config from '../config'

export interface User {
    userUid?: string
    userName?: string
    userFullName?: string
    userEmail?: string
    userEmailPublic?: string
    userType?: string
    userSex?: string
    userLocked?: string
    userSequence?: string
    orgCode?: string
    orgName?: string
    mobilePhone?: string
    officePhone?: string
}

/**
 * 查询我的下属
 * @method queryMySubordinates
 * @param {string} userUid 用户账号
 */
function queryMySubordinates(userUid) {
    return request(`${config.apiHost}/bua/org/MySubordinates`, {
        method: 'GET',
        data: {
            userUid: userUid
        }
    })
}

/**
 * 查询用户个人信息
 * @method getUserBaseInfo
 * @param {string} uid
 */
const getUserBaseInfo = function(uid) {
    return request(`${config.apiHost}/bua/user/getUser`, {
        method: 'GET',
        data: {
            userUid: uid
        }
    })
}

/**
 * 查询当前用户个人信息
 * @method getCurrentUserInfo
 */
function getCurrentUserInfo() {
    return request(`${config.apiHost}/private/bua/user/getUserForMultiUnit`)
}

/**
 * 查询用户头像
 * @method getPicture
 * @param {string} uid
 */
function getPicture(uid) {
    return request(`${config.apiHost}/bua/user/getPicture`, {
        method: 'GET',

        data: {
            userUid: uid
        }
    })
}

/**
 * 根据用户的名称或者账号模糊查询
 * @method searchUsers
 * @param {string} userUid
 * @param {string} userName
 * @param {string} parentOrgCode 父级orgCode，限定在此机构下查找
 */
function searchUsers(userUid, userName, parentOrgCode?: string) {
    return request<User[]>(`${config.apiHost}/bua/user/searchUsers`, {
        method: 'POST',
        data: {
            userUid: userUid,
            userName: userName,
            orgCode: parentOrgCode
        }
    })
}

/**
 * 查询机构下面的所有用户（穿透查询）
 * @method queryByOrgCodeAllUsers
 * @param {string} orgCode
 * @param {*} callback
 */
function queryByOrgCodeAllUsers(orgCode) {
    return request<User[]>(`${config.apiHost}/bua/user/queryByOrgCodeAllUsers`, {
        method: 'GET',
        data: {
            orgCode: orgCode,
            includeLocked: false
        }
    })
}

/**
 * 获取用户所属的单位信息
 */
function getUserUnits() {
    return request(`${config.apiHost}/private/bua/user/units`)
}

/**
 * 查询机构下面的所有用户
 * @method queryByOrgCode
 * @param {string} orgCode
 * @param {*} callback
 */
const queryByOrgCode = function(orgCode) {
    return request<User[]>(`${config.apiHost}/bua/user/queryByOrgCode`, {
        method: 'GET',
        data: {
            orgCode: orgCode
        }
    })
}

export default {
    queryMySubordinates,
    getUserUnits,
    getUserBaseInfo,
    getCurrentUserInfo,
    getPicture,
    searchUsers,
    queryByOrgCodeAllUsers,
    queryByOrgCode
}
