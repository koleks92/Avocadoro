import {
    app,
    BrowserWindow,
    Tray,
    Menu,
    nativeImage,
    ipcMain,
    TitleOptions,
} from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { promiseHooks } from "node:v8";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

const PROTOCOL = "avocadoro";

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [
            path.resolve(process.argv[1]),
        ]);
    }
} else {
    app.setAsDefaultProtocolClient(PROTOCOL);
}

let mainWindow: BrowserWindow;
let tray: Tray;

function handleTimer(event: Electron.IpcMainEvent, timer: string) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);

    const options: TitleOptions = {
        fontType: "monospaced",
    };

    if (timer != "") {
        tray.setTitle(timer, options);
    } else {
        tray.setTitle("");
    }
}

function handelTimerOn(event: Electron.IpcMainEvent, timerOn: boolean) {
    if (mainWindow && timerOn) {
        mainWindow.setClosable(false);
    } else if (mainWindow) {
        mainWindow.setClosable(true);
    }
}

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        backgroundColor: "#0f0f0f",

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            backgroundThrottling: false,
            // Ensure contextIsolation is true and nodeIntegration is false for security
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // ... (Window loading logic)
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
            )
        );
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};

// --- App Lifecycle and Deep Link Handling ---

// The `requestSingleInstanceLock` is crucial for deep linking on Windows/Linux
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    // Handle new instance launch (Windows/Linux)
    app.on("second-instance", (event, argv, workingDirectory) => {
        // Find the URL argument
        const url = argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));

        if (mainWindow) {
            // Focus the main window
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();

            if (url) {
                console.log(`Deep link received (second-instance): ${url}`);
                mainWindow.webContents.send("deep-link-url", url);
            }
        }
    });

    app.on("ready", createWindow);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // Handle protocol activation (macOS)
    app.on("open-url", (event, url) => {
        event.preventDefault();

        if (mainWindow) {
            console.log(`Deep link received (open-url): ${url}`);
            mainWindow.webContents.send("deep-link-url", url);
            // Ensure window is shown/focused
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    // The Tray can only be instantiated after the 'ready' event is fired
    app.whenReady().then(() => {
        ipcMain.on("setTimer", handleTimer);
        ipcMain.on("setTimerOn", handelTimerOn);

        // --- Tray Icon Setup ---
        const finalPathString = path.join(
            app.isPackaged ? process.resourcesPath : app.getAppPath(),
            "assets",
            "tray_icon.png"
        );

        console.log(finalPathString);

        const trayIcon = nativeImage.createFromPath(finalPathString);

        const targetSize = 22;
        let resizedIcon = trayIcon.resize({
            width: targetSize,
            height: targetSize,
        });

        tray = new Tray(resizedIcon);
        tray.setToolTip("Avocado App");

        tray.on("click", () => {
            if (mainWindow) {
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                } else {
                    mainWindow.show();
                }
            }
        });
    });
}

// Quit when all windows are closed
app.on("window-all-closed", () => {
    app.quit();
});
