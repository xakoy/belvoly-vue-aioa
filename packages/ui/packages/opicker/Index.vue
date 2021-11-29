<template>
    <BvDialog size="medium" v-if="visible" :visible="true" :title="title" @close="cancelHandler">
        <div class="bv-opicker">
            <!-- <bvan-search v-if="searchInputVisible" v-model="searchText" shape="round" :show-action="searchVisible" placeholder="搜索" @search="searchHandler" @cancel="cancelSearchHandler" /> -->
            <div class="bv-opicker__container">
                <div class="bv-opicker__content">
                    <el-tree
                        node-key="id"
                        ref="tree"
                        :lazy="true"
                        show-checkbox
                        :check-strictly="true"
                        :props="{ label: 'name', isLeaf: 'leaf' }"
                        :load="loadHandler"
                        :defaultExpandedKeys="defaultExpandedKeys"
                        @check-change="treeCurrentCheckChangeHandler"
                    />
                </div>
                <div class="bv-opicker__selectedarea">
                    <bv-flex direction="column" style="height: 100%;">
                        <bv-flex-item>
                            <bv-flex>
                                <bv-flex-item auto>
                                    已选
                                    <span class="bv-opicker__primary">{{ checkItems.length }}</span> 个
                                </bv-flex-item>
                                <bv-flex-item>
                                    <span class="bv-opicker__clear" @click="clear">清空</span>
                                </bv-flex-item>
                            </bv-flex>
                        </bv-flex-item>
                        <bv-flex-item auto style="overflow: hidden;">
                            <div class="bv-opicker__selectedarea--content">
                                <span v-for="(cItem, index) in checkItems" :key="index">
                                    <span class="bv-opicker__selectedarea--content-close" @click="removeItemClickHandler(cItem)">
                                        <i class="fc fc-circle-close-filled" />
                                    </span>
                                    {{ cItem.name }}
                                </span>
                            </div>
                        </bv-flex-item>
                    </bv-flex>
                </div>
            </div>
        </div>
        <template #footer>
            <el-button type="primary" @click="confirmHandler">
                确定
            </el-button>
            <el-button @click="cancelHandler">
                取消
            </el-button>
        </template>
    </BvDialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Objective, get as getObjective } from './objective'
import { utils } from '@belvoly-vue-aioa/core'
import { Dialog as BvDialog } from '../dialog'
import { Flex as BvFlex } from '../layout'
import { FlexItem as BvFlexItem } from '../layout'
import { OPickerNode } from './types'
import { ElTree } from 'element-ui/types/tree'

const { request } = utils

interface Node {
    level?: number
    label?: string
    value: string
    id: string
    children?: Node[]
    check?: boolean
    [key: string]: any
    loading?: boolean
    loaded?: boolean
    parent?: Node
    isLeaf?: boolean
    cancheck?: boolean
    data?: any
}

interface TreeNode {
    id: string
    name: string
    value: string
    type: string
    leaf: boolean
    checked: boolean
    data: any
    [key: string]: any
}

type SelectionMode = 'multiple' | 'single'

interface NameValue {
    name: string
    value: string
    data?: any
}

@Component({
    components: {
        BvDialog,
        BvFlex,
        BvFlexItem
    }
})
export default class OpickerIndex extends Vue {
    @Prop({ default: 'OPicker' }) title: string
    @Prop({ default: 'multiple' }) selectionMode: SelectionMode
    @Prop({ default: false }) visible: boolean
    @Prop({
        default: function() {
            return []
        }
    })
    objects: Objective[]
    @Prop() names: string
    @Prop() values: string

    @Prop() value: {
        names: string
        values: string
        nodes: NameValue[]
    }
    /**
     * 多选值的分隔符
     */
    @Prop({ default: ',' }) splitChar: string

    checkItems: TreeNode[] = []
    selectedareaExpand = false
    defaultExpandedKeys = []

    get isSingleMode() {
        return this.selectionMode === 'single'
    }

    mounted() {
        if (this.value) {
            let nodes: NameValue[] = []
            if (this.value.nodes) {
                nodes = this.value.nodes
            } else {
                if (this.value.names && this.value.values) {
                    const values = this.value.values.split(this.splitChar)
                    nodes = this.value.names.split(this.splitChar).map((name, index) => ({
                        name: name,
                        value: values[index]
                    }))
                }
            }
            this.checkItems = nodes.map(n => this.convertToTreeNode(n))
        }
    }

    destroyed() {}

    async loadHandler(node, resolve) {
        if (node.data && node.data.children) {
            resolve(node.data.children)
        } else if (node.level === 0) {
            await this.loadSubNode(null, resolve)
        } else {
            const orgCode = node.data.value
            await this.loadSubNode(orgCode, resolve)
        }

        const tree = this.getCurrentTree()
        tree.setCheckedKeys(
            this.checkItems.map(item => item.id),
            true
        )
    }

    async loadSubNode(parentCode, resolve) {
        await this.queryChildren(parentCode, resolve) // 查询子机构信息
    }

    // 查询机构下一层子机构
    async queryChildren(parentCode: string, resolve) {
        const { data } = await this.queryRemoteData(parentCode)
        if (data) {
            if (!parentCode) {
                if (data.length === 1) {
                    this.defaultExpandedKeys = [data[0].id]
                }
            }
            const nodeData = this.convertOPickerNodesToTreeNodeData(data)
            const children = [...nodeData]
            resolve(children)
        }
    }

