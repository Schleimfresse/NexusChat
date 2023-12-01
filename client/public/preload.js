const { ipcRenderer, contextBridge } = require("electron");
console.log(ipcRenderer);

contextBridge.exposeInMainWorld("connection", {
	ipcRenderer,
});
