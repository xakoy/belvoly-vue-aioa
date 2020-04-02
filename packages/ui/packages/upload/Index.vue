<template>
    <div>
        <el-upload
            :action="uploadAction"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            multiple="multiple"
            :file-list="getFileList"
            :on-success="handleUploadSuccess"
            v-if="isEditFile"
        >
            <el-button size="mini" type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">({{ uploadTip }})</div>
        </el-upload>
        <!-- 查看附件 -->
        <el-upload class="upload-detail" :action="uploadAction" :on-preview="handlePreview" :file-list="getFileList" v-else></el-upload>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { MessageBox, Message } from 'element-ui'
import { services, globalConfig } from '@belvoly-vue-aioa/core'
const { attachmentService } = services

const config = {
    sharedservice: {
        assets: {
            baseURI: `${globalConfig.apiHost}/sharedservice/assets`
        }
    },
    api: {
        baseURI: globalConfig.apiHost
    },
    o365: {
        enabled: false,
        baseURI: '',
        blobURI: '',
        supportFileTypes: ''
    }
}

@Component
export default class Index extends Vue {
    @Prop({ default: `${config.api.baseURI}/sharedservice/blob/upload` }) action: string
    @Prop({ default: 50 }) maxSize: number
    @Prop({ default: true }) multiple: boolean
    @Prop({ default: [] }) fileList: Array<any>
    @Prop({ required: true }) refTableName: string
    @Prop({ required: true }) typeCode: string
    @Prop() userUid: string
    @Prop({ default: true }) isEditFile: boolean

    uploadFiles: any[] = []

    get uploadAction() {
        return `${this.action}?refTableName=${this.refTableName}&typeCode=${this.typeCode}&creatorID=${this.userUid}`
    }
    get getFileList() {
        const files = this.fileList.map((c: any) => {
            if (c.displayName) {
                c.name = c.displayName
            }
            return c
        })
        return files
    }
    get uploadTip() {
        return `最多允许上传${this.maxSize}MB的内容`
    }

    mounted() {
        this.watchFileList(this.fileList)
    }

    @Watch('fileList')
    watchFileList(newValue) {
        this.uploadFiles = [...newValue]
    }
    @Watch('uploadFiles')
    watchUploadFiles(newValue) {
        this.replaceFileIcons(newValue)
    }

