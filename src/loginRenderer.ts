import log from 'electron-log'
import * as QRCode from 'qrcode'
import { AppConfig } from './config'

// 渲染进程初始化日志
log.initialize();
log.info('Logger initialized in login renderer process');

declare global {
    interface Window {
        loginApi: {
            getQRcode: (roomid: string) => Promise<string>,
            getRoomList: () => Promise<AppConfig>
            selectRoom: (roomid: number) => void
        }
    }
}

const roomIDInput = document.getElementById('roomIDInput') as HTMLInputElement
const confirmBtn = document.getElementById('confirmBtn') as HTMLButtonElement
const qrcodeCanvas = document.getElementById('qrcodeCanvas') as HTMLCanvasElement
const currentRoomID = document.getElementById('currentRoomID') as HTMLCanvasElement
const roomTable = document.getElementById('roomTable') as HTMLTableElement

window.onload = async () => {
    await updateRoomList()
    registerElementListeners()
}

async function registerElementListeners() {
    // 确认按钮
    confirmBtn.addEventListener('click', async () => {
        const roomid = roomIDInput.value
        if (roomid !== '') {
            // 生成二维码
            const url = await window.loginApi.getQRcode(roomid)
            QRCode.toCanvas(qrcodeCanvas, url, (error) => {
                if (error) {
                    log.error(error)
                }
                log.info('qr code generated')
            })
        }
    })
}

async function updateRoomList() {
    const roomList = await window.loginApi.getRoomList()

    if (roomList.currentRoomConfig) {
        currentRoomID.innerHTML = `当前直播间: ${roomList.currentRoomConfig?.NAME.toString()}`
    }

    roomList.roomConfigList.forEach(room => {
        const row = roomTable.insertRow()
        const cell1 = row.insertCell(0)
        cell1.innerHTML = room.NAME
        const cell2 = row.insertCell(1)
        const link = document.createElement('a')
        link.href = '#';
        link.textContent = room.ROOMID.toString();
        link.onclick = () => {
            window.loginApi.selectRoom(room.ROOMID);
        };
        cell2.appendChild(link);
    })
}