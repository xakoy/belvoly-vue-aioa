## 说明
移动前端核心库，包含 `request`, `配置`

### 使用方法
#### requeset 
```js
const { data, success } = await request('/xxx',
        {
            method: 'GET',
            data: { name: 'XX' }
        }
})
```

#### requeset 取消
```js
let abort

const result = request('/xxx',
        {
            method: 'GET',
            data: { name: 'XX' }，
            cancel: (c) => {
                abort = c
            }
        }
})
// 取消
abort()

const { success, isCancel } = await result
if(success) {
    // success = false
}


```

#### requestVariant 
> request的变体方法，返回promise和abort，支持直接取消，参数和返回值和request一样

```js
const { promise, abort } = requestVariant('/x')

setTimeout(abort, 1000)

const { data, success, isCancel } = await promise
if (success) {
    //data
} else if (isCancel) {
    //被取消的
}
```
## 版本记录
### v 0.1.16 
1. 增加`request`的`RequestOption`参数说明

### v 0.1.15
1. 选人组件调用的接口可以在浏览器中直接打开并返回数据，安全检测提升安全不够，需要修改为受保护的public/private接口[#24](https://github.com/xakoy/belvoly-vue-aioa/issues/24)

### v 0.1.13
1. 修复`request`在safari浏览器，当页面使用window.location.href产生302的情况，会显示错误提示。
### v 0.1.12
1. 增加企业微信的配置和支持

### v 0.1.11
1. `request` 增加异常处理`handleCatch` 参数。 修复异常时 没有返回正确的response

### v 0.1.10
1. `request` 增加 isShowError选项，是否默认显示错误信息
2. `request` Get 方式过滤null和undifine选项

### v 0.1.6
1. `request`修复options为`null`BUG

### v 0.1.5
1. `request`增加`cancel`取消的选项，返回值增加`isCancen`判断是否主动取消的
2. 增加`requestVariant`，是`request`的变体，返回 { promise, abort }

### v 0.1.2
1. 修复TS编译的Target为`esnext`，导致编译在低版本浏览器无法运行