// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron/renderer'

contextBridge.exposeInMainWorld(
  'api', {
    receiveMessageList: (callback: any) => {
        ipcRenderer.on('sendMessageListToRender', (_event, value) => callback(value))
    }
  }
)