import { OPickerNode } from './types'

export interface Objective<C extends object = {}> {
    code: string
    title: string
    config: C
    url: string
    chainAjax?: (ajax: any) => void
    /**
     * 数据转换，第一次请求接口，会调用此方法
     */
    dataConvert?: (data: any) => any[]
    /*
     * 数据项过滤事件
     * @event dataFilter
     * @param {object} 过滤的数据项
     */
    dataFilter<T>(item, config: C, obj: Objective<C>, options: { selectionMode: string }): OPickerNode
    /*
     * 获取静态数据数据源
     * @event getStaticDataSource
     */
    getStaticDataSource?: Function

    getSearchUrl?: (config: C) => string
    /*
     * 获取服务Url事件
     * @event getUrl
     * @param {json} config
     * @param {string} url[default=this.url] 要包装的Url默认为当前url属性
     */
    getUrl?: (config: C, url: string) => string
    /*
     * 是否显示图标
     * @event showIcon
     * @param {object} 数据项
     */
    showIcon?: (item) => boolean
}

const objectives: {
    [key: string]: Objective
} = {}

export function register(obj: Objective) {
    objectives[obj.code] = obj
}

export function get(code: string) {
    return objectives[code]
}
