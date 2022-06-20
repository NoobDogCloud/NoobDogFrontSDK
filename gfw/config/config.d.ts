export declare interface Config {
    framework?: string
    appID?: string
    appKey?: string
    baseUrl: string
    gatewayUrl?: string
    ssl?: boolean
    oauthUrl?: string
    publicKey?: string
    getUrl?: () => string
}

export declare function UpdateConfig(config: Config);
declare const defaultConfig: Config;
export default defaultConfig;
