<template>
    <div v-if="item" class="bvant-opicker__node">
        <div class="bvant-opicker__item" :style="{ 'padding-left': `${zindex}px` }">
            <div class="bvant-opicker__item--expand-icon" @click="expandClickHandler">
                <bvan-icon v-if="isExpand" name="arrow-down" />
                <bvan-icon v-else v-model="item.check" name="arrow" />
            </div>
            <div class="bvant-opicker__item--label">{{ item.label }}</div>
            <div v-if="item.cancheck" class="bvant-opicker__item--checkbox">
                <bvan-checkbox v-model="item.check" shape="square" @change="checkChange($event, item)" />
            </div>
        </div>
        <template v-for="(child, index) in children">
            <node v-show="isExpand" v-if="isParentNode(child)" :key="index" :lazy="lazy" :data="child" :zindex="zindex + 22" :load-node="loadNode" @checkChange="childCheckChangeHandler" />
            <div v-show="isExpand" v-else :key="index" class="bvant-opicker__item--warp bvant-opicker__item-nochild " :style="{ 'padding-left': `${zindex + 22}px` }">
                <div class="bvant-opicker__item" :class="{ 'van-hairline--bottom': index < children.length - 1 }">
                    <div class="bvant-opicker__item--avatar">
                        <span>罗</span>
                    </div>
                    <div class="bvant-opicker__item--label">{{ child.label }}</div>
                    <div v-if="child.cancheck" class="bvant-opicker__item--checkbox">
                        <bvan-checkbox v-model="child.check" shape="square" @change="checkChange($event, child)" />
                    </div>
                </div>
            </div>
        </template>
        <!-- <node /> -->
        <!-- <div class="bvant-opicker__node">
            <div class="bvant-opicker__item" style="padding-left: 32px;">
                <div class="bvant-opicker__item--expand-icon">
                    <bvan-icon name="arrow" />
                </div>
                <div class="bvant-opicker__item--label">互软集团</div>
                <div class="bvant-opicker__item--checkbox">
                    <bvan-checkbox shape="square" />
                </div>
            </div>
            <div class="bvant-opicker__item--warp bvant-opicker__item-nochild " style="padding-left: 32px;">
                <div class="bvant-opicker__item van-hairline--bottom">
                    <div class="bvant-opicker__item--avatar">
                        <span>罗</span>
                    </div>
                    <div class="bvant-opicker__item--label">罗龙</div>
                    <div class="bvant-opicker__item--checkbox">
                        <bvan-checkbox shape="square" />
                    </div>
                </div>
            </div>
            <div class="bvant-opicker__item--warp  bvant-opicker__item-nochild" style="padding-left: 32px;">
                <div class="bvant-opicker__item">
                    <div class="bvant-opicker__item--avatar">
                        <span>罗</span>
                    </div>
                    <div class="bvant-opicker__item--label">罗龙</div>
                    <div class="bvant-opicker__item--checkbox">
                        <bvan-checkbox shape="square" />
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Node } from './interface'

@Component({
    components: {
        Node: () => import('./Node.vue')
    }
})
export default class Index extends Vue {
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
