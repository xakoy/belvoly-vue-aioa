import { OPickerObjective } from '../../../../../packages/m-ui'

export const flowCategoryObjective: OPickerObjective<{
    onlyCurrentUnit: boolean
    isShowRoot: boolean
    rootOrgCode: string
    cascade: boolean
}> = {
    code: 'flow-category',
    title: '分类选择',
    config: {
        onlyCurrentUnit: false,
        isShowRoot: false,
        rootOrgCode: null,
        cascade: true
    },
    url: 'http://192.168.22.22:2001/api/private/wf/api/node/queryNodeApprover.do?_=1604633452285&flowId=1BCC0FFE-81F6-4E1C-B6F5-286B6328C255&formField=FL&orgCode=yfzx&holdType=1',
    chainAjax: function(ajax) {
        if (!ajax.headers) {
            ajax.headers = {}
        }
        ajax.dataType = 'json'
    },
    dataConvert: function(data) {
        return data.data.users
    },
    dataFilter: function(item, config) {
        return {
            id: item.userUid,
            name: item.userName,
            value: item.userUid,
            isParent: false,
            sequence: item.sequence,
            data: item
        }
    },
    getUrl: function(config, url) {
        const uri = new URL(url)

        return uri.href
    }
}
