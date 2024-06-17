import { LiveTCP, getConf } from 'bilibili-live-ws';
import { MSGBase, NormalMSG } from './parseMSG';
import appConfig from './config';

import log from 'electron-log';
import { SessionData } from './updateSession';

export async function getDanmaku(messageList: MSGBase[], sess: SessionData): Promise<LiveTCP> {
    // 读取SESSDATA并创建一个axios实例
    try {
        let liveClient: LiveTCP
        if (sess) {
            liveClient = new LiveTCP(
                Number(sess['roomid']),
                {
                    uid: Number(sess['uid']),
                    key: sess['key'],
                    buvid: sess['buvid'],
                    protover: 3,
                }
            )
        }
        else {
            const conf = await getConf(appConfig.ROOMID)
            log.info(`address: ${conf.address}`)
            log.info(`key:${conf.key}`)
            log.info(`host:${conf.host}`)
            liveClient = new LiveTCP(
                appConfig.ROOMID,
                {
                    uid: appConfig.UID,
                    key: appConfig.KEY,
                    buvid: appConfig.BUVID,
                    protover: 3,
                    // authBody: {
                    //   csrf: store.get('csrf') as string,
                    //   SESSDATA: store.get('SESSDATA') as string,
                    // },
                }
            )
        }
        liveClient.on('open', () => log.info('Connection is established'))

        // Connection is established
        liveClient.on('liveClient', () => {
            liveClient.on('heartbeat', log.info)
        })

        liveClient.on('DANMU_MSG', (data: any) => {
            // log("DANMU_MSG data received")
            const normalMSG = new NormalMSG(data)
            messageList.push(normalMSG)
            // log(data)
        })

        liveClient.on('SUPER_CHAT_MESSAGE_JPN', (data: any) => {
            // log("SUPER_CHAT_MESSAGE_JPN data received")
            // log(data)
        })

        liveClient.on('SUPER_CHAT_MESSAGE', (data: any) => {
            // log("SUPER_CHAT_MESSAGE data received")
            // log(data)
        })

        liveClient.on('close', () => log.info('Connection is closed'))
        return liveClient
    }
    catch (e) {
        log.error(e)
        throw e
    }
}