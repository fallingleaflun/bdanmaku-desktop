import ini from 'ini';
import fs from 'fs';
import { LiveTCP, getConf } from 'bilibili-live-ws';
import { MSGBase, NormalMSG } from './parseMSG';

export async function getDanmaku(messageList: MSGBase[]): Promise<LiveTCP> {
    // 读取SESSDATA并创建一个axios实例
    const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
    const ROOMID = Number(config.DEFAULT.ROOMID) as number
    const UID = Number(config.DEFAULT.UID) as number
    const BUVID = config.DEFAULT.BUVID2 as string
    const KEY = config.DEFAULT.KEY as string


    try {
        const conf = await getConf(ROOMID)
        console.log(`address: ${conf.address}`)
        console.log(`key:${conf.key}`)
        console.log(`host:${conf.host}`)
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
        liveClient.on('open', () => console.log('Connection is established'))

        // Connection is established
        liveClient.on('liveClient', () => {
            liveClient.on('heartbeat', console.log)
        })

        liveClient.on('DANMU_MSG', (data: any) => {
            // console.log("DANMU_MSG data received")
            const normalMSG = new NormalMSG(data)
            messageList.push(normalMSG)
            // console.log(data)
        })

        liveClient.on('SUPER_CHAT_MESSAGE_JPN', (data: any) => {
            // console.log("SUPER_CHAT_MESSAGE_JPN data received")
            // console.log(data)
        })

        liveClient.on('SUPER_CHAT_MESSAGE', (data: any) => {
            // console.log("SUPER_CHAT_MESSAGE data received")
            // console.log(data)
        })
        
        liveClient.on('close', () => console.log('Connection is closed'))
        return liveClient
    }
    catch (e) {
        console.error(e)
        throw e
    }
}