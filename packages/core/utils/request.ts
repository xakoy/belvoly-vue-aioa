import axios, { Method as AxiosMethod, AxiosResponse } from 'axios'
// import store from '@/store'
import { format } from './string'
import gloablConfig from '../config'

import { Notification } from 'element-ui'

const axiosInstance = axios.create({})

export interface RequestOption {
    url?: string
    method?: AxiosMethod
    headers?: any
    data?: any
}

export enum Method {
    Post = 'POST',
    Get = 'GET',
    Put = 'PUT',
    Delete = 'DELETE'
}

const codeMessage = {
    200: '操作成功',
    201: '新建或修改数据成功',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '参数错误',
    401: '需要用户验证',
    403: '用户无权限',
    404: '资源不存在',
    405: '不支持的操作方法',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的',
    422: '当创建一个对象时，发生一个验证错误',
    500: '服务器内部错误',
    502: '应用程序错误',
    503: '维护中',
    504: '网关超时'
}

function errorShow(errorText) {
    Notification.error({
        title: `请求错误:`,
        message: errorText || '请刷新重试、重新登录或联系管理员'
    })
}

export function request<T>(url: string, options?: RequestOption): Promise<{ data?: T; error?: any; response?: any; success: boolean }> {
    const config = {
        method: <Method>'GET',
        headers: {},
        ...options
    }
    config.url = url

    const type = config.method

    if (type === 'GET' && config.data) {
        const str = Object.keys(config.data)
            .map(key => {
                return `${key}=${encodeURIComponent(config.data[key])}`
            })
            .join('&')
        config.url = `${config.url}${url.indexOf('?') > -1 ? '&' : '?'}_=${new Date().getTime()}&${str}`
    }

    const token = gloablConfig.token
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }

    const contentType = config.headers['Content-Type']
    if (contentType === 'application/x-www-form-urlencoded') {
        config.data = convertToAxiosData(config.data)
    }

    if (!contentType && (type === 'POST' || type === 'DELETE' || type === 'PUT')) {
        config.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...config.headers
        }
    }

    return new Promise(resolve => {
        axiosInstance
            .request(config)
            .then(response => {
                return new Promise<AxiosResponse<any>>((interResolve, interReject) => {
                    if (response.status >= 200 && response.status < 300) {
                        if (response.data.flag === 0) {
                            interResolve(response)
                        } else {
                            interReject(response)
                        }
                    } else {
                        interReject(response)
                    }
                })
            })
            .then(response => {
                resolve({
                    data: response.data.data,
                    response: response,
                    success: true
                })
            })
            .catch(e => {
                const status = getValue(e, 'response.status')
                const flag = getValue(e, 'data.flag')
                let errorText = ''
                if (flag && flag > 0) {
                    errorText = getValue(e, 'data.message', getValue(codeMessage, status, getValue(e, 'statusText', '')))
                } else {
                    errorText = '请刷新重试、重新登录或联系管理员'
                }

                errorShow(errorText)

                resolve({
                    error: e,
                    success: false
                })
            })
    })
}

function getValue(target, key: string, defaultValue?) {
    const paths = typeof key === 'string' ? key.split('.') : [key]
    try {
        return paths.reduce((prev, path) => {
            return prev[path]
        }, target)
    } catch (e) {
        return defaultValue || ''
    }
}

function convertToAxiosData(data) {
    const result = new URLSearchParams()

    if (!data) {
        return result
    }

    Object.keys(data).forEach(key => {
        result.set(key, data[key])
    })

    return result
}

export function callApi<T>({ url, type }: { url: string; type: AxiosMethod }, options: RequestOption = {}) {
    let newUrl = url
    if (type === Method.Get && options.data) {
        newUrl = format(url, options.data)
    }
    options.method = type
    return request<T>(newUrl, options)
}

export function get<T>(url: string, options: RequestOption = {}) {
    options.method = Method.Get
    return request<T>(url, options)
}

export default {
    request
}
