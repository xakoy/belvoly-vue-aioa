<template>
    <span v-if="isWord">W</span>
    <span v-else-if="isExcel" style="background: green;">X</span>
    <span v-else-if="isPowerPoint" style="background: orange;">P</span>
    <span v-else style="background: #ccc">O</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class UploadItem extends Vue {
    @Prop() name

    get extensionName() {
        const name = this.name
        if (!name) {
            return ''
        }
        return name.substring(name.lastIndexOf('.'))
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
}
</script>
