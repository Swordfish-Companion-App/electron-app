import { app, BrowserWindow, screen } from 'electron';

let win: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
  // Create the loading window
  loadingWindow = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  loadingWindow.loadFile('./src/loading/index.html');
  loadingWindow.center();

  // Create the main window
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.size;
  const windowWidth = width >= 1920 ? 1280 : width >= 1280 ? 854 : width / 1.5;
  const windowHeight = height >= 1080 ? 720 : height >= 720 ? 480 : height / 1.5;
  createMainWindow(windowWidth, windowHeight);

  // Close the loading window and show the main window
  setTimeout(() => {
    if (loadingWindow) {
      loadingWindow.close();
      if (win) {
        win.show();
      }
    }
  }, 3000);
});

function createMainWindow(winWidth: number, winHeight: number) {
  win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    show: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile('./src/main/index.html');
  win.center();
}

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, re-create a window in the app when the dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    if (win) {
      createMainWindow(800, 600);
    }
  }
});
