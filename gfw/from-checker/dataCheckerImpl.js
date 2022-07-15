// #根据不同字段业务数据类型,提供根据效验ID的效验方法
import * as moment from 'dayjs'
import {PersonCardId as PersonCardID} from "./personCardId";
import {validateCardInfo} from "bankcard";

export class ImplDataChecker {
    static IsNull (str) {
        return str === undefined || str.length === 0
    }

    static IsZero (str) {
        return parseInt(str, 10) === 0 || parseFloat(str) === 0.0
    }

    static NotZero (str) {
        return parseInt(str, 10) > 0 || parseFloat(str) > 0.0
    }

    static IsInt (str) {
        return Number.isInteger(str)
    }

    static IsNumber (str) {
        return Number.isNaN(str)
    }

    static IsEmail (email) {
        return /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/g.test(email)
    }

    static IsMobileNumber (mobileNumber) {
        return /^(((13[0-9])|(15([0-3]|[5-9]))|(17([0-9]))|(18[0-9]))\\d{8})|(0\\d{2}-\\d{8})|(0\\d{3}-\\d{7})$/g.test(mobileNumber) && mobileNumber.length === 11
    }

    static IsTelPhoneNumber (telephoneNumber) {
        return (
            (/^(([0\\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/g.test(telephoneNumber) && telephoneNumber.length === 12) ||
            (/^(\d{7,8})(-(\d{3,}))?$/g.test(telephoneNumber) && telephoneNumber.length === 7)
        )
    }

    static IsBusinessRegisterNo (str) {
        return /^[0-9][a-fA-F0-9]{14,18}$/g.test(str) && (str.length === 15 || str.length === 18)
    }

    static IsChinese (str) {
        return /[\u4E00-\u9FFF]+/g.test(str)
    }

    static IsID (str, len) {
        const reg = new RegExp(`^[a-zA-Z][a-z0-9A-Z_-]{1,${len - 1}}$`, 'g')
        return reg.test(str)
    }

    static IsStrictID (str, len) {
        const reg = new RegExp(`^[a-zA-Z][a-z0-9A-Z-]{1,${len - 1}}$`, 'g')
        return reg.test(str)
    }

    static notContainSpace (str) {
        return str.indexOf(' ') >= 0
    }

    static IsRealName (str) {
        const l = str.length
        return ImplDataChecker.IsChinese(str) ? l > 1 && l < 5 && !ImplDataChecker.notContainSpace(str) : l > 2 && l < 255
    }

    static IsPersonCardID (str) {
        return PersonCardID.checkIdCard(str)
    }

    static IsUnixDate (unixTime) {
        return unixTime === 0 || moment(unixTime).format('yyyy-MM-dd').length > 0
    }

    static IsDate (str) {
        return moment(str).isValid()
    }

    static IsWeek (str) {
        let tmp
        let _char
        let state = true
        const prefixArray = ['周', '星', '期', '礼', '拜']
        tmp = str
        while (state) {
            if (str.length <= 1) {
                break
            }
            _char = str.charAt(0)
            if (prefixArray.indexOf(_char) >= 0) {
                tmp = str.substring(1, str.length - 1)
                state = true
            } else {
                state = false
            }
        }
        switch (tmp) {
            case '一':
                tmp = '1'
                break
            case '二':
                tmp = '2'
                break
            case '三':
                tmp = '3'
                break
            case '四':
                tmp = '4'
                break
            case '五':
                tmp = '5'
                break
            case '六':
                tmp = '6'
                break
            case '日':
            case '天':
            case '七':
                tmp = '7'
                break
            default:
                tmp = str
        }
        return this.IsNumber(tmp) && parseInt(tmp, 10) > 0 && parseInt(tmp, 10) < 8
    }

    static IsMonth (str) {
        let tmp
        // eslint-disable-next-line no-underscore-dangle
        let _char
        let state = true
        tmp = str
        while (state) {
            if (str.length <= 1) {
                break
            }
            _char = str.charAt(0)
            switch (_char) {
                case '月':
                case '份':
                    tmp = str.substring(1, str.length - 1)
                    state = true
                    break
                default:
                    state = false
            }
        }

        switch (tmp) {
            case '一':
                tmp = '1'
                break
            case '二':
                tmp = '2'
                break
            case '三':
                tmp = '3'
                break
            case '四':
                tmp = '4'
                break
            case '五':
                tmp = '5'
                break
            case '六':
                tmp = '6'
                break
            case '七':
                tmp = '7'
                break
            case '八':
                tmp = '8'
                break
            case '九':
                tmp = '9'
                break
            case '十':
                tmp = '10'
                break
            case '十一':
                tmp = '11'
                break
            case '十二':
                tmp = '12'
                break
            default:
                tmp = str
        }
        return ImplDataChecker.IsInt(tmp) && parseInt(tmp, 10) > 0 && parseInt(tmp, 10) < 13
    }

    static IsIP (str) {
        const num = '(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)'
        const regex = new RegExp(`^${num}\\.${num}\\.${num}\\.${num}$`)
        return regex.test(str)
    }

    static IsUrl (str) {
        const v = new RegExp(
            '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
            'i'
        )
        return v.test(str)
    }

    static IsPassword (str) {
        return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,128}$/g.test(str)
    }

    static IsPostalCode (str) {
        return /^\d{6}$/g.test(str)
    }

    // 金额
    static IsDecimal (str) {
        const reg = RegExp('([$¥])([0-9,.]+)')
        return reg.test(str)
    }

    static IsDateAndYear (str) {
        const regex = new RegExp(
            '(((01[0-9]{2}|0[2-9][0-9]{2}|[1-9][0-9]{3})-(0?[13578]|1[02])-(0?[1-9]|[12]\\d|3[01]))|((01[0-9]{2}|0[2-9][0-9]{2}|[1-9][0-9]{3})-(0?[13456789]|1[012])-(0?[1-9]|[12]\\d|30))|((01[0-9]{2}|0[2-9][0-9]{2}|[1-9][0-9]{3})-0?2-(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((04|08|12|16|[2468][048]|[3579][26])00))-0?2-29)) (20|21|22|23|[0-1]?\\d):[0-5]?\\d:[0-5]?\\d'
        )
        return regex.test(str)
    }

    static IsTime (str) {
        return /^(?:[01]\d|2[0-3])(?::[0-5]\d){1,2}$/.test(str)
    }

    static IsBankCard (str) {
        return validateCardInfo(str)
    }

    static IsObjectId (str) {
        return /^[0-9a-fA-F]{24}$/.test(str)
    }

    static IsVersion (str) {
        return /^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$/.test(
            str
        )
    }
}
