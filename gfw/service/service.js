import _ from 'lodash'
import {ModelField} from "./modelField";

export const modelFieldType = {
    publicField: 0,
    maskField: 1,
    protectField: 2,
    lockerField: 3
}

export const apiLevel = {
    PublicApi: 0,
    SessionApi: 1,
    OauthApi: 2,
    PrivateApi: 3,
    CloseApi: 4
}

// #应用元数据定义结构
export class MircoServiceContext {
    // id
    name
    protocol
    model = {}
    endpoint = []

    constructor (info) {
        // this.id = appID
        this.name = info.name
        this.protocol = info.transfer + '://'
        this.endpoint = info.subaddr.split(',')
        this.model = {}
        _.forOwn(info.dataModel, (val, key) => {
            const arr = {}
            _.forEach(val.rule, v => {
                arr[v.name] = ModelField.build(v)
            })
            this.model[key] = arr
        })
    }

    static build (info) {
        return new MircoServiceContext(info)
    }

    // 获得微服务连接信息(默认轮转算法)
    getConnectUrl () {
        if (this.endpoint.length === 0) {
            return ''
        }
        const random = _.random(0, this.endpoint.length - 1)
        return this.protocol + this.endpoint[random]
    }
}
