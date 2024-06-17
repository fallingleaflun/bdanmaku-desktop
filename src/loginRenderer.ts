import log from 'electron-log'
import * as QRCode from 'qrcode'

// 渲染进程初始化日志
log.initialize();
log.info('Logger initialized in login renderer process');

declare global {
    interface Window {
        loginApi: {
            getQRcode: (roomid: string) => Promise<string>,
        }
    }
}

const roomIDInput = document.getElementById('roomIDInput') as HTMLInputElement
const roomIDButton = document.getElementById('confirmBtn') as HTMLButtonElement
const qrcodeCanvas = document.getElementById('qrcodeCanvas') as HTMLCanvasElement

roomIDButton.addEventListener('click',  async () => {
    log.info("clicked")
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
        // TODO: 等待扫码完成，主线程检查登录后关闭窗口
    }
})
