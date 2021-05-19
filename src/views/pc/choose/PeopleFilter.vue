<template>
    <el-form-item label="过滤用户">
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
            :peopleDataFilter="peopleDataFilter"
            @selected="selectedHandler"
        />
    </el-form-item>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ChoosePeopleOrOrg } from '../../../../packages/ui/packages/choose'
import { PeopleDataFilterOfChoosePeopleOrOrg } from '../../../../packages/ui/packages/choose/types'

interface Filter {
    peopleDataFilter: PeopleDataFilterOfChoosePeopleOrOrg
}

@Component({
    components: {
        ChoosePeopleOrOrg
    }
})
export default class PeopleFilter extends Vue implements Filter {
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
    peopleDataFilter: PeopleDataFilterOfChoosePeopleOrOrg = (users: any[]) => {
        return users.filter(u => !!u.mobilePhone || !!u?.person?.mobile)
    }
}
</script>
