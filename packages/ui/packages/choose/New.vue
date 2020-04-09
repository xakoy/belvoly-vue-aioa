<template>
    <div class="bv-choose-people_wrapper" v-show="visible">
        <div class="bv-choose-people_mask" @click="handleClickMask"></div>
        <div class="bv-choose-people">
            <div class="bv-choose-people_head">
                <div>{{ title }}</div>
                <div class="bv-choose-people_close fc fc-close" @click="handleClickClose"></div>
            </div>
            <div class="bv-choose-people_view">
                <div>
                    <slot name="header"></slot>
                </div>
                <div class="bv-choose-people_body">
                    <div class="bv-choose-people_tree">
                        <el-tabs v-model="tab.activeTabName" @tab-click="tabClickHandler">
                            <el-tab-pane label="本单位" name="unit">
                                <div class="bv-choose-people_treenav">
                                    <div class="bv-choose-people_search">
                                        <el-input v-model="searchText" @keyup.enter="keyupSubmit(event)" placeholder="用户名称\账号">
                                            <template v-slot:append>
                                                <el-button title="查询用户" class="bv-choose-people_search_button" @click="searchUnitUserHandler">
                                                    <i class="fc fc-search"></i>
                                                </el-button>
                                            </template>
                                        </el-input>
                                    </div>

                                    <el-tree
                                        ref="tree"
                                        :show-checkbox="isShowCheckBox"
                                        :expand-on-click-node="false"
                                        node-key="id"
                                        :props="{
                                            label: 'name',
                                            children: 'zones',
                                            isLeaf: 'leaf'
                                        }"
                                        lazy
                                        :default-expanded-keys="defaultExpandedKeys"
                                        :check-strictly="true"
                                        :load="loadUnitOrgs"
                                        @node-click="handleTreeNodeClick"
                                        @check-change="handleTreeNodeCheckChange"
                                    >
                                        <template v-slot="{ node }">
                                            <span style="font-size: 14px;">
                                                <span style="padding-right: 3px;">
                                                    <i class="fc fc-company" />
                                                </span>
                                                <span>{{ node.label }}</span>
                                            </span>
                                        </template>
                                    </el-tree>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="全局" name="gloabl" v-if="isShowGlobal">
                                <div class="bv-choose-people_treenav">
                                    <el-tree
                                        ref="globaltree"
                                        :show-checkbox="isShowCheckBox"
                                        node-key="id"
                                        :expand-on-click-node="false"
                                        :props="{
                                            label: 'name',
                                            children: 'zones',
                                            isLeaf: 'leaf'
                                        }"
                                        lazy
                                        :default-expanded-keys="defaultExpandedKeys"
                                        :check-strictly="true"
                                        :load="loadGlobalOrgs"
                                        @node-click="handleTreeNodeClick"
                                        @check-change="handleTreeNodeCheckChange"
                                    >
                                        <template v-slot="{ node }">
                                            <span style="font-size: 14px;">
                                                <span style="padding-right: 3px;">
                                                    <i class="fc fc-company" />
                                                </span>
                                                <span>{{ node.label }}</span>
                                            </span>
                                        </template>
                                    </el-tree>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="bv-choose-people_canselect">
                        <div class="bv-choose-people_canselect_title">
                            <span class="bv-choose-people_canselect_title_left bv-choose-people_canselect_title_primary">{{ currentSelectOrg ? currentSelectOrg.orgName : '' }}</span>
                            <span class="bv-choose-people_canselect_title_right">
                                <el-checkbox @change="showDepartmentClick" v-model="showDepartmentalUsers">显示子部门用户</el-checkbox>
                                <!-- <el-checkbox v-model="checkAll" :disabled="checkAllDisabled">全选</el-checkbox> -->
                            </span>
                        </div>
                        <div style="overflow: auto;">
                            <ul class="bv-choose-people_canselect_list">
                                <li class="bv-choose-people_select_item" v-for="(item, index) in canSelecteUsers" :key="index" @click="handleSelectUser(item, $event)">
                                    <span :class="{ 'bv-choose-people_select_item_avatar': !item.checked, 'bv-choose-people_select_item_checked': item.checked }">
                                        <span v-show="item.checked">.</span>
                                        <img v-show="!item.checked" :src="getUserIcon(item.data)" />
                                    </span>
                                    <span class="bv-choose-people_select_item_name">
                                        <b>{{ item.name }}</b>
                                        <i>{{ item.data.orgName }}</i>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <template v-if="mode === 'orgAndUser'">
                        <div class="bv-choose-people_select">
                            <div style="height:50%;" class="bv-choose-people_selectbox">
                                <div class="bv-choose-people_canselect_title">
                                    <span class="bv-choose-people_canselect_title_left">
                                        已选用户：
                                        <span class="bv-choose-people_canselect_title_primary">{{ selectNumber }} 名</span>
                                    </span>
                                    <span class="bv-choose-people_canselect_title_right" style="padding-right: 10px;">
                                        <span class="bv-choose-people_canselect_clear" @click="handleClearSelectedUsers">清空</span>
                                    </span>
                                </div>
                                <div class="bv-choose-people_selectbox_content">
                                    <ul>
                                        <li class="bv-choose-people_select_item" v-for="(item, index) in selectedUsers" :key="index">
                                            <span class="bv-choose-people_select_item_avatar">
                                                <span class="bv-choose-people_select_item_avatar_close" @click="handleRemoveSelectedUser(item, index)" title="删除">
                                                    x
                                                </span>
                                                <span class="bv-choose-people_select_item_avatar_name">
                                                    <img :src="getUserIcon(item.data)" />
                                                </span>
                                            </span>
                                            <span class="bv-choose-people_select_item_name" @click="handleClick(index)">
                                                <b>{{ item.name }}</b>
                                                <i>{{ item.orgName }}</i>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div style="height:50%;" class="bv-choose-people_selectbox">
                                <div class="bv-choose-people_canselect_title">
                                    <span class="bv-choose-people_canselect_title_left">
                                        已选机构：
                                        <span class="bv-choose-people_canselect_title_primary">{{ selectNumberOrg }} 个</span>
                                    </span>
                                    <span class="bv-choose-people_canselect_title_right" style="padding-right: 10px;">
                                        <span class="bv-choose-people_canselect_clear" @click="handleClearSelectedOrgs">清空</span>
                                    </span>
                                </div>
                                <div class="bv-choose-people_selectbox_content">
                                    <ul>
                                        <li class="bv-choose-people_select_item" v-for="(item, index) in selectedOrgs" :key="index">
                                            <span class="bv-choose-people_select_item_avatar">
                                                <span class="bv-choose-people_select_item_avatar_close" @click="handleClickRemoveOrg(item, index)" title="删除">
                                                    x
                                                </span>
                                                <span class="bv-choose-people_select_item_avatar_name">{{ getOrgIcon(item.name) }}</span>
                                            </span>
                                            <span class="bv-choose-people_select_item_name" @click="handleClick(index)">
                                                <b>{{ item.name }}</b>
                                                <i>{{ item.orgName }}</i>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="bv-choose-people_selectbox">
                            <div class="bv-choose-people_canselect_title">
                                <span class="bv-choose-people_canselect_title_left">
                                    已选用户：
                                    <span class="bv-choose-people_canselect_title_primary">{{ selectNumber }} 名</span>
                                </span>
                                <span class="bv-choose-people_canselect_title_right" style="padding-right: 10px;">
                                    <span class="bv-choose-people_canselect_clear" @click="handleClearSelectedUsers">清空</span>
                                </span>
                            </div>
                            <div class="bv-choose-people_selectbox_content">
                                <ul>
                                    <li class="bv-choose-people_select_item" v-for="(item, index) in selectedUsers" :key="index">
                                        <span class="bv-choose-people_select_item_avatar">
                                            <span class="bv-choose-people_select_item_avatar_close" @click="handleRemoveSelectedUser(item, index)" title="删除">
                                                x
                                            </span>
                                            <span class="name_icon">
                                                <img :src="getUserIcon(item.data)" class="myAvatar" />
                                            </span>
                                        </span>
                                        <span class="bv-choose-people_select_item_name" @click="handleClick(index)">
                                            <b>{{ item.name }}</b>
                                            <i>{{ item.orgName }}</i>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                </div>
                <div>
                    <slot name="footer"></slot>
                </div>
            </div>
            <div class="bv-choose-people_foot">
                <el-button type="primary" @click="handleClickConfirm">确定</el-button>
                <el-button @click="handleClickClose">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { services, globalConfig } from '@belvoly-vue-aioa/core'
