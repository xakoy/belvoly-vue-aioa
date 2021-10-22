## 版本记录
### v 0.1.18
1. 增加`request`的`RequestOption`参数说明
### v 0.1.15
1. 选人组件调用的接口可以在浏览器中直接打开并返回数据，安全检测提升安全不够，需要修改为受保护的public/private接口[#24](https://github.com/xakoy/belvoly-vue-aioa/issues/24)
### v 0.1.13
1. 修复`request`在safari浏览器，当页面使用window.location.href产生302的情况，会显示错误提示。
### v 0.1.11
1. `request` 增加异常处理`handleCatch` 参数。 修复异常时 没有返回正确的response
2. `request` 增加 isShowError选项，是否默认显示错误信息
3. `request` Get 方式过滤null和undifine选项
4. `request`增加`cancel`取消的选项，返回值增加`isCancen`判断是否主动取消的
5. 增加`requestVariant`，是`request`的变体，返回 { promise, abort }
6. 修复`request` Get方式没有参数的情况下没有添加时间戳，导致IE缓存严重

### v 0.1.8
1. `request` Get 方式过滤null和undifine选项
### v 0.1.7
1. 修复TS编译的Target为`esnext`，导致编译在低版本浏览器无法运行

### v 0.1.4
[新增]
1. userService搜索用户接口增加parentOrgCode，只查询父机构下的用户