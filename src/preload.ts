// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron/renderer'

// Preload in "Isolated World"
// Renderer in "Main World"
contextBridge.exposeInMainWorld(
  'api',
  {
    receiveMessageList: (callback: any) => {
      ipcRenderer.on('sendMessageListToRender', (_event, value) => callback(value))
    },
    showArea: (callback: any) => {
      ipcRenderer.on('showArea', (_event) => callback())
    },
    hideArea: (callback: any) => {
      ipcRenderer.on('hideArea', (_event) => callback())
    },
  }
)