import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { WebSocketServer } from 'ws';

let mainWindow;
let javaWebSocketConnection = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 1920,
    title: 'Electron Vite',
    fullscreen: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // Ensure contextIsolation is enabled for security
      contextIsolation: true,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // Start the WebSocket server
  startWebSocketServer();
}

function startWebSocketServer() {
  const wss = new WebSocketServer({ port: 9091, host: '127.0.0.1' });

  wss.on('connection', function connection(ws) {
    console.log('Java client connected');
    javaWebSocketConnection = ws; // Store the connection for later use

    ws.on('message', function incoming(message) {
      console.log('Received from Java client:', message);

      // Send a response back to the Java backend
      ws.send('Message received: ' + 'Hello from Electron!');

      // Communicate with the renderer process
      mainWindow.webContents.send('message-from-java', message);
    });

    ws.on('close', function () {
      console.log('Java client disconnected');
      javaWebSocketConnection = null;
    });

    ws.on('error', function (error) {
      console.error('WebSocket error:', error);
    });
  });

  wss.on('listening', function () {
    console.log('WebSocket server started on ws://localhost:9091');
  });
}

// Handle messages from the renderer process
ipcMain.on('message-to-java', (event, message) => {
  console.log('Received message from renderer:', message);
  // Forward the message to the Java backend via WebSocket
  if (javaWebSocketConnection && javaWebSocketConnection.readyState === javaWebSocketConnection.OPEN) {
    javaWebSocketConnection.send(message);
  } else {
    console.error('No active WebSocket connection to Java backend.');
  }
});

// Electron app initialization
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
