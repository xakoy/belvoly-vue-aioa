<template>
    <div class="bv-upload" :class="{ ['bv-upload__readonly']: !isEditFile }" v-if="!simple">
        <el-upload
            :action="uploadAction"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUploadHandler"
            :accept="accept"
            :limit="limit"
            :multiple="multiple"
            :file-list="getElementFiles"
            :on-change="handleUploadChange"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :on-progress="handleUploadProgress"
            :on-exceed="handleExceed"
            v-if="isEditFile"
            :show-file-list="false"
        >
            <el-button size="mini" type="primary" :disabled="isDisabled">上传附件</el-button>
            <div slot="tip" class="bv-upload__tip el-upload__tip">({{ uploadTip }})</div>
        </el-upload>
        <div class="bv-upload__detail">
            <div class="bv-upload-list__item" v-for="(item, index) in files" :key="index">
                <span class="bv-upload-list__item-icon"><img class="el-upload-file-icon" :src="getFileIcon(item)" @error="iconErrorHandler(item, $event)" alt=".pdf"/></span>
                <span class="bv-upload-list__item-title">
                    <a href="" @click="titleClickHandler(item, $event)" :title="item.file.displayName || item.file.name">{{ item.file.displayName || item.file.name }}</a>
                </span>
                <span v-if="item.status === 'uploading'" class="bv-upload-list__item-loading"><i class="el-icon-loading"></i> 上传中...</span>
                <span v-else-if="item.status === 'failed'" class="bv-upload-list__item-errortip">上传失败</span>
                <template v-else>
                    <span class="bv-upload-list__item-view" title="查看" @click="viewClickHandler(item)"><i class="fc fc-eyes-open"></i> 查看</span>
                    <span class="bv-upload-list__item-download" title="下载" @click="downloadClickHandler(item)"><i class="fc fc-cloud-download"></i> 下载</span>
                </template>
                <span v-if="isEditFile && item.status !== 'uploading'" class="bv-upload-list__item-delete" @click="removeClickHandler(item)" title="删除"><i class="fc fc-delete"></i> 删除</span>
            </div>
        </div>
    </div>
    <div class="bv-upload bv-upload__simple" v-else>
        <el-upload
            :action="uploadAction"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUploadHandler"
            :accept="accept"
            :limit="limit"
            :show-file-list="false"
            :multiple="multiple"
            :file-list="getFileList"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :on-progress="handleUploadProgress"
            :on-exceed="handleExceed"
            v-if="isEditFile"
        >
            <slot name="simple" />
        </el-upload>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { MessageBox, Message } from 'element-ui'
import { services, globalConfig } from '@belvoly-vue-aioa/core'
const { attachmentService } = services

interface OnRemove {
    (id: string): Promise<void>
}
interface BeforeUpload {
    (file: any): Promise<boolean>
}

interface HtmlFile {
    id?: string
    name: string
    size: number
    response?: {
        data: UploadFile
    }
}

interface UploadFile {
    name?: string
    id?: string
    url?: string
    displayName?: string
    extension?: string
}

type UploadFileStatus = 'success' | 'failed' | 'uploading'

interface ExisitFile {
    status: UploadFileStatus
    file: HtmlFile & UploadFile
    uid?: string
}

@Component
export default class Index extends Vue {
    @Prop() action: string
    @Prop({ default: 50 }) maxSize: number
    @Prop({ default: true }) multiple: boolean
    @Prop({
        default: function() {
            return []
        }
    })
    fileList: Array<any>
    @Prop({}) refTableName: string
    @Prop({}) typeCode: string
    @Prop() userUid: string
    @Prop({ default: true }) isEditFile: boolean
    @Prop({ default: 9999 }) limit: number
    /**
     * 是否只允许图面
     */
    @Prop({ default: false }) isOnlyImage: boolean

