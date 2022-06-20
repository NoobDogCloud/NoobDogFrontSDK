/**
 * 以数据流方式订阅数据
 * */

import {SubscribeClient} from "./subscribeClient";
import {GscSubscriberCommand} from "./GscSubscriberCommand";

export class StreamSubscriber {
    #topic // 流数据源名称
    #subscriber // 订阅者
    #stream // 数据流
    constructor(topic) {
        this.#topic = topic
        this.#stream = []
    }

    static async New(topic) {
        const r = new StreamSubscriber(topic)
        return await r.buildSubscriber()
    }

    async buildSubscriber() {
        this.#subscriber = await SubscribeClient.New(this.#topic)
        return this
    }

    /**
     * 订阅数据流
     * */
    subscribe() {
        return this.#subscriber.subscribe(res => {
            if (res.status()) {
                res.getRecord().forEach(record => {
                    this.#stream.push(record.getData())
                })
            }
        })
    }

    unsubscribe() {
        return this.#subscriber.unsubscribe()
    }

    /**
     * 获取数据流
     * */
    getStream() {
        return this.#stream
    }

    /**
     * 清空数据流
     * */
    clearStream() {
        this.#stream = []
    }

    /**
     * 获取数据流长度
     * */
    getStreamLength() {
        return this.#stream.length
    }

    /**
     * 强制重新获取全部数据流
     * */
    resetStream() {
        this.clearStream()
        return this.#subscriber.call(GscSubscriberCommand.New(this.#topic).toGetAll())
    }
}
