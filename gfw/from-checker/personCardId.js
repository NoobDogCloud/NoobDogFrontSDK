const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1] // 加权因子
const ValidateCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 身份证验证位值.10代表X
export class PersonCardId {
    static checkIdCard(idCard) {
        idCard = PersonCardId.trim(idCard) // 去掉字符串头尾空格
        if (idCard.length === 15) {
            return PersonCardId.isValidityBirthBy15IdCard(idCard) // 进行15位身份证的验证
        } else if (idCard.length === 18) {
            const a_idCard = idCard.split('') // 得到身份证数组
            return PersonCardId.isValidityBirthBy18IdCard(idCard) && PersonCardId.isTrueValidateCodeBy18IdCard(a_idCard)
        } else {
            return false
        }
    }

    /**
     * 判断身份证号码为18位时最后的验证位是否正确
     * @param a_idCard 身份证号码数组
     */
    static isTrueValidateCodeBy18IdCard(a_idCard) {
        let sum = 0 // 声明加权求和变量
        if (a_idCard[17].toLowerCase() === 'x') {
            a_idCard[17] = String(10) // 将最后位为x的验证码替换为10方便后续操作
        }
        for (let i = 0; i < 17; i++) {
            sum += Wi[i] * a_idCard[i].charCodeAt(0) // 加权求和
        }
        const valCodePosition = sum % 11 // 得到验证码所位置
        return a_idCard[17].charCodeAt(0) === ValidateCode[valCodePosition]
    }

    /**
     * 验证18位数身份证号码中的生日是否是有效生日
     * @param idCard18 18位书身份证字符串
     */
    static isValidityBirthBy18IdCard(idCard18) {
        const year = idCard18.substring(6, 10)
        const month = idCard18.substring(10, 12)
        const day = idCard18.substring(12, 14)
        const temp_date = new Date(Number(year), parseFloat(month) - 1, parseFloat(day))
        // 这里用getFullYear()获取年份，避免千年虫问题
        return !(temp_date.getFullYear() !== parseFloat(year) || temp_date.getMonth() !== parseFloat(month) - 1 || temp_date.getDate() !== parseFloat(day))
    }

    /**
     * 验证15位数身份证号码中的生日是否是有效生日
     * @param idCard15 15位书身份证字符串
     */
    static isValidityBirthBy15IdCard(idCard15) {
        const year = idCard15.substring(6, 8)
        const month = idCard15.substring(8, 10)
        const day = idCard15.substring(10, 12)
        const temp_date = new Date(Number(year), parseFloat(month) - 1, parseFloat(day))
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
        return !(PersonCardId.simpleYear(String(temp_date.getFullYear())) !== parseFloat(year) || temp_date.getMonth() !== parseFloat(month) - 1 || temp_date.getDate() !== parseFloat(day))
    }

    static trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '')
    }

    static simpleYear(str) {
        return parseFloat(str.substring(2, str.length))
    }
}
