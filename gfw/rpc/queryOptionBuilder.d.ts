type QueryOptionHeader = {
    fields: string | string[] | { [key: string]: string }
    sort: string
    options: string
}

export declare class QueryOptionBuilder {
    static build(): QueryOptionBuilder

    reInit()

    desc(field: string): this

    asc(field: string): this

    fields(fields: string[]): this

    notFields(fields: string[]): this

    enableJoin(statue: boolean): this

    build(): QueryOptionHeader
}
