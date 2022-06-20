import _ from 'lodash'

export class ModelField {
    checkId // 业务数据类型
    name // 字段名
    text // 字段可读名
    required // 字段是否是必选项
    classify
    preinstall = {}

    #handle // 事件回调
    constructor(info) {
        this.checkId = info.checkId
        this.name = info.name
        this.text = _.get(info, 'text', '')
        this.required = _.get(info, 'required', false)
        this.classify = _.get(info, 'classify', '')
        this.preinstall = _.get(info, 'preinstall', {})
        this.#handle = {}
    }

    static build(info) {
        return new ModelField(info)
    }

    onEvent(e, v) {
        this.#handle[e] = v
        return this
    }

    async event(e, v) {
        const fn = _.get(this.#handle, e, undefined)
        if (fn === undefined) {
            return
        }
        if (fn.constructor.name === 'AsyncFunction') {
            await fn(e, v)
        } else {
            fn(e, v)
        }
    }
}
