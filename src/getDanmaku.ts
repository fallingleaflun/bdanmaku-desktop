import { LiveTCP, getConf } from 'bilibili-live-ws';
import { MSGBase, NormalMSG } from './parseMSG';
import log from 'electron-log';
import configUtils, { RoomConfig } from './config';
import { BrowserWindow } from 'electron';

export async function getDanmaku(messageList: MSGBase[], roomConfig: RoomConfig, mainWindow: BrowserWindow): Promise<LiveTCP> {
    try {
        if (roomConfig.NAME !== "invalid") {
            let liveClient: LiveTCP
            const conf = await getConf(roomConfig.ROOMID)
            log.info(`address: ${conf.address}`)
            log.info(`key:${conf.key}`)
            log.info(`host:${conf.host}`)
            liveClient = new LiveTCP(
                roomConfig.ROOMID,
                {
                    uid: roomConfig.UID,
                    key: roomConfig.KEY,
                    buvid: roomConfig.BUVID,
                    protover: 3,
                    // authBody: {
                    //   csrf: store.get('csrf') as string,
                    //   SESSDATA: store.get('SESSDATA') as string,
                    // },
                }
            )

            liveClient.on('open', () => {
                log.info('Connection is established')
                mainWindow.webContents.send('connectionEstablished')
            })

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

            liveClient.on('close', () => {
                log.info('Connection is closed')
                mainWindow.webContents.send('connectionLost')
            })
            return liveClient
        }
        return null
    }
    catch (e) {
        log.error(e)
        throw e
    }
}