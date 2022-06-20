interface PageInfo {
    currentPage: number
    pageSize: number
    totalSize: number
    record: any[]
}

interface Response {
    errorcode: number
    message?: string
    record: { [key: string]: any }[] | string
    totalSize?: number
    currentPage?: number
}

export declare class RpcReturn {
    constructor(resp: Response)

    static build(resp: Response): RpcReturn

    setRecord(v: { [key: string]: any }[] | string): this

    getErrCode(): number

    getMessage(): string

    getRecord(): any

    asPageInfo(fnFilter: null | undefined | ((v: any) => boolean)): PageInfo

    asString(): string

    asNumber(): number

    asBoolean(): boolean

    asJson(): { [key: string]: any }

    asJsonArray(): { [key: string]: any }[]

    status(): boolean

    hasMessage(): boolean
}
