<template>
    <div class="alert" v-show="visible">
        <div class="alert_mask" @click="handleClickMask"></div>
        <div class="alert_con">
            <div class="alert_head">
                <div>{{ title }}</div>
                <div class="alert_close fc fc-close" @click="handleClickClose"></div>
            </div>
            <div class="alert-view">
                <div>
                    <slot name="header"></slot>
                </div>
                <div class="alert_body">
                    <div class="alert_tree tree-color">
                        <el-tabs v-model="tab.activeTabName" @tab-click="tabClickHandler">
                            <el-tab-pane label="本单位" name="unit">
                                <el-row style="width:100%">
                                    <el-col :span="23">
                                        <input v-model="searchText" class="serchIcon" @keyup.enter="keyupSubmit(event)" placeholder="用户名称\账号" />
                                    </el-col>
                                    <el-col :span="1">
                                        <el-button title="查询用户" class="serchButtonAndText" @click="searchUnitUserHandler">
                                            <i class="fc fc-search"></i>
                                        </el-button>
                                    </el-col>
                                </el-row>

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
                            </el-tab-pane>
                            <el-tab-pane label="全局" name="gloabl" v-if="isShowGlobal">
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
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="alert_to_be_select">
                        <div class="alert_select_title">
                            <span class="alert_select_left name">{{ currentSelectOrg ? currentSelectOrg.orgName : '' }}</span>
                            <span class="alert_select_right checkbox-color">
                                <el-checkbox @change="showDepartmentClick" v-model="showDepartmentalUsers">显示子部门用户</el-checkbox>
                                <!-- <el-checkbox v-model="checkAll" :disabled="checkAllDisabled">全选</el-checkbox> -->
                            </span>
                        </div>
                        <div class="alert_select_peoples" style="overflow: auto;">
                            <ul class="alert_select_list">
                                <li v-for="(item, index) in canSelecteUsers" :key="index" @click="handleSelectUser(item, $event)">
                                    <span :class="{ alert_select_icon: !item.checked, 'myicon-tick-checked': item.checked }" :style="{ color: item.checked ? '#1f64a3' : '' }">
                                        <span v-show="item.checked">.</span>
                                        <img v-show="!item.checked" :src="getUserIcon(item.data)" class="myAvatar" />
                                    </span>
                                    <span class="alert_select_name">
                                        <b>{{ item.name }}</b>
                                        <i>{{ item.data.orgName }}</i>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <template v-if="mode === 'orgAndUser'">
                        <div class="alert_select" style="padding-left: 5px;">
                            <div style="height:50%;">
                                <div class="alert_select_title">
                                    <span class="alert_select_left">
                                        已选用户：
                                        <span class="alert_selected_number">{{ selectNumber }} 名</span>
                                    </span>
                                    <span class="alert_select_right" style="padding-right: 10px;">
                                        <span class="alert_clear" @click="handleClearSelectedUsers">清空</span>
                                    </span>
                                </div>
                                <div style=" height:88%;  padding-top: 3px; overflow: auto;">
                                    <ul class="alert_select_list">
                                        <li v-for="(item, index) in selectedUsers" :key="index">
                                            <span class="alert_select_icon">
                                                <span class="close_icon" @click="handleRemoveSelectedUser(item, index)" title="删除" style="font-size:large;margin-top: -2px;">x</span>
                                                <span class="name_icon">
                                                    <img :src="getUserIcon(item.data)" class="myAvatar" />
                                                </span>
                                            </span>
                                            <span class="alert_select_name" @click="handleClick(index)">
                                                <b>{{ item.name }}</b>
                                                <i>{{ item.orgName }}</i>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div style="height:50%;">
                                <div class="alert_select_title">
                                    <span class="alert_select_left">
                                        已选机构：
                                        <span class="alert_selected_number">{{ selectNumberOrg }} 个</span>
                                    </span>
                                    <span class="alert_select_right" style="padding-right: 10px;">
                                        <span class="alert_clear" @click="handleClearSelectedOrgs">清空</span>
                                    </span>
                                </div>
                                <div style=" height:88%;  padding-top: 3px; overflow: auto;">
                                    <ul class="alert_select_list">
                                        <li v-for="(item, index) in selectedOrgs" :key="index">
                                            <span class="alert_select_icon">
                                                <span class="close_icon" @click="handleClickRemoveOrg(item, index)" title="删除" style="font-size:large;margin-top: -2px;">x</span>
                                                <span class="name_icon">{{ getOrgIcon(item.name) }}</span>
                                            </span>
                                            <span class="alert_select_name" @click="handleClick(index)">
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
                        <div class="alert_select" style="padding-left: 5px;">
                            <div class="alert_select_title">
                                <span class="alert_select_left">
                                    已选用户：
                                    <span class="alert_selected_number">{{ selectNumber }} 名</span>
                                </span>
                                <span class="alert_select_right" style="padding-right: 10px;">
                                    <span class="alert_clear" @click="handleClearSelectedUsers">清空</span>
                                </span>
                            </div>
                            <div style="padding-top: 3px;">
                                <ul class="alert_select_list">
                                    <li v-for="(item, index) in selectedUsers" :key="index">
                                        <span class="alert_select_icon">
                                            <span class="close_icon" @click="handleRemoveSelectedUser(item, index)" title="删除" style="font-size:large;margin-top: -2px;">x</span>
                                            <span class="name_icon">
                                                <img :src="getUserIcon(item.data)" class="myAvatar" />
                                            </span>
                                        </span>
                                        <span class="alert_select_name" @click="handleClick(index)">
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
            <div class="alert_foot">
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
.alert {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 20;
    text-align: left;
    //   display: none;

    ul {
        line-height: 24px;
        padding: 0;
        margin: 0;
    }

    li {
        margin: 0;
    }
}

