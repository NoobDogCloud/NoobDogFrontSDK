declare class StreamSubscriber {
    constructor(topic: string)

    static New(topic: string): Promise<StreamSubscriber>

    buildSubscriber(): Promise<this>

    subscribe(): boolean

    unsubscribe(): boolean

    getStream(): any[]

    clearStream(): void

    getStreamLength(): number

    resetStream(): boolean
}
