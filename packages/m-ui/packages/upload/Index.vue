<template>
    <div class="bvan-mui-upload margin-small-top" v-if="!simple">
        <bvan-cell form :title="label" :border="true" v-if="!isReadonly">
            <template #right-icon>
                <template v-if="!isReadonly && !isDisabled">
                    <bvan-uploader ref="vanUploader" v-if="!inApp" :before-read="beforeReadHandler" :accept="accept" :after-read="afterReadHandler" :multiple="multiple">
                        <bvan-icon name="attachment" class-prefix="fc" color="#999" style="line-height: inherit;" />
                    </bvan-uploader>
                    <bvan-icon v-else name="attachment" class-prefix="fc" color="#999" style="line-height: inherit;" @click="appUploadClickHandler" />
                </template>
            </template>
        </bvan-cell>
        <bvan-cell-group class="bvan-mui-upload__group" v-if="files.length > 0" :border="false">
            <template #title v-if="isReadonly"> {{ label }} </template>
            <div class="bvan-mui-upload__items">
                <dl v-for="(item, index) in files" :key="index" class="bvan-mui-upload__item">
                    <dt>
                        <item :name="item.file.name" />
                        <strong>
                            <span>{{ item.file.name }}</span>
                        </strong>
                    </dt>
                    <dd v-if="$scopedSlots.buttons"><slot name="buttons" :item="item" /></dd>
                    <dd v-else>
                        <bvan-loading v-if="item.status === 'uploading'" size="14px">上传中...</bvan-loading>
                        <template v-else-if="item.status === 'failed'">
                            <bvan-tag type="danger">上传失败</bvan-tag>
                            <span v-if="!isReadonly" class="bvan-mui-upload__button" @click="removeHandler(item.file)">
                                <bvan-icon name="delete" class-prefix="fc" style="line-height: inherit;" />
                                删除
                            </span>
                        </template>
                        <template v-else>
                            <span v-if="isShowViewBtn" class="bvan-mui-upload__button" @click="handlePreview(item.file)">
                                <bvan-icon name="eyes-open" class-prefix="fc" style="line-height: inherit;" />
                                查看
                            </span>
                            <span v-if="!isReadonly" class="bvan-mui-upload__button" @click="removeHandler(item.file)">
                                <bvan-icon name="delete" class-prefix="fc" style="line-height: inherit;" />
                                删除
                            </span>
                            <span class="bvan-mui-upload__button" @click="handleDownload(item.file)">
                                <bvan-icon name="cloud-download" class-prefix="fc" style="line-height: inherit;" />
                                下载
                            </span>
                            <span class="bvan-mui-upload__button" v-if="enabledRename || beforeRename" @click="rename(item.file)">
                                <bvan-icon name="edit-pen" class-prefix="fc" style="line-height: inherit;" />
                                重命名
                            </span>
                            <!-- 
                            <span class="bvan-mui-upload__button">
                                <bvan-icon name="write-mail" class-prefix="fc" style="line-height: inherit;" />
                                编辑
                            </span> -->
                        </template>
                    </dd>
                </dl>
            </div>
        </bvan-cell-group>
        <bvan-dialog v-if="!!renameItem" :value="true" title="重命名" show-cancel-button :before-close="renameBeforeClosehandler">
            <div style="padding: 20px 0">
                <bvan-cell-group title="名称：" :border="false">
                    <bvan-field v-model="renameItem.name" border form :maxlength="nameMaxLength" />
                </bvan-cell-group>
            </div>
        </bvan-dialog>
        <PreviewFrame :onLineUrl="onLineUrl" :show.sync="onLineVisible" />
    </div>
    <span class="bvan-mui-upload__simple" v-else>
        <bvan-uploader v-if="!inApp" ref="simpleVanUploader" :before-read="beforeReadHandler" :accept="accept" :after-read="afterReadHandler" :multiple="multiple">
            <slot name="simple" />
        </bvan-uploader>
        <span v-else @click="appUploadClickHandler">
            <slot name="simple" />
        </span>
    </span>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Notify, Dialog } from '@belvoly-vue-aioa/bvant'
