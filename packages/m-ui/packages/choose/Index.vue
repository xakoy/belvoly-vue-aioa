<template>
    <div v-if="visible" class="bvant-choose-people-or-org">
        <div class="bvant-choose-people-or-org__container">
            <bvan-nav-bar :title="title" :border="false" />
            <bvan-search v-if="searchInputVisible" v-model="searchText" shape="round" :show-action="searchVisible" placeholder="搜索" @search="searchHandler" @cancel="cancelSearchHandler" />
            <div class="bvant-choose-people-or-org--content">
                <tree v-show="!searchVisible" ref="tree" :lazy="true" :props="{ label: 'name', isLeaf: 'leaf' }" :load="loadHandler" @currentCheckChange="treeCurrentCheckChangeHandler" />
                <search :loading="searchLoading" :isSingleMode="this.isSingleMode" v-if="searchVisible" :data="searchData" @currentCheckChange="searchCurrentCheckChangeHandler"></search>
            </div>
            <div class="bvant-choose-people-or-org__selectedarea " :class="{ 'bvant-choose-people-or-org__selectedarea--state-expand': selectedareaExpand }">
                <div class="bvant-choose-people-or-org__selectedarea--expandicon" @click="selectedareaExpand = !selectedareaExpand">
                    <bvan-icon v-if="!selectedareaExpand" name="arrow-up" />
                    <bvan-icon v-else name="arrow-down" />
                </div>
                <div class="bvant-choose-people-or-org__selectedarea--content">
                    <span v-for="(cItem, index) in checkItems" :key="index">
                        {{ cItem.name }}
                    </span>
                </div>
            </div>
            <bvan-button-group>
                <bvan-button square block @click="cancelHandler">取消</bvan-button>
                <bvan-button square block type="info" @click="confirmHandler">确定</bvan-button>
            </bvan-button-group>
        </div>
    </div>
</template>

<script lang="ts">
import { services } from '@belvoly-vue-aioa/m-core'
const { orgService, userService } = services

import { Vue, Component, Prop } from 'vue-property-decorator'
import Tree from './Tree.vue'
import Search from './Search.vue'
import { Node } from './interface'

type TreeNodeType = 'org' | 'user'

interface TreeNode {
    id: string
    name: string
    value: string
    type: TreeNodeType
    leaf: boolean
    checked: boolean
    data: any
    [key: string]: any
}

interface NameValue {
    name: string
    value: string
    data?: any
}

type Mode = 'user' | 'orgAndUser' | 'org'
type SelectionMode = 'multiple' | 'single'

@Component({
    components: {
        Tree,
        Search
    }
})
export default class Index extends Vue {
    @Prop({ default: '选择人员' }) title: string
    @Prop({ default: 'multiple' }) selectionMode: SelectionMode
    @Prop({ default: 'orgAndUser' }) mode: Mode
    @Prop() rootOrgCode: string
    @Prop({ default: false }) visible: boolean
    @Prop({ default: false }) isShowGlobal: boolean
    @Prop({}) defaultUsers: NameValue[]
    @Prop({}) defaultOrgs: NameValue[]
    @Prop() names: string
    @Prop() codes: string

    get searchInputVisible() {
        return !this.isOnlyChooseOrg
    }

    selectedareaExpand = false
    checkItems: TreeNode[] = []

    get isOnlyChooseOrg() {
        return this.mode === 'org'
    }

    get isOnlyChooseUser() {
        return this.mode === 'user'
    }

    get isSingleMode() {
        return this.selectionMode === 'single'
    }
    mounted() {
        if (this.defaultUsers) {
            this.checkItems.push(...this.defaultUsers.map(u => this.convertToTreeNode(u, 'user')))
        }
        if (this.defaultOrgs) {
            this.checkItems.push(...this.defaultOrgs.map(o => this.convertToTreeNode(o, 'org')))
        }
        document.body.appendChild(this.$el)
    }

    destoryed() {
        this.$el.parentNode.removeChild(this.$el)
    }

    searchCurrentCheckChangeHandler(checked: boolean, item: Node) {
        const tree: any = this.$refs.tree
        tree.setCheck(item.id, checked)
        this.treeCurrentCheckChangeHandler(checked, item)
    }

