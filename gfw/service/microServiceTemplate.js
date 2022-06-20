import _ from 'lodash'
import { BaseRpc } from '../rpc/baseRpc'
import {GscEncrypt as GscJson} from "../encode/GscEncrypt";

export const sort_enum = {
    Asc: 'asc',
    Desc: 'desc'
}

// 根据模型定义,检查输入数据
async function modelChecker (input, model, err_fn) {
    if (model === {}) {
        return true
    }
    const r = {}
    const keys = _.keys(input)
    for (const k of keys) {
        const v = input[k]
        const rule = _.get(model, k)
        // 输入数据不再模型中,直接排除
        if (rule !== undefined) {
            // 输入数据检查
            const r_check = await DataChecker.check(rule.checkId, v)
            if (r_check) {
                r[k] = v
            } else {
                // 调用错误回调
                if (err_fn !== undefined) {
                    err_fn(k, v)
                }
                return false
            }
        }
    }
    return true
}

// #提供基础的微服务模板接口支持的类(数据层支持GSC)
export class MicroServiceTemplate {
    #className
    #model
    #rpc
    #sec
    #fieldArr = []
    #fieldStatue // 1: 包含字段, 0:不包含字段
    #fieldSort = {} // 排序字段
    #optional = {} // 配置开关
    #check_callback

    constructor (rpc) {
        this.#sec = true
        this.#className = ''
        this.#model = {}
        this.#fieldArr = []
        this.#fieldStatue = false
        this.#check_callback = undefined
        this.init()
        this.#rpc = rpc
        this.#rpc.setRecovery(() => this.init())
    }

    static async build (serviceName) {
        const r = await BaseRpc.build(serviceName)
        return new MicroServiceTemplate(r)
    }

    setCheckError (fn) {
        this.#check_callback = fn
        return this
    }

    setReferSec (sec) {
        this.#sec = sec
        return this
    }

    provider (className) {
        this.#className = className
        if (this.#rpc.ctx) {
            this.#model = this.#rpc.ctx.model[className]
        }
        return this
    }

    setRecovery (pfn) {
        this.#rpc.setRecovery(pfn)
        return this
    }

    async insert (data) {
        const vData = await this.#perChecker(data)
        return (await this.getRpcInstant().setPath(this.#className, 'insert')).call(vData)
    }

    async delete (ids) {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'delete')).call(_.uniq(ids.join()))
    }

    async deleteEx (query) {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'deleteEx')).call(GscJson.encodeJsonArray(query))
    }

    async update (ids, data) {
        const vData = await this.#perChecker(data)
        return (await this.getRpcInstant().setPath(this.#className, 'update')).call(_.uniq(ids.join()), vData)
    }

    async updateEx (data, query) {
        const vData = await this.#perChecker(data)
        return (await this.getRpcInstant().setPath(this.#className, 'updateEx')).call(vData, GscJson.encodeJsonArray(query))
    }

    async page (idx, max) {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'page')).call(idx, max)
    }

    async pageEx (idx, max, query) {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'pageEx')).call(idx, max, GscJson.encodeJsonArray(query))
    }

    async select () {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'select')).call()
    }

    async selectEx (query) {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'selectEx')).call(GscJson.encodeJsonArray(query))
    }

    async find (key, val) {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'find')).call(key, val)
    }

    async findEx (query) {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'findEx')).call(GscJson.encodeJsonArray(query))
    }

    async tree (query) {
        // 调用接口
        return (await this.getRpcInstant().setPath(this.#className, 'tree')).call(GscJson.encodeJsonArray(query))
    }

    setField (fields) {
        this.updateFieldArr(false)
        this.#fieldArr.push(...fields)
        return this
    }

    setMask (fields) {
        this.updateFieldArr(true)
        this.#fieldArr.push(...fields)
        return this
    }

    setSort (field, sort) {
        this.#fieldSort[field] = sort
        return this
    }

    setOptional (field, status) {
        this.#optional[field] = status
        return this
    }

    loadInterface () {
    }

    init () {
        this.#fieldArr = []
        this.#fieldSort = {}
    }

    async #checkInput (data) {
        // 效验输入值
        const r = await modelChecker(data, this.#model, this.#check_callback)
        // 出问题调用回调函数并直接中断
        if (!r) {
            throw new Error('输入数据类型检查失败!')
        }
        return true
    }

    async #perChecker (data) {
        // 检查 data 数据
        await this.#checkInput(data)
        // 调用接口
        return this.#sec ? GscJson.encodeJson(data) : JSON.stringify(data)
    }

    getRpcInstant () {
        const header_extra = this.buildExtraOptional()
        if (_.size(header_extra) > 0) {
            this.#rpc.setHeader(header_extra)
        }
        return this.#rpc
    }

    buildExtraOptional () {
        const header_extra = {}
        // 存在显/隐字段
        if (this.#fieldArr.length > 0) {
            header_extra.GrapeDbFields = this.#fieldStatue ? this.#fieldArr : { not: this.#fieldArr }
        }
        // 存在排序字段
        if (_.size(this.#fieldSort) > 0) {
            header_extra.GrapeDbSorts = this.#fieldSort
        }
        // 存在控制定义
        if (_.size(this.#optional) > 0) {
            header_extra.GrapeDbOptions = this.#optional
        }
        return header_extra
    }

    updateFieldArr (status) {
        if (this.#fieldStatue === status) {
            this.#fieldStatue = !status
            this.#fieldArr.slice(0, this.#fieldArr.length)
        }
    }
}
