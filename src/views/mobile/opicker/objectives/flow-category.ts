import { OPickerNode } from 'packages/m-ui/packages/opicker/types'
import { OPickerObjective } from '../../../../../packages/m-ui'

function convertNode(item): OPickerNode {
    const isParent = !!item.children
    return {
        id: item.id,
        name: item.label,
        value: item.code,
        isParent: isParent,
        cancheck: !isParent,
        sequence: 0,
        data: item,
        hasChildNodesData: true,
        nodes: !isParent ? null : item.children.map(i => convertNode(i))
    }
}

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
    url: 'http://192.168.22.22:2001/api/public/formApi/formdata/getDicTreeData.do?_=1604653969726&id=F02A192F-11E7-4C58-983E-1C41660A4E93&formId=72268E7A-F78D-4E3C-80B0-9179DD67434B',
    chainAjax: function(ajax) {
        ajax.method = 'POST'
    },
    dataConvert: function(data) {
        return data.data
    },
    dataFilter: function(item, config) {
        return convertNode(item)
    },
    getUrl: function(config, url) {
        const uri = new URL(url)

        return uri.href
    }
}
