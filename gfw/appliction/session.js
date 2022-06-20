import _ from 'lodash'
let GlobalStore = {}
let GlobalInstance = undefined
let GlobalStoreGetter = (keyOrData)=>{
    if(_.isString(keyOrData)){
        return GlobalStore[keyOrData]
    }
    else{
        return GlobalStore
    }
}
let GlobalStoreSetter = (keyOrData, value)=>{
    if(_.isString(keyOrData)){
        GlobalStore[keyOrData] = value
    }
    else{
        _.forOwn(keyOrData, (v, k) => {
            GlobalStore[k] = v;
        });
    }
}
export class GscSession {
    #sid

    static setStoreGetter (new_getter) {
        GlobalStoreGetter = new_getter
    }

    static setStoreSetter (new_setter) {
        GlobalStoreSetter = new_setter
    }

    constructor () {
        this.#sid = ''
    }

    static getInstance () {
        return GlobalInstance === undefined ? new GscSession() : GlobalInstance
    }

    build (sid, info) {
        this.#sid = sid
        GlobalStoreSetter(info)
        return this
    }

    destroy () {
        if (this.#sid) {
            GlobalStore = {}
            this.#sid = undefined
            GlobalStoreSetter({})
        }
    }

    fetch (info) {
        GlobalStoreSetter(info)
        return this
    }

    info () {
        return GlobalStoreGetter()
    }

    logging () {
        let data = GlobalStoreGetter()
        return data && _.keys(data).length > 0
    }

    getSID () {
        return this.#sid
    }
}
