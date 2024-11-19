import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Define the custom API
const api = {
  sendFingerprintData: (data) => ipcRenderer.send('fingerprint-data', data),
  receiveWebSocketData: (callback) => ipcRenderer.on('websocket-data', (event, data) => callback(data)),
};

// Use `contextBridge` to expose APIs if `contextIsolation` is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    console.log('Preload script executed');
    contextBridge.exposeInMainWorld('api', api);
    console.log('API exposed:..........................', api);
  } catch (error) {
    console.error('Failed to expose APIs:', error);
  }
} else {
  // Fallback for non-isolated contexts
  window.electron = electronAPI;
  window.api = api;
}