    treeCurrentCheckChangeHandler(checked: boolean, item: Node) {
        if (checked) {
            if (this.isSingleMode) {
                this.checkItems
                    .map(i => i.id)
                    .forEach(id => {
                        if (id !== item.id) {
                            const tree: any = this.$refs.tree
                            tree.setCheck(id, false)
                        }
                    })
                this.checkItems = [<TreeNode>item.data]
            } else {
                this.checkItems.push(<TreeNode>item.data)
            }
        } else {
            const index = this.checkItems.findIndex(i => i.id === item.id)
            if (index > -1) {
                this.checkItems.splice(index, 1)
            }
        }
    }

    rootOrg = null

    async getRoot() {
        if (this.isShowGlobal) {
            const { data: rootOrg } = await orgService.getOrgRoot()
            this.rootOrg = rootOrg
        } else {
            const { data: rootOrg } = await orgService.getOrgInfo(this.rootOrgCode)
            this.rootOrg = rootOrg
        }
        return this.rootOrg
    }

    async loadHandler(node, resolve) {
        if (node.level === 0) {
            const rootOrg = await this.getRoot()
            if (rootOrg) {
                await this.queryChildren(rootOrg.orgCode, resolve, rootOrg)
            }
        } else {
            const orgCode = node.data.value
            await this.loadSubNode(orgCode, resolve, true)
        }
    }

    cancelSearchHandler() {
        this.searchData = null
    }

    searchHandler(value) {
        if (!this.isOnlyChooseOrg) {
            this.searchUser(value, this.isShowGlobal ? null : this.rootOrgCode)
        } else {
            this.searchOrg(value, this.isShowGlobal ? null : this.rootOrgCode)
        }
    }

    searchData: Node[] = null
    searchLoading = false
    searchText = ''

    get searchVisible() {
        return this.searchLoading || !!this.searchData
    }

    async searchUser(text: string, parentCode?: string) {
        this.searchLoading = true
        const { data, success } = await userService.searchUsers(text, text, parentCode)
        if (success) {
            const userData = this.convertUsersToTreeNodeData(data)
            this.searchData = userData
        } else {
            this.searchData = []
        }
        this.searchLoading = false
    }

    async searchOrg(text: string, parentCode?: string) {
        this.searchLoading = true
        const { data, success } = await userService.searchUsers(text, text, parentCode)
        if (success) {
            const userData = this.convertUsersToTreeNodeData(data)
            this.searchData = userData
        } else {
            this.searchData = []
        }
        this.searchLoading = false
    }

    async loadSubNode(orgCode, resolve, isOnlyChild: boolean) {
        if (!isOnlyChild) {
            // 查询本机构信息，并查询子机构信息
            const { data } = await orgService.getOrgInfo(orgCode)
            if (data) {
                await this.queryChildren(orgCode, resolve, data)
            }
        } else {
            await this.queryChildren(orgCode, resolve, null) // 查询子机构信息
        }
    }

    // 查询机构下一层子机构
    async queryChildren(orgCode, resolve, parentOrg) {
        const { data } = await orgService.queryChildren(orgCode)
        if (data) {
            const nodeData = this.convertOrgsToTreeNodeData(data)
            let userData
            if (!this.isOnlyChooseOrg) {
                const { data: users } = await userService.queryByOrgCode(orgCode)
                userData = this.convertUsersToTreeNodeData(users)
            }
            if (parentOrg) {
                // this.defaultExpandedKeysId = orgCode
                // 默认展开第一个节点
                // this.defaultExpandedKeys = [orgCode]
                const parentNode = this.convertOrgToTreeNode(parentOrg, false)
                parentNode.children = [...nodeData]
                if (!this.isOnlyChooseOrg) {
                    parentNode.children.push(...userData)
                }
                const convertData = [parentNode]
                resolve(convertData)
            } else {
                const children = [...nodeData]
                if (!this.isOnlyChooseOrg) {
                    children.push(...userData)
                }
                resolve(children)
            }
        }
    }

    convertOrgsToTreeNodeData(data: any[]) {
        if (!data) return []

        return data.map(org => {
            const node = this.convertOrgToTreeNode(org, false)
            return node
        })
    }

    convertUsersToTreeNodeData(data: any[]) {
        if (!data) return []

        return data.map(user => {
            const node = this.convertUserToTreeNode(user, true)
            return node
        })
    }

