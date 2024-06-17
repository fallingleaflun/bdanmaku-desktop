import { LoginQr } from './loginQr'
import log from 'electron-log'
import { Cookie } from './cookie'

// 协议相关
enum PollQrResultCode {
    SUCCESS = 0,
    EXPIRED = 86038,
    NOT_CONFIRMED = 86090,
    NOT_SCANNED = 86101,
}
const keepPollQrResultCode = new Set([PollQrResultCode.NOT_CONFIRMED, PollQrResultCode.NOT_SCANNED])

// 全局变量
const USER_AGENT = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36'
let lastUrl = '' // 上一次请求二维码的url
let lastKey = '' // 上一次请求二维码的key
export interface SessionData {
    uid: string,
    roomid: string,
    buvid: string,
    key: string
}
export let sessionData: SessionData = { // 获取弹幕所需要的参数
    'uid': '',
    'roomid': '',
    'buvid': '',
    'key': ''
}
export let finished = false // 是否已经完成参数获取
let pollTimeout: NodeJS.Timeout | null = null

/* 获取登录链接
* @param roomid: 房间号
* @param finishCallback: 完成登录的回调函数
*/
export async function handleGetQRcode(roomid: string, finishCallback: () => void): Promise<string> {
    sessionData['roomid'] = roomid
    try {
        if (!lastKey || lastKey === '') {
            const qr = new LoginQr(USER_AGENT, lastKey)
            log.info('try to generate qr code url')
            const genRes = await qr.generate()
            if (genRes.code === 0) {
                lastKey = genRes.key
                lastUrl = genRes.url
                log.info('qr code url generated')
                // 开启轮询
                clearTimeout(pollTimeout)
                pollUtilSuccess(qr, roomid, finishCallback)
                return genRes.url
            }
        }
        else {
            const qr = new LoginQr(USER_AGENT, lastKey)
            // 开启轮询
            clearTimeout(pollTimeout)
            pollUtilSuccess(qr, roomid, finishCallback)
            return lastUrl
        }
    }
    catch (error) {
        log.error(`handleGetQRcode error: ${error}`)
    }
}

// 轮询是否已经完成登录
export async function pollUtilSuccess(qr: LoginQr, roomid: string, finishCallback: () => void) {
    log.info('round robin poll qr code');
    try {
        const result = await qr.poll(roomid, lastKey);
        if (!keepPollQrResultCode.has(result.code)) {
            if (result.code === PollQrResultCode.SUCCESS) {
                const cookie = result.cookie;
                sessionData['buvid'] = Cookie.getValueFromCookieString(cookie, 'buvid3');
                sessionData['key'] = await qr.getSessionKey(roomid, cookie);
                sessionData['uid'] = await qr.getUID(cookie)
                log.info('login success, session data:');
                log.info(sessionData);
                finishCallback();
            }
            else if (result.code === PollQrResultCode.EXPIRED || result.code === PollQrResultCode.NOT_CONFIRMED) {
                log.info('login expired or not confirmed');
                lastKey = '';
                lastUrl = '';
            }
            return result.code
        }
        pollTimeout = setTimeout(async () => {
            await pollUtilSuccess(qr, roomid, finishCallback)
        }, 2000)
        return result.code
    }
    catch (error) {
        log.error(`pollUtilSuccess error: ${error}`)
    }
}

