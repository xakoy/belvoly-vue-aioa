<template>
    <div>
        <bvan-field label="用户过滤器" is-link v-model="item.names" readonly @click="inputClickHandler" />
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
            :peopleDataFilter="peopleDataFilter"
            @selected="selectedHandler"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ChoosePeopleOrOrg } from '../../../packages/m-ui/packages/choose'

@Component({
    components: {
        ChoosePeopleOrOrg
    }
})
export default class PeopleFilter extends Vue {
    opickerToToVisible = false
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

    peopleDataFilter = (users: any[]) => {
        console.log(1)
        return users.filter(u => !!u.mobilePhone || !!u?.person?.mobile)
    }
}
</script>
