<template>
    <div>
        <div v-if="loading" style="text-align:center">
            <bvan-loading>搜索中</bvan-loading>
        </div>
        <template v-else>
            <bvan-empty v-if="items.length === 0" description="没有搜索到结果" />
            <template v-else>
                <node-user
                    v-for="(child, index) in items"
                    :border="index < data.length - 1"
                    :style="{ 'padding-left': `${22}px` }"
                    :key="index"
                    :icon="getUserIcon(child)"
                    :label="child.label"
                    :cancheck="child.cancheck"
                    v-model="child.check"
                    @change="checkChange($event, child)"
                ></node-user>
            </template>
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
    components: {
        NodeUser
    }
})
export default class Search extends Vue {
    @Prop({}) data: Node[]
    @Prop({ type: Boolean, default: false }) isSingleMode: boolean
    @Prop({ type: Boolean, default: false }) loading: boolean
    items: Node[] = []

    mounted() {
        this.watchData()
    }

    @Watch('data')
    watchData() {
        this.items = !this.data
            ? []
            : this.data.map(c => {
                  const rc: Node = { id: c.id }
                  rc.label = c.name || c.label
                  rc.data = c
                  rc.check = c.check ? true : false
                  rc.cancheck = c.cancheck ? true : false
                  return rc
              })
    }

    getUserIcon(user) {
        return `${config.api.baseURI}/bua/avatar/getHeadPhoto?userUid=` + user.id
    }

    checkChange(checked, item: Node) {
        if (this.isSingleMode && checked) {
            this.items
                .filter(c => c.id !== item.id)
                .forEach(c => {
                    console.log(1)

                    c.check = false
                })
        }
        this.$emit('currentCheckChange', checked, item)
    }
}
</script>
