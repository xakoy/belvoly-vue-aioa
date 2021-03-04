<template>
    <iframe :sandbox="sandbox" class="tinymce-editor-preview-iframe" @load="loadHandler" scrolling="no" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
const isIE = function() {
    const userAgent = window.navigator.userAgent
    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    return isIE || isIE11
}
@Component
export default class IFrame extends Vue {
    @Prop({ type: String }) html: string

    isSandbox = !isIE()
    sandbox = 'allow-same-origin'

    get element() {
        return this.$el as HTMLFrameElement
    }

    @Watch('html')
    watchHtml() {
        this.setValue(this.$el as HTMLFrameElement, this.html)
    }

    mounted() {
        this.watchHtml()
    }

    setValue(frame: HTMLFrameElement, html) {
        if (!this.isSandbox) {
            frame.setAttribute('src', `javascript:''`)
            // Attribute.set(frameComponent.element, 'src', `javascript:''`)
            // IE 6-11 doesn't support data uris on iframeComponents
            // and Edge only supports upto ~4000 chars in data uris
            // so I guess they will have to be less secure since we can't sandbox on those
            // TODO: Use sandbox if future versions of IE/Edge supports iframeComponents with data: uris.
            const doc = frame.contentWindow.document

            doc.open()
            doc.write(html)
            doc.close()
        } else {
            // TINY-3769: We need to use srcdoc here, instead of src with a data URI, otherwise browsers won't retain the Origin.
            // See https://bugs.chromium.org/p/chromium/issues/detail?id=58999#c11
            // Attribute.set(frameComponent.element, 'srcdoc', html)
            frame.setAttribute('srcdoc', html)
        }
    }

    loadHandler() {
        console.log('iframe loading')
        this.element.style.height = this.element.contentDocument.querySelector('html').offsetHeight + 'px'
    }
}
</script>

<style lang="less">
.tinymce-editor-preview-iframe {
    display: block;
    border: 0;
    width: 100%;
}
</style>
