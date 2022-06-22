/**
 *   模式:
 *      direct
 *      mesh
 *      gateway
 *      sec-gateway
 * */
import _ from "lodash";

const defaultConfig = {
    framework: 'system',
    appID: '0',
    appKey: 'grapeSoft@',
    mode: 'direct',
    baseUrl: 'http://127.0.0.1:805',
    getUrl: function () {
        return ( this.mode === 'gateway' || this.mode === 'sec-gateway') ?
            this.baseUrl + "/api" :
            this.baseUrl;
    }
}

export function UpdateConfig(cfg) {
    _.merge(defaultConfig, cfg)
}

export default defaultConfig
