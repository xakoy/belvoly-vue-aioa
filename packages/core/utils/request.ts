import axios, { Method as AxiosMethod, AxiosResponse, AxiosRequestConfig } from 'axios'
// import store from '@/store'
import { format } from './string'
import gloablConfig from '../config'

import { Notification } from 'element-ui'

const isAppleWebKit = window.navigator.userAgent.indexOf('AppleWebKit') > -1

const axiosInstance = axios.create({})

export interface RequestOption extends AxiosRequestConfig {
    url?: string
    method?: AxiosMethod
    headers?: any
    data?: any
}

export interface ResponseOption<T> {
    isShowError?: ((response: AxiosResponse, error: any) => boolean) | boolean
    isSuccess?: (response: AxiosResponse) => boolean
    getData?: (response: AxiosResponse) => T
    handleCatch?: (
        e: any
    ) => Promise<{
        /**
         * 返回是否处理完成，true：则后续不处理，false：则还继续处理
         */
        handle: boolean
        /**
         * 当handle: true, 返回接口当数据
         */
        result?: any
        /**
         * 当handle: false，返回的错误信息
         */
        errorText?: string
    }>
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

/**
 * 请求一个WEBAPI地址，request的一个变体，返回取消和promise
 * @param url 请求的地址
 * @param options 请求选项
 * @param resOption 结果的选项
 *
 * @example
 *       const { promise, abort } = requestVariant('/x')
 *
 *       setTimeout(abort, 1000)
 *
 *       const { data, success, isCancel } = await promise
 *       if (success) {
 *           //data
 *       } else if (isCancel) {
 *          //被取消的
 *       }
 *
 */
export function requestVariant<T>(
    url: string,
    options?: RequestOption,
    resOption?: ResponseOption<T>
): {
    /**
     * 取消的方法
     */
    abort: () => void
    /**
     * 执行的promise
     */
    promise: Promise<{
        data?: T
        error?: any
        response?: any
        success: boolean
        isCancel?: boolean
    }>
} {
    let cancel
    const cancelDelegate = c => {
        cancel = c
    }
    const { ...ops } = options
    const newOptions = {
        ...ops,
        cancel: cancelDelegate
    }
    return {
        promise: request<T>(url, newOptions, resOption),
        abort: cancel
    }
}

export function request<T>(
    url: string,
    options: RequestOption & {
        /**
         * 取消回调函数
         * @example
         *
         * let cancel
         *
         * const { data, success } = await request('/xxx',
         *     {
         *         cancel: (c) => {
         *              cancel = c
         *         }
         *     })
         *
         * cancel
         */
        cancel?: (cancel: () => void) => void
    } = {},
    resOption?: ResponseOption<T>
): Promise<{ data?: T; error?: any; response?: any; success: boolean; isCancel?: boolean }> {
    const { cancel, ...ops } = options
    const config: AxiosRequestConfig = {
        method: <Method>'GET',
        headers: {},
        ...ops
    }
    config.url = url

    const type = config.method

    if (type === 'GET') {
        const str = config.data
            ? Object.keys(config.data)
                  .filter(key => config.data[key] !== undefined && config.data[key] !== null)
                  .map(key => {
                      return `${key}=${encodeURIComponent(config.data[key])}`
                  })
                  .join('&')
            : ''
        config.url = `${config.url}${url.indexOf('?') > -1 ? '&' : '?'}_=${new Date().getTime()}${str ? '&' + str : ''}`
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

    const responsedOption: ResponseOption<T> = {
        isShowError: true,
        isSuccess: response => {
            return response.status >= 200 && response.status < 300 && response.data.flag === 0
        },
        getData: response => {
            return response.data.data
        },
        ...resOption
    }

    if (cancel) {
        config.cancelToken = new axios.CancelToken(cancel)
    }

    return new Promise(resolve => {
        axiosInstance
            .request(config)
            .then(response => {
                return new Promise<AxiosResponse<any>>((interResolve, interReject) => {
                    if (responsedOption.isSuccess(response)) {
                        interResolve(response)
                    } else {
                        interReject({ response: response })
                    }
                })
            })
            .then(response => {
                resolve({
                    data: responsedOption.getData(response),
                    response: response,
                    success: true
                })
            })
            .catch(async e => {
                const isNetworkError = getValue(e, 'message') === 'Network Error'

                let errorText = ''

                const { handleCatch } = responsedOption

                if (handleCatch) {
                    const { handle, errorText: handleErrorText, result: handleResult } = await handleCatch(e)
                    if (handle) {
                        if (handleResult) {
                            resolve(handleResult)
                        }
                        return
                    } else {
                        errorText = handleErrorText
                    }
                }

                const isCancel = axios.isCancel(e)

                if (errorText) {
                    errorShow(errorText)
                } else {
                    const isShowError =
                        !(isAppleWebKit && isNetworkError) && (typeof responsedOption.isShowError === 'boolean' ? responsedOption.isShowError : responsedOption.isShowError(e.response, e))
                    const status = getValue(e, 'response.status')
                    const flag = getValue(e, 'response.data.flag')

                    if (flag && flag > 0) {
                        errorText = getValue(e, 'response.data.message', getValue(codeMessage, status, getValue(e, 'response.statusText', '')))
                    } else {
                        errorText = '请刷新重试、重新登录或联系管理员'
                    }

                    if (!isCancel && isShowError) {
                        errorShow(errorText)
                    }
                }
                resolve({
                    isCancel: isCancel,
                    error: e,
                    response: e.response,
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
    request,
    requestVariant
}
