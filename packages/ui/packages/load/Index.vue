<template>
    <div>
        <el-button native-type="button" @click="clickHandler">设置</el-button>
        <el-dialog :visible="visible" width="600" title="设置JS">
            <el-form :model="item" :rules="rules" ref="form">
                <el-form-item label="JS URL" prop="url">
                    <el-input v-model="item.url" />
                </el-form-item>
                <el-form-item label="JS 方法" prop="method">
                    <el-input v-model="item.method" />
                </el-form-item>
                <el-form-item label="订阅事件" prop="eventName">
                    <el-select v-model="eventName" placeholder="请选择">
                        <el-option v-for="(e, index) in events" :key="index" :label="e.name" :value="e.code"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelHandler">取 消</el-button>
                <el-button type="primary" :loading="saving" @click="saveHandler">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { SubscriptionEventItem, SubscriptionEvent } from './interface'

@Component
export default class Index extends Vue implements SubscriptionEvent {
    @Prop() events: SubscriptionEventItem[]

    visible = false
    saving = false

    item = {
        url: '',
        method: '',
        eventName: ''
    }

    rules = {
        url: { required: true, message: '请填写' }
    }

    clickHandler() {
        this.visible = true
    }

    cancelHandler() {
        this.visible = false
    }

    saveHandler() {
        const form = this.$refs.form as ElForm
        form.validate(isValid => {
            if (!isValid) {
                return
            }

            this.save()
        })
    }

    save() {}

    trigger(eventName: string, data: any) {
        console.log('trigger:', eventName, data)
    }
}
</script>
