<template>
    <div v-if="item" class="bvant-choose-people-or-org__node">
        <div class="bvant-choose-people-or-org__item" :style="{ 'padding-left': `${zindex}px` }">
            <div v-if="item.cancheck" class="bvant-choose-people-or-org__item--expand-icon" @click="expandClickHandler">
                <bvan-icon v-if="isExpand" name="arrow-down" />
                <bvan-icon v-else v-model="item.check" name="arrow" />
            </div>
            <div class="bvant-choose-people-or-org__item--label" @click="itemLabelClickHandler">{{ item.label }}</div>
            <div v-if="item.cancheck" class="bvant-choose-people-or-org__item--checkbox">
                <bvan-checkbox v-model="item.check" shape="square" @change="checkChange($event, item)" />
            </div>
            <div v-else class="bvant-choose-people-or-org__item--expand-righticon" @click="expandClickHandler">
                <bvan-icon v-if="isExpand" name="arrow-down" />
                <bvan-icon v-else v-model="item.check" name="arrow" />
            </div>
        </div>
        <template v-for="(child, index) in children">
            <b-vant-mui-choose-tree-node
                v-show="isExpand"
                v-if="isParentNode(child)"
                :key="index"
                :lazy="lazy"
                :data="child"
                :zindex="zindex + 22"
                :load-node="loadNode"
                @checkChange="childCheckChangeHandler"
            />
            <node-user
                :border="index < children.length - 1"
                :style="{ 'padding-left': `${zindex + 22}px` }"
                v-show="isExpand"
                v-else
                :key="index"
                :icon="getUserIcon(child)"
                :label="child.label"
                :cancheck="child.cancheck"
                v-model="child.check"
                @change="checkChange($event, child)"
            ></node-user>
            <!-- <div class="bvant-choose-people-or-org__item--warp bvant-choose-people-or-org__item-nochild " >
                <div class="bvant-choose-people-or-org__item" :class="{ 'van-hairline--bottom':  }">
                    <div class="bvant-choose-people-or-org__item--avatar">
                        <img :src="getUserIcon(child)" />
                    </div>
                    <div class="bvant-choose-people-or-org__item--label">{{ child.label }}</div>
                    <div v-if="child.cancheck" class="bvant-choose-people-or-org__item--checkbox">
                        <bvan-checkbox v-model="child.check" shape="square"  />
                    </div>
                </div>
            </div> -->
        </template>
    </div>
</template>

<script lang="ts">
import { globalConfig } from '@belvoly-vue-aioa/m-core'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import NodeUser from './NodeUser.vue'
import { Node } from './interface'
const config = {
    api: {
        baseURI: globalConfig.apiHost
    }
}

@Component({
    name: 'BVantMuiChooseTreeNode',
    components: {
        NodeUser
    }
})
export default class TreeNode extends Vue {
    @Prop() data: Node
    @Prop({ default: false }) lazy: boolean

    @Prop() zindex: number
    @Prop() loadNode: Function

    @Prop({ default: false, type: Boolean }) expand: boolean

    isExpand = true
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

    itemLabelClickHandler() {
        if (this.item.cancheck) {
            this.item.check = !this.item.check
        } else {
            this.expandClickHandler()
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
