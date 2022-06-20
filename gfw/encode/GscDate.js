import dayjs from 'dayjs'

export class GscDate {
    static toDatetimeString(date) {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    }

    static toDateString(date) {
        return dayjs(date).format('YYYY-MM-DD')
    }

    static toTimestamp(date, millisecond = false) {
        return millisecond ? dayjs(date).valueOf() : dayjs(date).unix()
    }
}
