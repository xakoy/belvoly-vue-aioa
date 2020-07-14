export interface Node {
    level?: number
    label?: string
    value: string
    id: string
    children?: Node[]
    check?: boolean
    [key: string]: any
    loading?: boolean
    loaded?: boolean
    parent?: Node
    isLeaf?: boolean
    cancheck?: boolean
    data?: any
}
