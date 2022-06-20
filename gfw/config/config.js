/**
 * - 管理模式
 * {
 *     framework: 'system',
 *     appID: '0',                    // 必须写0
 *     appKey: 'grapeSoft@',        // 管理的授权码
 *     baseUrl: '127.0.0.1:805',    // 管理端地址
 * }
 * - 网关模式
 *   {
 *       appID: '1',                            // 应用ID
 *       baseUrl: 'ingress.test.local:32621',   // 应用网格地址
 *   }
 * - 安全网关模式
 *   {
 *       appID: '1',                            // 应用ID
 *       baseUrl: 'safe.ingress.test.local:32621',   // 安全网关入口
 *       gatewayUrl: 'gateway.ingress.test.local:32621',   // api安全网关地址
 *   }
 * - 集群模式
 *   {
 *       appID: '1',                            // 应用ID
 *       baseUrl: 'ingress.test.local:32621',   // 授权入口地址
 *       oauthUrl: '127.0.0.1:8080',   // 授权服务地址
 *   }
 * */
import _ from "lodash";

const defaultConfig = {
    framework: 'system',
    appID: '0',
    appKey: 'grapeSoft@',
    // baseUrl: '12.12.12.120:805',
    // baseUrl: '127.0.0.1:805',
    baseUrl: 'http://127.0.0.1:8000/api',
    gatewayUrl: 'http://127.0.0.1:8000',
    getUrl: function () {
        return this.baseUrl
    }
}

export function UpdateConfig(cfg) {
    _.merge(defaultConfig, cfg)
}

export default defaultConfig