    convertOrgToTreeNode(org: any, leaf = false) {
        const id = org.orgCode
        const isSelected = this.checkItems.some(item => item.id === id)
        return <Node>{
            id: id,
            name: org.orgName,
            value: org.orgCode,
            type: 'org',
            leaf: leaf,
            check: isSelected,
            cancheck: !this.isOnlyChooseUser,
            data: org,
            children: undefined
        }
    }

    convertUserToTreeNode(user: any, leaf = false) {
        const id = user.userUid
        const isSelected = this.checkItems.some(item => item.id === id)
        return <Node>{
            id: id,
            name: user.userName ? user.userName : user.userFullName,
            value: user.userUid,
            type: 'user',
            leaf: leaf,
            cancheck: true,
            check: isSelected,
            data: user
        }
    }

    cancelHandler() {
        this.close()
    }
    confirmHandler() {
        const users = this.checkItems.filter(item => item.type === 'user').map(u => this.convertToNameValue(u))
        const orgs = this.checkItems.filter(item => item.type === 'org').map(o => this.convertToNameValue(o))
        const all = [...users, ...orgs]
        const data = {
            users: users,
            orgs: orgs,
            userNames: users.map(u => u.name).join(','),
            userValues: users.map(u => u.value).join(','),
            orgNames: orgs.map(o => o.name).join(','),
            orgValues: orgs.map(o => o.value).join(','),
            names: all.map(a => a.name).join(','),
            values: all.map(a => a.value).join(',')
        }
        this.$emit('update:names', data.names)
        this.$emit('update:values', data.values)
        this.$emit('selected', data)
        this.close()
    }

    convertToTreeNode(nv: NameValue, type: TreeNodeType) {
        return <TreeNode>{
            id: nv.value,
            name: nv.name,
            value: nv.value,
            checked: true,
            type: type,
            data: nv.data
        }
    }

    convertToNameValue(node: TreeNode) {
        return <NameValue>{
            name: node.name,
            value: node.value,
            data: node.data
        }
    }

    close() {
        this.$emit('update:visible', false)
        this.$emit('close')
    }
}
</script>

<style lang="less">
.bvant-choose-people-or-org {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: #ffffff;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
    &__container {
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    &--content {
        height: 100px;
        flex: 1;
        margin-bottom: 65px;
        overflow: auto;
    }
    &__node {
    }

    &__item {
        position: relative;
        display: flex;
        padding: 16px 0;
        line-height: 1;
        &--warp {
        }

        &--expand-icon {
            width: 14px;
            text-align: center;
            color: #cccccc;
            cursor: pointer;
        }

        &--avatar {
            > span,
            > img {
                display: inline-block;
                width: 30px;
                height: 30px;
                border-radius: 30px;
                background: #3492e9;
                color: #ffffff;
                text-align: center;
                line-height: 30px;
            }
        }

        &--checkbox {
            width: 32px;
            text-align: center;
        }

        &--label {
            flex: 1;
            font-size: 16px;
            padding-left: 8px;
        }

        &-nochild {
            background: #f9f9f9;
        }
        &-nochild &--label,
        &-nochild &--checkbox {
            padding-top: 6px;
        }
    }

    &__selectedarea {
        position: absolute;
        bottom: 40px;
        left: 0;
        width: 100%;
        border-top: 1px solid #e4e4e4;
        background: #f9f9f9;

        &--expandicon {
            position: absolute;
            border: 1px solid #e4e4e4;
            border-radius: 30px;
            background: #f9f9f9;
            left: 0;
            right: 0;
            margin: auto;
            width: 30px;
            height: 30px;
            top: -15px;
            z-index: 1;
            color: #cccccc;
            text-align: center;
        }

        &--content {
            background: #f9f9f9;
            position: relative;
            z-index: 2;
            padding: 16px;
            padding-bottom: 8px;
            white-space: nowrap;
            overflow: auto;

            > span {
                min-width: 50px;
                text-align: center;
                line-height: 24px;
                border-radius: 4px;
                border: 1px solid #3492e9;
                font-size: 12px;
                color: #3492e9;
                padding: 0 8px;
                display: inline-block;
                margin-right: 8px;
                margin-bottom: 8px;
            }
        }

        &--state-expand &--content {
            white-space: normal;
        }
    }
}
</style>
