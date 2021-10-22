### 0.1.49
1. 修复选人组件拿到的api地址不正确
### 0.1.48
1. `Upload` 控件重构，显示文件的逻辑重写，不用element-ui字段的效果
### 0.1.47
1. `Upload` 开启下载日志功能设为默认开启
### 0.1.46
1. `Upload` 增加开启下载日志功能
### 0.1.45
1. `Upload` 功能和移动端保持一致，增加在线查看选项
### 0.1.44 
1. `ChoosePeopleOrOrg` 增加 `peopleDataFilter` 用户过滤器
### 0.1.43
1. `Upload` 增加`onRemove`属性，当定义此属性，则替换默认删除事件
## v0.1.42
1. `ChoosePeopleOrOrg` 搜索用户无效 [BUG#4472]

## v0.1.40
1. `ChoosePeopleOrOrg` 自定义tab切换时，待选择区域数据还是上一tab的数据。同时修复点击左侧树节点接口很慢的情况下，数据显示错误。
## v0.1.39
1. `ChoosePeopleOrOrg`自定义tab页面默认展开第一个节点 [BUG#4282]
2. `ChoosePeopleOrOrg` 更新默认头像 [BUG#4273]
3. `ChoosePeopleOrOrg` 自定义tab点击全选和列表点开的数据匹配、点击清空按钮全选的勾选按钮不勾选 [BUG#4274]
4. `Upload` 修复点击标题也触发`download`事件
5. `Upload` 在线预览断修复大小写扩展名判断失败，修复如.doc和.DOC都可以支持
## v0.1.37
1. `ChoosePeopleOrOrg` 增加`objectives`属性，支持选人配置自定义tab页面

## v0.1.35
1.  `Upload` 组件增加 `download`事件
## v0.1.34
1. 修复`ChoosePeopleOrOrg`在接口请求慢的时候，会先显示暂无数据，再把选人的数据显示出来 [#20](https://github.com/xakoy/belvoly-vue-aioa/issues/20)
## v0.1.31
1. `ChoosePeopleOrOrg` beforeClose 方法增加了action参数，是确定关闭，还是取消关闭

## v0.1.30
1. `ChoosePeopleOrOrg`增加关闭前方法属性，关闭前的回调，会暂停 Dialog 的关闭	function(done)，done 用于关闭 Dialog
2. `ChoosePeopleOrOrg`增加了`selectedOrgChange`、`selectedUserChange`、`selectedChange`三个事件

## v0.1.24
1. 调整`ChoosePeopleOrOrg`组件样式

## v 0.1.22
1. 调整`Upload`样式

## v 0.1.21
1. `Upload`组件增加属性`simple`，简易模式，不包含任意界面
2. `Upload`组件增加`uploading`、`error`事件
3. 修复`ChoosePeopleOrOrg`组件右边选人的宽度没固定
4. 调整`ChoosePeopleOrOrg`选人样式

## v 0.1.7
[新增]
1. 增加选人控件全局搜索

[修复]
1. 选人控件本单位搜索
2. 选人控件子部门选项无效

# API
## Upload
上传组件

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| label | 标题 | *string* | `附件` |
| action | 上传的API地址 | *string* | `${config.api.baseURI}/sharedservice/blob/upload` |
| multiple | [是否开启图片多选，部分安卓机型不支持](#/zh-CN/uploader) | *boolean* | `true` |
| fileList | 第一次显示文件集合 | *file[]* | `[]` |
| visible 支持`.sync`语法 | 是否显示 | *boolean* | `false` |
| refTableName | 共享附件接口`refTableName`参数 | *string* | - |
| typeCode | 共享附件接口`typeCode`参数 | *string* | - |
| userUid | 当前用户的`userUid` | *string* | - |
| tip | 提示文字 | *string* | - |
| maxSize | 最多只能上传多少MB内容 | *number* | `50` |
| limit | 最多可以上传多少个文件 | *number* | `9999` |
| isOnlyImage | 是否只允许图片 | *boolean* | `false` |
| readonly | 是否只读模式 | *boolean* | `false` |
| simple | 是否简易模式 | *boolean* | `false` |
| beforeUpload | 上传前验证，Promise 异常，则取消上传 | *Promise<void>* | - |
| enableDownloadLog | 是否开启下载日志 | *boolean* | `true` |


### Events

| 事件名 | 说明 | 回调参数 |
|------|------|------|
| success | 上传成功后触发 | *info*, *responseData* |
| change | 上传完成后触发 | *files[]* |
| error | 上传失败后触发| - |
| uploading | 上传中后触发| - |
| download | 点击下载后的事件 | file |

### Methods

| 方法名 | 说明 | 回调参数 |
|------|------|------|
| updateRelevance| 更新关联业务表记录ID | refTableID: *string* |

### Slots

| 名称 | 说明 | 参数
|------|------|------|
| buttons | 按钮区自定义内容 | item: { status: '文件状态', file: '文件内容'} |
| simple | 简易模式的上传自定义内容 | - |


## ChoosePeopleOrOrg
选人选部门组件
### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| title | 标题 | *string* | `选择人员` |
| selectionMode | 选择模式，单选还是多选 | *`multiple`,`single`* | `single` | 
| mode | 模式，选用户还是选用户和部门 | `user`,`orgAndUser` | `orgAndUser` |
| rootOrgCode | 根部门Code | *string* | - |
| visible | 是否可见 ｜ *boolean* | `false` |
| isShowGlobal | 是否显示全局人员 ｜ *boolean* | `false` |
| defaultUsers | 默认选中的用户集合 | *NameValue[]* | |
| defaultOrgs | 默认选中的部门集合 | *NameValue[]* | |
| beforeClose | 关闭前触发的方法 | Functin(internalClose, 'ok' \| 'cancel') | |
| peopleDataFilter | 用户数据源过滤器 | Function(users: user[]) => user[]  | |
