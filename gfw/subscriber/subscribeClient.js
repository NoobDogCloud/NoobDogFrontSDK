import { w3cwebsocket } from 'websocket'
import {NetCommon, NetErrorLevel} from "../net/netCommon";
import config from "../config/config";
import {RpcReturn} from "../rpc/response";
import {GscSubscriberCommand} from "./GscSubscriberCommand";

const SubscribeReason = {
    User: {
        code: 0,
        reason: 'User'
    },
    Other: {
        code: 10000404,
        reason: 'Other'
    }
}

export class SubscribeClient extends NetCommon {
    #cli
    #topic
    #endpoint
    #onReceived
    #reConnectStatus

    constructor(service, topic) {
        super(service)
        if (!service && !topic) {
            throw new Error('需要设置数据源名或者服务名')
        }

        this.#endpoint = `ws://${config.baseUrl}`
        this.#topic = topic
        this.#reConnectStatus = undefined
    }

    static async New(topic) {
        const r = new SubscribeClient(undefined, topic)
        return await r.connect()
    }

    static async NewService(service) {
        const r = new SubscribeClient(service, undefined)
        return await r.connect()
    }

    static #buildCommand(SubscriberCommand) {
        console.log(SubscriberCommand)
        if (SubscriberCommand && SubscriberCommand?.constructor?.name === 'GscSubscriberCommand') {
            return SubscriberCommand.build()
        } else {
            throw new Error('必须输入订阅命令')
        }
    }

    async connect() {
        this.#reConnectStatus = undefined
        const cli = new w3cwebsocket(this.#endpoint)
        cli.onerror = error => {
            console.log('Connect Error: ' + error.toString())
            this.filterError(error, ' [正在重连...]')
            this.#reConnect()
        }
        cli.onclose = (code, reason) => {
            console.log('echo-protocol Connection Closed')
            if (code === SubscribeReason.Other.code) {
                // 用户客户端主动断开
            } else {
                this.#reConnect()
            }
            this.#cli = undefined
        }
        cli.onmessage = message => {
            let v
            if (message?.type === 'message') {
                try {
                    v = JSON.parse(message.data)
                    if (v.errorcode !== 1) {
                        if (this.#onReceived) {
                            this.#onReceived(RpcReturn.build(v))
                        }
                        return
                    }
                } catch (e) {
                    console.error(e)
                    v = {
                        errorcode: 1,
                        message: `服务应答异常:${message.data}`
                    }
                }
                this.errorHandle(v, NetErrorLevel.service)
            }
        }
        return new Promise((resolve, reject) => {
            cli.onopen = () => {
                console.log('echo-protocol Connection Opened')
                this.#cli = cli
                this.#reConnectStatus = undefined
                resolve(this)
            }
        })
    }

    #reConnect() {
        if (this.#reConnectStatus === undefined) {
            this.#reConnectStatus = setTimeout(async () => {
                await this.connect()
            }, 5000)
        }
    }

    onReceived(callback) {
        this.#onReceived = callback
        return this
    }

    #getPath() {
        // 包含默认服务名
        return this.service ? `/${this.service}/${this.class}/${this.action}` : '/global/@subscribeCustomDataSource'
    }

    getTopic() {
        return this.service ? `topic_service_${this.service}_${this.class}` : this.#topic
    }

    subscribe(...arg) {
        return this.call(
            GscSubscriberCommand.New(this.getTopic(), this.getHeader())
                .toSubscribe()
                .setPath(this.#getPath())
                .setParam(SubscribeClient.build_post_params(NetCommon.autoAppendParamType(...arg)))
        )
    }

    unsubscribe() {
        this.#onReceived = undefined
        return this.call(GscSubscriberCommand.New(this.getTopic(), this.getHeader()).toUnsubscribe().setPath(this.#getPath()))
    }

    call(SubscriberCommand) {
        if (this.#cli.readyState !== this.#cli.OPEN) {
            return false
        }
        this.#cli.send(SubscribeClient.#buildCommand(SubscriberCommand))
        return true
    }

    close() {
        this.#cli.close(SubscribeReason.User.code, SubscribeReason.User.reason)
        this.#cli = this.#onReceived = undefined
    }
}
