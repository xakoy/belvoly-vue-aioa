# v0.2.14
1. 增加`forcedRootBlock` 属性，参考[tinymce的官方文档](https://www.tiny.cloud/docs/configure/content-filtering/#forced_root_block), 用于设置编辑默认是否添加P元素，警告：官方不推荐禁用此功能。
# v0.2.13
1. 富文本编辑器在全屏状态下点击的菜单栏点击无效 #4954
# v0.2.12
1. 增加`codesample`插件，使用此插件需要引入额外的样式，需要在public目录新建文件夹`js`里面放置从tinymce拷贝skins这个目录放置到js目录下
# v0.2.11
1. 增加`menubar`属性，boolean是否显示菜单栏
# v 0.2.8
1. 修复tinymce 没有值的情况下出现了滚动条
## v 0.2.7
1. 修复tinymce 引入错误的content_css导致影响整体页面样式
## v 0.2.6
1. 修复tinymce 只有点击第一行才可以编辑
## v 0.2.5
1. 修复readonly没起作用
## v 0.2.4
1. 增加readonly、height属性
## v 0.2.3
1. 修复IE 11兼容问题
2. 修复VsCode TS 提示问题
## v 0.2.2
1. 修复在el-dialog中工具栏隐藏在dialog的下方
2. 增加`TinymceEditorPreview`组件来确保样式和编辑一致
    ```html
    <tinymce-editor-preview :content="html" />
    ```
## v 0.2.1
1. 修复iOS 在中文输入法下输入 ‘uuuu’ 直接点击完成，会连续触发 focusout, focusin, 导致键盘被收回，但是判断为键盘弹起来了
## v 0.2.0
1. 修复在iOS中文输入法下偶尔会接受到拼音到参数
2. 更新tinymce版本，更好到支持移动端
## v 0.1.9
1. 增加移动端在获得焦点和失去焦点时增加keyboardShow、keyboardHide事件
2. 修复Vue toolbar属性 object类型不对错误
## v 0.1.7
1. 增加行高按钮
2. 增加首行缩进按钮