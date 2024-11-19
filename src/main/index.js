import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import WebSocket from 'ws';
import icon from '../../resources/icon.png?asset';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    title: 'Electron Vite',
    fullscreen: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true, // Enable context isolation for security
      nodeIntegration: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Start WebSocket server connection
  setupWebSocketServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// WebSocket integration
function setupWebSocketServer() {
  const ws = new WebSocket('ws://localhost:8080'); // Connect to Java WebSocket server

  ws.on('open', () => {
    console.log('Connected to WebSocket server');
  });

  ws.on('message', (data) => {
    console.log('Message received from WebSocket server:', data);

    // Forward WebSocket data to the renderer process
    if (mainWindow) {
      mainWindow.webContents.send('websocket-data', data);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

// Listen for fingerprint data from renderer
ipcMain.on('fingerprint-data', (event, data) => {
  console.log('Received fingerprint data from renderer:', data);

  // Example: Make an API call with the data
  const axios = require('axios');
  axios
    .post('https://example.com/api/verify', data)
    .then((response) => {
      console.log('API Response:', response.data);
    })
    .catch((error) => {
      console.error('API Error:', error);
    });
});
