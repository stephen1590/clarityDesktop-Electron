//https://clarityapi.concurcompleat.com/swagger
//Full API list here ^

const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow } = electron;

const Tray = electron.Tray
const iconPath = path.join(__dirname, './img/SAPConcur.png')
const Menu = electron.Menu

let mainWindow;
let tray = null;

//Listen for app to be ready

function createWindow() {

    //--------------------------------------------------
    // Main Window
    //--------------------------------------------------
    mainWindow = new BrowserWindow({
        width: 1680,
        height: 1200,
        frame: true,
        backgroundColor: '#1e1e1e',
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true
        }
    });

    //--------------------------------------------------
    // Prevent closing from quitting - do it from the system tray
    //--------------------------------------------------
    mainWindow.on('close', function(event) {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }

        return false;
    });

    //mainWindow.setMenu(null);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //--------------------------------------------------
    // TRAY
    //--------------------------------------------------
    tray = new Tray(iconPath);
    tray.setToolTip('Clarity Web Wrapper')
    tray.on('click', function() {
        mainWindow.show();
    })

    let template = [{
        label: 'Quit Application',
        click: function() {
            app.isQuiting = true;
            app.quit();
        }
    }]
    const ctxMenu = Menu.buildFromTemplate(template);
    tray.setContextMenu(ctxMenu);
}

app.whenReady().then(createWindow)

//app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});