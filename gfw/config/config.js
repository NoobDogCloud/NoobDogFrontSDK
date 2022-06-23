/**
 *   模式:
 *      direct
 *      mesh
 *      gateway
 *      sec-gateway
 * */
import _ from "lodash";

const defaultConfig = {
    appID: '',
    appKey: '',
    mode: '',
    baseUrl: '',
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
