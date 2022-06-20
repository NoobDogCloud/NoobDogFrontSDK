interface SubscriberCommand {
    path: string
    param: string
    headers: {
        [key: string]: any
    }
}

export declare class GscSubscriberCommand {
    constructor(topic: undefined | string, header: undefined | Object)

    static New(topic: undefined | string, header: undefined | Object): GscSubscriberCommand

    setPath(path: string): this

    subscribeCustomDataSource(): this

    setParam(param: string): this

    toSubscribe(): this

    toUnsubscribe(): this

    toPublish(): this

    toGetAll(): this

    build(): SubscriberCommand
}
