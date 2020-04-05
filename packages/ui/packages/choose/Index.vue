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
                    <div class="alert_tree tree-color" id="alert_tree">
                        <el-row style="width:100%">
                            <el-col :span="23">
                                <input v-model="selectUser" class="serchIcon" @keyup.enter="keyupSubmit(event)" placeholder="用户名称\账号" />
                            </el-col>
                            <el-col :span="1">
                                <el-button title="查询用户" class="serchButtonAndText" @click="buttonSearch(event)">
                                    <i class="fc fc-search"></i>
                                </el-button>
                            </el-col>
                        </el-row>

                        <el-tree
                            ref="tree"
                            :show-checkbox="isShowCheckBox"
                            node-key="id"
                            :props="props"
                            lazy
                            :default-expanded-keys="defaultExpandedKeys"
                            :check-strictly="strictly"
                            :load="loadNode"
                            @node-click="handleNodeClick"
                            @check-change="handleCheckChange"
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
                    <div class="alert_to_be_select">
                        <div class="alert_select_title">
                            <span class="alert_select_left name">{{ toBeSelectOrgName }}</span>
                            <span class="alert_select_right checkbox-color">
                                <el-checkbox @change="showDepartmentClick" v-model="showDepartmentalUsers">显示子部门用户</el-checkbox>
                                <el-checkbox v-model="checkAll" :disabled="checkAllDisabled">全选</el-checkbox>
                            </span>
                        </div>
                        <div class="alert_select_peoples" style="overflow: auto;">
                            <ul class="alert_select_list">
                                <li v-for="(item, index) in toBeSelect" :key="index" @click="handleSelect(item, $event)">
                                    <template v-if="item.checked === true">
                                        <span :id="item.type + '_' + item.value" class="myicon-tick-checked" style="color:#1f64a3">
                                            <span style>.</span>
                                            <img :src="getNameIcon(item.value)" style="display:none;" class="myAvatar" />
                                        </span>
                                    </template>
                                    <template v-else>
                                        <span :id="item.type + '_' + item.value" class="alert_select_icon">
                                            <span style="display:none;">.</span>
                                            <img :src="getNameIcon(item.value)" class="myAvatar" />
                                        </span>
                                    </template>
                                    <span class="alert_select_name">
                                        <b>{{ item.name }}</b>
                                        <i>{{ item.orgName }}</i>
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
                                        <span class="alert_clear" @click="handleClickClear">清空</span>
                                    </span>
                                </div>
                                <div style=" height:88%;  padding-top: 3px; overflow: auto;">
                                    <ul class="alert_select_list">
                                        <li v-for="(item, index) in selectedObjects" :key="index">
                                            <span class="alert_select_icon">
                                                <span class="close_icon" @click="handleClickRemove(item, index)" title="删除" style="font-size:large;margin-top: -2px;">x</span>
                                                <span class="name_icon">
                                                    <img :src="getNameIcon(item.value)" class="myAvatar" />
                                                </span>
                                            </span>
                                            <span class="alert_select_name" @click="handleClick(index)" :class="currentIndex === index ? 'currentSelect' : ''">
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
                                        <span class="alert_clear" @click="handleClickClearOrg">清空</span>
                                    </span>
                                </div>
                                <div style=" height:88%;  padding-top: 3px; overflow: auto;">
                                    <ul class="alert_select_list">
                                        <li v-for="(item, index) in selectedObjectsOrg" :key="index">
                                            <span class="alert_select_icon">
                                                <span class="close_icon" @click="handleClickRemoveOrg(item, index)" title="删除" style="font-size:large;margin-top: -2px;">x</span>
                                                <span class="name_icon">{{ getNameIconOrg(item.name) }}</span>
                                            </span>
                                            <span class="alert_select_name" @click="handleClick(index)" :class="currentIndex === index ? 'currentSelect' : ''">
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
                                    <span class="alert_clear" @click="handleClickClear">清空</span>
                                </span>
                            </div>
                            <div style="padding-top: 3px;">
                                <ul class="alert_select_list">
                                    <li v-for="(item, index) in selectedObjects" :key="index">
                                        <span class="alert_select_icon">
                                            <span class="close_icon" @click="handleClickRemove(item, index)" title="删除" style="font-size:large;margin-top: -2px;">x</span>
                                            <span class="name_icon">
                                                <img :src="getNameIcon(item.value)" class="myAvatar" />
                                            </span>
                                        </span>
                                        <span class="alert_select_name" @click="handleClick(index)" :class="currentIndex === index ? 'currentSelect' : ''">
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

