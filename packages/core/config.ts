interface GloablConfigType {
    apiHost?: string
    token?: string
}

const gloablConfig: GloablConfigType = {
    apiHost: '',
    token: ''
}

export function setGloablConfig(config: typeof gloablConfig) {
    gloablConfig.apiHost = config.apiHost
    gloablConfig.token = config.token
}

export default gloablConfig
