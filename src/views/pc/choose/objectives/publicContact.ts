import { ChooseItemNode } from '@belvoly-vue-aioa/ui'
import { ChooseObjective } from '@belvoly-vue-aioa/ui'

const rootConfig = {
    apiHost: 'http://192.168.101.135:2001/api'
}

function convert(data, type): ChooseItemNode[] {
    if (type === 'category') {
        const result = data.map(item => {
            return {
                id: item.groupId,
                name: item.groupName,
                value: item.groupId,
                hasChildNodesData: item.children && item.children.length > 0,
                nodes: convert(item.children, type),
                isParent: item.children && item.children.length > 0,
                sequence: 0,
                data: item
            }
        })
        return result
    } else {
        return data.list
    }
}

export const publicContactObjective: ChooseObjective<{
    onlyCurrentUnit: boolean
    isShowRoot: boolean
    rootOrgCode: string
    cascade: boolean
}> = {
    code: 'publicContact',
    title: '公共',
    config: {
        onlyCurrentUnit: false,
        isShowRoot: false,
        rootOrgCode: null,
        cascade: true
    },
    url: ``,
    dataConvert: function(re, type) {
        return convert(re.data, type)
    },
    dataFilter: function(item, config, _, __, type) {
        if (type === 'category') {
            return item
        } else {
            return {
                id: item.contactId,
                value: item.contactId,
                name: item.fullName,
                data: { ...item, mobilePhone: item.mobilePhone },
                isParent: false,
                sequence: 0,
                subName: item.department || item.companyName,
                avatar: ''
            }
        }
    },
    searchPlaceholder: '名称',
    getSearchUrl: function(config, searchText) {
        return `${rootConfig.apiHost}/private/contacts/orgview/search?pageSize=10000&currentPage=1&categoryType=5&name=${encodeURIComponent(searchText)}&isThrough=true&groupId=0`
    },
    getUrl: function(config, url, category, type) {
        if (type === 'category') {
            return `${rootConfig.apiHost}/public/contacts/group/publicTree`
        } else {
            return `${rootConfig.apiHost}/private/contacts/orgview/search?pageSize=10000&currentPage=1&categoryType=5&name=&isThrough=false&groupId=` + category
        }
    }
}
