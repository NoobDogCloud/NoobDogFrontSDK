import {QueryBuilder} from "../gfw/rpc/queryBuilder";
import {QueryOptionBuilder} from "../gfw/rpc/queryOptionBuilder";
import {ServiceApiConfig} from "./serviceApi";

export declare class BaseApi {
    ModelName: string

    static build(config: ServiceApiConfig)

    beforeFilter(data: { [key: string]: any }): any

    afterFilter(data: { [key: string]: any }): any

    afterFilterArray(data: { [key: string]: any }): any

    insert(data: { [key: string]: any }): Promise<any>

    update(ids: string, data: { [key: string]: any }): Promise<any>

    updateAndQuery(data: { [key: string]: any }, query?: QueryBuilder): Promise<any>

    select(options?: QueryOptionBuilder): Promise<any>

    selectAndQuery(query?: QueryBuilder, options?: QueryOptionBuilder): Promise<any>

    page(idx: number, max: number, options?: QueryOptionBuilder): Promise<any>

    pageAndQuery(idx: number, max: number, query?: QueryBuilder, options?: QueryOptionBuilder): Promise<any>

    find(key: string, val: string | number, options?: QueryOptionBuilder): Promise<any>

    findAndQuery(query?: QueryBuilder, options?: QueryOptionBuilder): Promise<any>

    remove(ids: string): Promise<any>

    removeAndQuery(id: string, query?: QueryBuilder): Promise<any>

    field(fieldArr: string | string[]): this

    desc(field: string): this

    asc(field: string): this

    call(action: string, ...array: any[]): Promise<any>

    setAction(action: string | symbol): this

    _call(...array: any[]): Promise<any>

    // 应答类型定义好后完善
    subscribeAll(receiver: (v: Response) => void, query?: QueryBuilder, options?: QueryOptionBuilder): boolean

    subscribe(receiver: (v: Response) => void, idx: number, max: number, query?: QueryBuilder, options?: QueryOptionBuilder): boolean

    unsubscribe(): boolean
}