    get currentObjective() {
        const o = this.objects[0]
        const raw = getObjective(o.code)
        if (!raw) {
            throw new Error(`使用无注册服务标识:${o.code}`)
        }
        return {
            ...raw,
            ...o
        }
    }

    async queryRemoteData(code) {
        const uri = this.currentObjective.getUrl ? this.currentObjective.getUrl(this.currentObjective.config, this.currentObjective.url, code) : this.currentObjective.url
        const url = new URL(uri)
        if (code) {
            url.searchParams.set('code', code)
        }

        const reOption: any = { method: 'GET' }
        if (this.currentObjective.chainAjax) {
            this.currentObjective.chainAjax(reOption)
        }

        const result = await request.request<OPickerNode[]>(url.href, reOption, {
            isSuccess: response => {
                return response.status === 200
            },
            getData: response => response.data
        })
        let data = result.data
        if (this.currentObjective.dataConvert) {
            data = this.currentObjective.dataConvert(data)
        }

        if (this.currentObjective.dataFilter) {
            data = data.map(item => this.currentObjective.dataFilter(item, this.currentObjective.config, this.currentObjective, { selectionMode: this.selectionMode }))
        }

        return {
            data
        }
    }

    getCurrentTree() {
        const tree: ElTree<any, any> = this.$refs.tree as any
        return tree
    }

    treeCurrentCheckChangeHandler(item: Node, checked: boolean) {
        if (checked) {
            if (this.isSingleMode) {
                const tree = this.getCurrentTree()
                tree.setCheckedKeys([item.id], true)
                this.checkItems = [<TreeNode>item]
            } else {
                if (!this.checkItems.some(i => i.value === item.value)) {
                    this.checkItems.push(<TreeNode>item)
                }
            }
        } else {
            const index = this.checkItems.findIndex(i => i.value === item.value)
            if (index > -1) {
                this.checkItems.splice(index, 1)
            }
        }
    }

    searchInputVisible = false
    searchText = ''
    searchVisible = false

    searchHandler() {
        //
    }

    cancelSearchHandler() {
        //
    }

    convertOPickerNodesToTreeNodeData(nodes: OPickerNode[]) {
        if (!nodes) return []

        return nodes.map(item => {
            const node = this.convertOPickerNodeToTreeNode(item, false)
            return node
        })
    }

    convertOPickerNodeToTreeNode(item: OPickerNode, leaf = false) {
        const cancheck = item.cancheck === undefined ? true : item.cancheck
        const checkedItem = this.checkItems.find(c => c.value === item.value)
        const isSelected = !!checkedItem && cancheck
        if (isSelected) {
            checkedItem.id = item.id
        }
        return <Node>{
            id: item.id,
            name: item.name,
            value: item.value,
            type: item.nodeType,
            leaf: leaf || item.isParent === false,
            disabled: !cancheck,
            check: isSelected,
            children: !(item.hasChildNodesData && item.nodes) ? null : item.nodes.map(i => this.convertOPickerNodeToTreeNode(i)),
            data: item.data
        }
    }

    cancelHandler() {
        this.close()
    }
    confirmHandler() {
        const items = this.checkItems.map(u => this.convertToNameValue(u))
        const all = [...items]
        const names = all.map(a => a.name).join(this.splitChar)
        const values = all.map(a => a.value).join(this.splitChar)
        const value = {
            names: names,
            values: values,
            nodes: items
        }

        this.$emit('update:names', names)
        this.$emit('update:values', values)
        this.$emit('input', value)
        this.$emit('selected', value)
        this.close()
    }

    removeItemClickHandler(cItem: TreeNode) {
        this.cancelSearchHandler()
        const index = this.checkItems.findIndex(i => i.id === cItem.id)
        if (index > -1) {
            this.checkItems.splice(index, 1)
        }
        const tree = this.getCurrentTree()
        tree.setCheckedKeys(
            this.checkItems.map(item => item.id),
            true
        )
    }

    clear() {
        this.checkItems = []
        const tree = this.getCurrentTree()
        tree.setCheckedKeys([])
    }

    close() {
        this.$emit('update:visible', false)
        this.$emit('close')
    }

    convertToTreeNode(nv: NameValue, type?: string) {
        return <TreeNode>{
            id: nv.value,
            name: nv.name,
            value: nv.value,
            checked: true,
            type: type,
            data: nv.data
        }
    }

    convertToNameValue(node: TreeNode) {
        return <NameValue>{
            name: node.name,
            value: node.value,
            data: node.data
        }
    }
}
</script>

<style lang="less">
@import '../../css/initial.less';

.bv-opicker {
    height: 400px;
    &__container {
        height: 100%;
        position: relative;
        display: flex;
    }
    &__content {
        height: 100%;
        box-sizing: border-box;
        padding: 20px;
        width: 50%;
        overflow: auto;
        border-right: 1px solid;
        .border-color--right(border-color-base);
    }
    &__primary {
        .color(color-primary);
    }
    &__clear {
        .color(@color-danger);
        cursor: pointer;
    }

    &__selectedarea {
        padding: 20px;
        box-sizing: border-box;
        flex: 1;
        &--content {
            box-sizing: border-box;
            height: 100%;
            padding-top: 20px;
            overflow: auto;

            > span {
                display: block;
                line-height: 24px;
            }
            &-close {
                .color(@color-danger);

                cursor: pointer;
                padding-right: 8px;
            }
        }
    }

    .el-tree {
        overflow: hidden;
        .el-checkbox.is-disabled {
            display: none;
        }
    }
}
</style>