    @Prop({ default: false, type: Boolean }) simple: boolean
    /**
     * 文字提示
     */
    @Prop() tip: string
    /**
     * 上传前验证
     */
    @Prop() beforeUpload: BeforeUpload
    /**
     * 删除，当没有定义删除属性时，则启用默认删除事件
     */
    @Prop() onRemove: OnRemove
    /**
     * 是否开启下载日志功能
     */
    @Prop({ default: true, type: Boolean }) enableDownloadLog: boolean

    uploadFiles: UploadFile[] = []

    files: ExisitFile[] = []

    elementFiles: Array<any> = []

    get config() {
        return {
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
                supportFileExtensions: [],
                ...globalConfig.o365
            }
        }
    }

    get uploadAction() {
        let param = ''
        if (this.refTableName) {
            param += `&refTableName=${this.refTableName}`
        }
        if (this.typeCode) {
            param += `&typeCode=${this.typeCode}`
        }
        if (this.userUid) {
            param += `&creatorID=${this.userUid}`
        }
        return `${this.actionUrl}${this.actionUrl.indexOf('?') === -1 ? '?' : ''}${param}`
    }

    get actionUrl() {
        return this.action || `${this.config.api.baseURI}/sharedservice/blob/upload`
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

    get getNewFileList() {
        const files = this.fileList.map(c => {
            if (c.displayName) {
                c.name = c.displayName
            }

            return <ExisitFile>{
                status: 'success',
                file: c
            }
        })
        return files
    }

    get getElementFiles() {
        return this.files.map(c => c.file)
    }

    get accept() {
        if (this.isOnlyImage) {
            return '.jpg,.jpeg,.png,.bmp'
        }
        return ''
    }
    get uploadTip() {
        return this.tip || this.isOnlyImage ? `最多允许上传${this.maxSize}MB的内容，格式仅支持${this.accept}` : `最多允许上传${this.maxSize}MB的内容`
    }

    get isDisabled() {
        return this.uploadFiles.length >= this.limit
    }

    mounted() {
        this.watchFileList()
    }

    @Watch('fileList')
    watchFileList() {
        this.files = this.getNewFileList
        this.uploadFiles = this.fileList.map(f => f)
    }

    handlePreview(file) {
        if (file.id) {
            this.handlePreviewCore(file)
        } else {
            this.download(file.response.data.url, file)
        }
    }
    handlePreviewCore(file) {
        const preivewEnabled = this.config.o365.enabled

        if (preivewEnabled) {
            this.handleO365Preview(file)
        } else {
            this.download(file.url, file)
        }
    }
    handleO365Preview(file) {
        let url = file.url
        const isSupportPreview = file.extension && this.checkO365PreviewSupproted(file.extension)

        if (isSupportPreview) {
            url = `${this.config.o365.baseURI}${this.config.o365.blobURI}/${file.id}`
            window.open(url)
            return
        }

        window.open(url)
    }

    checkO365PreviewSupproted(extension: string) {
        const ext = extension.toLowerCase()
        const supportFileExtensions = this.config.o365.supportFileExtensions

        return supportFileExtensions.includes(ext)
    }

    async handleExceed(files, fileList) {
        Message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }

    async handleRemove(file) {
        if (!(file.id || file.response)) {
            return true
        }
        const id = file.id || file.response.data.id

        const removeSuccessHandle = () => {
            const fileIndex = this.uploadFiles.findIndex(file => file.id === id)
            if (fileIndex > -1) {
                this.uploadFiles.splice(fileIndex, 1)
            }
            const index = this.files.findIndex(f => f.file.id === id)
            if (index > -1) {
                this.files.splice(index, 1)
            }
        }

        if (this.onRemove) {
            try {
                await this.onRemove(id)
                removeSuccessHandle()
            } catch {
                //
            }
        } else {
            const { success } = await attachmentService.remove(id)

            if (success) {
                Message({
                    message: '删除附件成功',
                    type: 'success'
                })
                removeSuccessHandle()
            }
        }
        this.change()
    }
    async beforeRemove(file) {
        if (file.status === 'ready') {
            const uid = file.uid
            const rawFile = this.files.find(f => f.uid === uid)
            if (rawFile) {
                rawFile.status = 'failed'
                this.files.splice(
                    this.files.findIndex(f => f.uid === uid),
                    1
                )
            }
            return true
        }
        return await MessageBox.confirm(`确定移除 ${file.name}？`)
    }

    handleUploadChange(file, fileList) {
        const uid = file.uid
        let status: UploadFileStatus = 'uploading'
        if (file.status === 'success') {
            status = 'success'
        } else if (file.status === 'fail') {
            status = 'failed'
        }
        const rawFile = this.files.find(f => f.uid === uid)
        if (rawFile) {
            rawFile.status = status
            rawFile.file = file
            if (status === 'success') {
                rawFile.file = file.response.data
            }
        } else {
            this.files.push({
                file: file,
                status: status,
                uid: uid
            })
        }
    }

    handleUploadSuccess(response, file, fileList) {
        const responseData: UploadFile = response.data

        const successFiles = fileList.find(file => file.status === 'success')

        if (responseData) {
            this.uploadFiles.push(responseData)
        }

        if (successFiles.length < fileList.length) {
            return
        }

        const fs = this.uploadFiles.map(f => ({ ...f }))

        const uploadInfo = {
            ids: fs.map(file => file.id),
            refTableId: '',
            refTableName: this.refTableName,
            file: file,
            fileList: fs
        }

        this.$emit('on-success', uploadInfo)
        this.$emit('success', uploadInfo, responseData)
        this.change()
    }

    handleUploadError(err, file) {
        const uid = file.uid
        const rawFile = this.files.find(f => f.uid === uid)
        if (rawFile) {
            rawFile.status = 'failed'
        }
        this.$emit('error', err, file)
    }

    handleUploadProgress(event, file) {
        this.$emit('uploading', event, file)
    }

    change() {
        const files = this.uploadFiles.map(f => {
            return {
                id: f.id,
                data: f
            }
        })
        this.$emit('change', files)
    }

    async beforeUploadHandler(file) {
        const before = this.beforeUpload || (this.isOnlyImage && this.beforeUploadImage)
        if (before) {
            try {
                await before(file)
            } catch (e) {
                this.$message.error(e.message)
                throw new Error(e.message)
            }
        }
        const isLtSize = file.size / 1024 / 1024 < this.maxSize
        if (!isLtSize) {
            const message = `上传文件大小不能超过 ${this.maxSize}MB!`
            this.$message.error(message)
            throw new Error(message)
        }
    }

    async beforeUploadImage(file) {
        const allowTypes = ['image/bmp', 'image/jpeg', 'image/png']

        if (allowTypes.some(c => c === file.type)) {
            return true
        }

        throw new Error(`图片格式不正确`)
    }

    getFileIcon(item: ExisitFile) {
        const file = item.file
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
        const assertBaseURI = `${this.config.sharedservice.assets.baseURI}/img/files`
        const iconUrl = `${assertBaseURI}/${removedDotExtension}.png`

        return iconUrl
    }

    iconErrorHandler(item: ExisitFile, e: Event) {
        const assertBaseURI = `${this.config.sharedservice.assets.baseURI}/img/files`
        const errorUrl = `${assertBaseURI}/default.png`
        ;(e.target as HTMLImageElement).src = errorUrl
    }

    titleClickHandler(item: ExisitFile, e: Event) {
        if (item.status === 'success') {
            this.handlePreview(item.file)
        }
        e.preventDefault()
    }

    viewClickHandler(item: ExisitFile) {
        this.handlePreview(item.file)
    }

    downloadClickHandler(item: ExisitFile) {
        this.download(item.file.url, item.file)
    }

    async removeClickHandler(item: ExisitFile) {
        if (item.status === 'failed') {
            this.files.splice(
                this.files.findIndex(f => f.uid === item.uid),
                1
            )
            return
        }
        this.beforeRemove(item.file).then(
            () => {
                this.handleRemove(item.file)
            },
            () => {}
        )
    }

    download(url: string, file) {
        this.$emit('download', file)
        let downloadUrl = url
        if (this.enableDownloadLog) {
            downloadUrl = downloadUrl + (downloadUrl.indexOf('?') === -1 ? '?' : '&') + 'token=' + globalConfig.token
        }
        window.open(downloadUrl)
    }

    /**
     * 更新关联业务表记录ID
     */
    updateRelevance(refTableID) {
        const blobRelevance = {
            ids: this.uploadFiles.map(file => file.id),
            refTableName: this.refTableName,
            refTableID: refTableID
        }
        return attachmentService.updateRelevance(blobRelevance)
    }
}
</script>
<style lang="less">
.bv-upload {
    &__tip {
        margin-left: 10px;
        display: inline-block;
    }

    &__simple {
        display: inline-block;
    }
    .el-upload-list__item {
        transition: none;
        .el-upload-list__item-name {
            display: inline-block;
            vertical-align: middle;
            color: #333;
            margin-right: 20px;

            width: auto;

            .el-upload-file-icon {
                width: 26px;
                height: 26px;
                vertical-align: middle;
                margin-right: 7px;
            }
        }
        .el-upload-list__item-status-label {
            display: inline-block;
        }
        .bv-upload-list__item-download,
        .bv-upload-list__item-view,
        .el-upload-list__item-status-label,
        .el-icon-close {
            position: static;
            vertical-align: middle;
            margin-right: 7px;
            color: #999;
        }

        &:hover {
            background-color: transparent;
            .el-icon-close {
                display: inline-block;
            }
        }
    }
}
.bv-upload__readonly .bv-upload__detail {
    clear: none;
}
.bv-upload__detail {
    clear: both;
    .el-upload--text {
        display: none !important;
    }
    .el-upload-list__item {
        transition: none;
        line-height: 26px;
        &:hover {
            background-color: transparent;
            .el-icon-close,
            .el-icon-close-tip {
                display: none;
            }
        }
        .el-icon-close-tip {
            display: none !important;
        }

        .el-upload-list__item-name {
            display: inline-block;
            vertical-align: middle;
            color: #333;
            margin-right: 20px;

            width: auto;

            .el-upload-file-icon {
                width: 26px;
                height: 26px;
                vertical-align: middle;
                margin-right: 7px;
            }
        }
    }
}

