import _, { isArray, isBoolean, isDate, isInteger, isNumber, isObject } from 'lodash'
import config from "../config/config";
import {GscDate} from "../encode/GscDate";
import {GscSession} from "../appliction/session";

export const NetErrorLevelLocal = 'local'
export const NetErrorLevelRemote = 'remote'
export const NetErrorLevelService = 'service'

export const NetErrorLevel = {
    local: 'local', // 本地代码错误
    service: 'service', // 微服务错误
    remote: 'remote' // 服务器或者网络硬件错误
}

const error_handle = {}

export class NetCommon {
    service
    class
    action
    header = {}
    host
    session
    api_token

    constructor (service) {
        this.service = service
        this.host = config.getUrl()
        this.session = this.loadSession()
        this.init()
    }

    static setErrorHandle (level, pfn) {
        error_handle[level] = pfn
    }

    static build_post_params (arg) {
        if (arg.length === 0) {
            return ''
        }
        let params = 'gsc-post:'
        arg.forEach(param => {
            params += `${param}:,`
        })
        return _.trimEnd(params, ':,')
    }

    // 根据参数实际类型生成参数
    static autoAppendParamType (...args) {
        for (let i = 0; i < args.length; i++) {
            if (isNumber(args[i])) {
                args[i] = isInteger(args[i]) ? (args[i] = 'i:' + String(args[i])) : (args[i] = 'f:' + String(args[i]))
            } else if (isArray(args[i])) {
                args[i] = 'ja:' + JSON.stringify(args[i])
            } else if (isObject(args[i])) {
                args[i] = 'j:' + JSON.stringify(args[i])
            } else if (isBoolean(args[i])) {
                args[i] = 'b:' + String(args[i])
            } else if (isDate(args[i])) {
                args[i] = GscDate.toDatetimeString(args[i])
            }
        }
        return args
    }

    loadSession(){
        if(!this.session){
            this.session = GscSession.getInstance()
        }
        return this.session
    }

    init () {
        this.api_token = ''
        this.header = {}
    }

    // 故障处理函数
    errorHandle (e, level) {
        if (_.has(error_handle, level)) {
            error_handle[level](e, level)
        }
        return false
    }

    filterResult (response) {
        let v
        if (response.status !== 200) {
            v = {
                errorcode: 1,
                message: `服务应答异常:${response.status}`
            }
            this.errorHandle(v, NetErrorLevel.remote)
        } else {
            v = response.data
        }
        if (v.errorcode === 1) {
            this.errorHandle(v, NetErrorLevel.service)
        }
        return v
    }

    filterError (error, message) {
        const v = {
            errorcode: 1,
            message: '网络请求异常!' + (message ?? '')
        }
        this.errorHandle(v, NetErrorLevel.local)
        // console.log(error);
        return error
    }

    getHeader () {
        // 根据登陆情况,带入SID
        if (this.session && this.session.logging()) {
            this.header.GrapeSID = this.session.getSID()
        }

        // 根据配置情况,带入appKey
        if (this.header.appID === 0 || this.header.appID === '0') {
            if (_.has(config, 'appKey')) {
                this.header.appKey = String(config.appKey)
            }
        }

        // 根据授权请求,带入授权key(需要通用授权码系统支持！！！)
        if (this.api_token.length > 0) {
            this.header.GrapeOauth2 = this.api_token
        }
        return this.header
    }

    build_get_header () {
        let header = ''
        const keys = _.keys(this.header)
        if (keys.length > 0) {
            header = '/gscHeader_start'
            keys.forEach(key => {
                header += `/${key}/${this.header[key]}`
            })
            header = `${header}/gscHeader_end`
        }
        return header
    }

    build_params (_url, arg) {
        let url = _url
        if (arg.length > 0) {
            arg.forEach(p => {
                url += `/${p}`
            })
        }
        return url
    }

    build_get_params (arg) {
        return this.build_params(this.build_base_url(), arg)
    }

    build_base_url () {
        return `${this.host}/${this.service}/${this.class}/${this.action}`
    }

    setHost (url) {
        this.host = url
        return this
    }

    setPath (className, actionName) {
        this.class = className
        this.action = actionName
        return this
    }

    setHeader (key, values) {
        this.header[key] = values
        return this
    }

    setApiToken (token) {
        this.api_token = token
        return this
    }
}
