<template>
    <Editor ref="editor" v-model="editorHtml" :init="editorInit"></Editor>
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
        text: {},
        value: {},
        imageUploadUrl: {
            type: String
        },
        toolbar: {
            type: Object,
            default: null
        },
        validateEvent: {
            type: Boolean,
            default: true
        }
    },
    components: {
        Editor
    },
    watch: {
        value: {
            handler(val) {
                this.setEditorHtml(val)
            },
            immediate: true,
            deep: true
        },
        editorHtml: {
            handler(val) {
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
                images_upload_url: this.imageUploadUrl,
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
        getCleanText() {
            const $editor = this.$refs.editor
            let text = this.editorHtml
            if ($editor) {
                text = $editor.editor.getContent({ format: 'text' })
            } else {
                text = this.cleanHtml(text)
            }
            return text
        },
        cleanHtml(data) {
            let text = data
            if (text) {
                text = text.replace(/(\n)/g, '')
                text = text.replace(/(\t)/g, '')
                text = text.replace(/(\r)/g, '')
                text = text.replace(/<\/?[^>]*>/g, '')
                text = text.replace(/\s*/g, '')
                return text
            } else {
                return ''
            }
        },
        setEditorHtml(val) {
            this.editorHtml = val
        },
        handleEditorHtml(val) {
            const text = this.getCleanText()
            this.$emit('update:text', text)
            this.$emit('input', val)
            this.$emit('change', val)
            if (this.validateEvent) {
                this.dispatch('ElFormItem', 'el.form.change', [val])
            }
        },
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root
            let name = parent.$options.componentName

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent

                if (parent) {
                    name = parent.$options.componentName
                }
            }
            if (parent) {
                // eslint-disable-next-line prefer-spread
                parent.$emit.apply(parent, [eventName].concat(params))
            }
        }
    }
})
</script>