.bv-upload-list__item-icon {
    display: inline-block;
    vertical-align: middle;
    width: 26px;
    height: 26px;
    margin-right: 7px;
    flex-shrink: 0;
    img {
        width: 100%;
        height: 100%;
        display: block;
    }
}
.bv-upload-list__item-title {
    // flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-right: 10px;
    a {
        color: #333;
        &:hover {
            color: #409eff;
        }
    }
}

.bv-upload-list__item-loading,
.bv-upload-list__item-download,
.bv-upload-list__item-view,
.bv-upload-list__item-delete,
.bv-upload-list__item-errortip {
    // position: absolute;
    // right: 1px;
    top: 0;
    cursor: pointer;

    display: inline-block;
    vertical-align: middle;
    color: #999;
    margin-left: 10px;
    flex-shrink: 0;
}
.bv-upload-list__item-errortip {
    color: red;
}
.bv-upload-list__item-delete {
    display: none;
}
.bv-upload-list__item-download,
.bv-upload-list__item-view,
.bv-upload-list__item-delete {
    &:hover {
        color: #409eff;
    }
}
.bv-upload-list__item {
    display: flex;
    line-height: 26px;
    padding: 3px 10px 3px 4px;
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        .bv-upload-list__item-delete {
            display: inline-block;
        }
    }
}
</style>
