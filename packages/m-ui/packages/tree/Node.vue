<template>
    <div v-if="item" class="bvant-mui-tree-node">
        <div class="bvant-mui-tree-node__item" :style="{ 'padding-left': `${zindex}px` }">
            <div v-if="isParent" class="bvant-mui-tree-node__item--expand-icon" @click="expandClickHandler">
                <bvan-icon v-if="isExpand" name="arrow-down" />
                <bvan-icon v-else name="arrow" />
            </div>
            <div class="bvant-mui-tree-node__item--label">{{ item.label }}</div>
            <div v-if="item.cancheck" class="bvant-mui-tree-node__item--checkbox">
                <bvan-checkbox v-model="item.check" shape="square" @change="checkChange($event, item)" />
            </div>
        </div>
        <template v-for="(child, index) in children">
            <b-vant-mui-tree-node v-show="isExpand" :key="index" :lazy="lazy" :data="child" :zindex="zindex + 22" :load-node="loadNode" @checkChange="childCheckChangeHandler" />
        </template>
    </div>
</template>

<script lang="ts">
import { globalConfig } from '@belvoly-vue-aioa/m-core'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
// import NodeUser from './NodeUser.vue'
import { Node } from './interface'
const config = {
    api: {
        baseURI: globalConfig.apiHost
    }
}

@Component({
    name: 'BVantMuiTreeNode',
    components: {
        // NodeUser
    }
})
export default class TreeNode extends Vue {
    @Prop() data: Node
    @Prop({ default: false }) lazy: boolean

    @Prop() zindex: number
    @Prop() loadNode: Function

    @Prop({ default: false, type: Boolean }) expand: boolean

    isExpand = false
    // item: Node = null
    children: Node[] = []

    mounted() {
        this.watchExpand()
        this.watchDataChange()
    }

    @Watch('expand')
    watchExpand() {
        this.isExpand = this.expand
    }

    @Watch('data', { deep: true })
    watchDataChange() {
        this.children = this.item.children || []
    }

    get item() {
        return this.data
    }

    getUserIcon(user) {
        return `${config.api.baseURI}/bua/avatar/getHeadPhoto?userUid=` + user.id
    }

    get isParent() {
        const node = this.data
        if (this.lazy) {
            if (node.isLeaf) {
                return false
            } else {
                return true
            }
        }
        {
            return !!node.children
        }
    }

    expandClickHandler() {
        this.isExpand = !this.isExpand
        if (!this.data.isLeaf && !this.data.loaded) {
            this.loadNode(this.data)
        }
    }

    childCheckChangeHandler(checked, item: Node) {
        this.$emit('checkChange', checked, item)
    }

    checkChange(checked, item: Node) {
        this.$emit('checkChange', checked, item)
    }
}
</script>

<style lang="less">
.bvant-mui-tree-node {
    &__item {
        position: relative;
        display: flex;
        padding: 16px 0;
        line-height: 1;
        &--warp {
        }

        &--expand-icon {
            width: 14px;
            text-align: center;
            color: #cccccc;
            cursor: pointer;
        }

        &--avatar {
            > span,
            > img {
                display: inline-block;
                width: 30px;
                height: 30px;
                border-radius: 30px;
                background: #3492e9;
                color: #ffffff;
                text-align: center;
                line-height: 30px;
            }
        }

        &--checkbox {
            width: 32px;
            text-align: center;
        }

        &--label {
            flex: 1;
            font-size: 16px;
            padding-left: 8px;
        }

        &-nochild {
            background: #f9f9f9;
        }
        &-nochild &--label,
        &-nochild &--checkbox {
            padding-top: 6px;
        }
    }
}
</style>
