interface GloablConfigType {
    apiHost?: string
    token?: string
}

const gloablConfig: GloablConfigType = {
    apiHost: '',
    token: ''
}

export function setGloablConfig(config: typeof gloablConfig) {
    if (config.apiHost) {
        gloablConfig.apiHost = config.apiHost
    }
    if (config.token) {
        gloablConfig.token = config.token
    }
}

export default gloablConfig
