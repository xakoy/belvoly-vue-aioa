## 说明
belvoly vue 移动APP专用组件库

### 组件
1. `ChoosePeopleOrOrg` 选人组件
2. `Upload` 上传组件

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