import { ElTree } from 'element-ui/types/tree'
import { User } from '@belvoly-vue-aioa/core/services/userService'
const { orgService, userService } = services
const config = {
    api: {
        baseURI: globalConfig.apiHost
    }
}

@Component
export default class New extends Vue {
    @Prop({ default: '选择人员' }) title: string
    @Prop({ default: 'multiple' }) selectionMode: string
    @Prop({ default: 'orgAndUser' }) mode: string
    @Prop() rootOrgCode: string
    @Prop({ default: false }) visible: boolean
    @Prop({ default: false }) isShowGlobal: boolean
    @Prop({}) defaultUsers: any
    @Prop({}) defaultOrgs: any

    isShowCheckBox = true
    defaultExpandedKeys = []

    /**
     * tab相关数据
     */
    tab = {
        // 选择的tab
        activeTabName: 'unit',
        currentIndex: null
    }

    /**
     * 是否显示子部门用户
     */
    showDepartmentalUsers = false

    /**
     * 选中的用户
     */
    selectedUsers = []
    /**
     * 选中的机构
     */
    selectedOrgs: TreeNode[] = []

    /**
     * 当前选中的机构
     */
    currentSelectOrg = null

    /**
     * 可以选中的用户
     */
    canSelecteUsers: TreeNode[] = []