import { utils, globalConfig, services, wxwork } from '@belvoly-vue-aioa/m-core'
import { isInApp } from '../utils/environment'
import Item from './Item.vue'
import PreviewFrame from './Frame.vue'
const { attachmentService } = services
const { request } = utils

interface OnRemove {
    (id: string): Promise<void>
}

interface BeforeUpload {
    (file: any): Promise<boolean>
}

interface BeforeRename {
    (file: { id: string; name: string }): Promise<boolean>
}

function getFileName(path) {
    const pathArray = path.splitRemoveEmptys(/\/|\\\\/g)
    return pathArray[pathArray.length - 1]
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
    displayName?: string
}

type UploadFileStatus = 'success' | 'failed' | 'uploading'

interface ExisitFile {
    status: UploadFileStatus
    file: HtmlFile
}

@Component({
    components: {
        Item,
        PreviewFrame
    }
})
export default class Index extends Vue {
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

    @Prop({ default: '附件' }) label: string
    @Prop() action: string
    @Prop({ default: true }) multiple: boolean
    @Prop({
        default: function() {
            return []
        }
    })
    fileList: Array<UploadFile>

    @Prop({ required: false }) refTableName: string
    @Prop({ required: false }) typeCode: string
    @Prop({ required: false }) userUid: string
    @Prop({ default: false, type: Boolean }) readonly: boolean
    @Prop({ default: false, type: Boolean }) simple: boolean

    /**
     * 重命名时名称最大长度
     */
    @Prop({ type: Number, default: 250 }) nameMaxLength: number

    /**
     * 文字提示
     */
    @Prop({ required: false }) tip: string

    @Prop({ default: 50 }) maxSize: number
    /**
     * 是否只允许图片
     */
    @Prop({ default: false }) isOnlyImage: boolean
    /**
     * 上传前验证
     */
    @Prop({ required: false }) beforeUpload: BeforeUpload
    /**
     * 开启重名功能
     */
    @Prop({ type: Boolean, default: false }) enabledRename: boolean
    /**
     * 重命名前验证
     */
    @Prop({ required: false }) beforeRename: BeforeRename

    /**
     * 删除，当没有定义删除属性时，则启用默认删除事件
     */
    @Prop() onRemove: OnRemove

    @Prop({ default: 9999 }) limit: number
    /**
     * 是否开启下载日志功能
     */
    @Prop({ default: true, type: Boolean }) enableDownloadLog: boolean

    inApp = false
    inWxWork = false
    enabledWxwork = false

    uploadFiles: UploadFile[] = []

    files: ExisitFile[] = []

    onLineVisible = false
    onLineUrl = ''

    get isO365Enabled() {
        return this.config.o365.enabled
    }

    /**
     * 当前是否可以企业微信环境
     */
    get isWxworkReady() {
        return this.inWxWork && this.enabledWxwork
    }

    get isShowViewBtn() {
        return this.isO365Enabled && !this.inWxWork
    }

