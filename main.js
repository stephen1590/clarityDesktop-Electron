//https://clarityapi.concurcompleat.com/swagger
//Full API list here ^

const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow } = electron;

const Tray = electron.Tray
const iconPath = path.join(__dirname, './img/SAPConcur.png')
const Menu = electron.Menu
const ipcMain = electron.ipcMain

let mainWindow;
let loginWindow;
let loadingWindow;
let okayToKill = true;
let tray = null;

let loginName = null; //"gdsxprod\\stephen.mcdermott";

let apiKey = null;
let refreshKey = null;
//Listen for app to be ready

function createMainWindow() {

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

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    var data = {
        "username": loginName,
        "apiKey": apiKey,
        "refreshKey": refreshKey
    }

    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.openDevTools();
    });

    //Wait for the page to tell us it's ready!

    ipcMain.on("get-Login-Data", (event, args) => {
        console.log("Sending data: " + data)
        event.returnValue = data;
        mainWindow.webContents.send('login-data', data);
    });
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

function createLoadingWindow() {

}

function createLoginWindow() {

    //--------------------------------------------------
    // Main Window
    //--------------------------------------------------
    loginWindow = new BrowserWindow({
        width: 450,
        height: 450,
        frame: true,
        show: false,
        backgroundColor: '#1e1e1e',
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,

        }
    });
    loginWindow.setMenu(null);
    loginWindow.webContents.loadURL("https://support.concurcompleat.com");

    //--------------------------------------------------

    loginWindow.webContents.on('did-finish-load', function() {
        loginWindow.webContents.insertCSS('html,body{ background-color: #333 !important;background-image: url("") !important;}')
        loginWindow.show();
    });

    //--------------------------------------------------

    const filter = {
        urls: ['https://*.concurcompleat.com/*']
    }
    loginWindow.webContents.session.webRequest.onHeadersReceived(filter, (details, callback) => {
        if (details.responseHeaders['Set-Cookie']) {
            //console.log(details.responseHeaders['Set-Cookie'][0]);
            if ((details.responseHeaders['Set-Cookie'][0]).includes("ClarityAPIAccess=")) {
                //console.log(details.responseHeaders['Set-Cookie'][0]);
                apiKey = (details.responseHeaders['Set-Cookie'][0]);
                //console.log(details.responseHeaders['Set-Cookie'][1]);
                refreshKey = (details.responseHeaders['Set-Cookie'][1]);
            }

            if (apiKey != null & refreshKey != null & okayToKill) {
                okayToKill = false;
                loginWindow.hide()
                createMainWindow();
                loginWindow.destroy();
            }

        }
        callback({})
    });
    loginWindow.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
        if (details.uploadData) {
            if (loginName == null) {
                //console.log((details.uploadData[0]['bytes']).toString());
                var temp = (details.uploadData[0]['bytes']).toString();
                if (temp.indexOf("&UserName=")) {
                    loginName = temp.substring(temp.indexOf("&UserName=") + 10, temp.indexOf("&Password"));
                    loginName = loginName.replace("%5C", "\\");
                    console.log("Will attempt to login with: " + loginName)
                }
            }
        }
        callback({})
    });

    //--------------------------------------------------
    // Closing
    //--------------------------------------------------
    loginWindow.on('close', function(event) {
        if (okayToKill) {
            app.isQuiting = true;
            app.quit();
        } else {
            console.log("User logged in.")
        }
    });
}

app.commandLine.appendSwitch("disable-http-cache");
app.whenReady().then(createLoginWindow)

//app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    loginWindow.removeAllListeners('close');
    loginWindow.close();
    if (mainWindow) {
        mainWindow.removeAllListeners('close');
        mainWindow.close();
    }
});