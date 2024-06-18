import { Cookie } from './cookie'
import log from 'electron-log'
import axios from 'axios'

interface GenerateQrResp {
    code: number
    message: string
    ttl: number
    data: {
        url: string
        qrcode_key: string
    }
}

interface PollQrResp {
    code: number
    message: string
    ttl: number
    data: {
        url: string
        refresh_token: string
        timestamp: string
        code: number
        message: string
    }
}

interface PollQrResult {
    code: number
    msg: string
    cookie?: string
}

export class LoginQr {
    private readonly header: Record<string, string> = {}

    public constructor(
        userAgent = '',
        private key = '',
    ) {
        this.header = {
            'User-Agent': userAgent,
            Origin: 'https://www.bilibili.com',
            Referer: 'https://www.bilibili.com/',
        }
    }

    public async generate() {
        const r = await fetch('https://passport.bilibili.com/x/passport-login/web/qrcode/generate', {
            headers: this.header,
        })
        const res = await r.json()
        // log.info(`generate respone is ${JSON.stringify(res)}`)
        const {
            code,
            message,
            data: { url, qrcode_key: key } = { url: '', qrcode_key: '' },

        } = res as GenerateQrResp
        return { code, msg: message, url, key }
    }

    public async poll(roomid: string, key: string) {
        const r0 = await fetch(
            `https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${key}`,
            { headers: this.header },
        )
        log.info(`call: https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=${key}`)
        const res = await r0.json()
        log.info(`poll response is ${JSON.stringify(res)}`)
        log.info(`poll set-cookie is ${r0.headers.get('set-cookie')}`)
        const { code, message, data } = res as PollQrResp
        const result: PollQrResult =
            code === 0
                ? {
                    code: data.code,
                    msg: data.message,
                }
                : {
                    code: Number(code),
                    msg: message,
                }

        if (result.code !== 0) return result

        result.cookie = new Cookie()
            .set('buvid3', await this.getBuvid3())
            .add(r0.headers.getSetCookie())
            .del('i-wanna-go-back')
            .toString()

        return result
    }

    private async getBuvid3() {
        log.info(`getBuvid3 header: ${JSON.stringify(this.header)}`)
        const r = await fetch('https://api.bilibili.com/x/frontend/finger/spi', { headers: this.header })
        const { code, message, data } = await r.json()
        log.info(`getBuvid3 set-cookie is ${r.headers.get('set-cookie')}`)
        if (code !== 0) throw new Error(message)
        return data.b_3
    }
    
    public async getSessionKey(roomid: string, cookies: string) {
        // 有点莫名其妙，用fetch拿到的是错的，用axios拿到的是对的
        this.header['Cookie'] = cookies;
        log.info(`getSessionKey header: ${JSON.stringify(this.header)}`);
        const response = await axios.get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=${roomid}`, { headers: this.header });
        log.info(`getSessionKey set-cookie is ${response.headers['set-cookie']}`);
        const { code, message, ttl, data } = response.data;
        if (code !== 0) throw new Error(message);
        log.info(`getSessionKey data: ${JSON.stringify(data)}`);
        return data.token;
    }

    public async getUID(cookies: string) {
        this.header['Cookie'] = cookies
        log.info(`getUID header: ${JSON.stringify(this.header)}`)
        const r = await fetch(`https://api.bilibili.com/x/web-interface/nav`, { headers: this.header})
        const { code, message, ttl, data } = await r.json()
        if (code !== 0) throw new Error(message)
        return data.mid
    }

    public async getRoomName(roomid: string): Promise<string> {
        const response1 = await axios.get(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomid}`, { headers: this.header });
        const { code, message, msg, data } = response1.data;
        if (code !== 0) throw new Error(message);
        log.info(`getRoomName data: ${JSON.stringify(data)}`);
        return await this.getUname(data.uid)
    }

    private async getUname(uid: string) {
        const response2 = await axios.get(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`, { headers: this.header });
        const { code, msg, message, data } = response2.data;
        if (code !== 0) throw new Error(message);
        log.info(`getUname data: ${JSON.stringify(data)}`);
        return data.info.uname;
    }

    public getKey(){
        return this.key
    }
}