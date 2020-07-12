<template>
    <div>
        <tree-node v-for="(item, index) in rootNode.children" :key="index" :lazy="lazy" :data="item" :zindex="10" :load-node="loadNode" @checkChange="childCheckChangeHandler" expand />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import TreeNode from './Node.vue'
import { Node } from './interface'

interface TreeProps {
    label?: string
    children?: string
    disabled?: string
    isLeaf?: string
}

@Component({
    components: {
        TreeNode
    }
})
export default class Tree extends Vue {
    @Prop() data: Node[]
    @Prop({ default: false }) lazy: boolean
    @Prop() load: Function
    @Prop({
        default: function() {
            return {
                children: 'children',
                label: 'label',
                disabled: 'disabled',
                isLeaf: 'isLeaf'
            }
        }
    })
    props: TreeProps

    rootNode: Node = {
        id: '0',
        level: 0,
        label: '',
        isLeaf: true,
        loading: false,
        loaded: false,
        cancheck: false,
        data: null,
        children: []
    }

    mounted() {
        this.$nextTick(() => {
            if (this.lazy) {
                this.loadNode(this.rootNode)
            } else {
                this.rootNode.loaded = true
                this.parseChildren(this.rootNode, this.data)
            }
        })
    }

    loadNode(parentNode: Node) {
        const resolve = (nodes: Node[]) => {
            parentNode.loading = false
            parentNode.loaded = true
            this.parseChildren(parentNode, nodes)
        }
        parentNode.loading = true
        this.load(parentNode, resolve)
    }

    parseChildren(parent: Node, children: Node[]) {
        if (children) {
            parent.children = children.map(c => {
                const rc: Node = { id: c.id }
                rc.label = this.getLabel(c)
                rc.parent = parent
                rc.level = parent.level + 1
                rc.isLeaf = this.getLeaf(c)
                rc.loading = false
                rc.loaded = false
                rc.data = c
                rc.check = c.check ? true : false
                rc.cancheck = c.cancheck ? true : false

                if (c.children) {
                    rc.children = []
                    rc.loaded = true
                    this.parseChildren(rc, c.children)
                } else if (rc.isLeaf) {
                    rc.loaded = true
                }
                return rc
            })
        } else {
            parent.children = []
        }
    }

    getLabel(node: Node) {
        if (this.props.label) {
            return node[this.props.label]
        }
        return node.label
    }

    getLeaf(node: Node) {
        const key = this.props.isLeaf
        if (key) {
            return node[key]
        }
        return node.isLeaf || false
    }

    setCheck(id: string, checked: boolean) {
        const nodes = this.rootNode.children
        this.setNodeCheck(id, checked, nodes)
    }

    setNodeCheck(id: string, checked: boolean, nodes: Node[]) {
        for (const node of nodes) {
            if (node.id === id) {
                node.check = checked
                if (checked) {
                    if (!this.checkedItems.some(item => item === node)) {
                        this.checkedItems.push(node)
                        this.checkChange()
                    }
                } else {
                    const index = this.checkedItems.findIndex(item => item === node)
                    if (index > -1) {
                        this.checkedItems.splice(index, 1)
                        this.checkChange()
                    }
                }
                break
            } else if (node.children && node.children.length > 0) {
                this.setNodeCheck(id, checked, node.children)
            }
        }
    }

    checkedItems: Node[] = []

    childCheckChangeHandler(checked, item: Node) {
        if (checked) {
            this.checkedItems.push(item)
        } else {
            const index = this.checkedItems.findIndex(c => c === item)
            if (index > -1) {
                this.checkedItems.splice(index, 1)
            }
        }
        this.$emit('currentCheckChange', checked, item)
        this.checkChange()
    }

    checkChange() {
        this.$emit('checkChange', this.checkedItems)
    }
}
</script>
