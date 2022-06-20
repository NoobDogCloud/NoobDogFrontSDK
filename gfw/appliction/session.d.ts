export declare class GscSession {
    static getInstance(): GscSession

    static setStoreGetter(getter: SessionGetter): void

    static setStoreSetter(setter: SessionGetter): void

    build(sid: string, info: { [key: string]: any }): this

    destroy(): void

    fetch(info: { [key: string]: any }): this

    info(): { [key: string]: any }

    logging(): boolean

    getSID(): string
}

export type SessionSetter = (keyOrData: string | { [key: string]: any }, data?: any ) => void
export type SessionGetter = (keyOrData?: string | { [key: string]: any } ) => any | { [key: string]: any }

