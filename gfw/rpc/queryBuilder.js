export class QueryBuilder {
    #logic
    #store

    constructor() {
        this.reInit()
    }

    // cons[];
    static build() {
        return new QueryBuilder()
    }

    reInit() {
        this.#logic = true
        this.#store = []
    }

    addCondition(field, value, logic) {
        const o = {
            field,
            value,
            logic
        }
        if (!this.#logic) {
            o.link_logic = 'or'
        }
        this.#store.push(o)
        return this
    }

    and() {
        this.#logic = true
        return this
    }

    or() {
        this.#logic = false
        return this
    }

    eq(field, value) {
        this.addCondition(field, value, '=')
        return this
    }

    ne(field, value) {
        this.addCondition(field, value, '!=')
        return this
    }

    gt(field, value) {
        this.addCondition(field, value, '>')
        return this
    }

    gte(field, value) {
        this.addCondition(field, value, '>=')
        return this
    }

    lt(field, value) {
        this.addCondition(field, value, '<')
        return this
    }

    lte(field, value) {
        this.addCondition(field, value, '<=')
        return this
    }

    like(field, value) {
        this.addCondition(field, value, 'like')
        return this
    }

    /*
groupCondition(cons[]){
const block[] = [];
block.push(this.#logic ? 'and' : 'or');
block.push(cons);
this.cons.push(block);
return this;
}
  */
    nullCondition() {
        return this.#store.length === 0
    }

    build() {
        const r = [].concat(this.#store)
        this.#store = []
        return r
    }
}
