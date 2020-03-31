<template>
    <Editor id="tinymce" v-model="editorHtml" :init="editorInit"></Editor>
</template>

<script>
import tinymce from 'tinymce/tinymce' // 配置富文本
import 'tinymce/themes/silver/theme' // 引入富文本的主要脚本
import Editor from '@tinymce/tinymce-vue' // 引用富文本组件
// import skin_url from "../../../public/static/tinymce/skins/ui/oxide/skin.min.css" // 富文本样式
import languageUrl from './zh_CN.js'

import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/fullscreen'
import 'tinymce/skins/ui/oxide/skin.min.css'

import Vue from 'vue'
export default Vue.extend({
    props: {
        tinymceHtml: {},
        toolbar: {
            type: Object,
            default: null
        },
        maxCount: {
            type: Number,
            default: 200000
        }
    },
    components: {
        Editor
    },
    watch: {
        tinymceHtml: {
            handler(val) {
                this.setEditorHtml(val)
            },
            immediate: true,
            deep: true
        },
        editorHtml: {
            handler(val) {
                if (this.cleanWordString(val) > this.maxCount) {
                    val = String(val).slice(0, this.maxCount)
                    // this.$message.error(`当前编辑超过${this.maxCount}字数`)
                }

                this.handleEditorHtml(val)
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            editorInit: {
                selector: 'textarea',
                language_url: languageUrl,
                language: 'zh_CN',
                // skin_url: skin_url, //样式放入public在index.html里引用
                height: 300,
                plugins: 'link lists image code table wordcount fullscreen',
                toolbar:
                    this.toolbar ||
                    'fullscreen | newnote print preview | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | removeformat | link unlink image code',
                branding: false,
                convert_urls: false,
                // images_upload_url:
                //     this.$config.get("sharedservice.baseURI") +
                //     "/tinymce/upload?" +
                //     URLUtils.serialize({
                //         refTableName: "TINYMCE_IMAGE_UPLOAD",
                //         creatorID: this.$store.state.identity.uid
                //     }),
                automatic_uploads: true,
                file_picker_types: 'image'
            },
            editorHtml: this.tinymceHtml
        }
    },
    mounted() {
        tinymce.init({})
    },
    methods: {
        cleanWordString(data) {
            if (data) {
                data = data.replace(/(\n)/g, '')
                data = data.replace(/(\t)/g, '')
                data = data.replace(/(\r)/g, '')
                data = data.replace(/<\/?[^>]*>/g, '')
                data = data.replace(/\s*/g, '')
                return data.length
            } else {
                return 0
            }
        },
        setEditorHtml(val) {
            this.editorHtml = val
        },
        handleEditorHtml(val) {
            this.$emit('handleEditorHtml', val)
        }
    }
})
</script>