    get getFileList() {
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
    get accept() {
        if (this.isOnlyImage) {
            return '.jpg,.jpeg,.png,.bmp'
        }
        return '*'
    }
    get uploadTip() {
        return this.tip || this.isOnlyImage ? `最多允许上传${this.maxSize}MB的内容，格式仅支持${this.accept}` : `最多允许上传${this.maxSize}MB的内容`
    }

    get isReadonly() {
        return !(this.readonly === false)
    }

    get isDisabled() {
        return this.uploadFiles.length >= this.limit
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

    mounted() {
        this.init()
        this.watchFileList(this.fileList)
    }

    async init() {
        this.inApp = await isInApp()
        this.inWxWork = utils.environment.isInWeChatWork()
        if (this.inWxWork) {
            this.enabledWxwork = wxwork.isEnabled()
            if (this.enabledWxwork) {
                wxwork.initJsSDK({ jsApiList: ['previewFile', 'previewImage'] })
            }
        }
    }

    @Watch('fileList')
    watchFileList(newValue) {
        this.files = this.getFileList
        this.uploadFiles = [...newValue]
    }

    appUploadClickHandler() {
        const maxTotal = this.multiple ? this.limit : 1

        if (this.isOnlyImage) {
            BM.appointment.camera.getPicture(data => {
                if (data.imgURI) {
                    const file: HtmlFile = {
                        name: data.name || getFileName(data.imgURI),
                        size: data.fileSize || 0
                    }
                    this.clientUploadFile(data.imgURI, file, BM.appointment.camera.uploadPicture)
                }
            })
        } else {
            BM.appointment.file.getFiles(maxTotal, data => {
                if (Array.isArray(data)) {
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i]
                        if (item.fileURI) {
                            const file: HtmlFile = {
                                name: item.name || getFileName(item.fileURI),
                                size: item.fileSize || 0
                            }
                            this.clientUploadFile(item.fileURI, file, BM.appointment.file.uploadFile)
                        }
                    }
                } else {
                    alert('服务器未响应预期数据')
                }
            })
        }
    }

    async clientUploadFile(url: string, file: HtmlFile, uploadFileFunction) {
        if (url && file) {
            // uploadFileQueued(options, $itemscontainer, file)
            let isSuccess = false
            try {
                await this.beforeReadHandler(file)
                isSuccess = true
            } catch {
                isSuccess = false
            }
            if (!isSuccess) {
                return
            }
            const item: ExisitFile = {
                status: 'uploading',
                file: file
            }
            this.files.push(item)
            this.add(file, item)

            uploadFileFunction(url, this.uploadAction, data => {
                switch (data.state) {
                    case 0: //准备
                        break
                    case 1: //上传中
                        // uploadProgress(options, file, data.progressPercentage)
                        this.uploading(item, data.progressPercentage)
                        break
                    case 2: //成功
                        if (!data.result || data.result == '') {
                            // uploadError(options, file, '服务器没有返回预期返回值')
                            break
                        }
                        // eslint-disable-next-line no-case-declarations
                        let result = data.result
                        if (typeof result === 'string') {
                            result = JSON.parse(result)
                        }
                        result = result.data
                        file.response = { data: result }
                        item.status = 'success'
                        this.handleUploadSuccess(result, file, this.files, item)
                        // uploadSuccess(options, file, result)
                        break
                    case 3: //失败
                        // data.state = UPLOAD_ERROR_TYPE.ERROR
                        // uploadError(options, file, '上传失败')
                        item.status = 'failed'
                        this.error(item)
                        break
                    case 4: //超时
                        item.status = 'failed'
                        this.error(item)
                        // data.state = UPLOAD_ERROR_TYPE.TIMEOUT
                        // uploadError(options, file, '上传超时')
                        break
                    default:
                        break
                }
            })
        }
    }

    async beforeReadHandler(obj) {
        const validFile = async file => {
            const before = this.beforeUpload || (this.isOnlyImage && this.beforeUploadImage)
            if (before) {
                try {
                    await before(file)
                } catch (e) {
                    Notify({ type: 'danger', message: e.message })
                    throw new Error(e.message)
                }
            }
            const isLtSize = file.size / 1024 / 1024 < this.maxSize
            if (!isLtSize) {
                const message = `上传文件大小不能超过 ${this.maxSize}MB!`
                Notify({ type: 'danger', message: message })

                throw new Error(message)
            }
        }

        if (!Array.isArray(obj)) {
            return await validFile(obj)
        } else {
            const prs = obj.map(f => {
                return validFile(f)
            })
            return await new Promise((resolve, reject) => {
                Promise.all(prs).then(
                    () => {
                        resolve(undefined)
                    },
                    () => {
                        reject(false)
                    }
                )
            })
        }
    }
    async beforeUploadImage(file) {
        if (this.inApp) {
            return true
        }
        const allowTypes = ['image/bmp', 'image/jpeg', 'image/png']

        if (allowTypes.some(c => c === file.type)) {
            return true
        }

        throw new Error(`图片格式不正确`)
    }

