const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

// Enable required Electron features
app.commandLine.appendSwitch('enable-features', 'WebViewTag');

// Configure session
app.on('ready', () => {
  const session = require('electron').session.defaultSession;
  
  // Set custom user agent
  session.setUserAgent(session.getUserAgent() + ' GeminiBrowser/1.0.0');
  
  // Configure permissions
  session.setPermissionRequestHandler((webContents, permission, callback) => {
    const secureOrigin = webContents.getURL().startsWith('https://');
    callback(secureOrigin);
  });
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false,
    frame: false, // Use a borderless window
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#d1d5db',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.cjs'),
      enableRemoteModule: false,
      sandbox: true,
      // Enable hardware acceleration
      accelerator: 'gpu'
    }
  });

  // Load from the Vite development server in development mode
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Load the built file in production
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.maximize();
  mainWindow.show();

  // Handle new tab requests and permissions
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    mainWindow.webContents.send('new-tab', url);
    return { action: 'deny' };
  });

  // Handle permission requests
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['media', 'geolocation', 'notifications', 'fullscreen'];
    callback(allowedPermissions.includes(permission));
  });

  // Handle webview permissions
  app.on('web-contents-created', (event, contents) => {
    if (contents.getType() === 'webview') {
      // Handle webview permissions
      contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        callback(true);  // Allow all permissions in webview
      });

      // Allow loading external URLs in webview
      contents.on('will-navigate', (event, url) => {
        // Allow navigation
      });

      contents.on('will-attach-webview', (event, webPreferences, params) => {
        // Strip away preload scripts if unused
        delete webPreferences.preload;

        // Disable Node.js integration
        webPreferences.nodeIntegration = false;
        webPreferences.contextIsolation = true;
      });
    }
  });

  // --- IPC Handlers for UI interaction ---
  const contextMenu = Menu.buildFromTemplate([
    { role: 'cut' }, { role: 'copy' }, { role: 'paste' },
  ]);

  ipcMain.on('show-context-menu', () => contextMenu.popup(mainWindow));
  ipcMain.on('minimize-window', () => mainWindow.minimize());
  ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });
  ipcMain.on('close-window', () => mainWindow.close());
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});