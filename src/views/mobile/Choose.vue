<template>
    <div>
        <bvan-field label="收件人" is-link v-model="item.names" readonly @click="inputClickHandler" />
        <choose-people-or-org
            v-if="opickerToToVisible"
            rootOrgCode="shhr"
            selectionMode="single"
            mode="user"
            :isShowGlobal="true"
            :defaultUsers="item.users"
            :defaultOrgs="item.orgs"
            :codes.sync="item.codes"
            :names.sync="item.names"
            :visible.sync="opickerToToVisible"
            @selected="selectedHandler"
        />

        <bvan-field label="参与部门" is-link v-model="item.names" readonly @click="orgOpickerToToVisible = true" />
        <choose-people-or-org
            v-if="orgOpickerToToVisible"
            rootOrgCode="shhr"
            mode="org"
            title="参与部门"
            :isShowGlobal="false"
            :defaultUsers="item.users"
            :defaultOrgs="item.orgs"
            :codes.sync="item.codes"
            :names.sync="item.names"
            :visible.sync="orgOpickerToToVisible"
            @selected="selectedHandler"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// import { ChoosePeopleOrOrg } from '../../../packages/m-ui'
import { ChoosePeopleOrOrg } from '../../../packages/m-ui/packages/choose'
@Component({
    components: {
        ChoosePeopleOrOrg
    }
})
export default class ChoosePeopeleOrOrg extends Vue {
    opickerToToVisible = false

    orgOpickerToToVisible = false
    item = {
        codes: 'luolong',
        names: '罗龙',
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
        console.log(users, orgs)
    }
}
</script>