.alert .alert_mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
.alert .alert_con {
    position: absolute;
    left: 50%;
    top: 45%;
    //width: 660px;
    width: 60%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    overflow: hidden;
}
.alert .alert_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 17px 20px;
    font-size: 16px;
    background: #f2f2f2;
    border-bottom: 1px solid #c3c3c3;
}
.alert .alert_close {
    color: #909399;
    cursor: pointer;
}
.alert .alert_close:hover {
    color: #4090e2;
}
.alert-view .alert_body {
    display: flex;
    height: 400px;
}
.alert .alert_tree {
    width: 30%;
    padding: 16px;
    overflow-y: auto;
}
.alert .alert_select {
    width: 50%;
    margin-left: -1px;
    padding: 16px;
    overflow-y: auto;
    position: relative;
}

.alert .alert_bind {
    position: absolute;
    right: 0;
    top: 50%;
    width: 44px;
    transform: translateY(-50%);
}
.alert .alert_foot {
    text-align: right;
    padding: 10px 20px;
    background: #f2f2f2;
    border-top: 1px solid #c3c3c3;
}

.alert .m-icon {
    background: #ccc;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    font-size: 22px;
}
.alert_to_be_select {
    width: 50%;
    border: 0 solid #d8d8d8;
    margin: 0 10px;
    padding: 16px;
    overflow: auto;
    border-width: 0 1px;
}
.alert_select {
    &_title {
        overflow: hidden;
    }
    &_left {
        &.name {
            color: #409eff;
        }
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

/**绿色勾*/
.myicon-tick-checked {
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
}

.myicon-tick-checked:before,
.myicon-tick-checked:after {
    content: '';
    pointer-events: none;
    position: absolute;
    color: white;
    border: 1px solid;
    background-color: white;
}

.myicon-tick-checked:before {
    width: 2px;
    height: 2px;
    left: 28%;
    top: 48%;
    transform: skew(0deg, 60deg);
    -ms-transform: skew(0deg, 60deg);
    -webkit-transform: skew(0deg, 60deg);
}

.myicon-tick-checked:after {
    width: 8px;
    height: 2px;
    left: 41%;
    top: 43%;
    transform: skew(0deg, -60deg);
    -ms-transform: skew(0deg, -60deg);
    -webkit-transform: skew(0deg, -40deg);
}

.myAvatar {
    height: 30px;
    width: 30px;
    border-radius: 50%;
}

.serchButtonAndText {
    margin-left: -57px;
    margin-top: 1px;
    padding-bottom: 9px;
    padding-top: 9px;
}

.serchIcon {
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
    // background-image: url("~@/assets/img/searchicon.png");
    background-position: 10px 7px;
    background-repeat: no-repeat;
    padding: 7px 57px 7px 7px;
}

.alert_select_list {
    li {
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 10px;
        cursor: pointer;
        .alert_select_icon {
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
            .close_icon {
                display: none;
            }

            &:hover {
                .close_icon {
                    display: inline-block;
                }
                .name_icon {
                    display: none;
                }
            }
        }
        .alert_select_name {
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
}
.alert_clear {
    color: red;
    cursor: pointer;
}
.alert_selected_number {
    color: #409eff;
}
</style>
