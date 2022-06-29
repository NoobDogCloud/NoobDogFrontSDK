export function getStateText(v) {
    switch (v) {
        case 1:
            return '正常'
        case 2:
            return '处理中'
        case 3:
            return '已取消'
        case 0:
            return '不正常'
        case 4:
            return '禁止'
        case 5:
            return '已回滚'
        case 10:
            return '成功'
        case 20:
            return '失败'
        default:
            return '错误'
    }
}

export function getStateModel() {
    return [
        {
            id: 1,
            name: '正常'
        },
        {
            id: 2,
            name: '处理中'
        },
        {
            id: 3,
            name: '已取消'
        },

        {
            id: 0,
            name: '不正常'
        },
        {
            id: 4,
            name: '禁止'
        },
        {
            id: 5,
            name: '已回滚'
        },
        {
            id: 10,
            name: '成功'
        },
        {
            id: 20,
            name: '失败'
        }
    ]
}
