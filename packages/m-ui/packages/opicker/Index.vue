<template>
    <div v-if="visible" class="bvant-mui-opicker">
        <div class="bvant-mui-opicker__container">
            <bvan-nav-bar :title="title" :border="false" />
            <bvan-search v-if="searchInputVisible" v-model="searchText" shape="round" :show-action="searchVisible" placeholder="搜索" @search="searchHandler" @cancel="cancelSearchHandler" />
            <div class="bvant-mui-opicker__content">
                <tree></tree>
                <tree ref="tree" :lazy="true" :props="{ label: 'name', isLeaf: 'leaf' }" :load="loadHandler" @currentCheckChange="treeCurrentCheckChangeHandler" />
            </div>
            <div class="bvant-mui-opicker__selectedarea " :class="{ 'bvant-mui-opicker__selectedarea--state-expand': selectedareaExpand }">
                <div class="bvant-mui-opicker__selectedarea--expandicon" @click="selectedareaExpand = !selectedareaExpand">
                    <bvan-icon v-if="!selectedareaExpand" name="arrow-up" />
                    <bvan-icon v-else name="arrow-down" />
                </div>
                <div class="bvant-mui-opicker__selectedarea--content">
                    <span v-for="(cItem, index) in checkItems" :key="index" @click="checkItemClickHandler(cItem)">
                        {{ cItem.name }}
                    </span>
                </div>
            </div>
            <bvan-button-group>
                <bvan-button square block @click="cancelHandler">取消</bvan-button>
                <bvan-button square block type="info" @click="confirmHandler">确定</bvan-button>
            </bvan-button-group>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tree } from '../tree'
import { Objective, get as getObjective } from './objective'
import { utils } from '@belvoly-vue-aioa/m-core'
import { Node } from '../tree/interface'
import { OPickerNode } from './types'

const { request } = utils

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
        Tree
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
    @Prop() codes: string

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
        document.body.appendChild(this.$el)
    }

    destroyed() {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el)
        }
    }

    async loadHandler(node, resolve) {
        if (node.level === 0) {
            await this.loadSubNode(null, resolve)
        } else {
            const orgCode = node.data.value
            await this.loadSubNode(orgCode, resolve)
        }
    }

    async loadSubNode(parentCode, resolve) {
        await this.queryChildren(parentCode, resolve) // 查询子机构信息
    }

    // 查询机构下一层子机构
    async queryChildren(parentCode: string, resolve) {
        const { data } = await this.queryRemoteData(parentCode)
        if (data) {
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
        const uri = this.currentObjective.getUrl ? this.currentObjective.getUrl(this.currentObjective.config, this.currentObjective.url) : this.currentObjective.url
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

    treeCurrentCheckChangeHandler(checked: boolean, item: Node) {
        if (checked) {
            if (this.isSingleMode) {
                this.checkItems.forEach(c => {
                    if (c.value !== item.value) {
                        const tree: any = this.$refs.tree
                        if (c.id) {
                            tree.setCheck(c.id, false)
                        }
                    }
                })
                this.checkItems = [<TreeNode>item.data]
            } else {
                this.checkItems.push(<TreeNode>item.data)
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
        const isSelected = this.checkItems.some(c => c.value === item.value)
        return <Node>{
            id: item.id,
            name: item.name,
            value: item.value,
            type: item.nodeType,
            leaf: leaf || item.isParent === false,
            cancheck: item.cancheck === undefined ? true : item.cancheck,
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

    checkItemClickHandler(cItem: TreeNode) {
        this.cancelSearchHandler()
        const tree: any = this.$refs.tree
        tree.setCheck(cItem.id, false)
        const index = this.checkItems.findIndex(i => i.id === cItem.id)
        if (index > -1) {
            this.checkItems.splice(index, 1)
        }
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
.bvant-mui-opicker {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: #ffffff;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
    &__container {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    &__content {
        height: 100px;
        flex: 1;
        margin-bottom: 65px;
        overflow: auto;
    }

    &__selectedarea {
        position: absolute;
        bottom: 40px;
        left: 0;
        width: 100%;
        border-top: 1px solid #e4e4e4;
        background: #f9f9f9;

        &--expandicon {
            position: absolute;
            border: 1px solid #e4e4e4;
            border-radius: 30px;
            background: #f9f9f9;
            left: 0;
            right: 0;
            margin: auto;
            width: 30px;
            height: 30px;
            top: -15px;
            z-index: 1;
            color: #cccccc;
            text-align: center;
        }

        &--content {
            background: #f9f9f9;
            position: relative;
            z-index: 2;
            padding: 16px;
            padding-bottom: 8px;
            white-space: nowrap;
            overflow: auto;

            > span {
                min-width: 50px;
                text-align: center;
                line-height: 24px;
                border-radius: 4px;
                border: 1px solid #3492e9;
                font-size: 12px;
                color: #3492e9;
                padding: 0 8px;
                display: inline-block;
                margin-right: 8px;
                margin-bottom: 8px;
            }
        }

        &--state-expand &--content {
            white-space: normal;
        }
    }
}
</style>
