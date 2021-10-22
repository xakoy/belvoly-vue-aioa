<template>
    <div class="bv-choose-people_wrapper" v-show="visible">
        <div class="bv-choose-people_mask" @click="handleClickMask"></div>
        <div class="bv-choose-people">
            <div class="bv-choose-people_head">
                <div>{{ title }}</div>
                <div class="bv-choose-people_close fc fc-close" @click="handleClickClose"></div>
            </div>
            <div class="bv-choose-people_view">
                <div class="bv-choose-people_view__header">
                    <slot name="header"></slot>
                </div>
                <div class="bv-choose-people_body">
                    <div class="bv-choose-people_tree">
                        <el-tabs v-model="tab.activeTabName" @tab-click="tabClickHandler">
                            <el-tab-pane label="本单位" name="unit">
                                <div class="bv-choose-people_treenav">
                                    <div class="bv-choose-people_search">
                                        <el-input size="small" v-model="searchText" @keyup.enter.native="searchUnitUserHandler" placeholder="用户名称\账号">
                                            <template v-slot:append>
                                                <el-button title="查询用户" class="bv-choose-people_search_button" @click="searchUnitUserHandler">
                                                    <i class="fc fc-search"></i>
                                                </el-button>
                                            </template>
                                        </el-input>
                                    </div>

                                    <el-tree
                                        v-loading="unitOrgsLoading"
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
                                    <div class="bv-choose-people_search">
                                        <el-input size="small" v-model="searchText" @keyup.enter.native="searchGlobalUserHandler" placeholder="用户名称\账号">
                                            <template v-slot:append>
                                                <el-button title="查询用户" class="bv-choose-people_search_button" @click="searchGlobalUserHandler">
                                                    <i class="fc fc-search"></i>
                                                </el-button>
                                            </template>
                                        </el-input>
                                    </div>
                                    <el-tree
                                        v-loading="globalOrgsLoading"
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
                            <el-tab-pane v-for="(tab, index) in tabs" :name="'tab_' + tab.code" :label="tab.label" :key="index">
                                <div class="bv-choose-people_treenav">
                                    <div class="bv-choose-people_search" v-show="tab.isShowSearch">
                                        <el-input size="small" v-model.trim="tab.searchText" @keyup.enter.native="searchTabHandler(tab)" :placeholder="tab.placeholder">
                                            <template v-slot:append>
                                                <el-button title="查询" class="bv-choose-people_search_button" @click="searchTabHandler(tab)">
                                                    <i class="fc fc-search"></i>
                                                </el-button>
                                            </template>
                                        </el-input>
                                    </div>
                                    <el-tree
                                        v-loading="tab.loading"
                                        :ref="'tab_' + tab.code"
                                        :show-checkbox="false"
                                        node-key="id"
                                        :expand-on-click-node="false"
                                        :props="{
                                            label: 'name',
                                            children: 'zones',
                                            isLeaf: 'leaf'
                                        }"
                                        lazy
                                        :default-expanded-keys="tab.defaultExpandedKeys"
                                        :check-strictly="true"
                                        :load="loadTab(tab)"
                                        @node-click="handleTabTreeNodeClick(tab, ...$event)"
                                        @check-change="handleTabTreeNodeCheckChange(tab)"
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
                    <div key="notcustomtab" v-show="!isCustomTab" class="bv-choose-people_canselect" v-loading="getUserLoading">
                        <div class="bv-choose-people_canselect_title">
                            <span class="bv-choose-people_canselect_title_left bv-choose-people_canselect_title_primary">{{ currentSelectOrg ? currentSelectOrg.orgName : '' }}</span>
                            <span class="bv-choose-people_canselect_title_right">
                                <el-checkbox @change="showDepartmentClick" v-if="currentSelectOrg" v-model="showDepartmentalUsers">显示子部门用户</el-checkbox>
                                <el-checkbox @change="checkAllChangeHandler" v-model="checkAll" v-if="currentSelectOrg" :disabled="checkAllDisabled">全选</el-checkbox>
                            </span>
                        </div>
                        <div>
                            <ul class="bv-choose-people_canselect_list">
                                <li class="bv-choose-people_select_item" v-for="(item, index) in canSelecteUsers" :key="index" @click="handleSelectUser(item, $event)">
                                    <span :class="{ 'bv-choose-people_select_item_avatar': !item.checked, 'bv-choose-people_select_item_checked': item.checked }">
                                        <span v-show="item.checked">.</span>
                                        <img v-show="!item.checked" :src="getUserIcon(item)" @error="avatarLoadError($event)" />
                                    </span>
                                    <span class="bv-choose-people_select_item_name">
                                        <b>{{ item.name }}</b>
                                        <i>{{ item.data.orgName }}</i>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div key="customtab" v-show="isCustomTab" class="bv-choose-people_canselect" v-loading="getTabDataItemLoading">
                        <div class="bv-choose-people_canselect_title">
                            <span class="bv-choose-people_canselect_title_left bv-choose-people_canselect_title_primary">{{
                                currentSelectTabDataItemCategory ? currentSelectTabDataItemCategory.name : ''
                            }}</span>
                            <span class="bv-choose-people_canselect_title_right">
                                <el-checkbox @change="checkAllTabDataItemAllChangeHandler" v-model="checkAllTabDataItem" v-if="currentSelectTabDataItemCategory" :disabled="checkAllTabDataItemDisabled"
                                    >全选</el-checkbox
                                >
                            </span>
                        </div>
                        <div>
                            <ul class="bv-choose-people_canselect_list">
                                <li class="bv-choose-people_select_item" v-for="(item, index) in canSelecteTabDataItems" :key="index" @click="handleSelectUser(item, $event)">
                                    <span :class="{ 'bv-choose-people_select_item_avatar': !item.checked, 'bv-choose-people_select_item_checked': item.checked }">
                                        <span v-show="item.checked">.</span>
                                        <img v-show="!item.checked" :src="getTabDataItemAvatar(item)" @error="avatarLoadError($event)" />
                                    </span>
                                    <span class="bv-choose-people_select_item_name">
                                        <b>{{ item.name }}</b>
                                        <i>{{ item.data.subName }}</i>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <template v-if="!isOnlyChooseUser">
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
                                                    <img :src="getSelectUserIcon(item)" @error="avatarLoadError($event)" />
                                                </span>
                                            </span>
                                            <span
                                                class="bv-choose-people_select_item_name"
                                                :class="{ 'bv-choose-people_select_item_name__nodescript': !(item.data && item.data.orgName) }"
                                                @click="handleClick(index)"
                                            >
                                                <b>{{ item.name }}</b>
                                                <i>{{ item.data ? item.data.orgName : '' }}</i>
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
                                            <span class="bv-choose-people_select_item_name bv-choose-people_select_item_name__nodescript" @click="handleClick(index)">
                                                <b>{{ item.name }}</b>
                                                <!-- <i>{{ item.orgName }}</i> -->
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="bv-choose-people_select">
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
                                                <span class="bv-choose-people_select_item_avatar_name">
                                                    <img :src="getSelectUserIcon(item)" @error="avatarLoadError($event)" />
                                                </span>
                                            </span>
                                            <span
                                                class="bv-choose-people_select_item_name"
                                                :class="{ 'bv-choose-people_select_item_name__nodescript': !(item.data && item.data.orgName) }"
                                                @click="handleClick(index)"
                                            >
                                                <b>{{ item.name }}</b>
                                                <i>{{ item.data ? item.data.orgName : '' }}</i>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="bv-choose-people_view__footer">
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { services, globalConfig, utils } from '@belvoly-vue-aioa/core'
import { ElTree } from 'element-ui/types/tree'
import { User } from '@belvoly-vue-aioa/core/services/userService'
import { ChooseItemNode, ChooseNode, Objective, ObjectiveDataType, PeopleDataFilterOfChoosePeopleOrOrg } from './types'

