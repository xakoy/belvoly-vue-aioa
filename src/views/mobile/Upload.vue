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
    actionUrl = `http://192.168.24.111/api/sharedservice/blob/upload`
    typeCode = 'demo'
    refTableName = 'FRONTEND_TEST'
    fileList = [
        {
            id: '22523ceb-ade9-4e5e-8a22-9eb4ebc041a4',
            refTableID: null,
            refTableName: 'FRONTEND_TEST',
            displayName: 'TongHttpServer3.8用户手册.pdf',
            persistentType: 0,
            contentType: 'application/pdf',
            name: 'TongHttpServer3.8用户手册',
            extension: '.pdf',
            content: null,
            length: 2154031,
            relativePath: 'FRONTEND_TEST/20210907',
            internalName: '0db76f02-395c-4849-81fe-b7a0deabaceb.pdf',
            typeCode: 'demo',
            isDelete: 0,
            extraData: null,
            sequence: 0,
            creatorID: null,
            creatorName: null,
            createTime: '2021-09-07 10:17:23',
            updateTime: '2021-09-07 10:17:23',
            url: 'http://192.168.24.111/api/sharedservice/blob/22523ceb-ade9-4e5e-8a22-9eb4ebc041a4',
            downTimes: 0,
            md5_: '90a18c0689eff76a3798df3e7edd32b1',
            chunksUploadJson: null,
            internalFileName: null,
            base64: null
        },
        {
            id: '81bc401f-341d-4961-900e-7e068955fef5',
            refTableID: null,
            refTableName: 'FRONTEND_TEST',
            displayName: '基础前端面试题.docx',
            persistentType: 0,
            contentType: 'application/octet-stream',
            name: '基础前端面试题',
            extension: '.docx',
            content: null,
            length: 13077,
            relativePath: 'FRONTEND_TEST/20210907',
            internalName: 'eaab8934-5eab-4a85-bbc8-71ce7a39a133.docx',
            typeCode: 'demo',
            isDelete: 0,
            extraData: null,
            sequence: 0,
            creatorID: null,
            creatorName: null,
            createTime: '2021-09-07 10:17:44',
            updateTime: '2021-09-07 10:17:44',
            url: 'http://192.168.24.111/api/sharedservice/blob/81bc401f-341d-4961-900e-7e068955fef5',
            downTimes: 0,
            md5_: '2fe3794c4b5a8e306298d27094e866ad',
            chunksUploadJson: null,
            internalFileName: null,
            base64: null
        },
        {
            id: 'fe548395-17ae-482b-93cf-acce367e05c9',
            refTableID: null,
            refTableName: 'FRONTEND_TEST',
            displayName: '1.jpeg',
            persistentType: 0,
            contentType: 'image/jpeg',
            name: '1',
            extension: '.jpeg',
            content: null,
            length: 18175,
            relativePath: 'FRONTEND_TEST/20210907',
            internalName: '74664f74-5661-43eb-82e3-61ef8d6f6fb0.jpeg',
            typeCode: 'demo',
            isDelete: 0,
            extraData: null,
            sequence: 0,
            creatorID: null,
            creatorName: null,
            createTime: '2021-09-07 10:18:00',
            updateTime: '2021-09-07 10:18:00',
            url: 'http://192.168.24.111/api/sharedservice/blob/fe548395-17ae-482b-93cf-acce367e05c9',
            downTimes: 0,
            md5_: 'f86144ba1c66c35dbb0440ca83870025',
            chunksUploadJson: null,
            internalFileName: null,
            base64: null
        },
        {
            id: '7150a3db-a478-4034-acc1-d7f89ce6bd02',
            refTableID: null,
            refTableName: 'FRONTEND_TEST',
            displayName: 'WPS+云办公场景.pptx',
            persistentType: 0,
            contentType: 'application/octet-stream',
            name: 'WPS+云办公场景',
            extension: '.pptx',
            content: null,
            length: 7913136,
            relativePath: 'FRONTEND_TEST/20210907',
            internalName: '354c0460-340e-4780-8b49-da5388840f0c.pptx',
            typeCode: 'demo',
            isDelete: 0,
            extraData: null,
            sequence: 0,
            creatorID: null,
            creatorName: null,
            createTime: '2021-09-07 10:30:15',
            updateTime: '2021-09-07 10:30:15',
            url: 'http://192.168.24.111/api/sharedservice/blob/7150a3db-a478-4034-acc1-d7f89ce6bd02',
            downTimes: 0,
            md5_: '5227a149c4778f243f0433f18b2b3a17',
            chunksUploadJson: null,
            internalFileName: null,
            base64: null
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
