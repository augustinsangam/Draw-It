"use strict";
exports.__esModule = true;
// const { app, BrowserWindow } = require('electron')
var electron_1 = require("electron");
var win;
var createWindow = function () {
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        minWidth: 1300,
        minHeight: 900,
        backgroundColor: '#FFFFFF'
    });
    win.loadURL("file://" + __dirname + "/dist/index.html");
    //// uncomment below to open the DevTools.
    // win.webContents.openDevTools()
    // Event when the window is closed.
    win.on('closed', function () {
        win = null;
    });
};
// Create window on electron intialization
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // macOS specific close process
    if (win === null) {
        createWindow();
    }
});