    handlePreview(file) {
        if (file.id) {
            this.handlePreviewCore(file)
        } else {
            window.open(file.response.data.url)
        }
    }
    handlePreviewCore(file) {
        const preivewEnabled = config.o365.enabled

        if (preivewEnabled) {
            this.handleO365Preview(file)
        } else {
            window.open(file.url)
        }
    }
    handleO365Preview(file) {
        let url = file.url

        if (file.extension && this.checkO365PreviewSupproted(file.extension)) {
            url = `${config.o365.baseURI}${config.o365.blobURI}/${file.id}`
        }

        window.open(url)
    }
    checkO365PreviewSupproted(extension) {
        const supportFileTypes = config.o365.supportFileTypes

        return supportFileTypes.includes(extension)
    }
    async handleRemove(file) {
        const id = file.id || file.response.data.id

        const { success } = await attachmentService.remove(id)

        if (success) {
            Message({
                message: '删除附件成功',
                type: 'success'
            })

            const fileIndex = this.uploadFiles.findIndex(file => file.id === id)
            this.uploadFiles.splice(fileIndex, 1)
        }
    }
    beforeRemove(file) {
        return MessageBox.confirm(`确定移除 ${file.name}？`)
    }
    handleUploadSuccess(response, file, fileList) {
        const successFiles = fileList.find(file => file.status === 'success')
        this.uploadFiles.push(response.data)

        if (successFiles.length < fileList.length) {
            return
        }

        const uploadInfo = {
            ids: fileList.map(file => file.id || file.response.data.id),
            refTableId: '',
            refTableName: this.refTableName,
            file: file,
            fileList: fileList
        }

        this.$emit('on-success', uploadInfo)
        // this.$bus.emit('uploadInfo', uploadInfo)
    }
    beforeUpload(file) {
        const isLtSize = file.size / 1024 / 1024 < this.maxSize
        if (!isLtSize) {
            this.$message.error(`上传文件大小不能超过 ${this.maxSize}MB!`)
        }
        return isLtSize
    }
    replaceFileIcons(files) {
        this.$nextTick(() => {
            this.$el.querySelectorAll('.el-icon-document').forEach((el: HTMLElement, i) => {
                el.style.display = 'none'

                if (i >= files.length) {
                    return
                }

                this.showFileIcon(el, files[i])
            })
            // 查看模式下才显示
            if (!this.isEditFile) {
                this.$el.querySelectorAll('.el-upload-list__item-status-label').forEach((el: HTMLElement, i) => {
                    el.style.display = 'none'

                    if (i >= files.length) {
                        return
                    }
                    // 添加下载和预览按钮
                    this.addDownloadIcon(el, files[i])
                })
            }
        })
    }
    addDownloadIcon(el: HTMLElement, file) {
        let isView = false
        const url = file.url
        let urlv = ''
        if (file.extension && this.checkO365PreviewSupproted(file.extension)) {
            urlv = `${config.o365.baseURI}${config.o365.blobURI}/${file.id}`
            isView = true
        }

        if (isView) {
            const viewNode = document.createElement('span')
            viewNode.title = '查看'
            viewNode.addEventListener('click', function() {
                window.open(urlv)
            })
            viewNode.style.cursor = 'pointer'
            viewNode.style.position = 'absolute'
            viewNode.style.right = '18px'
            viewNode.style.top = '0'

            const iNode = document.createElement('i')
            iNode.className = 'fc fc-eyes-open'
            viewNode.prepend(iNode)

            el.parentNode.insertBefore(viewNode, el)

            el.style.right = '35px'
        } else {
            el.style.right = '19px'
        }

        const downloadElement = document.createElement('span')
        downloadElement.title = '下载'
        downloadElement.addEventListener('click', function() {
            window.open(url)
        })
        downloadElement.style.cursor = 'pointer'
        downloadElement.style.position = 'absolute'
        downloadElement.style.right = '1px'
        downloadElement.style.top = '0'

        const iNode = document.createElement('i')
        iNode.className = 'fc fc-down-o'
        downloadElement.prepend(iNode)
        el.parentNode.insertBefore(downloadElement, el)
    }
    showFileIcon(el: HTMLElement, file) {
        let extension = file.extension
        if (!extension) {
            const names = file.name.split('.')
            if (names.length > 1) {
                extension = '.' + names.pop()
            }
        }
        if (!extension) {
            return
        }
        const removedDotExtension = extension.substring(1)
        const assertBaseURI = `${config.sharedservice.assets.baseURI}/img/files`
        const iconUrl = `${assertBaseURI}/${removedDotExtension}.png`
        const errorUrl = `${assertBaseURI}/default.png`
        // el.previousSibling.parentElement.remove()

        const imgElement = document.createElement('img')
        imgElement.className = 'el-upload-file-icon'
        imgElement.src = iconUrl
        imgElement.alt = extension
        imgElement.addEventListener('error', function() {
            imgElement.src = errorUrl
        })

        el.parentNode.insertBefore(imgElement, el)
    }
    /**
     * 更新关联业务表记录ID
     */
    async updateRelevance(refTableID) {
        const blobRelevance = {
            ids: this.uploadFiles.map(file => file.id),
            refTableName: this.refTableName,
            refTableID: refTableID
        }
        const { success, data } = await attachmentService.updateRelevance(blobRelevance)
        if (success) {
            return data
        }
    }
}
</script>
<style lang="less">
.upload-detail {
    .el-upload--text {
        display: none !important;
    }
    .el-upload-list__item {
        &:hover {
            .el-icon-close,
            .el-icon-close-tip {
                display: none;
            }
        }
        .el-icon-close-tip {
            display: none !important;
        }

        .el-upload-list__item-name {
            .el-upload-file-icon {
                width: 16px;
                height: 16px;
                vertical-align: text-bottom;
                margin-right: 7px;
            }
        }
    }
}
</style>
