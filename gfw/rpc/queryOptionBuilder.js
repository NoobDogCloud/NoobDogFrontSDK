import { isArray, isObject } from 'lodash'

export class QueryOptionBuilder {
    #fields= undefined
    #sort = {}
    #options= {}
    #topic = undefined

    constructor() {}

    static build() {
        return new QueryOptionBuilder()
    }

    desc(field) {
        this.#sort[field] = 'desc'
        return this
    }

    asc(field) {
        this.#sort[field] = 'asc'
        return this
    }

    fields(fields) {
        this.#fields = fields
        return this
    }

    notFields(fields) {
        this.#fields = { not: fields }
        return this
    }

    enableJoin(statue = true) {
        this.#options['join'] = statue
        return this
    }

    topic(topic){
        this.#topic = topic
        return this
    }

    build() {
        const header = {}
        if (this.#fields) {
            header['GrapeDbFields'] = isObject(this.#fields) ? JSON.stringify(this.#fields) : isArray(this.#fields) ? this.#fields.join(',') : this.#fields
        }
        if (Object.keys(this.#sort).length > 0) {
            header['GrapeDbSorts'] = JSON.stringify(this.#sort)
        }
        if (Object.keys(this.#options).length > 0) {
            header['GrapeDbOptions'] = JSON.stringify(this.#options)
        }
        if (this.#topic) {
            header['topic'] = this.#topic
        }
        return header
    }
}
