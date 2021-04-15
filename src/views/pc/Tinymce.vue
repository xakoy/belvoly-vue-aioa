<template>
    <div>
        <el-dialog v-if="dialogVisible" :visible="true" title="标题" :append-to-body="true">
            <el-form :model="item" :rules="rules" ref="form">
                <el-form-item label="文本：" prop="html">
                    <tinymce-editor ref="textEditor" v-model="item.html" :text.sync="text" :imageUploadUrl="tinymceImageUploadUrl" />
                </el-form-item>
                <el-form-item label="文本2：" prop="html">
                    <tinymce-editor ref="textEditor2" v-model="item.html2" :imageUploadUrl="tinymceImageUploadUrl" />
                </el-form-item>

                <el-button @click="saveHandler">
                    保存
                </el-button>
            </el-form>
        </el-dialog>
        <el-button @click="dialogShowClickHandler">
            在dialog测试
        </el-button>

        <el-dialog v-if="previewDialogVisible" width="900px" :visible="true" title="预览" :append-to-body="true" @close="prewDialogCloseHandler">
            <tinymce-editor-preview :content="item.html" />
        </el-dialog>

        <el-button @click="previewClickHandler">
            预览内容
        </el-button>

        <el-form :model="item" :rules="rules" ref="form">
            <el-form-item label="文本：" prop="html">
                <tinymce-editor :height="600" readonly ref="textEditor" v-model="item.html" :text.sync="text" :imageUploadUrl="tinymceImageUploadUrl" />
            </el-form-item>
            <el-form-item label="文本2：" prop="html">
                <tinymce-editor ref="textEditor2" :toolbar="'codesample'" :menubar="false" v-model="item.html2" :imageUploadUrl="tinymceImageUploadUrl" />
            </el-form-item>

            <el-button @click="saveHandler">
                保存
            </el-button>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
// import { TinymceEditor, TinymceEditorPreview } from '../../../packages/tinymce'
import TinymceEditor from '../../../packages/tinymce/Editor.vue'
import TinymceEditorPreview from '../../../packages/tinymce/preivew/Index.vue'
import { ElForm } from 'element-ui/types/form'
import { Message } from 'element-ui'

@Component({
    components: {
        TinymceEditor,
        TinymceEditorPreview
    }
})
export default class HelloWorld extends Vue {
    @Prop() private msg!: string

    validateMaxText(rule: any, value: any, callback: any) {
        if (this.text && this.text.length > 30) {
            callback(new Error(rule.message))
        } else {
            callback()
        }
    }
    rules = {
        html: [
            { required: true, message: '请填写' },
            { validator: this.validateMaxText, message: '不能大于30字' }
        ]
    }
    item = {
        html: '<p>测试</p>',
        html2: 'ddd'
    }

    // 本地图片上传地址
    tinymceImageUploadUrl = `http://192.168.101.135:2001/api/sharedservice/tinymce/upload?refTableName=XXXXX&creatorID=XXXXX`

    text = ''

    async saveHandler() {
        const isValid = await (this.$refs.form as ElForm).validate()
        if (!isValid) {
            return
        }

        Message.success({
            message: `值为：${this.item.html}, 纯文本为：${this.text}`
        })
    }

    dialogVisible = false
    dialogShowClickHandler() {
        this.dialogVisible = true
    }

    previewDialogVisible = false
    previewClickHandler() {
        this.previewDialogVisible = true
    }

    prewDialogCloseHandler() {
        this.previewDialogVisible = false
    }
}
</script>
