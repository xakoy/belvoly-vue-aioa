<template>
    <div>
        <bvan-cell form center title="参与部门" :value="joinOrgItem.names" is-link @click="joinOrgOPickerVisible = true" />
        <o-picker
            title="参与部门"
            v-model="joinOrgItem"
            :objects="[{ code: 'org' }]"
            selectionMode="multiple"
            splitChar=","
            :visible.sync="joinOrgOPickerVisible"
            @selected="selectedHandler"
        ></o-picker>

        <bvan-cell form center title="参与人" :value="joinUserItem.names" is-link @click="joinUserOPickerVisible = true" />
        <o-picker
            title="参与人"
            v-model="joinUserItem"
            :objects="[{ code: 'orguser', config: { rootOrgCode: 'shhr' } }]"
            selectionMode="multiple"
            splitChar=","
            :visible.sync="joinUserOPickerVisible"
        ></o-picker>

        <bvan-cell form center title="流程分类" :value="flowCategoryItem.names" is-link @click="flowCategoryOPickerVisible = true" />
        <o-picker
            title="流程分类"
            v-model="flowCategoryItem"
            :objects="[{ code: 'flow-category', config: {} }]"
            selectionMode="multiple"
            splitChar=","
            :visible.sync="flowCategoryOPickerVisible"
        ></o-picker>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { OPicker } from '../../../../packages/m-ui/packages/opicker'
// import { OPicker } from '../../../../packages/m-ui'
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
