import _ from 'lodash'
import {ImplDataChecker} from "./dataCheckerImpl";

export const CheckerDef = {
    notNull: 1,
    isNull: 2,
    BigZero: 3,
    smallZero: 4,
    eqZero: 5,
    isNumber: 6,
    isInt: 7,
    isMoney: 8,
    isDecimal: 9,
    isEmail: 10,
    isMobile: 11,
    isBusinessID: 12,
    isChinese: 13,
    notContainSpace: 14,
    isName: 15,
    isPersonID: 16,
    isSimpleDate: 17,
    isWeek: 18,
    isMonth: 19,
    isIp: 20,
    isURL: 21,
    isPassword: 22,
    isPostCode: 23,
    isDate: 24,
    isTime: 25,
    isId: 26,
    isUnixData: 27,
    isBankCard: 28,
    isObjectId: 29,
    isStrictID: 30,
    isVersion: 31
}

const DataCheckerStore = {}
DataCheckerStore[CheckerDef.notNull] = str => !ImplDataChecker.IsNull(str)
DataCheckerStore[CheckerDef.isNull] = str => ImplDataChecker.IsNull(str)
DataCheckerStore[CheckerDef.BigZero] = str => ImplDataChecker.NotZero(str) && parseInt(str, 10) > 0
DataCheckerStore[CheckerDef.smallZero] = str => ImplDataChecker.NotZero(str) && parseInt(str, 10) < 0
DataCheckerStore[CheckerDef.eqZero] = str => ImplDataChecker.IsZero(str)
DataCheckerStore[CheckerDef.isNumber] = str => ImplDataChecker.IsNumber(str)
DataCheckerStore[CheckerDef.isInt] = str => ImplDataChecker.IsInt(str)
DataCheckerStore[CheckerDef.isMoney] = str => ImplDataChecker.IsDecimal(str)
DataCheckerStore[CheckerDef.isDecimal] = str => ImplDataChecker.IsDecimal(str)
DataCheckerStore[CheckerDef.isEmail] = str => ImplDataChecker.IsEmail(str)
DataCheckerStore[CheckerDef.isMobile] = str => ImplDataChecker.IsMobileNumber(str)
DataCheckerStore[CheckerDef.isBusinessID] = str => ImplDataChecker.IsBusinessRegisterNo(str)
DataCheckerStore[CheckerDef.isChinese] = str => ImplDataChecker.IsChinese(str)
DataCheckerStore[CheckerDef.notContainSpace] = str => ImplDataChecker.notContainSpace(str)
DataCheckerStore[CheckerDef.isName] = str => ImplDataChecker.IsRealName(str)
DataCheckerStore[CheckerDef.isPersonID] = str => ImplDataChecker.IsPersonCardID(str)
DataCheckerStore[CheckerDef.isSimpleDate] = str => ImplDataChecker.IsDate(str)
DataCheckerStore[CheckerDef.isWeek] = str => ImplDataChecker.IsWeek(str)
DataCheckerStore[CheckerDef.isMonth] = str => ImplDataChecker.IsMonth(str)
DataCheckerStore[CheckerDef.isIp] = str => ImplDataChecker.IsIP(str)
DataCheckerStore[CheckerDef.isURL] = str => ImplDataChecker.IsUrl(str)
DataCheckerStore[CheckerDef.isPassword] = str => ImplDataChecker.IsPassword(str)
DataCheckerStore[CheckerDef.isPostCode] = str => ImplDataChecker.IsPostalCode(str)
DataCheckerStore[CheckerDef.isDate] = str => ImplDataChecker.IsDateAndYear(str)
DataCheckerStore[CheckerDef.isTime] = str => ImplDataChecker.IsTime(str)
DataCheckerStore[CheckerDef.isId] = str => ImplDataChecker.IsID(str, 64)
DataCheckerStore[CheckerDef.isUnixData] = str => ImplDataChecker.IsUnixDate(parseInt(str, 10))
DataCheckerStore[CheckerDef.isBankCard] = async str => await ImplDataChecker.IsBankCard(str)
DataCheckerStore[CheckerDef.isObjectId] = str => ImplDataChecker.IsObjectId(str)
DataCheckerStore[CheckerDef.isStrictID] = str => ImplDataChecker.IsStrictID(str, 64)
DataCheckerStore[CheckerDef.isVersion] = str => ImplDataChecker.IsVersion(str)

export class DataChecker {
    static async check(id, str) {
        const func = _.get(DataCheckerStore, id, undefined)
        if (func === undefined) {
            return true
        }
        return await func(str)
    }
}
