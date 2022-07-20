import _, { isArray, isObject } from 'lodash'
import {RpcClient} from "./rpcClient";

// #Rpc类,根据微服务和接口定义自动化检查各项参数是否符合要求(服务\接口层支持GSC)
export class BaseRpc {
    ctx
    #serviceName
    #recovery_fn = []
    #net

    constructor (serviceName) {
        this.#serviceName = serviceName
        this.#net = RpcClient.New(serviceName)
        this.#recovery_fn = []
        this.init()
    }

    static build (serviceName) {
        return new BaseRpc(serviceName)
    }

    setRecovery (pfn) {
        this.#recovery_fn.push(pfn)
        return this
    }

    getNet () {
        return this.#net
    }

    // 检查接口是否存在
    chkInterface (classDesc, className, actionName, ...arg) {
        if (!_.has(classDesc, actionName)) {
            throw new Error(`服务{${this.#serviceName}/${className} -> 接口[${actionName}] 不存在`)
        }
        // debugger;
        // 获得同名API列表
        const apiArray = classDesc[actionName]
        // debugger;
        // 根据参数数量过滤
        const resultArray = apiArray.filter(v => {
            return v.param.length === arg.length
        })
        // debugger;
        if (resultArray.length === 0) {
            throw new Error(`服务{${this.#serviceName}/${className} -> 接口[${actionName}] ->未找到合适的接口(参数数量或者类型不匹配)`)
        }
        // debugger;
        return apiArray
    }

    // 根据接口定义,动态纠正数据类型
    appendParamType (apiDesc, ...arg) {
        const r = []
        apiDesc.forEach(a => {
            const d = a.param
            if (d.length === arg.length) {
                for (let i = 0, l = d.length; i < l; i += 1) {
                    const v = isArray(arg[i]) || isObject(arg[i]) ? JSON.stringify(arg[i]) : arg[i]
                    const findIdx = v.indexOf(':')
                    if (findIdx > 0 && findIdx < 8) {
                        const type = v.substring(0, findIdx)
                        const value = v.substring(findIdx + 1)
                        const _v = type !== d[i] ? `${d[i]}:${value}` : v
                        r.push(_v)
                    } else {
                        r.push(`${d[i]}:${v}`)
                    }
                }
            }
        })

        if (r.length !== arg.length) {
            throw new Error('参数数量不匹配->所需个数大于提供个数')
        }
        // debugger;
        return r
    }

    init () {
        const l = this.#recovery_fn.length
        if (l > 0) {
            for (let i = 0; i < l; i += 1) {
                this.#recovery_fn[i]()
            }
        }
    }
}
