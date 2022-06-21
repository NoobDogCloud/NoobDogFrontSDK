import { decrypt_vm, encrypt_vm, init_vm, initLocal } from 'frontend-sec/frontend_sec'
import axios from 'axios'
import config from "../config/config";
// , { decrypt_vm, encrypt_vm, init_vm }
let expired = 0
let spk = ''
let share_k = ''
let cpb_k = ''
let cpv_k = ''

function currentTime () {
    return Date.now() / 1000
}

export function encryptMessage (params, headers) {
    if (expired > 0) {
        // 插入签名
        try {
            // 插入声明周期维护模块
            const result = JSON.parse(encrypt_vm(cpv_k, spk, share_k, params))
            headers['gsc-signature'] = result.signature
            headers['gsc-timestamp'] = result.timestamp
            headers['gsc-token'] = share_k
            return result.content
        } catch (e) {
            console.log('filterUrl error=>', e)
        }
    }
    return params
}

export async function freshContext (headers) {
    if (expired > 0 && currentTime() > expired) {
        const params = encryptMessage('', headers)
        const response = await axios.post(config.gatewayUrl + '/fresh/' + encodeURIComponent(cpb_k), params, {
            headers
        })
        if (response.status === 200 && response.data !== '') {
            decryptResult(response)
            const result = JSON.parse(response.data)
            share_k = result['share_id']
            spk = result['token']
            expired = result['expired']
        }
    }
}

export function decryptResult (response) {
    // 过滤结果
    if (expired > 0) {
        try {
            // 插入声明周期维护模块
            const signature = response.headers['gsc-signature']
            const timestamp = BigInt(response.headers['gsc-timestamp'])
            response.data = decrypt_vm(cpb_k, spk, share_k, response.data, signature, timestamp)
        } catch (e) {
            console.log('filterResult error=>', e)
        }
    }
    return response
}

export function errorSec (error) {
    return error.response && error.response.status === 400 ? '安全模块!' : undefined
}

export function createSec (token) {
    initLocal().then(() => {
        const pair = JSON.parse(init_vm(token))
        spk = token
        cpb_k = pair['public_key']
        cpv_k = pair['private_key']
        const headers = {}
        const params = encryptMessage(token, headers)
        headers['gsc-token'] = cpb_k
        axios.post(config.gatewayUrl + '/' + encodeURIComponent(token), params, {
            headers
        }).then(response => {
            if (response.status === 200 && response.data !== '') {
                decryptResult(response)
                const result = JSON.parse(response.data)
                share_k = result['share_id']
                expired = result['expired']
            }
        }).catch(error => {
            console.log('createUrl error=>', error)
        })
    })
}
