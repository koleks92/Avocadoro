// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window {
        electronAPI: any;
    }
}

contextBridge.exposeInMainWorld("electronAPI", {
    setTimer: (timer: string) => ipcRenderer.send("setTimer", timer),
    setTimerOn: (timerOn: boolean) => ipcRenderer.send("setTimerOn", timerOn),
    onDeepLinkUrl: (callback: (url: string) => void) => {
        const listener = (_event: Electron.IpcRendererEvent, url: string) =>
            callback(url);
        ipcRenderer.on("deep-link-url", listener);

        return () => {
            ipcRenderer.removeListener("deep-link-url", listener);
        };
    },
});
