import { ChooseItemNode } from 'packages/ui/packages/choose/types'
import { ChooseObjective } from '../../../../../packages/ui'

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

export const orgObjective: ChooseObjective<{
    onlyCurrentUnit: boolean
    isShowRoot: boolean
    rootOrgCode: string
    cascade: boolean
}> = {
    code: 'personalcontact',
    title: '个人通讯录',
    config: {
        onlyCurrentUnit: false,
        isShowRoot: false,
        rootOrgCode: null,
        cascade: true
    },
    url: 'http://192.168.101.135:2001/api/private/contacts/group/query',
    chainAjax: function(ajax) {},
    dataConvert: function(re, type) {
        return convert(re.data, type)
    },
    dataFilter: function(item, config, _, __, type) {
        if (type === 'category') {
            return item
            return {
                id: item.groupId,
                name: item.groupName,
                value: item.groupId,
                isParent: true,
                sequence: 0,
                data: item
            }
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
        return 'http://192.168.101.135:2001/api/private/contacts/orgview/search?pageSize=10000&currentPage=1&categoryType=4&name=' + encodeURIComponent(searchText) + '&isThrough=true&groupId=0'
    },
    getUrl: function(config, url, category, type) {
        if (type === 'category') {
            const uri = new URL('http://192.168.101.135:2001/api/private/contacts/group/personalTree')

            // uri.searchParams.set('rootCode', category)

            return uri.href
        } else {
            const uri = new URL('http://192.168.101.135:2001/api/private/contacts/orgview/search?pageSize=10000&currentPage=1&categoryType=4&name=&isThrough=false&groupId=' + category)
            return uri.href
        }
    }
}
