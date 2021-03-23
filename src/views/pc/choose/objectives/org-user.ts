import { ChooseObjective } from '../../../../../packages/ui'

export const orgUserObjective: ChooseObjective<{
    onlyCurrentUnit: boolean
    isShowRoot: boolean
    rootOrgCode: string
    cascade: boolean
}> = {
    code: 'orguser',
    title: '按部门',
    config: {
        onlyCurrentUnit: false,
        isShowRoot: false,
        rootOrgCode: null,
        cascade: true
    },
    url: 'http://192.168.101.135:2001/api/bua/opicker/orgAndUser',
    chainAjax: function(ajax) {
        if (!ajax.headers) {
            ajax.headers = {}
        }
        ajax.dataType = 'json'
    },
    dataFilter: function(item, config) {
        if (config.isShowRoot === true) {
            item.open = true
        }

        if (item.isParent || (item.nodes !== null && item.nodes.length > 0)) {
            item.nocheck = true
            item.cancheck = false
        }
        return item
    },
    getUrl: function(config, url) {
        const uri = new URL(url)

        if (config.rootOrgCode) {
            uri.searchParams.set('rootCode', config.rootOrgCode)
        }
        if (config.isShowRoot === true) {
            uri.searchParams.set('isIncludeRoot', config.isShowRoot.toString())
        }

        return uri.href
    }
}
