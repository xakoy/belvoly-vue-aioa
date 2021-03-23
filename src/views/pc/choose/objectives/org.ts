import { ChooseObjective } from '../../../../../packages/ui'

export const orgObjective: ChooseObjective<{
    onlyCurrentUnit: boolean
    isShowRoot: boolean
    rootOrgCode: string
    cascade: boolean
}> = {
    code: 'org',
    title: '按部门',
    config: {
        onlyCurrentUnit: false,
        isShowRoot: false,
        rootOrgCode: null,
        cascade: true
    },
    url: 'http://192.168.101.135:2001/api/private/contacts/group/query',
    chainAjax: function(ajax) {},
    dataFilter: function(item, config, _, __, type) {
        if (type === 'category') {
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
    getUrl: function(config, url, category, type) {
        if (type === 'category') {
            const uri = new URL(url)

            uri.searchParams.set('rootCode', category)

            return uri.href
        } else {
            const uri = new URL('http://192.168.101.135:2001/api/public/contacts/contactItem/query?groupId=' + category)
            return uri.href
        }
    }
}
