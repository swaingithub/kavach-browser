const { contextBridge, ipcRenderer } = require('electron');

// Securely expose APIs from the main process to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Tab and Context Menu Controls
  onNewTab: (callback) => ipcRenderer.on('new-tab', (_event, value) => callback(value)),
  showContextMenu: () => ipcRenderer.send('show-context-menu'),

  // Window Controls for the borderless UI
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window')
});

