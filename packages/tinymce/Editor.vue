<template>
    <Editor ref="editor" v-model="editorHtml" :init="editorInit"></Editor>
</template>

<style>
body .tox-tinymce-aux {
    z-index: 10000;
}
</style>

<script>
import tinymce from 'tinymce/tinymce' // 配置富文本
import 'tinymce/icons/default'
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
import 'tinymce/plugins/preview'
import './plugins/indent2em'
import './plugins/lineheight'
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
            type: String,
            default: null
        },
        validateEvent: {
            type: Boolean,
            default: true
        }
    },
    components: {
        Editor: Editor
    },
    watch: {
        value: {
            handler: function(val) {
                this.setEditorHtml(val)
            },
            immediate: true,
            deep: true
        },
        editorHtml: {
            handler: function(val) {
                this.handleEditorHtml(val)
            },
            immediate: true,
            deep: true
        }
    },
    data: function() {
        return {
            editorInit: {
                selector: 'textarea',
                language_url: languageUrl,
                language: 'zh_CN',
                // skin_url: skin_url, //样式放入public在index.html里引用
                height: 300,
                plugins: 'link lists image code table wordcount fullscreen preview indent2em lineheight',
                menu: {},
                toolbar:
                    this.toolbar ||
                    'fontselect fontsizeselect lineheight | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent indent2em | removeformat | link unlink image | code fullscreen | newnote print preview',
                branding: false,
                convert_urls: false,
                images_upload_url: this.imageUploadUrl,
                font_formats:
                    "微软雅黑=微软雅黑,Microsoft YaHei;宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
                automatic_uploads: true,
                file_picker_types: 'image'
            },
            editorHtml: this.tinymceHtml,
            lasterFocusoutEvent: null,
            lasterFocusoutTime: null
        }
    },
    mounted: function() {
        tinymce.init({})
        try {
            const frameWindow = this.$refs.editor.editor.iframeElement.contentWindow
            if (frameWindow) {
                frameWindow.addEventListener('focusin', this.focusinHandler)
                frameWindow.addEventListener('focusout', this.focusoutHandler)
            }
        } catch {
            //
        }
    },
    beforeDestroy: function() {
        try {
            const frameWindow = this.$refs.editor.editor.iframeElement.contentWindow
            if (frameWindow) {
                frameWindow.removeEventListener('focusin', this.focusinHandler)
                frameWindow.removeEventListener('focusout', this.focusoutHandler)
            }
        } catch {
            //
        }
    },
    methods: {
        focusoutHandler(e) {
            this.lasterFocusoutEvent = e
            this.lasterFocusoutTime = new Date()
            const event = new CustomEvent('keyboardHide', {
                detail: {
                    target: e.target
                }
            })
            window.dispatchEvent(event)
        },
        focusinHandler(e) {
            if (this.lasterFocusoutEvent) {
                if (new Date() - this.lasterFocusoutTime < 200 && this.lasterFocusoutEvent.target === e.target) {
                    // 修复iOS 在中文输入法下输入 ‘uuuu’ 直接点击完成，会连续触发 focusout, focusin, 导致键盘被收回，但是判断为键盘弹起来了
                    e.target.blur()
                    return
                }
            }
            const event = new CustomEvent('keyboardShow', {
                detail: {
                    target: e.target
                }
            })
            window.dispatchEvent(event)
        },
        getCleanText: function() {
            const $editor = this.$refs.editor
            let text = this.editorHtml
            if ($editor) {
                text = $editor.editor.getContent({ format: 'text' })
            } else {
                text = this.cleanHtml(text)
            }
            return text
        },
        cleanHtml: function(data) {
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
        setEditorHtml: function(val) {
            this.editorHtml = val
        },
        handleEditorHtml: function(val) {
            const text = this.getCleanText()
            this.$emit('update:text', text)
            this.$emit('input', val)
            this.$emit('change', val)
            if (this.validateEvent) {
                this.dispatch('ElFormItem', 'el.form.change', [val])
            }
        },
        dispatch: function(componentName, eventName, params) {
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
