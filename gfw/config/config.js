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
        switch (this.mode){
            case 'gateway':
            case 'sec-gateway':
                return this.baseUrl + "/api"
            case 'direct':
                return this.baseUrl
            default:
                return null
        }
    }
}

export function UpdateConfig(cfg) {
    _.merge(defaultConfig, cfg)
}

export default defaultConfig
