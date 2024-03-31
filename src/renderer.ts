/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { MSGBase } from './parseMSG';
import Danmaku from './danmaku';

declare global {
    interface Window {
        api: {
            receiveMessageList: (callback: any) => void
        }
    }
}


const danmaku = new Danmaku({
    container: document.getElementById('danmaku-container')
});

window.api.receiveMessageList((messageList: MSGBase[]) => {
    messageList.forEach((msg) => {
        danmaku.emit({
            text: `(${msg.userName}): ${msg.info}`,
            style: {
                fontFamily: 'Microsoft YaHei',
                fontSize: '30px',
                color: '#ecf0f1',
                textShadow: '1px 0 0 #000000, -1px 0 0 #000000, 0 1px 0 #000000, 0 -1px 0 #000000'
            },
        });
    })
})