<script>
import { services } from '@belvoly-vue-aioa/core'
const { orgService, userService } = services

export default {
    name: 'OApicker',
    props: {
        title: {
            type: String,
            default: '选择人员'
        },
        selectionMode: {
            type: String,
            default: 'multiple' // single、multiple
        },
        mode: {
            type: String,
            default: 'orgAndUser' // user、orgAndUser
        },
        rootOrgCode: {
            type: String,
            default: ''
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentIndex: null,
            props: {
                label: 'name',
                children: 'zones',
                isLeaf: 'leaf'
            },
            showDepartmentalUsers: false,
            checkAll: false,
            strictly: true,
            selectedObjects: [],
            selectedObjectsOrg: [],
            selectedObjectsReturn: '',
            selectedObjectsOrgReturn: '',
            toBeSelect: [],
            toBeSelectOrgName: '',
            toBeSelectOrgCode: '',
            toBeSelectOrgs: [],
            selectUser: '',
            defaultUserValues: [],
            defaultOrgValues: [],
            defaultExpandedKeys: [],
            defaultExpandedKeysId: '',
            editCheckId: ''
        }
    },
    computed: {
        selectNumber() {
            return this.selectedObjects.length
        },
        selectNumberOrg() {
            return this.selectedObjectsOrg.length
        },
        checkAllDisabled() {
            return !!(this.toBeSelect.length <= 0 || this.selectionMode === 'single')
        },
        isShowCheckBox() {
            return this.mode === 'orgAndUser'
        }
    },
    watch: {
        checkAll(val) {
            if (val) {
                if (this.toBeSelect.length > 0) {
                    this.toBeSelect.forEach(user => {
                        user.checked = true
                        this.selectedObjects.push(user)
                    })
                    this.selectedObjects = this.objectArrayNoHeavy(this.selectedObjects, 'value')
                }
            } else {
                this.toBeSelect.forEach(user => {
                    user.checked = false
                })
                this.selectedObjects = this.getDifferentValues(this.selectedObjects, this.toBeSelect)
            }
        }
    },
    mounted() {
        // 这里赋值的模式需要做拷贝，这样就能避免引用的数据的串改。
        const defaultUser = JSON.stringify(this.defaultUserValues)
        const defaultOrg = JSON.stringify(this.defaultOrgValues)
        this.selectedObjects = JSON.parse(defaultUser)
        this.selectedObjectsOrg = JSON.parse(defaultOrg)
    },
    methods: {
        // 查询机构下的用户
        queryUserByOrgCode(orgCode) {
            this.toBeSelect = []
            userService.queryByOrgCode(orgCode, ({ data }) => {
                this.setChooseUser(data)
            })
        },
        // 查询机构下穿透的用户集合
        queryAllUsersByOrgCode(orgCode) {
            this.toBeSelect = []
            userService.queryByOrgCodeAllUsers(orgCode, ({ data }) => {
                this.setChooseUser(data)
            })
        },
        // 查询过滤用户
        queryUserBySearch() {
            this.toBeSelect = []
            this.toBeSelectOrgName = '用户查询'
            userService.searchUsers(this.selectUser, this.selectUser, ({ data }) => {
                this.setChooseUser(data)
            })
        },
        // 设置可选的用户集合
        setChooseUser(data) {
            if (!data) return
            data.forEach(user => {
                let checked = false
                const selected = this.selectedObjects.filter(function(item, index) {
                    return item.value === user.userUid
                })
                if (selected && selected.length > 0) checked = true

                this.toBeSelect.push({
                    id: user.userUid,
                    name: user.userName ? user.userName : user.name,
                    value: user.userUid,
                    type: 'user',
                    orgName: user.orgName,
                    checked: checked,
                    data: user
                })
            })
        },
        // 数据转换
        convertDataDef(data) {
            const newData = []
            if (!data) return newData

            data.forEach(org => {
                const isLeaf = !org.hasChildOrg

                newData.push({
                    id: org.orgCode,
                    name: org.orgName,
                    value: org.orgCode,
                    type: 'org',
                    leaf: isLeaf,
                    data: org
                })
            })

            return newData
        },
        // 查询机构下一层子机构
        queryChildren(orgCode, resolve, parentInfo) {
            orgService.queryChildren(orgCode, ({ data }) => {
                if (data) {
                    const newData = this.convertDataDef(data)
                    if (parentInfo) {
                        this.defaultExpandedKeysId = orgCode
                        this.defaultExpandedKeys = [orgCode]
                        const convertData = [
                            {
                                id: parentInfo.orgCode,
                                name: parentInfo.orgName,
                                value: parentInfo.orgCode,
                                type: 'org',
                                leaf: false,
                                data: parentInfo,
                                children: [newData]
                            }
                        ]
                        return resolve(convertData)
                    } else {
                        return resolve(newData)
                    }
                }
            })
        },
        loadSubNode(orgCode, resolve, mode) {
            if (mode === '1') {
                // 查询本机构信息，并查询子机构信息
                orgService.getOrgInfo(orgCode, ({ data }) => {
                    if (data) this.queryChildren(orgCode, resolve, data)
                })
            } else this.queryChildren(orgCode, resolve, null) // 查询子机构信息
        },
        // 树的初始加载
        loadNode(node, resolve) {
            const rootOrgCode = this.rootOrgCode
            if (node.level === 0 && rootOrgCode === '') {
                orgService.getOrgRoot(({ data }) => {
                    if (data) {
                        this.queryChildren(data.orgCode, resolve, data)
                    }
                })
            } else if (node.level === 0 && rootOrgCode !== '') {
                this.loadSubNode(rootOrgCode, resolve, '1')
            } else {
                const orgCode = node.data.value
                this.loadSubNode(orgCode, resolve, '2')
            }
        },
        // 节点点击事件
        showDepartmentClick(val) {
            if (this.toBeSelectOrgName !== '用户查询' && this.toBeSelectOrgCode !== '') {
                if (val) {
                    this.queryAllUsersByOrgCode(this.toBeSelectOrgCode)
                } else {
                    this.queryUserByOrgCode(this.toBeSelectOrgCode)
                }
            }
        },
        // 节点点击事件
        handleNodeClick(data) {
            this.checkAll = false
            this.selectUser = ''
            this.toBeSelectOrgName = data.name
            this.toBeSelectOrgCode = data.value
            if (this.showDepartmentalUsers) {
                this.queryAllUsersByOrgCode(data.value)
            } else {
                this.queryUserByOrgCode(data.value)
            }
        },
        // 单选模式下，数据清理
        clearSingleInfo() {
            if (this.selectionMode === 'single') {
                this.setUserShowMode()
                this.selectedObjects = []
                this.selectedObjectsOrg = []
                this.$refs.tree.setCheckedKeys([])
                this.editCheckId = ''
            }
        },
        // 中间用户选中和未选中的处理
        setUserShowMode() {
            this.selectedObjects.forEach(item => {
                const actionObj = document.getElementById(item.type + '_' + item.value)

                if (actionObj) {
                    actionObj.className = 'alert_select_icon'
                    actionObj.style.color = '#fff'

                    actionObj.childNodes[1].style.display = ''
                    actionObj.childNodes[0].style.display = 'none'
                }
            })
        },
        // 选中用户事件
        handleSelect(user, event) {
            this.clearSingleInfo()
            this.selectedObjects.push(user)
            this.selectedObjects = this.objectArrayNoHeavy(this.selectedObjects, 'value')

            const actionObj = document.getElementById(user.type + '_' + user.value)
            actionObj.childNodes[1].style.display = 'none'
            actionObj.childNodes[0].style.display = ''
            actionObj.className = 'myicon-tick-checked'
            actionObj.style.color = '#1f64a3'
        },
        // 获取用户头像
        getNameIcon(userUid) {
            const nameIcon = `${this.$config.get('api.baseURI')}/bua/avatar/getHeadPhoto?userUid=` + userUid
            return nameIcon
        },
        // 获取机构头像
        getNameIconOrg(name) {
            let nameIcon = ''
            if (name.length > 2) {
                nameIcon = name.substring(0, 2)
            } else {
                nameIcon = name.substring(0, 1)
            }
            return nameIcon
        },
        // 显示选择树
        handleShow() {
            // 树选中效果的偿机制
            const setCheckIds = []
            const defaultUser = JSON.stringify(this.defaultUserValues)
            const defaultOrg = JSON.stringify(this.defaultOrgValues)
            this.selectedObjects = JSON.parse(defaultUser)
            this.selectedObjectsOrg = JSON.parse(defaultOrg)
            this.selectedObjectsOrg.forEach(item => {
                setCheckIds.push(item.id)
            })
            this.$refs.tree.setCheckedKeys(setCheckIds)
        },
        handleClickMask() {
            this.handleClose()
        },
        handleClickClose() {
            this.handleClose()

            // 选择数据或者清空数据后，选择取消操作。需要通过这段代码来保证数据的一致性。
            if (this.defaultUserValues === null || this.defaultUserValues.length < 1) {
                this.selectedObjects = []
                this.selectedObjectsReturn = ''
            } else {
                this.selectedObjects = JSON.parse(this.selectedObjectsReturn)
            }

            // 选择数据或者清空数据后，选择取消操作。需要通过这段代码来保证数据的一致性。
            if (this.defaultOrgValues === null || this.defaultOrgValues.length < 1) {
                this.selectedObjectsOrg = []
                this.selectedObjectsOrgReturn = ''
            } else {
                if (this.selectedObjectsOrgReturn !== '') {
                    this.selectedObjectsOrg = JSON.parse(this.selectedObjectsOrgReturn)
                }
            }

            this.showDepartmentalUsers = false
            this.selectUser = ''
            this.$emit('close')
        },
        handleClickClear() {
            this.setUserShowMode()
            this.selectedObjects = []
            this.toBeSelect.forEach(user => {
                user.checked = false
            })
        },
        handleClickClearOrg() {
            this.$refs.tree.setCheckedKeys([])
            this.selectedObjectsOrg = []
        },
        handleClickConfirm() {
            this.selectedObjectsReturn = JSON.stringify(this.selectedObjects)
            this.selectedObjectsOrgReturn = JSON.stringify(this.selectedObjectsOrg)
            const data = {
                selectedOrgs: this.selectedObjectsOrg,
                selectedUsers: this.selectedObjects,
                selectedUserNames: this.getSelectedUserNames(),
                selectedUserValues: this.getSelectedUserValues(),
                selectedOrgNames: this.getSelectedOrgNames(),
                selectedOrgValues: this.getSelectedOrgValues()
            }
            let names = data.selectedUserNames
            let codes = data.selectedUserValues
            if (data.selectedOrgValues !== '') {
                if (codes !== '') {
                    names = names + ','
                    codes = codes + ','
                }
                names = names + data.selectedOrgNames
                codes = codes + data.selectedOrgValues
            }

            this.defaultUserValues = data.selectedUsers
            this.defaultOrgValues = data.selectedOrgs

            this.$nextTick(() => {
                this.handleShow()
            })
            this.$emit('input', codes)
            this.$emit('update:names', names)
            this.$emit('selected', data)
            this.handleClose()
        },
        keyupSubmit(e) {
            const evt = window.event || e
            if (evt.keyCode === 13) {
                this.queryUserBySearch()
            }
        },
        buttonSearch() {
            this.queryUserBySearch()
        },
        // 清除节点数据、折叠节点
        clearSelected() {
            // 折叠所有节点
            for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
                this.$refs.tree.store._getAllNodes()[i].expanded = this.isexpand
            }

            this.defaultExpandedKeys = [this.defaultExpandedKeysId]

            // 节点滚动条置顶 scrollTo(x,y) 不是IE和Edge才滚动
            const userAgent = navigator.userAgent
            const isOpera = userAgent.indexOf('Opera') > -1
            if (!(userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) && !(userAgent.indexOf('Edge') > -1) && !(userAgent.indexOf('rv:') > -1)) {
                document.getElementById('alert_tree').scrollTo(0, 0)
            }

            // 清空选中的内容
            this.$refs.tree.setCheckedKeys([])
            this.toBeSelect = []
            this.toBeSelectOrgName = ''
            this.showDepartmentalUsers = false
            this.selectUser = ''
        },
        handleClose() {
            this.clearSelected()
            this.$emit('update:visible', false)
        },
        // 上移、下移切换的函数
        handleClick(index) {
            this.currentIndex = index
        },
        // 点击删除按钮
        handleClickRemove(removeItem) {
            this.selectedObjects = this.selectedObjects.filter(item => item !== removeItem)

            const removeObj = document.getElementById(removeItem.type + '_' + removeItem.value)
            removeObj.className = 'alert_select_icon'
            removeObj.style.color = '#fff'

            removeObj.childNodes[0].style.display = 'none'
            removeObj.childNodes[1].style.display = ''

            this.$refs.tree.setChecked(removeItem.id, false, false)
        },
        // 点击删除按钮
        handleClickRemoveOrg(removeItem) {
            this.selectedObjectsOrg = this.selectedObjectsOrg.filter(item => item !== removeItem)

            this.$refs.tree.setChecked(removeItem.id, false, false)
        },
        // 对象数组去重
        objectArrayNoHeavy(originalArr, key) {
            const resultArr = []
            const o = {}
            for (let i = 0; i < originalArr.length; i++) {
                if (!o[originalArr[i][key]]) {
                    resultArr.push(originalArr[i])
                    o[originalArr[i][key]] = true
                }
            }
            return resultArr
        },
        // 取消全选后取差值
        getDifferentValues(selectedData, toBeSelectData) {
            const selectedArr = [...selectedData]
            const toBeSelectedArr = [...toBeSelectData]

            for (let i = 0; i < toBeSelectedArr.length; i++) {
                for (let j = 0; j < selectedArr.length; j++) {
                    if (selectedArr[j].value === toBeSelectedArr[i].value) {
                        selectedArr.splice(j, 1)
                        j--
                    }
                }
            }
            return selectedArr
        },
        // 返回用户的选择数据(Value)
        getSelectedUserValues(separator) {
            const selectedObjects = this.selectedObjects
            const valueArr = []
            selectedObjects.forEach(item => {
                valueArr.push(item.value)
            })
            return valueArr.join(separator || ',')
        },
        // 返回用户的选择数据(Name)
        getSelectedUserNames(separator) {
            const selectedObjects = this.selectedObjects
            const nameArr = []
            selectedObjects.forEach(item => {
                nameArr.push(item.name)
            })
            return nameArr.join(separator || ',')
        },
        // 返回机构的选择数据(Value)
        getSelectedOrgValues(separator) {
            const selectedObjectsOrg = this.selectedObjectsOrg
            const valueArr = []
            selectedObjectsOrg.forEach(item => {
                valueArr.push(item.value)
            })
            return valueArr.join(separator || ',')
        },
        // 返回机构的选择数据(Name)
        getSelectedOrgNames(separator) {
            const selectedObjectsOrg = this.selectedObjectsOrg
            const nameArr = []
            selectedObjectsOrg.forEach(item => {
                nameArr.push(item.name)
            })
            return nameArr.join(separator || ',')
        },
        // 返回用户的选择数据
        getSelectedObjectsUser() {
            return this.selectedObjects
        },
        // 返回机构的选择数据
        getSelectedObjectsOrg() {
            return this.selectedObjectsOrg
        },
        // 当节点变化的时候（在清空选择时，会触发该事件。）
        handleCheckChange(data, checked, indeterminate) {
            // 防止重复触发节点变换操作的判断。
            if (this.selectionMode === 'single') {
                if (checked === true) {
                    this.clearSingleInfo()
                    this.editCheckId = data.id
                    this.$refs.tree.setCheckedKeys([data.id])
                } else {
                    if (this.editCheckId === data.id) {
                        this.clearSingleInfo()
                        this.editCheckId = data.id
                        this.$refs.tree.setCheckedKeys([data.id])
                    }
                }
            }

            const first = this.$refs.tree.getCheckedNodes()
            this.selectedObjectsOrg = []
            first.forEach((item, index) => {
                this.selectedObjectsOrg.push({
                    id: item.value,
                    name: item.name,
                    value: item.value,
                    type: 'org',
                    data: item.data,
                    orgName: item.name
                })
            })

            this.selectedObjectsOrg = this.objectArrayNoHeavy(this.selectedObjectsOrg, 'value')
        }
    }
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
    //   display: none;
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
    margin-top: -4px;
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
