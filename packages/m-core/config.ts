import { WxworkConfig, setConfig as setWxworkConfig } from './wxwork/config'
interface GloablConfigType {
    apiHost?: string
    token?: string
    o365?: O365Config
    wxwork?: WxworkConfig
}

interface O365Config {
    enabled: boolean
    baseURI: string
    blobURI: string
    supportFileExtensions: string[]
}

const gloablConfig: GloablConfigType = {
    apiHost: '',
    token: '',
    o365: null,
    wxwork: null
}

export function setGloablConfig(config: typeof gloablConfig) {
    if (config.apiHost) {
        gloablConfig.apiHost = config.apiHost
    }
    if (config.token) {
        gloablConfig.token = config.token
    }
    if (config.o365) {
        gloablConfig.o365 = config.o365
    }
    if (config.wxwork) {
        gloablConfig.wxwork = setWxworkConfig(config.wxwork)
    }
}

export default gloablConfig
