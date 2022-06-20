import { isSymbol } from 'lodash'
import {BaseApi} from "./baseApi";

export default class ServiceApi {
    static New(config) {
        const api = BaseApi.build(config)
        return new Proxy(api, {
            get: (target, name) => {
                if (!isSymbol(name) && !name.startsWith('__v') && !(name in target)) {
                    target[name] = async(...args) => {
                        return await target.call(name, ...args)
                    }
                }
                return target[name]
            }
        })
    }
}
