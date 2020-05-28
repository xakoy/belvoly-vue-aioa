<template>
    <div v-if="item" class="bvant-choose-people-or-org__node">
        <div class="bvant-choose-people-or-org__item" :style="{ 'padding-left': `${zindex}px` }">
            <div class="bvant-choose-people-or-org__item--expand-icon" @click="expandClickHandler">
                <bvan-icon v-if="isExpand" name="arrow-down" />
                <bvan-icon v-else v-model="item.check" name="arrow" />
            </div>
            <div class="bvant-choose-people-or-org__item--label">{{ item.label }}</div>
            <div v-if="item.cancheck" class="bvant-choose-people-or-org__item--checkbox">
                <bvan-checkbox v-model="item.check" shape="square" @change="checkChange($event, item)" />
            </div>
        </div>
        <template v-for="(child, index) in children">
            <b-vant-mui-tree-node
                v-show="isExpand"
                v-if="isParentNode(child)"
                :key="index"
                :lazy="lazy"
                :data="child"
                :zindex="zindex + 22"
                :load-node="loadNode"
                @checkChange="childCheckChangeHandler"
            />
            <div v-show="isExpand" v-else :key="index" class="bvant-choose-people-or-org__item--warp bvant-choose-people-or-org__item-nochild " :style="{ 'padding-left': `${zindex + 22}px` }">
                <div class="bvant-choose-people-or-org__item" :class="{ 'van-hairline--bottom': index < children.length - 1 }">
                    <div class="bvant-choose-people-or-org__item--avatar">
                        <!-- <span>罗</span> -->
                        <img :src="getUserIcon(child)" />
                    </div>
                    <div class="bvant-choose-people-or-org__item--label">{{ child.label }}</div>
                    <div v-if="child.cancheck" class="bvant-choose-people-or-org__item--checkbox">
                        <bvan-checkbox v-model="child.check" shape="square" @change="checkChange($event, child)" />
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { globalConfig } from '@belvoly-vue-aioa/m-core'

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Node } from './interface'
const config = {
    api: {
        baseURI: globalConfig.apiHost
    }
}

@Component({
    name: 'BVantMuiTreeNode'
})
export default class TreeNode extends Vue {
    @Prop() data: Node
    @Prop({ default: false }) lazy: boolean

    @Prop() zindex: number
    @Prop() loadNode: Function

    isExpand = false
    // item: Node = null
    children: Node[] = []

    mounted() {
        //
        this.watchDataChange()
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

    isParentNode(node: Node) {
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
