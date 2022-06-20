export declare class GscEncrypt {
    static encodeJson(json: string | Object): string

    static encodeJsonArray(json: string | Object[]): string

    static encodeString(str: string): string

    static decodeJson(str: string): Object

    static decodeJsonArray(str: string): Object[]

    static decodeString(str: string): string

    static decode(str: string): string

    static getHeader(str: string): string

    static getType(header: string): string
}
