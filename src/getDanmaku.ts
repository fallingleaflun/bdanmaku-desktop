import ini from 'ini';
import fs from 'fs';
import { LiveTCP, getConf } from 'bilibili-live-ws';
import { MSGBase, NormalMSG } from './parseMSG';
import path from 'path';
import { app } from 'electron';
import log from 'electron-log';

export async function getDanmaku(messageList: MSGBase[]): Promise<LiveTCP> {
    // 读取SESSDATA并创建一个axios实例
    
    // 打包后使用exe路径
    // const exeDir = path.dirname(app.getPath('exe'));
    // const configFilePath = path.join(exeDir, 'config.ini');
    // console.log(`log path: ${app.getPath('logs')}`)
    // log.info(`config file path: ${configFilePath}`)
    
    // 测试用本地路径
    const configFilePath ='./config.ini'
    
    const config = ini.parse(fs.readFileSync(configFilePath, 'utf-8'))
    const ROOMID = Number(config.DEFAULT.ROOMID) as number
    const UID = Number(config.DEFAULT.UID) as number
    const BUVID = config.DEFAULT.BUVID2 as string
    const KEY = config.DEFAULT.KEY as string

    try {
        const conf = await getConf(ROOMID)
        log.info(`address: ${conf.address}`)
        log.info(`key:${conf.key}`)
        log.info(`host:${conf.host}`)
        const liveClient = new LiveTCP(ROOMID, {
            uid: UID,
            key: KEY,
            buvid: BUVID,
            protover: 3,
            // authBody: {
            //   csrf: store.get('csrf') as string,
            //   SESSDATA: store.get('SESSDATA') as string,
            // },
        })
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
        console.error(e)
        throw e
    }
}