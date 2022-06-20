// 显示调试
export function getDebugText(row, column, cellValue, index) {
    return cellValue ? '是' : '否'
}

export function getDebugModel() {
    return [
        {
            id: 0,
            name: '否'
        },
        {
            id: 1,
            name: '是'
        }
    ]
}
