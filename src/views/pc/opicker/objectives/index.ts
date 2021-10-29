import { registerOPickerService } from '../../../../../packages/ui/index'
// import { registerOPickerService } from '../../../../../packages/m-ui'

import { orgObjective } from './org'
import { orgUserObjective } from './org-user'
import { flowCategoryObjective } from './flow-category'

registerOPickerService(orgObjective)
registerOPickerService(orgUserObjective)
registerOPickerService(flowCategoryObjective)
