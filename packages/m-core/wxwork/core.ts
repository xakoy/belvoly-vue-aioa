import { getJsapiTicket } from '../services/wxworkService'
import { wx } from './wx'
import rootConfig from '../config'

const gb = {
    debug: false,
    appId: '', //'wwc11ee87e20b780401',
    initialized: false,
    jsApiList: [], //['previewFile', 'previewImage'],
    currentUrl: ''
}

/**
 * 是否启用
 */
export function isEnabled() {
    return rootConfig.wxwork.enabled
}

/**
 * https://work.weixin.qq.com/api/doc/90000/90136/90514
 */
export async function initJsSDK({ jsApiList }: { jsApiList: string[] }) {
    gb.appId = rootConfig.wxwork.appId
    gb.debug = rootConfig.wxwork.debug

    const url = window.location.href
    if (gb.initialized && gb.currentUrl === url) {
        // 避免重复初始化
        return
    }
    if (jsApiList) {
        const apilist = jsApiList.filter(s => !gb.jsApiList.includes(s))
        gb.jsApiList.push(...apilist)
    }
    gb.initialized = true
    gb.currentUrl = url
    const { data, success } = await getJsapiTicket(url)
    if (success) {
        wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: gb.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: gb.appId, // 必填，企业微信的corpID
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: gb.jsApiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        })
        wx.error(res => {
            console.error('wxwork | initJsSDK', res)
            alert('企业微信初始化失败，可能导致系统无法正常运行，原因：' + res.errMsg)
        })
    }
}
