import _ from 'lodash'
import {BaseRpc} from "./baseRpc";
import config from "../config/config";
import {MircoServiceContext} from "../service/service";
import {RpcReturn} from "./response";
import {NetCommon} from "../net/netCommon";

const BaseRpcStore = {}

export class Rpc {
    #base
    #className
    #headers = {}
    #preloadHeaders = {}
    #actionName
    #serviceName
    #context

    constructor (serviceName, context) {
        if (!_.has(BaseRpcStore, serviceName)) {
            BaseRpcStore[serviceName] = new BaseRpc(serviceName)
        }
        this.#base = BaseRpcStore[serviceName]
        this.#serviceName = serviceName
        this.#className = ''
        this.#actionName = ''
        this.#headers = {}
        this.#preloadHeaders = {}
        this.#context = context
    }

    static build (serviceName, context) {
        return new Rpc(serviceName, context)
    }

    getServiceName () {
        return this.#serviceName
    }

    setPath (className, actionName) {
        this.#className = className
        this.#actionName = actionName
        return this
    }

    setApiPublicKey () {
        this.#headers.appKey = config.appKey
        return this
    }

    setApiOauthToken (token) {
        this.#headers.GrapeOauth2 = token
        return this
    }

    setPreloadHeader (header) {
        if (_.size(header) > 0) {
            _.forIn(header, (v, k) => {
                this.#preloadHeaders[k] = v
            })
        }
        // console.log('update headers:', this.#preloadHeaders)
        return this
    }

    setHeader (header) {
        if (_.size(header) > 0) {
            _.forIn(header, (v, k) => {
                this.#headers[k] = v
            })
        }
        // console.log('update headers:', this.#headers)
        return this
    }

    // 获得 className 接口描述
    async loadApi (className) {
        // 设置基础rpc微服务上下文
        await this.setServiceCtx()
        // 获得微服务上下文并设置服务地址
        const n = this.#base.getNet()
        n.setHost(this.#base.ctx == null ? config.getUrl() : this.#base.ctx.getConnectUrl())
        // 获得服务模型接口定义
        return await this.#context.loadClassDesc(this.#base, this.#serviceName, className)
    }

    async setServiceCtx () {
        // 检查微服务
        const appCtx = await this.#context.getContext()
        if( appCtx){
            if (!_.indexOf(appCtx.services, this.#serviceName)) {
                throw new Error(`服务[${this.#serviceName}]未在应用->${appCtx.id} 中部署!`)
            }
            const services = appCtx.services;
            if( services ){
                let ctx = _.get(services, this.#serviceName)
                if( ctx ){
                    this.#base.ctx = MircoServiceContext.build(ctx)
                }
            }
        }

    }

    // 万能调用call,带入参数
    async call (...arg) {
        // 载入类说明
        const classDesc = await this.loadApi(this.#className)
        // 检查接口
        const apiDesc = this.#base.chkInterface(classDesc, this.#className, this.#actionName, ...arg)
        // 设置类
        const n = this.#base.getNet()
        n.setPath(this.#className, this.#actionName)
        // 设置头
        // console.log('rpc preloadHeaders', this.#preloadHeaders)
        _.forIn(this.#preloadHeaders, (v, k) => {
            n.setHeader(k, v)
        })
        // console.log('rpc header', this.#headers)
        _.forIn(this.#headers, (v, k) => {
            n.setHeader(k, v)
        })
        // 尝试初步补充类型
        const args = NetCommon.autoAppendParamType(...arg)
        // 动态调整参数类型
        const iArgs = this.#base.appendParamType(apiDesc, ...args)
        // 调用
        const resp = await n.post(...iArgs)
        // 回复
        this.#base.init()
        this.#headers = {}
        return RpcReturn.build(resp)
    }
}
