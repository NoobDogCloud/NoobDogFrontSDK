import { isArray, isObject } from 'lodash'

export class QueryOptionBuilder {
    #fields
    #sort
    #options

    constructor() {
        this.reInit()
    }

    static build() {
        return new QueryOptionBuilder()
    }

    reInit() {
        this.#fields = undefined
        this.#sort = []
        this.#options = undefined
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

    build() {
        const options = {}
        if (this.#fields) {
            options['fields'] = isObject(this.#fields) ? JSON.stringify(this.#fields) : isArray(this.#fields) ? this.#fields.join(',') : this.#fields
        }
        if (this.#sort.length > 0) {
            options['sort'] = JSON.stringify(this.#sort)
        }
        if (this.#options) {
            options['options'] = JSON.stringify(this.#options)
        }
        return options
    }
}
