import { OPickerObjective } from '../../../../../packages/m-ui'

export const orgObjective: OPickerObjective<{
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
    url: 'http://192.168.24.111/api/bua/opicker/org',
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
