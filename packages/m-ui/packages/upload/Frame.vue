<template>
    <bvan-popup safe-area-inset-bottom get-container="body" :class="$style.popup" :value="show" position="right" :duration="0" :overlay-class="$style.overlay">
        <bvan-nav-bar title="预览" :class="$style.navBar" />
        <section :class="$style.main">
            <p v-show="empty" :class="$style.empty">{{ empty }}</p>
            <div ref="iframe" :class="$style.iframeContainer"></div>
            <!-- <iframe  :src="onLineUrl" frameborder="0" :class="$style.iframe" allowfullscreen @load="iframeLoad"></iframe> -->
        </section>
        <div :class="$style.popupButtons">
            <bvan-button square @click="onCancel">关闭</bvan-button>
        </div>
    </bvan-popup>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({
    components: {}
})
export default class AnnexView extends Vue {
    @Prop({ default: false }) show: boolean
    @Prop({ default: '' }) onLineUrl: string
    empty = '附件正在打开...'

    onCancel() {
        // 修复出现iframe后，导致政务微信的接口失效，主动改变url地址，hack下政务微信的接口响应。
        // window.location.hash = new Date().getTime().toString()
        const aurl = new URL(window.location.href)
        aurl.hash = new Date().getTime().toString()
        window.location.replace(aurl.toString())
        this.$emit('update:show', false)
    }

    @Watch('show')
    watchShow() {
        this.loadFrame()
    }

    mounted() {
        this.loadFrame()
    }

    loadFrame() {
        debugger
        if (!this.show) {
            return
        }
        this.$nextTick(() => {
            const $iframe: HTMLElement = this.$refs.iframe as any
            $iframe.innerHTML = `<iframe src="${this.onLineUrl}" frameborder="0" class="${(this as any).$style.iframe}" allowfullscreen></iframe>`
            $iframe.querySelector('iframe').onload = this.iframeLoad
        })
    }

    iframeLoad() {
        this.empty = ''
    }
}
</script>
<style lang="less" module>
.popup {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
}

.main {
    flex: 1;
    overflow-y: auto;
}
.popupButtons {
    display: flex;
    & > button {
        flex: 1;
    }
}

.overlay {
    top: 1px;
}
.cellGroup::after {
    border-width: 0;
    content: none;
}
.navBar::after {
    border-bottom-width: 0;
}

.iframeContainer {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.iframe {
    display: block;
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.empty {
    margin-top: 10px;
    color: #969799;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
}
</style>
