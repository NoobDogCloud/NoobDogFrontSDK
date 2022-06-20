import { RpcReturn } from './response'

declare class Rpc {
    constructor(serviceName: string)

    static build(serviceName: string, applicationContext: any): Rpc

    getServiceName(): string

    setPath(className: string, actionName: string): this

    setApiPublicKey(): this

    setPreloadHeader(header: { [key: string]: any }): this

    setHeader(header: { [key: string]: any }): this

    call(...arg: any[]): Promise<RpcReturn>
}
