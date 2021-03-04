<template>
    <div class="tinymce-editor-preview">
        <i-frame :html="html" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import IFrame from './IFrame.vue'
import { getPreviewHtml } from './iframeContent'

@Component({
    components: {
        IFrame
    }
})
export default class Index extends Vue {
    @Prop({ type: String }) content: string

    html = ''

    @Watch('content')
    watchContent() {
        this.html = getPreviewHtml(this.content)
    }

    mounted() {
        this.watchContent()
    }
}
</script>

<style lang="less">
.tinymce-editor-preview {
    overflow: hidden;
}
</style>
