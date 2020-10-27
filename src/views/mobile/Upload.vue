<template>
    <div style="text-align: left">
        <upload
            style="margin-bottom: 10px"
            :action="actionUrl"
            :limit="1"
            :isOnlyImage="true"
            :fileList="imageList"
            :refTableName="refTableName"
            :typeCode="typeCode"
            label="封面"
            tip="封面仅支持20MB以下图片，格式仅支持.jpg ,jpeg .png .bmp"
        />
        <el-input v-model="ss" />
        <upload ref="upload" :action="actionUrl" :limit="4" :fileList="fileList" :typeCode="typeCode" :refTableName="refTableName" :isEditFile="true" @change="changeHandler" />

        <!-- <upload ref="upload2" :action="actionUrl" :limit="4" :fileList="fileList" :typeCode="typeCode" :refTableName="refTableName" readonly @change="changeHandler" /> -->
        <!-- <upload ref="upload3" label="自定义按钮" :action="actionUrl" :limit="4" :fileList="fileList" :typeCode="typeCode" :refTableName="refTableName" readonly @change="changeHandler">
            <template v-slot:buttons="{ item }"> {{ item.status }} {{ item.file.name }} </template>
        </upload>

        <bvan-cell-group title="简易模式">
            <upload simple @success="simpleSuccessHandler" action="http://192.168.101.135:2001/api/bua/avatar/uploadHeadPhoto?userUid=luolong">
                <template #simple>
                    上传中
                </template>
            </upload>
        </bvan-cell-group>
        <bvan-button @click="saveHandler" :loading="loading">
            保存
        </bvan-button> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// import { Upload } from '../../../packages/m-ui'
import Upload from '../../../packages/m-ui/packages/upload/Index.vue'
@Component({
    components: {
        Upload
    }
})
export default class UploadIndex extends Vue {
    ss = 'ss'
    actionUrl = `http://192.168.101.135:2001/api/sharedservice/blob/upload`
    typeCode = 'demo'
    refTableName = 'FRONTEND_TEST'
    fileList = [
        {
            id: '88de60ed-04c4-4251-aedd-ad56f2de5254',
            refTableID: null,
            refTableName: 'FRONTEND_TEST',
            displayName: 'Uffice环境信息、生成配置及发布过程.docx',
            persistentType: 0,
            contentType: 'application/octet-stream',
            name: 'Uffice环境信息、生成配置及发布过程',
            extension: '.docx',
            content: null,
            length: 127823,
            relativePath: 'FRONTEND_TEST\\20201027',
            internalName: '426b2ce2-7fa1-4e0b-bdc0-bbab4e66484d.docx',
            typeCode: 'demo',
            isDelete: 0,
            extraData: null,
            sequence: 0,
            creatorID: null,
            creatorName: null,
            createTime: '2020-10-27 10:32:56',
            updateTime: '2020-10-27 10:32:56',
            url: 'http://192.168.101.135:2001/api/sharedservice/blob/88de60ed-04c4-4251-aedd-ad56f2de5254',
            downTimes: 0,
            md5_: 'd1460855222779835bc66415ce895dc6',
            chunksUploadJson: null,
            internalFileName: null
        },
        {
            id: '6ae01cc6-6472-4c6d-a825-8c7d710b9d08',
            refTableID: null,
            refTableName: 'FRONTEND_TEST',
            displayName: 'UMIS智能办公项目版本跟踪清单.xlsx',
            persistentType: 0,
            contentType: 'application/octet-stream',
            name: 'UMIS智能办公项目版本跟踪清单',
            extension: '.xlsx',
            content: null,
            length: 26561,
            relativePath: 'FRONTEND_TEST\\20201027',
            internalName: '8a8809d3-e789-4d92-bdd5-f3a8288f714c.xlsx',
            typeCode: 'demo',
            isDelete: 0,
            extraData: null,
            sequence: 0,
            creatorID: null,
            creatorName: null,
            createTime: '2020-10-27 10:33:39',
            updateTime: '2020-10-27 10:33:39',
            url: 'http://192.168.101.135:2001/api/sharedservice/blob/6ae01cc6-6472-4c6d-a825-8c7d710b9d08',
            downTimes: 0,
            md5_: '8276fd4a7b80080b37a20d0b3715b404',
            chunksUploadJson: null,
            internalFileName: null
        },
        {
            id: 'fdf68808-6df6-4a72-a1be-3f70c626b1bf',
            refTableID: null,
            refTableName: 'FRONTEND_TEST',
            displayName: '数字经营系统设计思路.pptx',
            persistentType: 0,
            contentType: 'application/octet-stream',
            name: '数字经营系统设计思路',
            extension: '.pptx',
            content: null,
            length: 380774,
            relativePath: 'FRONTEND_TEST\\20201027',
            internalName: 'fdbdd9f1-5524-4eaa-b8ad-b43f01ec403f.pptx',
            typeCode: 'demo',
            isDelete: 0,
            extraData: null,
            sequence: 0,
            creatorID: null,
            creatorName: null,
            createTime: '2020-10-27 10:31:20',
            updateTime: '2020-10-27 10:31:20',
            url: 'http://192.168.101.135:2001/api/sharedservice/blob/fdf68808-6df6-4a72-a1be-3f70c626b1bf',
            downTimes: 0,
            md5_: '390a8fc598b25cce1c982807c25c985f',
            chunksUploadJson: null,
            internalFileName: null
        },
        {
            id: 'f6b80c23-41d2-42f1-8743-75f4190d123f',
            refTableID: '302df60ca8a94cfe8d7cc1f7b64c0d45',
            refTableName: 'CALENDAR_MYCALENDAR',
            displayName: '155058843.jpg',
            persistentType: 0,
            contentType: 'image/jpeg',
            name: '155058843',
            extension: '.jpg',
            content: null,
            length: 190124,
            relativePath: 'CALENDAR_MYCALENDAR\\20200331',
            internalName: '39d675c8-85ca-4683-a03b-f3fa3c0498d1.jpg',
            typeCode: 'undefined',
            isDelete: 0,
            extraData: null,
            sequence: 0,
            creatorID: 'xiejianyun',
            creatorName: null,
            createTime: '2020-03-31 17:15:02',
            updateTime: '2020-03-31 17:15:02',
            url: 'http://192.168.101.135:2001/api/sharedservice/blob/f6b80c23-41d2-42f1-8743-75f4190d123f',
            downTimes: 0
        }
    ]

    imageList = []

    changeHandler(files) {
        console.log('change', files)
    }

    loading = false

    async saveHandler() {
        const id = 'XXX-XXX-XX'
        const upload: any = this.$refs.upload
        this.loading = true
        await upload.updateRelevance(id)
        this.loading = false
    }

    async simpleSuccessHandler(a, b) {
        console.log(a, b, 'simple success')
        alert('上传成功')
    }
}
</script>