const { request } = utils

interface Tab {
    code: string
    label: string
    isShowSearch: boolean
    searchText: string
    placeholder: string
    loading: boolean
    objective: Objective
    defaultExpandedKeys: string[]
}

const { orgService, userService } = services

@Component
export default class New extends Vue {
    defaultAvatar =
        'data:image/png;base64,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'

    @Prop({ default: '选择人员' }) title: string
    @Prop({ default: 'multiple' }) selectionMode: string
    @Prop({ default: 'orgAndUser' }) mode: string
    @Prop() rootOrgCode: string
    @Prop({ default: false }) visible: boolean
    @Prop({ default: false }) isShowGlobal: boolean
    @Prop({}) defaultUsers: NameValue[]
    @Prop({}) defaultOrgs: NameValue[]
    @Prop() beforeClose: Function
    @Prop({
        default: function() {
            return []
        }
    })
    objects: Objective[]

    /**
     * 用户过滤器
     */
    @Prop({ type: Function }) peopleDataFilter: PeopleDataFilterOfChoosePeopleOrOrg

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
    selectedUsers: TreeNode[] = []
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

    /**
     * 获取用户的loading开关
     */
    getUserLoading = false

    /**
     * 全选
     */
    checkAll = false

    get config() {
        return {
            api: {
                baseURI: globalConfig.apiHost
            }
        }
    }

