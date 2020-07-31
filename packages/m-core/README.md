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
###
1. `request` 增加 isShowError选项，是否默认显示错误信息
### v 0.1.6
1. `request`修复options为`null`BUG

### v 0.1.5
1. `request`增加`cancel`取消的选项，返回值增加`isCancen`判断是否主动取消的
2. 增加`requestVariant`，是`request`的变体，返回 { promise, abort }

### v 0.1.2
1. 修复TS编译的Target为`esnext`，导致编译在低版本浏览器无法运行