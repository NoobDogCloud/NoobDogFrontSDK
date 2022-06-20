import { Base64 } from 'js-base64'
import { isString } from 'lodash'

export class GscEncrypt {
    static #decodeHtmlTag(html) {
        return html.replace(/@t/g, '/').replace(/@w/g, '+')
    }

    static #encodeHtmlTag(html) {
        return html.replace(/\//g, '@t').replace(/\+/g, '@w')
    }

    static encodeJson(json) {
        if (!isString(json)) {
            json = JSON.stringify(json)
        }
        return 'gsc-json&' + GscEncrypt.#encodeString(json)
    }

    static encodeJsonArray(json) {
        if (!isString(json)) {
            json = JSON.stringify(json)
        }
        return 'gsc-jsonArray&' + GscEncrypt.#encodeString(json)
    }

    static encodeString(str) {
        return 'gsc-string&' + GscEncrypt.#encodeString(str)
    }

    static #encodeString(str) {
        if (!isString(str)) {
            str = JSON.stringify(str)
        }
        return GscEncrypt.#encodeHtmlTag(Base64.encode(str))
    }

    static decodeJson(str) {
        const header = this.getHeader(str)
        if (this.getType(header) !== 'json') {
            return str
        }
        return JSON.parse(GscEncrypt.#decodeString(str.substring(header.length + 1)))
    }

    static decodeJsonArray(str) {
        const header = this.getHeader(str)
        if (this.getType(header) !== 'jsonArray') {
            return str
        }
        return JSON.parse(GscEncrypt.#decodeString(str.substring(header.length + 1)))
    }

    static decodeString(str) {
        const header = this.getHeader(str)
        if (this.getType(header) !== 'string') {
            return str
        }
        return GscEncrypt.#decodeString(str.substring(header.length + 1))
    }

    static decode(str) {
        const header = this.getHeader(str)
        if (this.getType(header) === 'json') {
            return JSON.parse(GscEncrypt.#decodeString(str.substring(header.length + 1)))
        } else if (this.getType(header) === 'jsonArray') {
            return JSON.parse(GscEncrypt.#decodeString(str.substring(header.length + 1)))
        } else if (this.getType(header) === 'string') {
            return GscEncrypt.#decodeString(str.substring(header.length + 1))
        }
        return null
    }

    static #decodeString(str) {
        return Base64.decode(GscEncrypt.#decodeHtmlTag(str))
    }

    static getHeader(str) {
        const header = str.split('&')[0]
        return header.startsWith('gsc-') ? header : ''
    }

    static getType(header) {
        return header.split('-')[1]
    }
}
