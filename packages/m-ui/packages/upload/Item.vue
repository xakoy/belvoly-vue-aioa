<template>
    <span :class="$style.box">
        <img :src="imgSrc" @error="imgErrorHandler" />
    </span>
</template>

<script lang="ts">
import { globalConfig } from '@belvoly-vue-aioa/m-core'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class UploadItem extends Vue {
    @Prop() name

    isLoadImageError = false
    get assertBaseURI() {
        return `${globalConfig.apiHost}/sharedservice/assets/img/files`
    }

    get imgSrc() {
        if (this.extensionName && !this.isLoadImageError) {
            const iconUrl = `${this.assertBaseURI}/${this.extensionName}.png`
            return iconUrl
        }
        return this.errorImgSrc
    }

    get errorImgSrc() {
        return `${this.assertBaseURI}/default.png`
    }

    get extensionName() {
        const name = this.name
        if (!name) {
            return ''
        }
        return name.substring(name.lastIndexOf('.') + 1)
    }

    get isWord() {
        return this.extensionName === '.doc' || this.extensionName === '.docx'
    }
    get isExcel() {
        return this.extensionName === '.xls' || this.extensionName === '.xlsx'
    }
    get isPowerPoint() {
        return this.extensionName === '.ppt' || this.extensionName === '.pptx'
    }

    imgErrorHandler() {
        this.isLoadImageError = true
    }
}
</script>

<style lang="less" module>
.box {
    img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
</style>
