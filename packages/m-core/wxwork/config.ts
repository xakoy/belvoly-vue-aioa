export interface WxworkConfig {
    debug?: boolean
    appId: string
    getJssdkTicketApiUrl: string
    enabled: boolean
}

export function setConfig(config: WxworkConfig) {
    return {
        enabled: true,
        debug: false,
        appId: '',
        getJssdkTicketApiUrl: '',
        ...config
    } as WxworkConfig
}
