import * as utils from './utils'
import * as services from './services'
import { default as globalConfig, setGloablConfig } from './config'

const { request, requestVariant } = utils.request

export { globalConfig, setGloablConfig, utils, services, request, requestVariant }
