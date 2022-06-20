export class InterfaceInfo {
    level = []
    name
    param = []

    constructor(info) {
        this.level = info.level.split(',')
        this.param = info.param.length > 0 ? info.param.split(',') : []
        this.name = info.name
    }

    static build(info) {
        return new InterfaceInfo(info)
    }
}
