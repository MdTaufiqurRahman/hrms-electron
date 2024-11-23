import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  onMessageFromJava: (callback) => ipcRenderer.on('message-from-java', callback),
  removeMessageListener: (channel, listener) => ipcRenderer.removeListener(channel, listener),
  sendToMain: (channel, data) => ipcRenderer.send(channel, data),
};

// Expose APIs to the renderer process
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
