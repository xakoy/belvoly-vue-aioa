<template>
    <div>
        <el-form>
            <el-input v-model="item.names" readonly @click.native="singleOickerToToVisible = true" />
            <choose-people-or-org
                v-if="singleOickerToToVisible"
                rootOrgCode="shhr"
                selectionMode="single"
                mode="user"
                :isShowGlobal="true"
                :defaultUsers="item.users"
                :defaultOrgs="item.orgs"
                :codes.sync="item.codes"
                :names.sync="item.names"
                :visible.sync="singleOickerToToVisible"
                @selected="selectedHandler"
            />
            <el-form-item label="多选">
                <el-input v-model="item.names" readonly @click.native="inputClickHandler" />
                <choose-people-or-org
                    v-if="opickerToToVisible"
                    rootOrgCode="shhr"
                    selectionMode="multiple"
                    mode="orgAndUser"
                    :isShowGlobal="true"
                    :defaultUsers="item.users"
                    :defaultOrgs="item.orgs"
                    :codes.sync="item.codes"
                    :names.sync="item.names"
                    :visible.sync="opickerToToVisible"
                    @selected="selectedHandler"
                    :beforeClose="beforeCloseHandler"
                    @selectedOrgChange="selectedOrgChangeHandler"
                    @selectedUserChange="selectedUserChangeHandler"
                    @selectedChange="selectedChangeHandler"
                />
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ChoosePeopleOrOrg } from '../../../packages/ui/packages/choose'
@Component({
    components: {
        ChoosePeopleOrOrg
    }
})
export default class ChoosePeopeleOrOrg extends Vue {
    singleOickerToToVisible = false
    opickerToToVisible = false
    item = {
        codes: '',
        names: '',
        users: [
            {
                name: '罗龙',
                value: 'luolong'
            }
        ],
        orgs: []
    }

    inputClickHandler() {
        this.opickerToToVisible = true
    }

    selectedHandler({ users, orgs }) {
        this.item.users = users
        this.item.orgs = orgs
    }

    beforeCloseHandler(done) {
        done()
    }
    selectedOrgChangeHandler(orgs) {
        console.log(orgs, 'selectedOrgChange')
    }
    selectedUserChangeHandler(users) {
        console.log(users, 'selectedUserChange')
    }
    selectedChangeHandler(data) {
        console.log(data, 'selectedChange')
    }
}
</script>
