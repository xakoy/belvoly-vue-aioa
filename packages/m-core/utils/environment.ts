import BM from './bm'

export function isInIOS(userAgent?: string) {
    userAgent = userAgent || navigator.userAgent.toLowerCase()

    return userAgent.indexOf('iPhone') !== -1
}

export function isInWeChat(userAgent?: string) {
    userAgent = userAgent || navigator.userAgent.toLowerCase()

    return userAgent.indexOf('micromessenger') !== -1
}

export function isInWeChatWork(userAgent?: string) {
    userAgent = userAgent || navigator.userAgent.toLowerCase()

    return userAgent.indexOf('wxwork') !== -1
}

export function isInDingTalk(userAgent?: string) {
    userAgent = userAgent || navigator.userAgent.toLowerCase()

    return userAgent.indexOf('dingtalk') !== -1
}

export function isApp() {
    return new Promise<boolean>(resolve => {
        if (!BM) {
            resolve(false)
            return
        }
        BM.appointment.driver.getLaster(({ platform }) => {
            const isapp = platform === 'android' || platform === 'ios'
            resolve(isapp)
        })
    })
}
