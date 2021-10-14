## 说明
belvoly vue 移动APP专用组件库

### 组件
1. `ChoosePeopleOrOrg` 选人组件
2. `Upload` 上传组件

### 0.1.50
1. `ChoosePeopleOrOrg` 模糊搜索用户时，人员增加部门信息，人员名称同名是可以区分用户
### 0.1.48
1. `Upload` 的 `uploading` 事件增加进度参数
2. `Upload` 修复simple模式只能上传图片
3. `Upload` 增加手动触发选择文件`chooseFile`方法

### 0.1.47
1. `Upload` 增加 `add` 事件
### 0.1.46 
1. `Upload` 增加`enabledRename`属性，是否开启重命名功能
2. `Upload` 修复批量上传报错
3. `Upload` 增加开启下载日志功能
### 0.1.45
1. `Upload` 增加`nameMaxLength`属性，限制名称最大长度，增加`beforeRename`属性，可以在重命名时验证

### 0.1.44
1. `Upload` 上传控件增加重命名的事件支持
### 0.1.43
1. `ChoosePeopleOrOrg` 增加 `peopleDataFilter` 用户过滤器

### 0.1.42
1. [FEATURE#1482] 选人控件机构不可以选时箭头移动到右侧，并且点击文字时展开或折叠。选择的内容在展开时撑满屏幕
### 0.1.41
1. `Upload` 增加`onRemove`属性，当定义此属性，则替换默认删除事件
### 0.1.39
1. `Upload` 修复查看按钮判断是在线预览，文件扩展名是大写会导致判断失败
2. `Upload` 在线预览如果不支持，则也会触发`download`事件

### 0.1.37
1. `OPicker` 增加`chainAjax`生命周期，解决设置请求前的信息
### 0.1.36
1.  `Upload` 组件增加 `download`事件
### 0.1.35
1. `OPicker` 搜索行为由点击确定修改为输入立即搜索[#22](https://github.com/xakoy/belvoly-vue-aioa/issues/22)
### 0.1.27
1.  `OPicker` 增加`dataConvert`生命周期配置，用来解决接口返回的特殊数据转换。
2.  `OPicker`和`ChoosePeopleOrOrg`修复页面后退没有关闭窗口
3. 修复`OPicker`和`ChoosePeopleOrOrg`销毁时JS报错
4. `OPicker`点击下方已经选中的元素，可以快速删除
5. `tree` 增加同步数据节点属性

### 0.1.25
1. 增加企业微信的配置和支持
2. 修复App内o365判断有误，预览问题

## 更新
### 0.1.23
1. `Upload` 修复APP 图片模式，上传显示图片格式不正确和图片太大无法上传的问题

### 0.1.22
1. `Upload` 修复APP 选图片和选附件是一样的界面，选图片只可以选择图片
### 0.1.21
1. `Upload` 样式调整

### 0.1.20
1. `Upload` 组件增加 `buttons`的slot

### 0.1.19
1. `ChoosePeopleOrOrg` 修复点击选人，出现2次数据

### 0.1.18
1. `ChoosePeopleOrOrg` 点击label可以选中
2. `ChoosePeopleOrOrg` 点击下方已经选中的元素，可以快速删除

### 0.1.17
1. `Upload`组件增加属性`simple`，简易模式，不包含任意界面
2. `Upload`组件增加`uploading`、`error`事件

### v 0.1.9
1. `OPicker`和`ChoosePeopleOrOrg`修复在iOS 11底部安全区域显示正常

### v 0.1.8
1. `Upload`组件支持在APP中上传和预览

### v 0.1.7
1. 增加`OPicker` 组件

### v 0.1.6
1. `ChoosePeopleOrOrg` 组件的`model`属性可以设置为`org`，用于选择机构
2. 修复BUG导致的编译失败

### v 0.1.5
1. `ChoosePeopleOrOrg` 组件增加搜索功能
2. `ChoosePeopleOrOrg` 组件可以正确识别`isShowGlobal`属性

### v 0.1.2
1. `ChoosePeopleOrOrg` 修复页面有滚动条，选人的界面没有全屏显示 
2. `Upload` 增加查看模式，和图标有Word、Excel、PPT、其它四种显示图标