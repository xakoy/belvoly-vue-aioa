import { User } from '@belvoly-vue-aioa/m-core/services/userService'

export interface PeopleDataFilterOfChoosePeopleOrOrg {
    (users: User[]): User[]
}
