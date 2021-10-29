<template>
    <div>
        <el-form>
            <el-form-item label="参与部门">
                <el-input v-model="joinOrgItem.names" readonly @click.native="joinOrgOPickerVisible = true" />
            </el-form-item>
            <el-form-item label="参与人">
                <el-input v-model="joinUserItem.names" readonly @click.native="joinUserOPickerVisible = true" />
            </el-form-item>
        </el-form>

        <o-picker
            title="参与部门"
            v-model="joinOrgItem"
            :objects="[{ code: 'org', config: { rootOrgCode: 'shhr', isShowRoot: true } }]"
            selectionMode="single"
            splitChar=","
            :visible.sync="joinOrgOPickerVisible"
            @selected="selectedHandler"
        ></o-picker>

        <o-picker
            title="参与人"
            v-model="joinUserItem"
            :objects="[{ code: 'orguser', config: { rootOrgCode: 'shhr' } }]"
            selectionMode="multiple"
            splitChar=","
            :visible.sync="joinUserOPickerVisible"
        ></o-picker>

        <!-- <bvan-cell form center title="流程分类" :value="flowCategoryItem.names" is-link @click="flowCategoryOPickerVisible = true" /> -->
        <!-- <o-picker
            title="流程分类"
            v-model="flowCategoryItem"
            :objects="[{ code: 'flow-category', config: {} }]"
            selectionMode="multiple"
            splitChar=","
            :visible.sync="flowCategoryOPickerVisible"
        ></o-picker> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { OPicker } from '../../../../packages/ui/packages/opicker'
import './objectives'

@Component({
    components: {
        OPicker
    }
})
export default class Index extends Vue {
    joinOrgItem = {
        values: '',
        names: ''
    }
    joinOrgOPickerVisible = false

    joinUserItem = {
        values: 'luolong',
        names: '罗龙'
    }

    joinUserOPickerVisible = false

    flowCategoryItem = {
        values: '',
        names: ''
    }

    flowCategoryOPickerVisible = false

    selectedHandler() {
        //
    }

    destroyed() {
        console.log('o de')
    }
}
</script>
