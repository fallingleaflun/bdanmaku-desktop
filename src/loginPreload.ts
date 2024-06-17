// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron/renderer'

// Preload in "Isolated World"
// Renderer in "Main World"
contextBridge.exposeInMainWorld(
  'loginApi',
  {
    getQRcode: (roomid: string) => {
      return ipcRenderer.invoke('getQRcode', roomid)
    },
  }
)