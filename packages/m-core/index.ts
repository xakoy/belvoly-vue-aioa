import * as utils from './utils'
import * as services from './services'
import * as wxwork from './wxwork'
import { default as globalConfig, setGloablConfig } from './config'

const { request, requestVariant } = utils.request

export { globalConfig, setGloablConfig, utils, services, request, requestVariant, wxwork }
