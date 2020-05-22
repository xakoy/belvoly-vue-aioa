<template>
    <div>
        <subscription-event ref="subscriptionEvent" :events="events" />
        <el-table :data="data">
            <el-table-column type="index" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="age" label="年龄" />
            <el-table-column prop="date" label="日期" />
        </el-table>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SubscriptionEvent } from '../../packages/ui/packages/load'

@Component({
    components: {
        SubscriptionEvent
    }
})
export default class SubscriptionEventExample extends Vue {
    data = []
    loading = false

    events = [
        {
            name: '列表加载完成事件',
            code: 'list-load',
            description: '列表加载完成后，出发的事件'
        }
    ]

    mounted() {
        this.getData()
    }

    getData() {
        setTimeout(() => {
            this.loading = true
            this.data = [
                {
                    name: '张三',
                    age: 19,
                    date: '2020-1-10'
                },
                {
                    name: '李四',
                    age: 22,
                    date: '2020-2-12'
                }
            ]
            this.loading = false

            this.$nextTick(() => {
                const subscriptionEvent = this.$refs.subscriptionEvent as SubscriptionEvent
                subscriptionEvent.trigger('list-load', { _vue: this, data: this.data })
            })
        }, 1000)
    }
}
</script>