    get isShowCheckBox() {
        return !this.isOnlyChooseUser
    }

    get isOnlyChooseUser() {
        return this.mode !== 'orgAndUser'
    }

    get isSingleMode() {
        return this.selectionMode === 'single'
    }

    get selectNumber() {
        return this.selectedUsers.length
    }

    get selectNumberOrg() {
        return this.selectedOrgs.length
    }

    get checkAllDisabled() {
        return this.canSelecteUsers.length <= 0 || this.isSingleMode
    }

    created() {
        this.loadTabs()
    }

    mounted() {
        if (this.defaultUsers) {
            this.selectedUsers.push(...this.defaultUsers.map(u => this.convertToTreeNode(u, 'user')))
        }
        if (this.defaultOrgs) {
            this.selectedOrgs.push(...this.defaultOrgs.map(o => this.convertToTreeNode(o, 'org')))
        }
        document.body.appendChild(this.$el)
    }

    destroyed() {
        if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el)
        }
    }

    unitOrgsLoading = true
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
        this.unitOrgsLoading = false
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

    globalOrgsLoading = true

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
        this.globalOrgsLoading = false
    }

    isCustomTab = false
    tabClickHandler(tab) {
        this.tab.activeTabName = tab.name
        this.isCustomTab = this.tab.activeTabName.startsWith('tab_')
        this.currentSelectOrg = null
        this.currentSelectTabDataItemCategory = null
        this.canSelecteUsers = []
        this.canSelecteTabDataItems = []
        this.refreshTreeNodeSelectedStatus()
    }

    async searchUnitUserHandler() {
        await this.searchUser(this.searchText, this.rootOrgCode)
    }

    async searchGlobalUserHandler() {
        await this.searchUser(this.searchText)
    }

    getUsersAbortDelegate = null

    async searchUser(text: string, parentCode?: string) {
        this.cancelGetUserAbortDelegate()

        this.currentSelectOrg = null
        this.getUserLoading = true
        const res = await userService.searchUsersVariant(text, text, parentCode)
        const { abort, promise } = res
        this.getUsersAbortDelegate = abort
        const { data, isCancel } = await promise
        if (!isCancel) {
            this.getUserLoading = false
        }
        this.setChooseUser(data)
    }

    async handleTreeNodeClick(data: TreeNode) {
        this.checkAll = false

        this.currentSelectOrg = data.data
        this.queryUser(this.currentSelectOrg.orgCode, this.showDepartmentalUsers)
    }

    async queryUser(orgCode: string, isQueryAllChild: boolean) {
        this.cancelGetUserAbortDelegate()

        if (isQueryAllChild) {
            await this.queryAllUsersByOrgCode(orgCode)
        } else {
            await this.queryUserByOrgCode(orgCode)
        }
    }

    handleTreeNodeCheckChange(data: TreeNode, checked) {
        if (this.isSingleMode) {
            if (checked === true) {
                this.selectedOrgs = [data]
                const tree = this.getCurrentTree()
                tree.setCheckedKeys([data.id])
            } else {
                const index = this.selectedOrgs.findIndex(item => item.id === data.id)
                if (index > -1) {
                    this.selectedOrgs.splice(index, 1)
                }
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

    cancelGetUserAbortDelegate() {
        if (this.getUsersAbortDelegate) {
            this.getUsersAbortDelegate()
            this.getUsersAbortDelegate = null
        }
    }

    // 查询机构下的用户
    async queryUserByOrgCode(orgCode) {
        this.cancelGetUserAbortDelegate()
        this.getUserLoading = true
        const { abort, promise } = await userService.queryByOrgCodeVariant(orgCode)
        this.getUsersAbortDelegate = abort
        const { data, isCancel } = await promise
        if (!isCancel) {
            this.getUserLoading = false
        }
        this.setChooseUser(data)
    }
    // 查询机构下穿透的用户集合
    async queryAllUsersByOrgCode(orgCode) {
        this.cancelGetUserAbortDelegate()
        this.getUserLoading = true
        const { abort, promise } = await userService.queryByOrgCodeAllUsersVariant(orgCode)
        this.getUsersAbortDelegate = abort
        const { data, isCancel } = await promise
        if (!isCancel) {
            this.getUserLoading = false
        }
        this.setChooseUser(data)
    }

    setChooseUser(users: User[]) {
        let data: User[]
        if (this.peopleDataFilter) {
            data = this.peopleDataFilter(users)
        } else {
            data = users
        }
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
        this.queryUser(this.currentSelectOrg.orgCode, this.showDepartmentalUsers)
    }

    checkAllChangeHandler(isCheckAll) {
        if (isCheckAll) {
            this.canSelecteUsers.forEach(item => {
                this.handleSelectUser(item)
            })
        } else {
            this.canSelecteUsers.forEach(item => {
                this.handleRemoveSelectedUser(item)
            })
        }
    }

    handleSelectUser(user: TreeNode) {
        if (!user.checked) {
            user.checked = true
            if (this.isSingleMode) {
                this.selectedUsers = []
                this.canSelecteUsers
                    .filter(u => u.checked && u !== user)
                    .forEach(u => {
                        u.checked = false
                    })
            }
            this.selectedUsers.push(user)
        }
    }

    handleRemoveSelectedUser(user: TreeNode) {
        const index = this.selectedUsers.findIndex(u => u.id === user.id)
        if (index > -1) {
            this.selectedUsers.splice(index, 1)
        }
        this.refreshCanSelectUserStatus()
        this.refreshCanSelectDataItemsStatus()
    }

    handleClick() {
        //TODO:
    }

    handleClearSelectedUsers() {
        this.checkAll = false
        this.checkAllTabDataItem = false
        this.selectedUsers = []
        this.refreshCanSelectUserStatus()
        this.refreshCanSelectDataItemsStatus()
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

    getCurrentTree() {
        const tree: ElTree<any, any> = (this.tab.activeTabName === 'unit' ? this.$refs.tree : this.$refs.globaltree) as any
        return tree
    }

    refreshTreeNodeSelectedStatus() {
        const tree = this.getCurrentTree()
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

    close(action: 'ok' | 'cancel' = 'cancel') {
        if (this.beforeClose) {
            this.beforeClose(this.internalClose, action)
            return
        }
        this.internalClose()
    }

    internalClose() {
        this.$emit('update:visible', false)
        this.$emit('close')
    }

    keyupSubmit() {
        //TODO:
    }

    @Watch('selectedOrgs')
    watchSelectOrgs() {
        this.$emit('selectedOrgChange', this.selectedOrgs)
        this.$emit('selectedChange', { users: this.selectedUsers, orgs: this.selectedOrgs })
    }

    @Watch('selectedUsers')
    watchSelectUsers() {
        this.$emit('selectedUserChange', this.selectedUsers)
        this.$emit('selectedChange', { users: this.selectedUsers, orgs: this.selectedOrgs })
    }

    handleClickConfirm() {
        const users = this.selectedUsers.map(u => this.convertToNameValue(u))
        const orgs = this.selectedOrgs.map(o => this.convertToNameValue(o))
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
        this.close('ok')
    }
    getUserIcon(user) {
        return `${this.config.api.baseURI}/bua/avatar/getHeadPhoto?userUid=` + user.value
    }

    getSelectUserIcon(user: TreeNode) {
        if (user.data && user.data.avatar !== null && user.data.avatar !== undefined) {
            return user.data.avatar || this.defaultAvatar
        }
        return `${this.config.api.baseURI}/bua/avatar/getHeadPhoto?userUid=` + user.value
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
            data: org,
            children: undefined
        }
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

    //#region 自定义tab栏
    currentSelectTabDataItemCategory: TreeNode = null
    getTabDataItemLoading = false
    checkAllTabDataItem = false
    // checkAllTabDataItemDisabled = false
    get checkAllTabDataItemDisabled() {
        return this.canSelecteTabDataItems.length <= 0 || this.isSingleMode
    }
    canSelecteTabDataItems: TreeNode[] = []
    tabs: Tab[] = []

    loadTabs() {
        this.tabs = this.objects.map(obj => {
            return {
                code: obj.code,
                label: obj.title,
                isShowSearch: !!obj.getSearchUrl,
                searchText: '',
                placeholder: obj.searchPlaceholder,
                loading: false,
                objective: obj,
                defaultExpandedKeys: []
            }
        })
    }

    async searchTabHandler(tab: Tab) {
        if (!tab.searchText) {
            return
        }
        const url = tab.objective.getSearchUrl(tab.objective.config, tab.searchText)
        if (!url) {
            return
        }
        this.getTabDataItemLoading = true
        const sdata = await this.queryTabData(tab, '', 'search', url, true)
        this.getTabDataItemLoading = false
        const data: TreeNode<ChooseItemNode>[] = this.convertTabDataItemsToTreeNodeData(sdata, tab) as any
        this.changeTabDataItems(data)
    }

    loadTab(tab: Tab) {
        return async (node, resolve) => {
            if (node.level === 0) {
                const { data } = await this.queryRemoteData(tab, '')
                if (data) {
                    if (data.length > 0) {
                        tab.defaultExpandedKeys = [data[0].id]
                    }
                    resolve(data)
                }
            } else if (node.data.rawData.hasChildNodesData) {
                resolve(node.data.children)
            } else {
                const { data } = await this.queryRemoteData(tab, node.data.value)
                if (data) {
                    resolve(data)
                }
            }
            tab.loading = false
        }
    }

    async handleTabTreeNodeClick(tab, nodeData: TreeNode) {
        this.checkAllTabDataItem = false

        this.currentSelectTabDataItemCategory = nodeData
        this.getTabDataItemLoading = true
        const { data } = await this.queryTabDataItems(this.currentSelectTabDataItemCategory.value, tab)
        this.getTabDataItemLoading = false
        this.changeTabDataItems(data)
    }

    changeTabDataItems(data: TreeNode<ChooseItemNode>[]) {
        if (!data) {
            this.canSelecteTabDataItems = []
        } else {
            this.canSelecteTabDataItems = data.map(item => {
                const isSelected = this.selectedUsers.findIndex(u => u.id === item.value) > -1
                const userNode = <TreeNode>{
                    id: item.id,
                    name: item.name,
                    value: item.value,
                    type: 'user',
                    checked: isSelected,
                    data: {
                        avatar: item.rawData.avatar,
                        subName: item.rawData.subName,
                        ...(item.data || {})
                    }
                }
                return userNode
            })
        }
    }

    handleTabTreeNodeCheckChange(tab) {
        //
    }

    checkAllTabDataItemAllChangeHandler(isCheckAll) {
        if (isCheckAll) {
            this.canSelecteTabDataItems.forEach(item => {
                this.handleSelectUser(item)
            })
        } else {
            this.canSelecteTabDataItems.forEach(item => {
                this.handleRemoveSelectedUser(item)
            })
        }
    }

    refreshCanSelectDataItemsStatus() {
        this.canSelecteTabDataItems.forEach(item => {
            const isSelected = this.selectedUsers.findIndex(u => u.id === item.id) > -1
            item.checked = isSelected
        })
    }

    async queryTabDataItems(category: string, tab: Tab) {
        const sdata = await this.queryTabData(tab, category, 'item', '', true)

        const data: TreeNode<ChooseItemNode>[] = this.convertTabDataItemsToTreeNodeData(sdata, tab) as any

        return {
            data
        }
    }

    tabRequestAbortDelegate = null

    async queryTabData(tab: Tab, code: string, dataType: ObjectiveDataType, url = '', isCanAbort = false) {
        if (this.tabRequestAbortDelegate) {
            this.tabRequestAbortDelegate()
        }
        const objective = tab.objective
        const uri = url || (objective.getUrl ? objective.getUrl(objective.config, objective.url, code, dataType) : objective.url)

        const res = await request.requestVariant<any>(
            uri,
            { method: 'GET' },
            {
                isSuccess: response => {
                    return response.status === 200
                },
                getData: response => response.data
            }
        )

        const { abort, promise } = res
        if (isCanAbort) {
            this.tabRequestAbortDelegate = abort
        }

        const result = await promise

        if (!result.success) {
            return []
        }
        const rawData = result.data

        let rdata: ChooseNode[] = []

        if (objective.dataConvert) {
            rdata = objective.dataConvert(rawData, dataType)
        } else {
            rdata = rawData.data
        }

        let data: ChooseNode[] = []
        if (objective.dataFilter) {
            data = rdata.map(item => objective.dataFilter(item, objective.config, objective, { selectionMode: this.selectionMode }, dataType))
        }
        return data
    }

    async queryRemoteData(tab: Tab, code: string) {
        let data = await this.queryTabData(tab, code, 'category')

        data = this.convertTabDataCategoriesToTreeNodeData(data, tab)

        return {
            data
        }
    }

    getTabDataItemAvatar(item: ChooseItemNode) {
        return item.data.avatar || this.defaultAvatar
    }

    convertTabDataCategoriesToTreeNodeData(data: ChooseNode[], tab: Tab) {
        if (!data) return []

        return data.map(item => {
            const node = this.convertTabDataCategoryToTreeNode(item, !item.isParent, tab)
            return node
        })
    }

    convertTabDataCategoryToTreeNode(item: ChooseNode, leaf = false, tab: Tab) {
        return <TreeNode>{
            id: item.id,
            name: item.text || item.name,
            value: item.value,
            type: 'category_' + tab.code,
            leaf: leaf,
            checked: false,
            data: item.data,
            rawData: item,
            children: item.hasChildNodesData && item.nodes ? item.nodes.map(n => this.convertTabDataCategoryToTreeNode(n, !n.isParent, tab)) : null
        }
    }

    convertTabDataItemsToTreeNodeData(data: ChooseNode[], tab: Tab): TreeNode[] {
        if (!data) return []

        return data.map(item => {
            const node = this.convertTabDataItemToTreeNode(item, !item.isParent, tab)
            return node
        })
    }

    convertTabDataItemToTreeNode(item: ChooseNode, leaf = false, tab: Tab) {
        return <TreeNode>{
            id: item.id,
            name: item.text || item.name,
            value: item.value,
            type: 'item_' + tab.code,
            leaf: leaf,
            checked: false,
            data: item.data,
            rawData: item,
            children: item.isParent && item.nodes ? item.nodes.map(n => this.convertTabDataItemToTreeNode(n, !n.isParent, tab)) : null
        }
    }
    //#endregion

    avatarLoadError(e: Event) {
        const el = e.target as HTMLImageElement
        el.src = this.defaultAvatar
    }
}

type TreeNodeType = 'org' | 'user'

interface TreeNode<T = {}> {
    id: string
    name: string
    value: string
    type: TreeNodeType
    leaf: boolean
    checked: boolean
    data: any
    children: TreeNode[]
    rawData: T
    [key: string]: any
}

interface NameValue {
    name: string
    value: string
    data?: any
}
</script>

<style lang="less">
.bv-choose-people {
    font-size: 14px;
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
    // min-width: 700px;
    width: 900px;
    // width: 60%;
    max-width: 90%;
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
        flex: 1;
        overflow: hidden;
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

        .el-tree__empty-block {
            display: none;
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
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        padding: 8px;
        display: flex;
        flex-direction: column;

        &_content {
            flex: 1;
            overflow: auto;
            padding: 5px 0;
            box-sizing: border-box;

            > ul {
                display: flex;
                flex-wrap: wrap;
                // .bv-choose-people_select_item {
                //     width: 100%;
                // }
            }
        }
    }

    &_canselect {
        width: 35%;
        border: 0 solid #d8d8d8;
        padding: 8px;
        overflow: auto;
        border-width: 0 1px;
        box-sizing: border-box;

        &_clear {
            color: #e65454;
            cursor: pointer;
        }
        &_title {
            overflow: hidden;
            padding-bottom: 15px;
            &_left {
                color: #999;
                float: left;
            }
            &_primary {
                color: #409eff;
            }
            &_right {
                color: #999;
                float: right;

                .el-checkbox {
                    margin-right: 10px;
                    color: #999;
                    font-weight: normal;
                    &:last-child {
                        margin-right: 0;
                    }
                }
                .el-checkbox__label {
                    padding-left: 5px;
                }
            }
        }

        &_list {
            display: flex;
            flex-wrap: wrap;
        }
    }
    &_select_item {
        display: flex;
        // margin-right: 20px;
        margin-bottom: 20px !important;
        width: 50%;
        cursor: pointer;

        &_avatar {
            vertical-align: middle;
            width: 36px;
            height: 36px;
            background: #409eff;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
            text-align: center;
            line-height: 36px;
            margin-right: 10px;
            margin-top: 2px;
            img {
                height: 100%;
                width: 100%;
                border-radius: 50%;
            }

            &_close {
                display: none;
                font-size: large;
                margin-top: -2px;
                width: 100%;
                height: 100%;
            }
            &:hover &_close {
                display: inline-block;
            }

            &:hover &_name {
                display: none;
            }
        }
        &_name {
            flex: 1;
            overflow: hidden;
            vertical-align: middle;
            line-height: 1;
            padding: 5px 0;
            b,
            i {
                display: block;
                font-style: normal;
                font-weight: normal;
            }
            b {
                color: #333;
                font-size: 14px;
            }
            i {
                padding-top: 5px;
                font-size: 12px;
                color: #999;
            }

            &__nodescript {
                b {
                    margin-top: 7px;
                }
                i {
                    display: none;
                }
            }
        }
    }

    &_select {
        margin-left: -1px;
        overflow-y: auto;
        position: relative;
        padding-left: 5px;
        box-sizing: border-box;
        width: 35%;
    }

    &_foot {
        text-align: right;
        padding: 10px 20px;
        background: #f2f2f2;
        border-top: 1px solid #c3c3c3;
    }
}

.bv-choose-people_select_item_checked {
    vertical-align: middle;
    width: 36px;
    height: 36px;
    margin-right: 20px;
    cursor: pointer;
    border-radius: 50%;
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    margin-right: 10px;
    margin-top: 2px;
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
