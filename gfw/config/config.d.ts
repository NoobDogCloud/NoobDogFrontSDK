export declare interface Config {
    framework?: string
    appID?: string
    appKey?: string
    mode: string
    baseUrl: string
    ssl?: boolean
    publicKey?: string
    getUrl?: () => string
}

export declare function UpdateConfig(config: Config);
declare const defaultConfig: Config;
export default defaultConfig;
