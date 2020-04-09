(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue-property-decorator'), require('element-ui'), require('@belvoly-vue-aioa/core')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vue-property-decorator', 'element-ui', '@belvoly-vue-aioa/core'], factory) :
    (global = global || self, factory(global.ui = {}, global.vuePropertyDecorator, global.elementUi, global.core));
}(this, (function (exports, vuePropertyDecorator, elementUi, core) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    const { attachmentService } = core.services;
    const config = {
        sharedservice: {
            assets: {
                baseURI: `${core.globalConfig.apiHost}/sharedservice/assets`
            }
        },
        api: {
            baseURI: core.globalConfig.apiHost
        },
        o365: {
            enabled: false,
            baseURI: '',
            blobURI: '',
            supportFileTypes: ''
        }
    };
    let Index = class Index extends vuePropertyDecorator.Vue {
        constructor() {
            super(...arguments);
            this.uploadFiles = [];
        }
        get uploadAction() {
            return `${this.action}?refTableName=${this.refTableName}&typeCode=${this.typeCode}&creatorID=${this.userUid}`;
        }
        get getFileList() {
            const files = this.fileList.map((c) => {
                if (c.displayName) {
                    c.name = c.displayName;
                }
                return c;
            });
            return files;
        }
        get uploadTip() {
            return `最多允许上传${this.maxSize}MB的内容`;
        }
        mounted() {
            this.watchFileList(this.fileList);
        }
        watchFileList(newValue) {
            this.uploadFiles = [...newValue];
        }
        watchUploadFiles(newValue) {
            this.replaceFileIcons(newValue);
        }
        handlePreview(file) {
            if (file.id) {
                this.handlePreviewCore(file);
            }
            else {
                window.open(file.response.data.url);
            }
        }
        handlePreviewCore(file) {
            {
                window.open(file.url);
            }
        }
        handleO365Preview(file) {
            let url = file.url;
            if (file.extension && this.checkO365PreviewSupproted(file.extension)) {
                url = `${config.o365.baseURI}${config.o365.blobURI}/${file.id}`;
            }
            window.open(url);
        }
        checkO365PreviewSupproted(extension) {
            const supportFileTypes = config.o365.supportFileTypes;
            return supportFileTypes.includes(extension);
        }
        async handleRemove(file) {
            const id = file.id || file.response.data.id;
            const { success } = await attachmentService.remove(id);
            if (success) {
                elementUi.Message({
                    message: '删除附件成功',
                    type: 'success'
                });
                const fileIndex = this.uploadFiles.findIndex(file => file.id === id);
                this.uploadFiles.splice(fileIndex, 1);
            }
        }
        beforeRemove(file) {
            return elementUi.MessageBox.confirm(`确定移除 ${file.name}？`);
        }
        handleUploadSuccess(response, file, fileList) {
            const successFiles = fileList.find(file => file.status === 'success');
            this.uploadFiles.push(response.data);
            if (successFiles.length < fileList.length) {
                return;
            }
            const uploadInfo = {
                ids: fileList.map(file => file.id || file.response.data.id),
                refTableId: '',
                refTableName: this.refTableName,
                file: file,
                fileList: fileList
            };
            this.$emit('on-success', uploadInfo);
            // this.$bus.emit('uploadInfo', uploadInfo)
        }
        beforeUpload(file) {
            const isLtSize = file.size / 1024 / 1024 < this.maxSize;
            if (!isLtSize) {
                this.$message.error(`上传文件大小不能超过 ${this.maxSize}MB!`);
            }
            return isLtSize;
        }
        replaceFileIcons(files) {
            this.$nextTick(() => {
                this.$el.querySelectorAll('.el-icon-document').forEach((el, i) => {
                    el.style.display = 'none';
                    if (i >= files.length) {
                        return;
                    }
                    this.showFileIcon(el, files[i]);
                });
                // 查看模式下才显示
                if (!this.isEditFile) {
                    this.$el.querySelectorAll('.el-upload-list__item-status-label').forEach((el, i) => {
                        el.style.display = 'none';
                        if (i >= files.length) {
                            return;
                        }
                        // 添加下载和预览按钮
                        this.addDownloadIcon(el, files[i]);
                    });
                }
            });
        }
        addDownloadIcon(el, file) {
            let isView = false;
            const url = file.url;
            let urlv = '';
            if (file.extension && this.checkO365PreviewSupproted(file.extension)) {
                urlv = `${config.o365.baseURI}${config.o365.blobURI}/${file.id}`;
                isView = true;
            }
            if (isView) {
                const viewNode = document.createElement('span');
                viewNode.title = '查看';
                viewNode.addEventListener('click', function () {
                    window.open(urlv);
                });
                viewNode.style.cursor = 'pointer';
                viewNode.style.position = 'absolute';
                viewNode.style.right = '18px';
                viewNode.style.top = '0';
                const iNode = document.createElement('i');
                iNode.className = 'fc fc-eyes-open';
                viewNode.prepend(iNode);
                el.parentNode.insertBefore(viewNode, el);
                el.style.right = '35px';
            }
            else {
                el.style.right = '19px';
            }
            const downloadElement = document.createElement('span');
            downloadElement.title = '下载';
            downloadElement.addEventListener('click', function () {
                window.open(url);
            });
            downloadElement.style.cursor = 'pointer';
            downloadElement.style.position = 'absolute';
            downloadElement.style.right = '1px';
            downloadElement.style.top = '0';
            const iNode = document.createElement('i');
            iNode.className = 'fc fc-down-o';
            downloadElement.prepend(iNode);
            el.parentNode.insertBefore(downloadElement, el);
        }
        showFileIcon(el, file) {
            let extension = file.extension;
            if (!extension) {
                const names = file.name.split('.');
                if (names.length > 1) {
                    extension = '.' + names.pop();
                }
            }
            if (!extension) {
                return;
            }
            const removedDotExtension = extension.substring(1);
            const assertBaseURI = `${config.sharedservice.assets.baseURI}/img/files`;
            const iconUrl = `${assertBaseURI}/${removedDotExtension}.png`;
            const errorUrl = `${assertBaseURI}/default.png`;
            // el.previousSibling.parentElement.remove()
            const imgElement = document.createElement('img');
            imgElement.className = 'el-upload-file-icon';
            imgElement.src = iconUrl;
            imgElement.alt = extension;
            imgElement.addEventListener('error', function () {
                imgElement.src = errorUrl;
            });
            el.parentNode.insertBefore(imgElement, el);
        }
        /**
         * 更新关联业务表记录ID
         */
        async updateRelevance(refTableID) {
            const blobRelevance = {
                ids: this.uploadFiles.map(file => file.id),
                refTableName: this.refTableName,
                refTableID: refTableID
            };
            const { success, data } = await attachmentService.updateRelevance(blobRelevance);
            if (success) {
                return data;
            }
        }
    };
    __decorate([
        vuePropertyDecorator.Prop({ default: `${config.api.baseURI}/sharedservice/blob/upload` })
    ], Index.prototype, "action", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ default: 50 })
    ], Index.prototype, "maxSize", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ default: true })
    ], Index.prototype, "multiple", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ default: [] })
    ], Index.prototype, "fileList", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ required: true })
    ], Index.prototype, "refTableName", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ required: true })
    ], Index.prototype, "typeCode", void 0);
    __decorate([
        vuePropertyDecorator.Prop()
    ], Index.prototype, "userUid", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ default: true })
    ], Index.prototype, "isEditFile", void 0);
    __decorate([
        vuePropertyDecorator.Watch('fileList')
    ], Index.prototype, "watchFileList", null);
    __decorate([
        vuePropertyDecorator.Watch('uploadFiles')
    ], Index.prototype, "watchUploadFiles", null);
    Index = __decorate([
        vuePropertyDecorator.Component
    ], Index);
    var script = Index;

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        if (typeof shadowMode !== 'boolean') {
            createInjectorSSR = createInjector;
            createInjector = shadowMode;
            shadowMode = false;
        }
        // Vue.extend constructor export interop.
        const options = typeof script === 'function' ? script.options : script;
        // render functions
        if (template && template.render) {
            options.render = template.render;
            options.staticRenderFns = template.staticRenderFns;
            options._compiled = true;
            // functional template
            if (isFunctionalTemplate) {
                options.functional = true;
            }
        }
        // scopedId
        if (scopeId) {
            options._scopeId = scopeId;
        }
        let hook;
        if (moduleIdentifier) {
            // server build
            hook = function (context) {
                // 2.3 injection
                context =
                    context || // cached call
                        (this.$vnode && this.$vnode.ssrContext) || // stateful
                        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                // 2.2 with runInNewContext: true
                if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                    context = __VUE_SSR_CONTEXT__;
                }
                // inject component styles
                if (style) {
                    style.call(this, createInjectorSSR(context));
                }
                // register component module identifier for async chunk inference
                if (context && context._registeredComponents) {
                    context._registeredComponents.add(moduleIdentifier);
                }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
        }
        else if (style) {
            hook = shadowMode
                ? function (context) {
                    style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
                }
                : function (context) {
                    style.call(this, createInjector(context));
                };
        }
        if (hook) {
            if (options.functional) {
                // register for functional component in vue file
                const originalRender = options.render;
                options.render = function renderWithStyleInjection(h, context) {
                    hook.call(context);
                    return originalRender(h, context);
                };
            }
            else {
                // inject component registration as beforeCreate hook
                const existing = options.beforeCreate;
                options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
        }
        return script;
    }

    const isOldIE = typeof navigator !== 'undefined' &&
        /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
        return (id, style) => addStyle(id, style);
    }
    let HEAD;
    const styles = {};
    function addStyle(id, css) {
        const group = isOldIE ? css.media || 'default' : id;
        const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
        if (!style.ids.has(id)) {
            style.ids.add(id);
            let code = css.source;
            if (css.map) {
                // https://developer.chrome.com/devtools/docs/javascript-debugging
                // this makes source maps inside style tags work properly in Chrome
                code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
                // http://stackoverflow.com/a/26603875
                code +=
                    '\n/*# sourceMappingURL=data:application/json;base64,' +
                        btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                        ' */';
            }
            if (!style.element) {
                style.element = document.createElement('style');
                style.element.type = 'text/css';
                if (css.media)
                    style.element.setAttribute('media', css.media);
                if (HEAD === undefined) {
                    HEAD = document.head || document.getElementsByTagName('head')[0];
                }
                HEAD.appendChild(style.element);
            }
            if ('styleSheet' in style.element) {
                style.styles.push(code);
                style.element.styleSheet.cssText = style.styles
                    .filter(Boolean)
                    .join('\n');
            }
            else {
                const index = style.ids.size - 1;
                const textNode = document.createTextNode(code);
                const nodes = style.element.childNodes;
                if (nodes[index])
                    style.element.removeChild(nodes[index]);
                if (nodes.length)
                    style.element.insertBefore(textNode, nodes[index]);
                else
                    style.element.appendChild(textNode);
            }
        }
    }

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        [
          _vm.isEditFile
            ? _c(
                "el-upload",
                {
                  attrs: {
                    action: _vm.uploadAction,
                    "on-preview": _vm.handlePreview,
                    "on-remove": _vm.handleRemove,
                    "before-remove": _vm.beforeRemove,
                    "before-upload": _vm.beforeUpload,
                    multiple: "multiple",
                    "file-list": _vm.getFileList,
                    "on-success": _vm.handleUploadSuccess
                  }
                },
                [
                  _c("el-button", { attrs: { size: "mini", type: "primary" } }, [
                    _vm._v("上传附件")
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "el-upload__tip",
                      attrs: { slot: "tip" },
                      slot: "tip"
                    },
                    [_vm._v("(" + _vm._s(_vm.uploadTip) + ")")]
                  )
                ],
                1
              )
            : _c("el-upload", {
                staticClass: "upload-detail",
                attrs: {
                  action: _vm.uploadAction,
                  "on-preview": _vm.handlePreview,
                  "file-list": _vm.getFileList
                }
              })
        ],
        1
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = function (inject) {
        if (!inject) return
        inject("data-v-833ba49c_0", { source: ".upload-detail .el-upload--text {\n  display: none !important;\n}\n.upload-detail .el-upload-list__item:hover .el-icon-close,\n.upload-detail .el-upload-list__item:hover .el-icon-close-tip {\n  display: none;\n}\n.upload-detail .el-upload-list__item .el-icon-close-tip {\n  display: none !important;\n}\n.upload-detail .el-upload-list__item .el-upload-list__item-name .el-upload-file-icon {\n  width: 16px;\n  height: 16px;\n  vertical-align: text-bottom;\n  margin-right: 7px;\n}\n", map: {"version":3,"sources":["Index.vue"],"names":[],"mappings":"AAAA;EACE,wBAAwB;AAC1B;AACA;;EAEE,aAAa;AACf;AACA;EACE,wBAAwB;AAC1B;AACA;EACE,WAAW;EACX,YAAY;EACZ,2BAA2B;EAC3B,iBAAiB;AACnB","file":"Index.vue","sourcesContent":[".upload-detail .el-upload--text {\n  display: none !important;\n}\n.upload-detail .el-upload-list__item:hover .el-icon-close,\n.upload-detail .el-upload-list__item:hover .el-icon-close-tip {\n  display: none;\n}\n.upload-detail .el-upload-list__item .el-icon-close-tip {\n  display: none !important;\n}\n.upload-detail .el-upload-list__item .el-upload-list__item-name .el-upload-file-icon {\n  width: 16px;\n  height: 16px;\n  vertical-align: text-bottom;\n  margin-right: 7px;\n}\n"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__ = normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        false,
        createInjector,
        undefined,
        undefined
      );

    const { orgService, userService } = core.services;
    const config$1 = {
        api: {
            baseURI: core.globalConfig.apiHost
        }
    };
    let New = class New extends vuePropertyDecorator.Vue {
        constructor() {
            super(...arguments);
            this.isShowCheckBox = true;
            this.defaultExpandedKeys = [];
            /**
             * tab相关数据
             */
            this.tab = {
                // 选择的tab
                activeTabName: 'unit',
                currentIndex: null
            };
            /**
             * 是否显示子部门用户
             */
            this.showDepartmentalUsers = false;
            /**
             * 选中的用户
             */
            this.selectedUsers = [];
            /**
             * 选中的机构
             */
            this.selectedOrgs = [];
            /**
             * 当前选中的机构
             */
            this.currentSelectOrg = null;
            /**
             * 可以选中的用户
             */
            this.canSelecteUsers = [];
            /**
             * 搜索框显示文本
             */
            this.searchText = '';
        }
        get selectNumber() {
            return this.selectedUsers.length;
        }
        get selectNumberOrg() {
            return this.selectedOrgs.length;
        }
        mounted() {
            if (this.defaultUsers) {
                this.selectedUsers.push(...this.defaultUsers);
            }
            if (this.defaultOrgs) {
                this.selectedOrgs.push(...this.defaultOrgs);
            }
            document.body.appendChild(this.$el);
        }
        destroyed() {
            if (this.$el && this.$el.parentNode) {
                this.$el.parentNode.removeChild(this.$el);
            }
        }
        // 树的初始加载
        async loadUnitOrgs(node, resolve) {
            const rootOrgCode = this.rootOrgCode;
            if (node.level === 0) {
                if (rootOrgCode) {
                    await this.loadSubNode(rootOrgCode, resolve, false);
                }
                else {
                    const { data: rootOrg } = await orgService.getOrgRoot();
                    if (rootOrg) {
                        await this.queryChildren(rootOrg.orgCode, resolve, rootOrg);
                    }
                }
            }
            else {
                const orgCode = node.data.value;
                await this.loadSubNode(orgCode, resolve, true);
            }
        }
        async loadSubNode(orgCode, resolve, isOnlyChild) {
            if (!isOnlyChild) {
                // 查询本机构信息，并查询子机构信息
                const { data } = await orgService.getOrgInfo(orgCode);
                if (data) {
                    await this.queryChildren(orgCode, resolve, data);
                }
            }
            else {
                await this.queryChildren(orgCode, resolve, null); // 查询子机构信息
            }
        }
        // 查询机构下一层子机构
        async queryChildren(orgCode, resolve, parentOrg) {
            const { data } = await orgService.queryChildren(orgCode);
            if (data) {
                const nodeData = this.convertOrgsToTreeNodeData(data);
                if (parentOrg) {
                    // this.defaultExpandedKeysId = orgCode
                    // 默认展开第一个节点
                    this.defaultExpandedKeys = [orgCode];
                    const parentNode = this.convertOrgToTreeNode(parentOrg, false);
                    parentNode.children = [...nodeData];
                    const convertData = [parentNode];
                    resolve(convertData);
                }
                else {
                    resolve(nodeData);
                }
            }
            this.refreshTreeNodeSelectedStatus();
        }
        async loadGlobalOrgs(node, resolve) {
            if (node.level === 0) {
                const { data } = await orgService.getOrgRoot();
                if (data) {
                    await this.queryChildren(data.orgCode, resolve, data);
                }
            }
            else {
                const orgCode = node.data.value;
                await this.loadSubNode(orgCode, resolve, true);
            }
        }
        tabClickHandler(tab) {
            this.tab.activeTabName = tab.name;
            this.refreshTreeNodeSelectedStatus();
        }
        async searchUnitUserHandler() {
            const { data } = await userService.searchUsers(this.searchText, this.searchText);
            this.setChooseUser(data);
        }
        get isSingleMode() {
            return this.selectionMode === 'single';
        }
        async handleTreeNodeClick(data) {
            //TODO:
            this.currentSelectOrg = data.data;
            //TODO: 判断showDepartmentalUsers
            await this.queryUserByOrgCode(data.value);
        }
        handleTreeNodeCheckChange(data, checked) {
            if (this.isSingleMode) {
                this.selectedOrgs = [];
                if (checked === true) {
                    this.selectedOrgs.push(data);
                }
            }
            else {
                if (checked) {
                    const index = this.selectedOrgs.findIndex(item => item.id === data.id);
                    if (index === -1) {
                        this.selectedOrgs.push(data);
                    }
                }
                else {
                    const index = this.selectedOrgs.findIndex(item => item.id === data.id);
                    if (index > -1) {
                        this.selectedOrgs.splice(index, 1);
                    }
                }
            }
        }
        // 查询机构下的用户
        async queryUserByOrgCode(orgCode) {
            const { data } = await userService.queryByOrgCode(orgCode);
            this.setChooseUser(data);
        }
        // 查询机构下穿透的用户集合
        async queryAllUsersByOrgCode(orgCode) {
            const { data } = await userService.queryByOrgCodeAllUsers(orgCode);
            this.setChooseUser(data);
        }
        setChooseUser(data) {
            if (!data) {
                this.canSelecteUsers = [];
            }
            else {
                this.canSelecteUsers = data.map(user => {
                    const isSelected = this.selectedUsers.findIndex(u => u.id === user.userUid) > -1;
                    const userNode = {
                        id: user.userUid,
                        name: user.userName ? user.userName : user.userFullName,
                        value: user.userUid,
                        type: 'user',
                        checked: isSelected,
                        data: user
                    };
                    return userNode;
                });
            }
        }
        showDepartmentClick() {
            //TODO:
        }
        handleSelectUser(user) {
            if (!user.checked) {
                user.checked = true;
                this.selectedUsers.push(user);
            }
        }
        handleRemoveSelectedUser(user) {
            const index = this.selectedUsers.findIndex(u => u.id === user.id);
            if (index > -1) {
                this.selectedUsers.splice(index, 1);
            }
            this.refreshCanSelectUserStatus();
        }
        handleClick() {
            //TODO:
        }
        handleClearSelectedUsers() {
            this.selectedUsers = [];
            this.refreshCanSelectUserStatus();
        }
        // 清空选中的机构
        handleClearSelectedOrgs() {
            this.selectedOrgs = [];
            this.refreshTreeNodeSelectedStatus();
        }
        refreshCanSelectUserStatus() {
            this.canSelecteUsers.forEach(user => {
                const isSelected = this.selectedUsers.findIndex(u => u.id === user.id) > -1;
                user.checked = isSelected;
            });
        }
        refreshTreeNodeSelectedStatus() {
            const tree = (this.tab.activeTabName === 'unit' ? this.$refs.tree : this.$refs.globaltree);
            tree.setCheckedKeys(this.selectedOrgs.map(org => org.id));
        }
        handleClickRemoveOrg(org) {
            const index = this.selectedOrgs.findIndex(o => o.id === org.id);
            if (index > -1) {
                this.selectedOrgs.splice(index, 1);
            }
            this.refreshTreeNodeSelectedStatus();
        }
        handleClickMask() {
            this.close();
        }
        handleClickClose() {
            this.close();
        }
        close() {
            this.$emit('update:visible', false);
            this.$emit('close');
        }
        keyupSubmit() {
            //TODO:
        }
        handleClickConfirm() {
            const users = this.selectedUsers;
            const orgs = this.selectedOrgs;
            const all = [...users, ...orgs];
            const data = {
                users: users,
                orgs: orgs,
                userNames: users.map(u => u.name).join(','),
                userValues: users.map(u => u.value).join(','),
                orgNames: orgs.map(o => o.name).join(','),
                orgValues: orgs.map(o => o.value).join(','),
                names: all.map(a => a.name).join(','),
                values: all.map(a => a.value).join(',')
            };
            this.$emit('update:names', data.names);
            this.$emit('update:values', data.values);
            this.$emit('selected', data);
            this.close();
        }
        getUserIcon(user) {
            return `${config$1.api.baseURI}/bua/avatar/getHeadPhoto?userUid=` + user.userUid;
        }
        // 获取机构头像
        getOrgIcon(name) {
            let nameIcon = '';
            if (name.length > 2) {
                nameIcon = name.substring(0, 2);
            }
            else {
                nameIcon = name.substring(0, 1);
            }
            return nameIcon;
        }
        convertOrgsToTreeNodeData(data) {
            if (!data)
                return [];
            return data.map(org => {
                const node = this.convertOrgToTreeNode(org, !org.hasChildOrg);
                node.data = org;
                return node;
            });
        }
        convertOrgToTreeNode(org, leaf = false) {
            return {
                id: org.orgCode,
                name: org.orgName,
                value: org.orgCode,
                type: 'org',
                leaf: leaf,
                checked: false,
                data: undefined,
                children: undefined
            };
        }
        log(d) {
            console.log(d);
        }
    };
    __decorate([
        vuePropertyDecorator.Prop({ default: '选择人员' })
    ], New.prototype, "title", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ default: 'multiple' })
    ], New.prototype, "selectionMode", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ default: 'orgAndUser' })
    ], New.prototype, "mode", void 0);
    __decorate([
        vuePropertyDecorator.Prop()
    ], New.prototype, "rootOrgCode", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ default: false })
    ], New.prototype, "visible", void 0);
    __decorate([
        vuePropertyDecorator.Prop({ default: false })
    ], New.prototype, "isShowGlobal", void 0);
    __decorate([
        vuePropertyDecorator.Prop({})
    ], New.prototype, "defaultUsers", void 0);
    __decorate([
        vuePropertyDecorator.Prop({})
    ], New.prototype, "defaultOrgs", void 0);
    New = __decorate([
        vuePropertyDecorator.Component
    ], New);
    var script$1 = New;

    /* script */
    const __vue_script__$1 = script$1;

    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.visible,
              expression: "visible"
            }
          ],
          staticClass: "bv-choose-people_wrapper"
        },
        [
          _c("div", {
            staticClass: "bv-choose-people_mask",
            on: { click: _vm.handleClickMask }
          }),
          _vm._v(" "),
          _c("div", { staticClass: "bv-choose-people" }, [
            _c("div", { staticClass: "bv-choose-people_head" }, [
              _c("div", [_vm._v(_vm._s(_vm.title))]),
              _vm._v(" "),
              _c("div", {
                staticClass: "bv-choose-people_close fc fc-close",
                on: { click: _vm.handleClickClose }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "bv-choose-people_view" }, [
              _c("div", [_vm._t("header")], 2),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "bv-choose-people_body" },
                [
                  _c(
                    "div",
                    { staticClass: "bv-choose-people_tree" },
                    [
                      _c(
                        "el-tabs",
                        {
                          on: { "tab-click": _vm.tabClickHandler },
                          model: {
                            value: _vm.tab.activeTabName,
                            callback: function($$v) {
                              _vm.$set(_vm.tab, "activeTabName", $$v);
                            },
                            expression: "tab.activeTabName"
                          }
                        },
                        [
                          _c(
                            "el-tab-pane",
                            { attrs: { label: "本单位", name: "unit" } },
                            [
                              _c(
                                "div",
                                { staticClass: "bv-choose-people_treenav" },
                                [
                                  _c(
                                    "div",
                                    { staticClass: "bv-choose-people_search" },
                                    [
                                      _c("el-input", {
                                        attrs: { placeholder: "用户名称\\账号" },
                                        on: {
                                          keyup: function($event) {
                                            if (
                                              !$event.type.indexOf("key") &&
                                              _vm._k(
                                                $event.keyCode,
                                                "enter",
                                                13,
                                                $event.key,
                                                "Enter"
                                              )
                                            ) {
                                              return null
                                            }
                                            return _vm.keyupSubmit(_vm.event)
                                          }
                                        },
                                        scopedSlots: _vm._u([
                                          {
                                            key: "append",
                                            fn: function() {
                                              return [
                                                _c(
                                                  "el-button",
                                                  {
                                                    staticClass:
                                                      "bv-choose-people_search_button",
                                                    attrs: { title: "查询用户" },
                                                    on: {
                                                      click:
                                                        _vm.searchUnitUserHandler
                                                    }
                                                  },
                                                  [
                                                    _c("i", {
                                                      staticClass: "fc fc-search"
                                                    })
                                                  ]
                                                )
                                              ]
                                            },
                                            proxy: true
                                          }
                                        ]),
                                        model: {
                                          value: _vm.searchText,
                                          callback: function($$v) {
                                            _vm.searchText = $$v;
                                          },
                                          expression: "searchText"
                                        }
                                      })
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c("el-tree", {
                                    ref: "tree",
                                    attrs: {
                                      "show-checkbox": _vm.isShowCheckBox,
                                      "expand-on-click-node": false,
                                      "node-key": "id",
                                      props: {
                                        label: "name",
                                        children: "zones",
                                        isLeaf: "leaf"
                                      },
                                      lazy: "",
                                      "default-expanded-keys":
                                        _vm.defaultExpandedKeys,
                                      "check-strictly": true,
                                      load: _vm.loadUnitOrgs
                                    },
                                    on: {
                                      "node-click": _vm.handleTreeNodeClick,
                                      "check-change": _vm.handleTreeNodeCheckChange
                                    },
                                    scopedSlots: _vm._u([
                                      {
                                        key: "default",
                                        fn: function(ref) {
                                          var node = ref.node;
                                          return [
                                            _c(
                                              "span",
                                              {
                                                staticStyle: { "font-size": "14px" }
                                              },
                                              [
                                                _c(
                                                  "span",
                                                  {
                                                    staticStyle: {
                                                      "padding-right": "3px"
                                                    }
                                                  },
                                                  [
                                                    _c("i", {
                                                      staticClass: "fc fc-company"
                                                    })
                                                  ]
                                                ),
                                                _vm._v(" "),
                                                _c("span", [
                                                  _vm._v(_vm._s(node.label))
                                                ])
                                              ]
                                            )
                                          ]
                                        }
                                      }
                                    ])
                                  })
                                ],
                                1
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _vm.isShowGlobal
                            ? _c(
                                "el-tab-pane",
                                { attrs: { label: "全局", name: "gloabl" } },
                                [
                                  _c(
                                    "div",
                                    { staticClass: "bv-choose-people_treenav" },
                                    [
                                      _c("el-tree", {
                                        ref: "globaltree",
                                        attrs: {
                                          "show-checkbox": _vm.isShowCheckBox,
                                          "node-key": "id",
                                          "expand-on-click-node": false,
                                          props: {
                                            label: "name",
                                            children: "zones",
                                            isLeaf: "leaf"
                                          },
                                          lazy: "",
                                          "default-expanded-keys":
                                            _vm.defaultExpandedKeys,
                                          "check-strictly": true,
                                          load: _vm.loadGlobalOrgs
                                        },
                                        on: {
                                          "node-click": _vm.handleTreeNodeClick,
                                          "check-change":
                                            _vm.handleTreeNodeCheckChange
                                        },
                                        scopedSlots: _vm._u(
                                          [
                                            {
                                              key: "default",
                                              fn: function(ref) {
                                                var node = ref.node;
                                                return [
                                                  _c(
                                                    "span",
                                                    {
                                                      staticStyle: {
                                                        "font-size": "14px"
                                                      }
                                                    },
                                                    [
                                                      _c(
                                                        "span",
                                                        {
                                                          staticStyle: {
                                                            "padding-right": "3px"
                                                          }
                                                        },
                                                        [
                                                          _c("i", {
                                                            staticClass:
                                                              "fc fc-company"
                                                          })
                                                        ]
                                                      ),
                                                      _vm._v(" "),
                                                      _c("span", [
                                                        _vm._v(_vm._s(node.label))
                                                      ])
                                                    ]
                                                  )
                                                ]
                                              }
                                            }
                                          ],
                                          null,
                                          false,
                                          1525347875
                                        )
                                      })
                                    ],
                                    1
                                  )
                                ]
                              )
                            : _vm._e()
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("div", { staticClass: "bv-choose-people_canselect" }, [
                    _c("div", { staticClass: "bv-choose-people_canselect_title" }, [
                      _c(
                        "span",
                        {
                          staticClass:
                            "bv-choose-people_canselect_title_left bv-choose-people_canselect_title_primary"
                        },
                        [
                          _vm._v(
                            _vm._s(
                              _vm.currentSelectOrg
                                ? _vm.currentSelectOrg.orgName
                                : ""
                            )
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "span",
                        { staticClass: "bv-choose-people_canselect_title_right" },
                        [
                          _c(
                            "el-checkbox",
                            {
                              on: { change: _vm.showDepartmentClick },
                              model: {
                                value: _vm.showDepartmentalUsers,
                                callback: function($$v) {
                                  _vm.showDepartmentalUsers = $$v;
                                },
                                expression: "showDepartmentalUsers"
                              }
                            },
                            [_vm._v("显示子部门用户")]
                          )
                        ],
                        1
                      )
                    ]),
                    _vm._v(" "),
                    _c("div", { staticStyle: { overflow: "auto" } }, [
                      _c(
                        "ul",
                        { staticClass: "bv-choose-people_canselect_list" },
                        _vm._l(_vm.canSelecteUsers, function(item, index) {
                          return _c(
                            "li",
                            {
                              key: index,
                              staticClass: "bv-choose-people_select_item",
                              on: {
                                click: function($event) {
                                  return _vm.handleSelectUser(item, $event)
                                }
                              }
                            },
                            [
                              _c(
                                "span",
                                {
                                  class: {
                                    "bv-choose-people_select_item_avatar": !item.checked,
                                    "bv-choose-people_select_item_checked":
                                      item.checked
                                  }
                                },
                                [
                                  _c(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: item.checked,
                                          expression: "item.checked"
                                        }
                                      ]
                                    },
                                    [_vm._v(".")]
                                  ),
                                  _vm._v(" "),
                                  _c("img", {
                                    directives: [
                                      {
                                        name: "show",
                                        rawName: "v-show",
                                        value: !item.checked,
                                        expression: "!item.checked"
                                      }
                                    ],
                                    attrs: { src: _vm.getUserIcon(item.data) }
                                  })
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass: "bv-choose-people_select_item_name"
                                },
                                [
                                  _c("b", [_vm._v(_vm._s(item.name))]),
                                  _vm._v(" "),
                                  _c("i", [_vm._v(_vm._s(item.data.orgName))])
                                ]
                              )
                            ]
                          )
                        }),
                        0
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _vm.mode === "orgAndUser"
                    ? [
                        _c("div", { staticClass: "bv-choose-people_select" }, [
                          _c(
                            "div",
                            {
                              staticClass: "bv-choose-people_selectbox",
                              staticStyle: { height: "50%" }
                            },
                            [
                              _c(
                                "div",
                                { staticClass: "bv-choose-people_canselect_title" },
                                [
                                  _c(
                                    "span",
                                    {
                                      staticClass:
                                        "bv-choose-people_canselect_title_left"
                                    },
                                    [
                                      _vm._v(
                                        "\n                                    已选用户：\n                                    "
                                      ),
                                      _c(
                                        "span",
                                        {
                                          staticClass:
                                            "bv-choose-people_canselect_title_primary"
                                        },
                                        [_vm._v(_vm._s(_vm.selectNumber) + " 名")]
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "span",
                                    {
                                      staticClass:
                                        "bv-choose-people_canselect_title_right",
                                      staticStyle: { "padding-right": "10px" }
                                    },
                                    [
                                      _c(
                                        "span",
                                        {
                                          staticClass:
                                            "bv-choose-people_canselect_clear",
                                          on: {
                                            click: _vm.handleClearSelectedUsers
                                          }
                                        },
                                        [_vm._v("清空")]
                                      )
                                    ]
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                {
                                  staticClass: "bv-choose-people_selectbox_content"
                                },
                                [
                                  _c(
                                    "ul",
                                    _vm._l(_vm.selectedUsers, function(
                                      item,
                                      index
                                    ) {
                                      return _c(
                                        "li",
                                        {
                                          key: index,
                                          staticClass:
                                            "bv-choose-people_select_item"
                                        },
                                        [
                                          _c(
                                            "span",
                                            {
                                              staticClass:
                                                "bv-choose-people_select_item_avatar"
                                            },
                                            [
                                              _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "bv-choose-people_select_item_avatar_close",
                                                  attrs: { title: "删除" },
                                                  on: {
                                                    click: function($event) {
                                                      return _vm.handleRemoveSelectedUser(
                                                        item,
                                                        index
                                                      )
                                                    }
                                                  }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                                x\n                                            "
                                                  )
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "bv-choose-people_select_item_avatar_name"
                                                },
                                                [
                                                  _c("img", {
                                                    attrs: {
                                                      src: _vm.getUserIcon(
                                                        item.data
                                                      )
                                                    }
                                                  })
                                                ]
                                              )
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "span",
                                            {
                                              staticClass:
                                                "bv-choose-people_select_item_name",
                                              on: {
                                                click: function($event) {
                                                  return _vm.handleClick(index)
                                                }
                                              }
                                            },
                                            [
                                              _c("b", [_vm._v(_vm._s(item.name))]),
                                              _vm._v(" "),
                                              _c("i", [
                                                _vm._v(_vm._s(item.orgName))
                                              ])
                                            ]
                                          )
                                        ]
                                      )
                                    }),
                                    0
                                  )
                                ]
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "div",
                            {
                              staticClass: "bv-choose-people_selectbox",
                              staticStyle: { height: "50%" }
                            },
                            [
                              _c(
                                "div",
                                { staticClass: "bv-choose-people_canselect_title" },
                                [
                                  _c(
                                    "span",
                                    {
                                      staticClass:
                                        "bv-choose-people_canselect_title_left"
                                    },
                                    [
                                      _vm._v(
                                        "\n                                    已选机构：\n                                    "
                                      ),
                                      _c(
                                        "span",
                                        {
                                          staticClass:
                                            "bv-choose-people_canselect_title_primary"
                                        },
                                        [
                                          _vm._v(
                                            _vm._s(_vm.selectNumberOrg) + " 个"
                                          )
                                        ]
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "span",
                                    {
                                      staticClass:
                                        "bv-choose-people_canselect_title_right",
                                      staticStyle: { "padding-right": "10px" }
                                    },
                                    [
                                      _c(
                                        "span",
                                        {
                                          staticClass:
                                            "bv-choose-people_canselect_clear",
                                          on: { click: _vm.handleClearSelectedOrgs }
                                        },
                                        [_vm._v("清空")]
                                      )
                                    ]
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                {
                                  staticClass: "bv-choose-people_selectbox_content"
                                },
                                [
                                  _c(
                                    "ul",
                                    _vm._l(_vm.selectedOrgs, function(item, index) {
                                      return _c(
                                        "li",
                                        {
                                          key: index,
                                          staticClass:
                                            "bv-choose-people_select_item"
                                        },
                                        [
                                          _c(
                                            "span",
                                            {
                                              staticClass:
                                                "bv-choose-people_select_item_avatar"
                                            },
                                            [
                                              _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "bv-choose-people_select_item_avatar_close",
                                                  attrs: { title: "删除" },
                                                  on: {
                                                    click: function($event) {
                                                      return _vm.handleClickRemoveOrg(
                                                        item,
                                                        index
                                                      )
                                                    }
                                                  }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                                x\n                                            "
                                                  )
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "bv-choose-people_select_item_avatar_name"
                                                },
                                                [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.getOrgIcon(item.name)
                                                    )
                                                  )
                                                ]
                                              )
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "span",
                                            {
                                              staticClass:
                                                "bv-choose-people_select_item_name",
                                              on: {
                                                click: function($event) {
                                                  return _vm.handleClick(index)
                                                }
                                              }
                                            },
                                            [
                                              _c("b", [_vm._v(_vm._s(item.name))]),
                                              _vm._v(" "),
                                              _c("i", [
                                                _vm._v(_vm._s(item.orgName))
                                              ])
                                            ]
                                          )
                                        ]
                                      )
                                    }),
                                    0
                                  )
                                ]
                              )
                            ]
                          )
                        ])
                      ]
                    : [
                        _c("div", { staticClass: "bv-choose-people_selectbox" }, [
                          _c(
                            "div",
                            { staticClass: "bv-choose-people_canselect_title" },
                            [
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "bv-choose-people_canselect_title_left"
                                },
                                [
                                  _vm._v(
                                    "\n                                已选用户：\n                                "
                                  ),
                                  _c(
                                    "span",
                                    {
                                      staticClass:
                                        "bv-choose-people_canselect_title_primary"
                                    },
                                    [_vm._v(_vm._s(_vm.selectNumber) + " 名")]
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "bv-choose-people_canselect_title_right",
                                  staticStyle: { "padding-right": "10px" }
                                },
                                [
                                  _c(
                                    "span",
                                    {
                                      staticClass:
                                        "bv-choose-people_canselect_clear",
                                      on: { click: _vm.handleClearSelectedUsers }
                                    },
                                    [_vm._v("清空")]
                                  )
                                ]
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticClass: "bv-choose-people_selectbox_content" },
                            [
                              _c(
                                "ul",
                                _vm._l(_vm.selectedUsers, function(item, index) {
                                  return _c(
                                    "li",
                                    {
                                      key: index,
                                      staticClass: "bv-choose-people_select_item"
                                    },
                                    [
                                      _c(
                                        "span",
                                        {
                                          staticClass:
                                            "bv-choose-people_select_item_avatar"
                                        },
                                        [
                                          _c(
                                            "span",
                                            {
                                              staticClass:
                                                "bv-choose-people_select_item_avatar_close",
                                              attrs: { title: "删除" },
                                              on: {
                                                click: function($event) {
                                                  return _vm.handleRemoveSelectedUser(
                                                    item,
                                                    index
                                                  )
                                                }
                                              }
                                            },
                                            [
                                              _vm._v(
                                                "\n                                            x\n                                        "
                                              )
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c("span", { staticClass: "name_icon" }, [
                                            _c("img", {
                                              staticClass: "myAvatar",
                                              attrs: {
                                                src: _vm.getUserIcon(item.data)
                                              }
                                            })
                                          ])
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "span",
                                        {
                                          staticClass:
                                            "bv-choose-people_select_item_name",
                                          on: {
                                            click: function($event) {
                                              return _vm.handleClick(index)
                                            }
                                          }
                                        },
                                        [
                                          _c("b", [_vm._v(_vm._s(item.name))]),
                                          _vm._v(" "),
                                          _c("i", [_vm._v(_vm._s(item.orgName))])
                                        ]
                                      )
                                    ]
                                  )
                                }),
                                0
                              )
                            ]
                          )
                        ])
                      ]
                ],
                2
              ),
              _vm._v(" "),
              _c("div", [_vm._t("footer")], 2)
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "bv-choose-people_foot" },
              [
                _c(
                  "el-button",
                  {
                    attrs: { type: "primary" },
                    on: { click: _vm.handleClickConfirm }
                  },
                  [_vm._v("确定")]
                ),
                _vm._v(" "),
                _c("el-button", { on: { click: _vm.handleClickClose } }, [
                  _vm._v("取消")
                ])
              ],
              1
            )
          ])
        ]
      )
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = function (inject) {
        if (!inject) return
        inject("data-v-4ebde9a7_0", { source: ".bv-choose-people {\n  position: absolute;\n  left: 50%;\n  top: 45%;\n  width: 60%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  overflow: hidden;\n}\n.bv-choose-people_wrapper {\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  left: 0;\n  top: 0;\n  z-index: 9999;\n  text-align: left;\n  line-height: 24px;\n}\n.bv-choose-people ul {\n  padding: 0;\n  margin: 0;\n}\n.bv-choose-people li {\n  margin: 0;\n}\n.bv-choose-people_mask {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.bv-choose-people_head {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 17px 20px;\n  font-size: 16px;\n  background: #f2f2f2;\n  border-bottom: 1px solid #c3c3c3;\n}\n.bv-choose-people_close {\n  color: #909399;\n  cursor: pointer;\n}\n.bv-choose-people_close:hover {\n  color: #4090e2;\n}\n.bv-choose-people_body {\n  display: flex;\n  height: 400px;\n}\n.bv-choose-people_tree {\n  width: 30%;\n  min-width: 200px;\n}\n.bv-choose-people_tree .el-tabs {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.bv-choose-people_tree .el-tabs .el-tabs__content {\n  flex: 1;\n}\n.bv-choose-people_tree .el-tabs .el-tab-pane {\n  height: 100%;\n}\n.bv-choose-people_tree .el-tabs .el-tabs__nav-wrap {\n  padding-left: 20px;\n}\n.bv-choose-people_treenav {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.bv-choose-people_treenav .el-tree {\n  flex: 1;\n  overflow: auto;\n}\n.bv-choose-people_treenav .el-tree-node__children {\n  overflow: visible;\n}\n.bv-choose-people_search {\n  padding: 10px;\n  padding-top: 0;\n}\n.bv-choose-people_search_button {\n  margin-left: -57px;\n  margin-top: 1px;\n  padding-bottom: 9px;\n  padding-top: 9px;\n}\n.bv-choose-people_selectbox {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.bv-choose-people_selectbox_content {\n  flex: 1;\n  overflow: auto;\n  padding: 5px 0;\n  box-sizing: border-box;\n}\n.bv-choose-people_canselect {\n  width: 50%;\n  border: 0 solid #d8d8d8;\n  padding: 16px;\n  overflow: auto;\n  border-width: 0 1px;\n}\n.bv-choose-people_canselect_clear {\n  color: red;\n  cursor: pointer;\n}\n.bv-choose-people_canselect_title {\n  overflow: hidden;\n}\n.bv-choose-people_canselect_title_primary {\n  color: #409eff;\n}\n.bv-choose-people_canselect_title_left {\n  float: left;\n}\n.bv-choose-people_canselect_title_right {\n  float: right;\n}\n.bv-choose-people_canselect_title_right .el-checkbox {\n  margin-right: 10px;\n}\n.bv-choose-people_canselect_title_right .el-checkbox:last-child {\n  margin-right: 0;\n}\n.bv-choose-people_canselect_title_right .el-checkbox__label {\n  padding-left: 5px;\n}\n.bv-choose-people_select_item {\n  display: inline-block;\n  margin-right: 20px;\n  margin-bottom: 10px;\n  cursor: pointer;\n}\n.bv-choose-people_select_item_avatar {\n  vertical-align: middle;\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  background: #409eff;\n  color: #fff;\n  border-radius: 50%;\n  font-size: 12px;\n  text-align: center;\n  line-height: 30px;\n  margin-right: 10px;\n}\n.bv-choose-people_select_item_avatar img {\n  height: 30px;\n  width: 30px;\n  border-radius: 50%;\n}\n.bv-choose-people_select_item_avatar_close {\n  display: none;\n  font-size: large;\n  margin-top: -2px;\n}\n.bv-choose-people_select_item_avatar:hover .bv-choose-people_select_item_avatar_close {\n  display: inline-block;\n}\n.bv-choose-people_select_item_avatar:hover .bv-choose-people_select_item_avatar_name {\n  display: none;\n}\n.bv-choose-people_select_item_name {\n  display: inline-block;\n  vertical-align: middle;\n}\n.bv-choose-people_select_item_name b,\n.bv-choose-people_select_item_name i {\n  display: block;\n  font-style: normal;\n  font-weight: normal;\n}\n.bv-choose-people_select_item_name i {\n  font-size: 12px;\n  margin-top: -5px;\n  color: #999;\n}\n.bv-choose-people_select {\n  width: 50%;\n  margin-left: -1px;\n  padding: 16px;\n  overflow-y: auto;\n  position: relative;\n  padding-left: 5px;\n}\n.bv-choose-people_foot {\n  text-align: right;\n  padding: 10px 20px;\n  background: #f2f2f2;\n  border-top: 1px solid #c3c3c3;\n}\n.bv-choose-people_select_item_checked {\n  display: inline-block;\n  margin-right: 20px;\n  cursor: pointer;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  font-size: 12px;\n  text-align: center;\n  line-height: 30px;\n  margin-right: 10px;\n  position: relative;\n  background-color: #1f64a3;\n  color: #1f64a3;\n}\n.bv-choose-people_select_item_checked:before,\n.bv-choose-people_select_item_checked:after {\n  content: '';\n  pointer-events: none;\n  position: absolute;\n  color: white;\n  border: 1px solid;\n  background-color: white;\n}\n.bv-choose-people_select_item_checked:before {\n  width: 2px;\n  height: 2px;\n  left: 28%;\n  top: 48%;\n  transform: skew(0deg, 60deg);\n  -ms-transform: skew(0deg, 60deg);\n  -webkit-transform: skew(0deg, 60deg);\n}\n.bv-choose-people_select_item_checked:after {\n  width: 8px;\n  height: 2px;\n  left: 41%;\n  top: 43%;\n  transform: skew(0deg, -60deg);\n  -ms-transform: skew(0deg, -60deg);\n  -webkit-transform: skew(0deg, -40deg);\n}\n", map: {"version":3,"sources":["New.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,UAAU;EACV,gCAAgC;EAChC,sBAAsB;EACtB,gBAAgB;AAClB;AACA;EACE,WAAW;EACX,YAAY;EACZ,eAAe;EACf,OAAO;EACP,MAAM;EACN,aAAa;EACb,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,UAAU;EACV,SAAS;AACX;AACA;EACE,SAAS;AACX;AACA;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,oCAAoC;AACtC;AACA;EACE,aAAa;EACb,8BAA8B;EAC9B,mBAAmB;EACnB,kBAAkB;EAClB,eAAe;EACf,mBAAmB;EACnB,gCAAgC;AAClC;AACA;EACE,cAAc;EACd,eAAe;AACjB;AACA;EACE,cAAc;AAChB;AACA;EACE,aAAa;EACb,aAAa;AACf;AACA;EACE,UAAU;EACV,gBAAgB;AAClB;AACA;EACE,YAAY;EACZ,aAAa;EACb,sBAAsB;AACxB;AACA;EACE,OAAO;AACT;AACA;EACE,YAAY;AACd;AACA;EACE,kBAAkB;AACpB;AACA;EACE,YAAY;EACZ,aAAa;EACb,sBAAsB;AACxB;AACA;EACE,OAAO;EACP,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,aAAa;EACb,cAAc;AAChB;AACA;EACE,kBAAkB;EAClB,eAAe;EACf,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,YAAY;EACZ,aAAa;EACb,sBAAsB;AACxB;AACA;EACE,OAAO;EACP,cAAc;EACd,cAAc;EACd,sBAAsB;AACxB;AACA;EACE,UAAU;EACV,uBAAuB;EACvB,aAAa;EACb,cAAc;EACd,mBAAmB;AACrB;AACA;EACE,UAAU;EACV,eAAe;AACjB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,cAAc;AAChB;AACA;EACE,WAAW;AACb;AACA;EACE,YAAY;AACd;AACA;EACE,kBAAkB;AACpB;AACA;EACE,eAAe;AACjB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,kBAAkB;EAClB,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,qBAAqB;EACrB,WAAW;EACX,YAAY;EACZ,mBAAmB;EACnB,WAAW;EACX,kBAAkB;EAClB,eAAe;EACf,kBAAkB;EAClB,iBAAiB;EACjB,kBAAkB;AACpB;AACA;EACE,YAAY;EACZ,WAAW;EACX,kBAAkB;AACpB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,gBAAgB;AAClB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;AACf;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;;EAEE,cAAc;EACd,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,gBAAgB;EAChB,WAAW;AACb;AACA;EACE,UAAU;EACV,iBAAiB;EACjB,aAAa;EACb,gBAAgB;EAChB,kBAAkB;EAClB,iBAAiB;AACnB;AACA;EACE,iBAAiB;EACjB,kBAAkB;EAClB,mBAAmB;EACnB,6BAA6B;AAC/B;AACA;EACE,qBAAqB;EACrB,kBAAkB;EAClB,eAAe;EACf,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,eAAe;EACf,kBAAkB;EAClB,iBAAiB;EACjB,kBAAkB;EAClB,kBAAkB;EAClB,yBAAyB;EACzB,cAAc;AAChB;AACA;;EAEE,WAAW;EACX,oBAAoB;EACpB,kBAAkB;EAClB,YAAY;EACZ,iBAAiB;EACjB,uBAAuB;AACzB;AACA;EACE,UAAU;EACV,WAAW;EACX,SAAS;EACT,QAAQ;EACR,4BAA4B;EAC5B,gCAAgC;EAChC,oCAAoC;AACtC;AACA;EACE,UAAU;EACV,WAAW;EACX,SAAS;EACT,QAAQ;EACR,6BAA6B;EAC7B,iCAAiC;EACjC,qCAAqC;AACvC","file":"New.vue","sourcesContent":[".bv-choose-people {\n  position: absolute;\n  left: 50%;\n  top: 45%;\n  width: 60%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  overflow: hidden;\n}\n.bv-choose-people_wrapper {\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  left: 0;\n  top: 0;\n  z-index: 9999;\n  text-align: left;\n  line-height: 24px;\n}\n.bv-choose-people ul {\n  padding: 0;\n  margin: 0;\n}\n.bv-choose-people li {\n  margin: 0;\n}\n.bv-choose-people_mask {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  left: 0;\n  top: 0;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.bv-choose-people_head {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 17px 20px;\n  font-size: 16px;\n  background: #f2f2f2;\n  border-bottom: 1px solid #c3c3c3;\n}\n.bv-choose-people_close {\n  color: #909399;\n  cursor: pointer;\n}\n.bv-choose-people_close:hover {\n  color: #4090e2;\n}\n.bv-choose-people_body {\n  display: flex;\n  height: 400px;\n}\n.bv-choose-people_tree {\n  width: 30%;\n  min-width: 200px;\n}\n.bv-choose-people_tree .el-tabs {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.bv-choose-people_tree .el-tabs .el-tabs__content {\n  flex: 1;\n}\n.bv-choose-people_tree .el-tabs .el-tab-pane {\n  height: 100%;\n}\n.bv-choose-people_tree .el-tabs .el-tabs__nav-wrap {\n  padding-left: 20px;\n}\n.bv-choose-people_treenav {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.bv-choose-people_treenav .el-tree {\n  flex: 1;\n  overflow: auto;\n}\n.bv-choose-people_treenav .el-tree-node__children {\n  overflow: visible;\n}\n.bv-choose-people_search {\n  padding: 10px;\n  padding-top: 0;\n}\n.bv-choose-people_search_button {\n  margin-left: -57px;\n  margin-top: 1px;\n  padding-bottom: 9px;\n  padding-top: 9px;\n}\n.bv-choose-people_selectbox {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.bv-choose-people_selectbox_content {\n  flex: 1;\n  overflow: auto;\n  padding: 5px 0;\n  box-sizing: border-box;\n}\n.bv-choose-people_canselect {\n  width: 50%;\n  border: 0 solid #d8d8d8;\n  padding: 16px;\n  overflow: auto;\n  border-width: 0 1px;\n}\n.bv-choose-people_canselect_clear {\n  color: red;\n  cursor: pointer;\n}\n.bv-choose-people_canselect_title {\n  overflow: hidden;\n}\n.bv-choose-people_canselect_title_primary {\n  color: #409eff;\n}\n.bv-choose-people_canselect_title_left {\n  float: left;\n}\n.bv-choose-people_canselect_title_right {\n  float: right;\n}\n.bv-choose-people_canselect_title_right .el-checkbox {\n  margin-right: 10px;\n}\n.bv-choose-people_canselect_title_right .el-checkbox:last-child {\n  margin-right: 0;\n}\n.bv-choose-people_canselect_title_right .el-checkbox__label {\n  padding-left: 5px;\n}\n.bv-choose-people_select_item {\n  display: inline-block;\n  margin-right: 20px;\n  margin-bottom: 10px;\n  cursor: pointer;\n}\n.bv-choose-people_select_item_avatar {\n  vertical-align: middle;\n  display: inline-block;\n  width: 30px;\n  height: 30px;\n  background: #409eff;\n  color: #fff;\n  border-radius: 50%;\n  font-size: 12px;\n  text-align: center;\n  line-height: 30px;\n  margin-right: 10px;\n}\n.bv-choose-people_select_item_avatar img {\n  height: 30px;\n  width: 30px;\n  border-radius: 50%;\n}\n.bv-choose-people_select_item_avatar_close {\n  display: none;\n  font-size: large;\n  margin-top: -2px;\n}\n.bv-choose-people_select_item_avatar:hover .bv-choose-people_select_item_avatar_close {\n  display: inline-block;\n}\n.bv-choose-people_select_item_avatar:hover .bv-choose-people_select_item_avatar_name {\n  display: none;\n}\n.bv-choose-people_select_item_name {\n  display: inline-block;\n  vertical-align: middle;\n}\n.bv-choose-people_select_item_name b,\n.bv-choose-people_select_item_name i {\n  display: block;\n  font-style: normal;\n  font-weight: normal;\n}\n.bv-choose-people_select_item_name i {\n  font-size: 12px;\n  margin-top: -5px;\n  color: #999;\n}\n.bv-choose-people_select {\n  width: 50%;\n  margin-left: -1px;\n  padding: 16px;\n  overflow-y: auto;\n  position: relative;\n  padding-left: 5px;\n}\n.bv-choose-people_foot {\n  text-align: right;\n  padding: 10px 20px;\n  background: #f2f2f2;\n  border-top: 1px solid #c3c3c3;\n}\n.bv-choose-people_select_item_checked {\n  display: inline-block;\n  margin-right: 20px;\n  cursor: pointer;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  font-size: 12px;\n  text-align: center;\n  line-height: 30px;\n  margin-right: 10px;\n  position: relative;\n  background-color: #1f64a3;\n  color: #1f64a3;\n}\n.bv-choose-people_select_item_checked:before,\n.bv-choose-people_select_item_checked:after {\n  content: '';\n  pointer-events: none;\n  position: absolute;\n  color: white;\n  border: 1px solid;\n  background-color: white;\n}\n.bv-choose-people_select_item_checked:before {\n  width: 2px;\n  height: 2px;\n  left: 28%;\n  top: 48%;\n  transform: skew(0deg, 60deg);\n  -ms-transform: skew(0deg, 60deg);\n  -webkit-transform: skew(0deg, 60deg);\n}\n.bv-choose-people_select_item_checked:after {\n  width: 8px;\n  height: 2px;\n  left: 41%;\n  top: 43%;\n  transform: skew(0deg, -60deg);\n  -ms-transform: skew(0deg, -60deg);\n  -webkit-transform: skew(0deg, -40deg);\n}\n"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$1 = undefined;
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* style inject SSR */
      
      /* style inject shadow dom */
      

      
      const __vue_component__$1 = normalizeComponent(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        false,
        createInjector,
        undefined,
        undefined
      );

    exports.ChoosePeopleOrOrg = __vue_component__$1;
    exports.Upload = __vue_component__;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