    async afterReadHandler(file) {
        if (file instanceof Array) {
            file.forEach(item => {
                this.uploadFile(item.file)
            })
        } else {
            this.uploadFile(file.file)
        }
    }

    async uploadFile(file) {
        const item: ExisitFile = {
            file: file,
            status: 'uploading'
        }
        this.files.push(item)
        const data = new FormData()
        data.append(`file`, file)
        this.add(file, item)
        this.uploading(item, 0)
        const { data: result, success } = await request.request(this.uploadAction, {
            headers: {
                //添加请求头
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            data: data,
            onUploadProgress: event => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100
                    this.uploading(item, percentComplete)
                }
            }
        })
        if (success) {
            item.file.response = { data: result }

            item.status = 'success'
            this.handleUploadSuccess(result, file, this.files, item)
        } else {
            item.status = 'failed'
            this.error(item)
        }
    }
    error(item: ExisitFile) {
        this.$emit('error', item.file, item)
    }

    add(file: HtmlFile, item: ExisitFile) {
        this.$emit('add', file, item)
    }

    uploading(item: ExisitFile, percentage: number) {
        this.$emit('uploading', item.file, item, percentage)
    }

    handlePreview(file) {
        if (file.id) {
            this.handlePreviewCore(file)
        } else {
            this.handlePreviewCore(file.response.data)
        }
    }

    handleDownload(file) {
        this.$emit('download', file)
        if (file.id) {
            if (this.isWxworkReady) {
                wxwork.wx.previewFile({
                    url: this.getDownloadUrl(file.url),
                    name: file.name,
                    size: file.length || file.size
                })
            } else if (this.inApp) {
                BM.appointment.file.download(this.getDownloadUrl(file.url), file.name, '')
            } else {
                window.open(this.getDownloadUrl(file.url))
            }
        } else {
            if (this.isWxworkReady) {
                wxwork.wx.previewFile({
                    url: this.getDownloadUrl(file.response.data.url),
                    name: file.name,
                    size: file.length || file.size
                })
            } else if (this.inApp) {
                BM.appointment.file.download(this.getDownloadUrl(file.response.data.url), file.name, '')
            } else {
                window.open(this.getDownloadUrl(file.response.data.url))
            }
        }
    }

    async handlePreviewCore(file: { id: string; name: string; length?: number; size?: number; url: string; extension?: string }) {
        const preivewEnabled = this.config.o365.enabled

        if (preivewEnabled) {
            this.handleO365Preview(file)
        } else {
            if (this.inApp) {
                BM.appointment.file.download(this.getDownloadUrl(`${this.config.api.baseURI}/sharedservice/blob/${file.id}`), file.name, '')
                this.$emit('download', file)
            } else {
                window.open(this.getDownloadUrl(file.url))
            }
        }
    }

    getDownloadUrl(url: string) {
        let downloadUrl = url
        if (this.enableDownloadLog) {
            downloadUrl = downloadUrl + (downloadUrl.indexOf('?') === -1 ? '?' : '&') + 'token=' + globalConfig.token
        }
        return downloadUrl
    }

    async handleO365Preview(file: { id: string; name: string; length?: number; size?: number; url: string; extension?: string }) {
        let url = file.url
        let isSupport = false

        if (file.extension && this.checkO365PreviewSupproted(file.extension)) {
            isSupport = true
            url = `${this.config.o365.baseURI}${this.config.o365.blobURI}/${file.id}`
        }

        if (isSupport) {
            this.previewOnlineFile(url)
        } else {
            if (this.inApp) {
                BM.appointment.file.download(this.getDownloadUrl(url), file.name, '')
            } else {
                window.open(this.getDownloadUrl(url))
            }
            this.$emit('download', file)
        }
    }

    previewOnlineFile(url: string) {
        this.onLineUrl = url
        this.onLineVisible = true
    }
    checkO365PreviewSupproted(extension: string) {
        const ext = extension.toLowerCase()
        const supportFileExtensions = this.config.o365.supportFileExtensions

        return supportFileExtensions.includes(ext)
    }

    async removeHandler(file) {
        this.beforeRemove(file)
            .then(() => {
                this.handleRemove(file)
            })
            .catch(function() {
                //
            })
    }

    async handleRemove(file) {
        const fi = this.files.findIndex(f => f === file)
        this.files.splice(fi, 1)

        if (!(file.id || file.response)) {
            return true
        }
        const id = file.id || file.response.data.id

        const removeSuccessHandle = () => {
            const fileIndex = this.uploadFiles.findIndex(file => file.id === id)
            if (fileIndex > -1) {
                this.uploadFiles.splice(fileIndex, 1)
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
                Notify({
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
            return true
        }
        return await Dialog.confirm({ title: `确定移除 ${file.name}？` })
    }

    handleUploadSuccess(responseData: UploadFile, file, fileList, item: ExisitFile) {
        if (responseData) {
            this.uploadFiles.push(responseData)
        }
        const successFiles = fileList.find(file => file.status === 'success')

        if (successFiles.length < fileList.length) {
            return
        }

        const uploadInfo = {
            ids: this.uploadFiles.map(file => file.id),
            refTableId: '',
            refTableName: this.refTableName,
            file: file,
            fileList: fileList
        }

        this.$emit('success', uploadInfo, responseData, item)
        this.change()
        // this.$bus.emit('uploadInfo', uploadInfo)
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

    /**
     * 更新关联业务表记录ID
     */
    updateRelevance(refTableID, refTableName) {
        const blobRelevance = {
            ids: this.uploadFiles.map(file => file.id),
            refTableName: refTableName || this.refTableName,
            refTableID: refTableID
        }
        return attachmentService.updateRelevance(blobRelevance)
    }

    renameItem = null

    rename(file) {
        this.renameItem = {
            id: file.id,
            name: file.name
        }
    }

    async renameConfirmHandler() {
        const before = this.beforeRename
        if (before) {
            try {
                await before(this.renameItem)
            } catch (e) {
                Notify({ type: 'warning', message: typeof e === 'string' ? e : e.message })
                return false
            }
        }

        this.files.find(f => f.file.id === this.renameItem.id).file.name = this.renameItem.name
        this.$emit('rename', {
            name: this.renameItem.name,
            id: this.renameItem.id
        })
        this.renameItem = null
        return true
    }

    renameCancelHandler() {
        this.renameItem = null
    }

    async renameBeforeClosehandler(action, done) {
        if (action === 'confirm') {
            const success = await this.renameConfirmHandler()

            if (!success) {
                done(false)
            }
        } else {
            this.renameCancelHandler()
        }
    }

    chooseFile() {
        if (this.isReadonly || this.isDisabled) {
            return
        }

        if (this.inApp) {
            this.appUploadClickHandler()
        } else {
            const uploder: any = this.simple ? this.$refs.simpleVanUploader : this.$refs.vanUploader
            uploder.chooseFile()
        }
    }
}
</script>

<style lang="less">
.bvan-mui-upload {
    &__items {
        padding: 16px;
    }
    &__item {
        padding-bottom: 16px;
        &:last-of-type {
            padding-bottom: 0;
        }
        dt {
            line-height: 24px;
            display: flex;
            white-space: nowrap;
            padding-bottom: 8px;
            > span {
                width: 24px;
                height: 24px;
                text-align: center;
                margin-right: 8px;
                color: #ffffff;
                font-size: 12px;
            }
            strong {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: normal;

                input {
                    width: 100%;
                    box-sizing: border-box;
                }
            }
            em {
                display: block;
                overflow: hidden;
                text-align: right;
                font-style: normal;
            }
        }
    }
    &__button {
        color: #999;
        margin-right: 16px;
        > i {
            margin-right: 4px;
        }
    }
}
</style>