    /**
     * 搜索框显示文本
     */
    searchText = ''

    get selectNumber() {
        return this.selectedUsers.length
    }

    get selectNumberOrg() {
        return this.selectedOrgs.length
    }

    mounted() {
        if (this.defaultUsers) {
            this.selectedUsers.push(...this.defaultUsers)
        }
        if (this.defaultOrgs) {
            this.selectedOrgs.push(...this.defaultOrgs)
        }
        document.body.appendChild(this.$el)
    }

    destroyed() {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el)
        }
    }

    // 树的初始加载
    async loadUnitOrgs(node, resolve) {
        const rootOrgCode = this.rootOrgCode
        if (node.level === 0) {
            if (rootOrgCode) {
                await this.loadSubNode(rootOrgCode, resolve, false)
            } else {
                const { data: rootOrg } = await orgService.getOrgRoot()
                if (rootOrg) {
                    await this.queryChildren(rootOrg.orgCode, resolve, rootOrg)
                }
            }
        } else {
            const orgCode = node.data.value
            await this.loadSubNode(orgCode, resolve, true)
        }
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
            if (parentOrg) {
                // this.defaultExpandedKeysId = orgCode
                // 默认展开第一个节点
                this.defaultExpandedKeys = [orgCode]
                const parentNode = this.convertOrgToTreeNode(parentOrg, false)
                parentNode.children = [...nodeData]
                const convertData = [parentNode]
                resolve(convertData)
            } else {
                resolve(nodeData)
            }
        }
        this.refreshTreeNodeSelectedStatus()
    }

    async loadGlobalOrgs(node, resolve) {
        if (node.level === 0) {
            const { data } = await orgService.getOrgRoot()
            if (data) {
                await this.queryChildren(data.orgCode, resolve, data)
            }
        } else {
            const orgCode = node.data.value
            await this.loadSubNode(orgCode, resolve, true)
        }
    }

    tabClickHandler(tab) {
        this.tab.activeTabName = tab.name
        this.refreshTreeNodeSelectedStatus()
    }

    async searchUnitUserHandler() {
        const { data } = await userService.searchUsers(this.searchText, this.searchText)
        this.setChooseUser(data)
    }

    get isSingleMode() {
        return this.selectionMode === 'single'
    }

    async handleTreeNodeClick(data: TreeNode) {
        //TODO:
        this.currentSelectOrg = data.data
        //TODO: 判断showDepartmentalUsers
        await this.queryUserByOrgCode(data.value)
    }

    handleTreeNodeCheckChange(data: TreeNode, checked) {
        if (this.isSingleMode) {
            this.selectedOrgs = []
            if (checked === true) {
                this.selectedOrgs.push(data)
            }
        } else {
            if (checked) {
                const index = this.selectedOrgs.findIndex(item => item.id === data.id)
                if (index === -1) {
                    this.selectedOrgs.push(data)
                }
            } else {
                const index = this.selectedOrgs.findIndex(item => item.id === data.id)
                if (index > -1) {
                    this.selectedOrgs.splice(index, 1)
                }
            }
        }
    }

    // 查询机构下的用户
    async queryUserByOrgCode(orgCode) {
        const { data } = await userService.queryByOrgCode(orgCode)
        this.setChooseUser(data)
    }
    // 查询机构下穿透的用户集合
    async queryAllUsersByOrgCode(orgCode) {
        const { data } = await userService.queryByOrgCodeAllUsers(orgCode)
        this.setChooseUser(data)
    }

    setChooseUser(data: User[]) {
        if (!data) {
            this.canSelecteUsers = []
        } else {
            this.canSelecteUsers = data.map(user => {
                const isSelected = this.selectedUsers.findIndex(u => u.id === user.userUid) > -1
                const userNode = <TreeNode>{
                    id: user.userUid,
                    name: user.userName ? user.userName : user.userFullName,
                    value: user.userUid,
                    type: 'user',
                    checked: isSelected,
                    data: user
                }
                return userNode
            })
        }
    }

    showDepartmentClick() {
        //TODO:
    }

    handleSelectUser(user: TreeNode) {
        if (!user.checked) {
            user.checked = true
            this.selectedUsers.push(user)
        }
    }

    handleRemoveSelectedUser(user: TreeNode) {
        const index = this.selectedUsers.findIndex(u => u.id === user.id)
        if (index > -1) {
            this.selectedUsers.splice(index, 1)
        }
        this.refreshCanSelectUserStatus()
    }

    handleClick() {
        //TODO:
    }

    handleClearSelectedUsers() {
        this.selectedUsers = []
        this.refreshCanSelectUserStatus()
    }

    // 清空选中的机构
    handleClearSelectedOrgs() {
        this.selectedOrgs = []
        this.refreshTreeNodeSelectedStatus()
    }

    refreshCanSelectUserStatus() {
        this.canSelecteUsers.forEach(user => {
            const isSelected = this.selectedUsers.findIndex(u => u.id === user.id) > -1
            user.checked = isSelected
        })
    }
    refreshTreeNodeSelectedStatus() {
        const tree: ElTree<any, any> = (this.tab.activeTabName === 'unit' ? this.$refs.tree : this.$refs.globaltree) as any
        tree.setCheckedKeys(this.selectedOrgs.map(org => org.id))
    }

    handleClickRemoveOrg(org: TreeNode) {
        const index = this.selectedOrgs.findIndex(o => o.id === org.id)
        if (index > -1) {
            this.selectedOrgs.splice(index, 1)
        }
        this.refreshTreeNodeSelectedStatus()
    }

    handleClickMask() {
        this.close()
    }

    handleClickClose() {
        this.close()
    }

    close() {
        this.$emit('update:visible', false)
        this.$emit('close')
    }

    keyupSubmit() {
        //TODO:
    }

    handleClickConfirm() {
        const users = this.selectedUsers
        const orgs = this.selectedOrgs
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
    getUserIcon(user) {
        return `${config.api.baseURI}/bua/avatar/getHeadPhoto?userUid=` + user.userUid
    }
    // 获取机构头像
    getOrgIcon(name) {
        let nameIcon = ''
        if (name.length > 2) {
            nameIcon = name.substring(0, 2)
        } else {
            nameIcon = name.substring(0, 1)
        }
        return nameIcon
    }

    convertOrgsToTreeNodeData(data: any[]) {
        if (!data) return []

        return data.map(org => {
            const node = this.convertOrgToTreeNode(org, !org.hasChildOrg)
            node.data = org
            return node
        })
    }

    convertOrgToTreeNode(org: any, leaf = false) {
        return <TreeNode>{
            id: org.orgCode,
            name: org.orgName,
            value: org.orgCode,
            type: 'org',
            leaf: leaf,
            checked: false,
            data: undefined,
            children: undefined
        }
    }

    log(d) {
        console.log(d)
    }
}

