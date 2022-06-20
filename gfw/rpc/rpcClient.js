import axios from 'axios'
import _ from 'lodash'
import {NetCommon} from "../net/netCommon";
import {decryptResult, encryptMessage, errorSec, freshContext} from "./sec";

const getQueue = {}
const postQueue = {}

// #基础网络代理类,协议层支持GSC
export class RpcClient extends NetCommon {
    constructor (service) {
        super(service)
        this.init()
    }

    static New (service) {
        return new RpcClient(service)
    }

    // 到这里时参数应该都经过转换了，全部都是字符串了！
    get (...arg) {
        const url = this.build_get_params(arg)
        const headers = this.getHeader()
        const query_key = url + '@' + JSON.stringify(headers)
        if (!_.has(getQueue, query_key)) {
            getQueue[query_key] = []
        }
        const queue = getQueue[query_key]
        return new Promise((resolve, reject) => {
            queue.push({ resolve, reject })
            if (queue.length === 1) {
                axios
                    .get(url, { headers })
                    .then(response => {
                        for (let i = 0; i < queue.length; i++) {
                            queue[i].resolve(this.filterResult(response))
                        }
                        // console.log(queue.length)
                        delete getQueue[query_key]
                        // resolve(this.filterResult(response))
                    })
                    .catch(error => {
                        for (let i = 0; i < queue.length; i++) {
                            queue[i].reject(this.filterError(error))
                        }
                        delete getQueue[query_key]
                        // reject(this.filterError(error))
                    })
                    .finally(() => this.init())
            }
        })
    }

    // #申请当前API访问权限
    applyApiAccess () {
        const url = `${this.host}/${this.service}/${this.class}/getApiAccessOnce/${this.class}/${this.action}`
        const headers = this.getHeader()
        return new Promise((resolve, reject) => {
            axios
                .get(url, { headers })
                .then(response => {
                    this.filterResult(response)
                    resolve(this)
                })
                .catch(error => {
                    reject(this.filterError(error))
                })
        })
    }

    // #直接通过URL访问,不使用header
    getDirect (...arg) {
        const url = this.#build_direct_get_params(arg)
        /*
        return new Promise((resolve, reject) => {
            axios
                .get(url)
                .then(response => {
                    resolve(this.filterResult(response))
                })
                .catch(error => {
                    reject(this.filterError(error))
                })
                .finally(() => this.init())
        })
        */
        window.open(url)
    }

    post (...arg) {
        const url = this.build_base_url()
        const params = RpcClient.build_post_params(arg)
        const headers = this.getHeader()
        const query_key = url + '@' + JSON.stringify(headers) + '#' + JSON.stringify(params)
        if (!_.has(postQueue, query_key)) {
            postQueue[query_key] = []
        }
        const queue = postQueue[query_key]
        return new Promise((resolve, reject) => {
            queue.push({ resolve, reject })
            if (queue.length === 1) {
                freshContext(headers).then(() => {
                    const sec_params = encryptMessage(params, headers)
                    axios
                        .post(url, sec_params, { headers })
                        .then(response => {
                            response = decryptResult(response)
                            for (let i = 0; i < queue.length; i++) {
                                queue[i].resolve(this.filterResult(response))
                            }
                            delete postQueue[query_key]
                        })
                        .catch(error => {
                            const message = errorSec(error)
                            for (let i = 0; i < queue.length; i++) {
                                queue[i].reject(this.filterError(error, message))
                            }
                            delete postQueue[query_key]
                        })
                        .finally(() => this.init())
                })
            }
        })
    }

    file (file_object, ...arg) {
        const form = new FormData()
        form.append('file', file_object)
        const url = this.build_get_params(arg)
        const headers = this.getHeader()
        return new Promise((resolve, reject) => {
            axios
                .post(url, form, { headers })
                .then(response => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(this.filterError(error))
                })
                .finally(() => this.init())
        })
    }

    #build_direct_get_params (arg) {
        const url = `${this.host}${this.build_get_header()}/${this.service}/${this.class}/${this.action}`
        return this.build_params(url, arg)
    }
}
