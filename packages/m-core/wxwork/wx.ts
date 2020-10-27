import { WxworkMedia } from './media'

interface WxworkCore {
    config(options: { beta: boolean; debug: boolean; appId: string; timestamp: string; nonceStr: string; signature: string; jsApiList: string[] }): void
    ready(cb: () => void): void
    error(cb: (res: { errMsg: string; err_msg: string }) => void): void
}

interface Wxwork extends WxworkCore, WxworkMedia {}

const wx: Wxwork = (window as any).wx

export { wx }
