type logicType = 'and' | 'or'

export declare class QueryBuilder {
    build: string

    static build(): QueryBuilder

    reInit()

    addCondition(field: string, value: any, logic: logicType): this

    and(): this

    or(): this

    eq(field: string, value: any): this

    ne(field: string, value: any): this

    gt(field: string, value: any): this

    gte(field: string, value: any): this

    lt(field: string, value: any): this

    lte(field: string, value: any): this

    in(field: string, value: any[]): this

    nin(field: string, value: any[]): this

    like(field: string, value: string): this

    nlike(field: string, value: string): this

    between(field: string, value: [any, any]): this

    nbetween(field: string, value: [any, any]): this

    nullCondition(): boolean
}