interface TreeNode {
    id: string
    name: string
    value: string
    type: 'org' | 'user'
    leaf: boolean
    checked: boolean
    data: any
    children: TreeNode[]
    [key: string]: any
}
</script>

<style lang="less">
.bv-choose-people {
    &_wrapper {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        text-align: left;
        line-height: 24px;
    }
    ul {
        padding: 0;
        margin: 0;
    }

    li {
        margin: 0;
    }
    position: absolute;
    left: 50%;
    top: 45%;
    //width: 660px;
    width: 60%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    overflow: hidden;

    &_mask {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    &_head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 17px 20px;
        font-size: 16px;
        background: #f2f2f2;
        border-bottom: 1px solid #c3c3c3;
    }
    &_close {
        color: #909399;
        cursor: pointer;
        &:hover {
            color: #4090e2;
        }
    }

    &_body {
        display: flex;
        height: 400px;
    }
    &_tree {
        width: 30%;
        min-width: 200px;
        .el-tabs {
            height: 100%;
            display: flex;
            flex-direction: column;
            .el-tabs__content {
                flex: 1;
            }
            .el-tab-pane {
                height: 100%;
            }
            .el-tabs__nav-wrap {
                padding-left: 20px;
            }
        }
    }

    &_treenav {
        height: 100%;
        display: flex;
        flex-direction: column;

        .el-tree {
            flex: 1;
            overflow: auto;
        }
        .el-tree-node__children {
            overflow: visible;
        }
    }

    &_search {
        padding: 10px;
        padding-top: 0;
    }
    &_search_button {
        margin-left: -57px;
        margin-top: 1px;
        padding-bottom: 9px;
        padding-top: 9px;
    }

    &_selectbox {
        height: 100%;
        display: flex;
        flex-direction: column;

        &_content {
            flex: 1;
            overflow: auto;
            padding: 5px 0;
            box-sizing: border-box;
        }
    }

    &_canselect {
        width: 50%;
        border: 0 solid #d8d8d8;
        padding: 16px;
        overflow: auto;
        border-width: 0 1px;

        &_clear {
            color: red;
            cursor: pointer;
        }
        &_title {
            overflow: hidden;
            &_primary {
                color: #409eff;
            }
            &_left {
                float: left;
            }
            &_right {
                float: right;
                .el-checkbox {
                    margin-right: 10px;
                    &:last-child {
                        margin-right: 0;
                    }
                }
                .el-checkbox__label {
                    padding-left: 5px;
                }
            }
        }
    }
    &_select_item {
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 10px;
        cursor: pointer;

        &_avatar {
            vertical-align: middle;
            display: inline-block;
            width: 30px;
            height: 30px;
            background: #409eff;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
            text-align: center;
            line-height: 30px;
            margin-right: 10px;
            img {
                height: 30px;
                width: 30px;
                border-radius: 50%;
            }

            &_close {
                display: none;
                font-size: large;
                margin-top: -2px;
            }
            &:hover &_close {
                display: inline-block;
            }

            &:hover &_name {
                display: none;
            }
        }
        &_name {
            display: inline-block;
            vertical-align: middle;
            b,
            i {
                display: block;
                font-style: normal;
                font-weight: normal;
            }
            i {
                font-size: 12px;
                margin-top: -5px;
                color: #999;
            }
        }
    }

    &_select {
        width: 50%;
        margin-left: -1px;
        padding: 16px;
        overflow-y: auto;
        position: relative;
        padding-left: 5px;
    }

    &_foot {
        text-align: right;
        padding: 10px 20px;
        background: #f2f2f2;
        border-top: 1px solid #c3c3c3;
    }
}

.bv-choose-people_select_item_checked {
    display: inline-block;
    margin-right: 20px;
    // margin-bottom: 10px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 12px;
    text-align: center;
    line-height: 30px;
    margin-right: 10px;
    position: relative;
    background-color: #1f64a3;
    color: #1f64a3;

    &:before,
    &:after {
        content: '';
        pointer-events: none;
        position: absolute;
        color: white;
        border: 1px solid;
        background-color: white;
    }

    &:before {
        width: 2px;
        height: 2px;
        left: 28%;
        top: 48%;
        transform: skew(0deg, 60deg);
        -ms-transform: skew(0deg, 60deg);
        -webkit-transform: skew(0deg, 60deg);
    }
    &:after {
        width: 8px;
        height: 2px;
        left: 41%;
        top: 43%;
        transform: skew(0deg, -60deg);
        -ms-transform: skew(0deg, -60deg);
        -webkit-transform: skew(0deg, -40deg);
    }
}
</style>
