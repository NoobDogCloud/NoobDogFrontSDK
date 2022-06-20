export declare class Application {
    static build(appId: String | undefined): Application

    static getDefaultContext(): Promise<any>

    getContext(): Promise<any>

    load(): Promise<Application>

    static getAppID(): String
}

export declare function InitContext(): Promise<any>
