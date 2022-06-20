import { isArray, isBoolean, isNumber, isString } from 'lodash'
import dayjs from 'dayjs'

export class RpcReturn {
    #v
    #pageInfo

    constructor (resp) {
        this.#v = isString(resp) ? JSON.parse(resp) : resp
        // this.#v = resp
        this.#pageInfo = null
    }

    static build (resp) {
        return new RpcReturn(resp)
    }

    setRecord (v) {
        this.#v.record = v
        return this
    }

    getErrCode () {
        return this.#v.errorcode
    }

    getMessage () {
        return this.#v.message === undefined ? '' : this.#v.message
    }

    getRecord () {
        return this.#v.record
    }

    // 将返回内容转成异步进度对象
    asAsyncProgress () {
        const result = this.#v.record
        // 将任务时间戳转换为时间
        const info = result.logs
        try {
            const metaArr = info.split(':')
            const zeroTimestamp = parseInt(metaArr[0])
            result.time = dayjs(zeroTimestamp)
            result.logs = metaArr.slice(1).join(':')
        } catch (e) {
            console.error('返回的日志信息不正确，无法解析')
        }
        return result
    }

    asPageInfo (fnFilter) {
        if (this.#pageInfo == null) {
            this.#pageInfo = {
                currentPage: this.#v.currentPage,
                pageSize: this.#v.pageSize,
                totalSize: this.#v.totalSize,
                record: fnFilter ? fnFilter(this.#v.record) : this.#v.record
            }
        }
        return this.#pageInfo
    }

    asString () {
        try {
            return isString(this.#v.record) ?? String(this.#v.record)
        } catch (e) {
            console.warn('record is not a string=>', this.#v.record)
            return ''
        }
    }

    asNumber () {
        try {
            return isNumber(this.#v.record) ?? Number(this.#v.record)
        } catch (e) {
            console.warn('record is not a number=>', this.#v.record)
            return ''
        }
    }

    asBoolean () {
        if (isString(this.#v.record)) {
            this.#v.record = String(this.#v.record) === 'true'
        } else if (isNumber(this.#v.record)) {
            this.#v.record = Number(this.#v.record) === 1
        } else if (isBoolean(this.#v.record)) {
            return this.#v.record
        } else {
            return false
        }
    }

    asJson () {
        if (isBoolean(this.#v.record) || isNumber(this.#v.record)) {
            this.#v.record = String(this.#v.record)
        }
        if (isString(this.#v.record)) {
            if (String(this.#v.record).length === 0) {
                this.#v.record = {}
            } else {
                try {
                    this.#v.record = JSON.parse(this.#v.record)
                } catch (e) {
                    console.warn('result.record is failed to parse as json=>', this.#v.record)
                    this.#v.record = {}
                }
            }
        }
        if (isArray(this.#v.record) && this.#v.record.length > 0) {
            return this.#v.record[0]
        } else {
            return this.#v.record
        }
    }

    asJsonArray () {
        if (isBoolean(this.#v.record) || isNumber(this.#v.record)) {
            this.#v.record = String(this.#v.record)
        }
        if (isString(this.#v.record)) {
            if (String(this.#v.record).length === 0) {
                this.#v.record = []
            } else {
                try {
                    this.#v.record = JSON.parse(this.#v.record)
                } catch (e) {
                    console.warn('result.record is failed to parse as json array=>', this.#v.record)
                    this.#v.record = []
                }
            }
        }
        if (isArray(this.#v.record)) {
            return this.#v.record
        } else {
            const r = []
            r.push(this.#v.record)
            return r
        }
    }

    status () {
        return this.getErrCode() === 0
    }

    hasMessage () {
        return this.#v.message !== undefined
    }
}
