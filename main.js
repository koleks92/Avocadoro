const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    const startURL = isDev
        ? "http://localhost:5173"
        : `file://${path.join(__dirname, "../build/index.html")}`;

    console.log(startURL);
    win.loadURL(startURL);
};

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
