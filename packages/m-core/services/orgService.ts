import { request } from '../utils/request'
import config from '../config'

export interface Org {
    orgName?: string
    orgCode?: string
    /**
     * 组织类型
     */
    orgType?: string
    /**
     * 单位类型
     */
    unitType?: string
    /**
     * 排序号
     */
    orgSequence?: string
}

/**
 * 查询组织机构树
 * @method queryOrgTree
 * @param {string} orgCode 父组织机构代号
 */
function queryOrgTree(orgCode) {
    return request(`${config.apiHost}/bua/org/descendants`, {
        method: 'GET',
        data: {
            orgCode: orgCode
        }
    })
}

/**
 * 查询顶层组织机构详细信息
 * @method getOrgRoot
 */
function getOrgRoot() {
    return request<Org>(`${config.apiHost}/bua/org/root`)
}

/**
 * 查询当前机构代号对应该机构的祖先列表
 * @method queryOrgAncestor
 * @param {string} orgCode 机构代号
 */
function queryOrgAncestor(orgCode) {
    return request(`${config.apiHost}/bua/org/ancestor`, {
        method: 'GET',
        data: {
            orgCode: orgCode
        }
    })
}

/**
 * 查询用户所属的单位信息
 * @method getUnitInfo
 * @param {string} userUid 用户账号
 */
function getUnitInfo(userUid) {
    return request(`${config.apiHost}/bua/user/unit`, {
        method: 'GET',
        data: {
            userUid: userUid
        }
    })
}

/**
 * 获取子组织机构列表
 * @method queryChildren
 * @param {string} orgCode 机构标识
 */
function queryChildren(orgCode) {
    return request<
        {
            orgName: string
            orgCode: string
            orgParentCode: string
            orgType: string
            orgSequence: string
            orgParentName: string
            hasChildOrg: boolean
        }[]
    >(`${config.apiHost}/bua/org/queryChildren`, {
        method: 'GET',
        data: {
            orgCode: orgCode
        }
    })
}

/**
 * 获取当前机构的相关信息
 * @method getOrgInfo
 * @param {string} orgCode 机构标识
 */
function getOrgInfo(orgCode) {
    return request<Org>(`${config.apiHost}/bua/org/${orgCode}`)
}

export default {
    queryOrgTree,
    getOrgRoot,
    queryOrgAncestor,
    getUnitInfo,
    queryChildren,
    getOrgInfo
}
