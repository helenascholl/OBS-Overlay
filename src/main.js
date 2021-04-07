const { app, BrowserWindow, ipcMain } = require('electron');

const editorHtmlFile = 'editor/index.html';
const overlayHtmlFile = 'overlay/index.html';

let editorWindow;
let overlayWindow;

app.whenReady().then(() => {
  editorWindow = createWindow(editorHtmlFile, {
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  editorWindow.on('closed', () => {
    if (overlayWindow) {
      overlayWindow.close();
    }
  });
});

ipcMain.handle('reload-overlay', () => {
  if (overlayWindow) {
    overlayWindow.reload();
  }
});

ipcMain.handle('open-overlay', () => {
  createOverlayWindow();
});

function createWindow(htmlFile, config) {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: config && config.backgroundColor ? config.backgroundColor : 'white',
    webPreferences: config && config.webPreferences ? config.webPreferences : {}
  });

  window.loadFile(htmlFile);

  return window;
}

function createOverlayWindow() {
  if (overlayWindow) {
    overlayWindow.close();
  }

  overlayWindow = createWindow(overlayHtmlFile, {
    backgroundColor: '#35BD09'
  });

  overlayWindow.on('close', () => {
    overlayWindow = null;
  });
}
