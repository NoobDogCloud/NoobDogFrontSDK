import config from '../config/config'

const instance = {}

export class GscSubscriberCommand {
    #path
    #param
    #header
    #topic

    constructor(topic, header) {
        this.#topic = topic
        this.#setHeader(header)
        this.#init()
        this.subscribeCustomDataSource()
    }

    static New(topic, header) {
        if (instance.hasOwnProperty(topic)) {
            return instance[topic].#setHeader(header).#init()
        } else {
            const r = new GscSubscriberCommand(topic, header)
            instance[topic] = r
            return r
        }
    }

    #setHeader(header) {
        this.#header = header
            ? header
            : {
                  host: config.baseUrl,
                  appID: config.appID
              }
        return this
    }

    setPath(path) {
        this.#path = path
        return this
    }

    // 设置为全局自定义数据源 path
    subscribeCustomDataSource() {
        this.#path = '/global/@subscribeCustomDataSource'
        return this
    }

    setParam(param) {
        this.#param = param
        return this
    }

    // 订阅主题
    toSubscribe() {
        this.#header['mode'] = 'subscribe'
        return this
    }

    // 取消订阅主题
    toUnsubscribe() {
        this.#header['mode'] = 'cancel'
        return this
    }

    // 强制更新主题数据
    toPublish() {
        this.#header['mode'] = 'update'
        return this
    }

    // 获得主题数据源全部数据
    toGetAll() {
        this.#header['mode'] = 'select'
        return this
    }

    #init() {
        this.#header['topic'] = this.#topic
        this.#param = ''
        return this
    }

    build() {
        this.#header['host'] = config.baseUrl
        const r = JSON.stringify({
            path: this.#path,
            param: this.#param,
            header: this.#header
        })
        this.#init()
        return r
    }
}
