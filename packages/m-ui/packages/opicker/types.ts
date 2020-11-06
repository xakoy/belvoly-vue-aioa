export interface OPickerNode {
    id: string
    name: string
    text?: string
    value: string
    isParent: boolean
    nodes?: OPickerNode[]
    nodeType?: string
    sequence: number
    data?: any
    [key: string]: any
}
