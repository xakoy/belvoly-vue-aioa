import { User } from '@belvoly-vue-aioa/core/services/userService'

export interface PeopleDataFilterOfChoosePeopleOrOrg {
    (users: User[]): User[]
}
