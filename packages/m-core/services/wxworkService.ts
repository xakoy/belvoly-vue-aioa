import { request } from '../utils/request'
import config from '../config'

/**
 * 获取企业微信的JS API ticket
 * REF:// https://work.weixin.qq.com/api/doc/90000/90136/90514
 * @param url url
 */
export function getJsapiTicket(url: string) {
    return request<{
        noncestr: string
        timestamp: string
        signature: string
    }>(config.wxwork.getJssdkTicketApiUrl, {
        method: 'POST',
        data: {
            url: url
        }
    })
}

export default {
    getJsapiTicket
}
