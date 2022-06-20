import _ from 'lodash'
import {Application} from "../gfw/appliction/application";
import {Rpc} from "../gfw/rpc/rpc";
import {SubscribeClient} from "../gfw/subscriber/subscribeClient";

export class BaseApi {
    ServiceName
    PreHeader
    ModelName
    actionName
    // 输入字段过滤链
    input_filter = {}
    // 输出字段过滤链
    output_filter = {}
    // 订阅客户端
    subscriber
    // 应用上下文
    Context

    constructor (config) {
        this.input_filter = config.pushHook
        this.output_filter = config.pullHook
        this.subscriber = undefined
        this.ModelName = config.model
        this.ServiceName = config.name
        this.PreHeader = config.headers
        this.Context = config.context ?? Application.build()
    }

    static build (config) {
        return new BaseApi(config)
    }

    static buildQuery (query) {
        return query && query?.constructor?.name === 'QueryBuilder' ? query.build() : []
    }

    static appendQueryOption (options) {
        return options && options?.constructor?.name === 'QueryOptionBuilder' ? options.build() : {}
    }

    getRequest () {
        return Rpc.build(this.ServiceName, this.Context).setPreloadHeader(this.PreHeader).setHeader({
            'appID': this.Context.getAppID()
        })
    }

    beforeFilter (data) {
        const o = _.cloneDeep(data)
        if (this.input_filter) {
            _.mapKeys(o, (v, k) => {
                if (this.input_filter[k]) {
                    o[k] = this.input_filter[k](o[k])
                }
            })
        }
        return o
    }

    afterFilter (data) {
        if (this.output_filter) {
            _.mapKeys(data, (v, k) => {
                if (this.output_filter[k]) {
                    data[k] = this.output_filter[k](data[k])
                }
            })
        }
        return data
    }

    afterFilterArray (data) {
        if (this.output_filter) {
            _.map(data, v => {
                this.afterFilter(v)
            })
        }
        return data
    }

    // 新增数据
    async insert (data) {
        const v = this.beforeFilter(data)
        const r = await this.getRequest().setPath(this.ModelName, 'insert').call(v)
        return r.setRecord(this.afterFilter(r.asJson()))
    }

    // 全部方式更新数据
    async update (ids, data) {
        const v = this.beforeFilter(data)
        const r = await this.getRequest().setPath(this.ModelName, 'update').call(ids, v)
        return r.setRecord(this.afterFilterArray(r.asJsonArray()))
    }

    // 全部方式更新数据和条件
    async updateAndQuery (data, query) {
        const v = this.beforeFilter(data)
        const r = await this.getRequest().setPath(this.ModelName, 'updateEx').call(v, BaseApi.buildQuery(query))
        return r.setRecord(this.afterFilterArray(r.asJsonArray()))
    }

    // 全部方式查看数据
    async select (options) {
        const q = await this.getRequest().setPath(this.ModelName, 'select')
        if (options) {
            q.setHeader(BaseApi.appendQueryOption(options))
        }
        const r = await q.call()
        return r.setRecord(this.afterFilterArray(r.asJsonArray()))
    }

    // 全部方式查看数据和条件
    async selectAndQuery (query, options) {
        const q = this.getRequest().setPath(this.ModelName, 'selectEx')
        if (options) {
            q.setHeader(BaseApi.appendQueryOption(options))
        }
        const r = await q.call(BaseApi.buildQuery(query))
        return r.setRecord(this.afterFilterArray(r.asJsonArray()))
    }

    // 分页方式查看数据
    async page (idx, max, options) {
        const q = this.getRequest().setPath(this.ModelName, 'page')
        if (options) {
            q.setHeader(BaseApi.appendQueryOption(options))
        }
        const r = await q.call(idx, max)
        r.asPageInfo(v => this.afterFilterArray(v))
        return r
    }

    // 分页方式查看数据和条件
    async pageAndQuery (idx, max, query, options) {
        const q = this.getRequest().setPath(this.ModelName, 'pageEx')
        if (options) {
            q.setHeader(BaseApi.appendQueryOption(options))
        }
        const r = await q.call(idx, max, BaseApi.buildQuery(query))
        r.asPageInfo(v => this.afterFilterArray(v))
        return r
    }

    // 查看数据
    async find (key, val, options) {
        const q = this.getRequest().setPath(this.ModelName, 'find')
        if (options) {
            q.setHeader(BaseApi.appendQueryOption(options))
        }
        const r = await q.call(key, val)
        if (!r.status()) {
            return r
        }
        return r.setRecord(this.afterFilter(r.getRecord()))
    }

    // 查看数据和条件
    async findAndQuery (query, options) {
        const q = this.getRequest().setPath(this.ModelName, 'findEx')
        if (options) {
            q.setHeader(BaseApi.appendQueryOption(options))
        }
        const r = await q.call(BaseApi.buildQuery(query))
        if (!r.status()) {
            return r
        }
        return r.setRecord(this.afterFilter(r.getRecord()))
    }

    // 删除数据
    async remove (id) {
        return await this.getRequest().setPath(this.ModelName, 'delete').call(id)
    }

    // 删除数据和条件
    async removeAndQuery (id, query) {
        return await this.getRequest().setPath(this.ModelName, 'deleteEx').call(id, BaseApi.buildQuery(query))
    }

    // 获得模型对应接口描述
    async loadApi () {
        return await this.getRequest().loadApi(this.ModelName)
    }

    // 设置字段
    field (fieldArr) {
        const fields = _.isArray(fieldArr) ? fieldArr.join(',') : fieldArr
        this.getRequest().setHeader({
            GrapeDbFields: fields
        })
        return this
    }

    // 设置排序
    desc (field) {
        this.getRequest().setHeader({
            GrapeDbSorts: {
                [field]: 'desc'
            }
        })
        return this
    }

    asc (field) {
        this.getRequest().setHeader({
            GrapeDbSorts: {
                [field]: 'asc'
            }
        })
        return this
    }

    // 请求时添加 授权值(适用 验证码，或者额外验证Code等一次性访问接口)
    withOauth (oauth) {
        this.getRequest().setApiOauthToken(oauth)
        return this
    }

    // 其他方法
    async call (action, ...args) {
        return await this.getRequest()
            .setPath(this.ModelName, action)
            .call(...args)
    }

    async getSubscriber () {
        if (!this.subscriber) {
            this.subscriber = await SubscribeClient.NewService(this.getRequest().getServiceName())
        }
        return this.subscriber.setHeader('appId', this.Context.getAppID())
    }

    // 订阅数据
    async subscribeAll (receiver, query, options) {
        const sub = await this.getSubscriber()
        if (!sub) {
            return false
        }
        sub.setPath(this.ModelName, 'selectEx')
        if (options) {
            sub.setHeader(BaseApi.appendQueryOption(options))
        }
        return sub.onReceived(receiver).subscribe(BaseApi.buildQuery(query))
    }

    async subscribe (receiver, idx, max, query, options) {
        const sub = await this.getSubscriber()
        if (!sub) {
            return false
        }
        sub.setPath(this.ModelName, 'pageEx')
        if (options) {
            sub.setHeader(BaseApi.appendQueryOption(options))
        }
        return sub.onReceived(receiver).subscribe(idx, max, BaseApi.buildQuery(query))
    }

    // 取消订阅
    async unsubscribe () {
        const sub = await this.getSubscriber()
        if (!sub) {
            return false
        }
        const r = sub.unsubscribe()
        this.subscriber = undefined
        return r
    }
}
