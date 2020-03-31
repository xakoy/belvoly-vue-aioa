(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue-property-decorator'), require('element-ui')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vue-property-decorator', 'element-ui'], factory) :
    (global = global || self, factory(global.ui = {}, global.vuePropertyDecorator, global.elementUi));
}(this, (function (exports, vuePropertyDecorator, elementUi) { 'use strict';

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

    // import attachmentService from '@/services/attachmentService'
    const config = {
        sharedservice: {
            assets: {
                baseURI: ''
            }
        },
        api: {
            baseURI: ''
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
        handleRemove(file) {
            const id = file.id || file.response.data.id;
            // attachmentService.deleteAttachment(id, data => {
            //     this.$message({
            //         message: '删除附件成功',
            //         type: 'success',
            //         onClose: () => {}
            //     })
            //     const fileIndex = this.uploadFiles.findIndex(file => file.id === id)
            //     this.uploadFiles.splice(fileIndex, 1)
            // })
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
            el.previousSibling.parentElement.remove();
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
        updateRelevance(refTableID) {
            return new Promise(resolve => {
                const blobRelevance = {
                    ids: this.uploadFiles.map(file => file.id),
                    refTableName: this.refTableName,
                    refTableID: refTableID
                };
                // attachmentService.updateRelevance(blobRelevance, result => {
                //     resolve(result)
                // })
            });
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
        inject("data-v-94112e1e_0", { source: ".upload-detail .el-upload--text {\n  display: none !important;\n}\n.upload-detail .el-upload-list__item:hover .el-icon-close,\n.upload-detail .el-upload-list__item:hover .el-icon-close-tip {\n  display: none;\n}\n.upload-detail .el-upload-list__item .el-icon-close-tip {\n  display: none !important;\n}\n.upload-detail .el-upload-list__item .el-upload-list__item-name .el-upload-file-icon {\n  width: 16px;\n  height: 16px;\n  vertical-align: text-bottom;\n  margin-right: 7px;\n}\n", map: {"version":3,"sources":["Index.vue"],"names":[],"mappings":"AAAA;EACE,wBAAwB;AAC1B;AACA;;EAEE,aAAa;AACf;AACA;EACE,wBAAwB;AAC1B;AACA;EACE,WAAW;EACX,YAAY;EACZ,2BAA2B;EAC3B,iBAAiB;AACnB","file":"Index.vue","sourcesContent":[".upload-detail .el-upload--text {\n  display: none !important;\n}\n.upload-detail .el-upload-list__item:hover .el-icon-close,\n.upload-detail .el-upload-list__item:hover .el-icon-close-tip {\n  display: none;\n}\n.upload-detail .el-upload-list__item .el-icon-close-tip {\n  display: none !important;\n}\n.upload-detail .el-upload-list__item .el-upload-list__item-name .el-upload-file-icon {\n  width: 16px;\n  height: 16px;\n  vertical-align: text-bottom;\n  margin-right: 7px;\n}\n"]}, media: undefined });

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

    exports.Upload = __vue_component__;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
