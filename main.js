//https://clarityapi.concurcompleat.com/swagger
//Full API list here ^

const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow } = electron;


let mainWindow;

//Listen for app to be ready

function createWindow() {
    //Create new window
    //var password = getInput();
    mainWindow = new BrowserWindow({
        width: 1680,
        height: 1200,
        frame: true,
        backgroundColor: '#1e1e1e',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });
    //mainWindow.setMenu(null);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
}

app.whenReady().then(createWindow)


app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});