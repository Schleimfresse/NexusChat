const { default: axios } = require("axios");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
	let mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		title: "NexusChat",
		webPreferences: {
			nodeIntegration: false,
			preload: path.join(__dirname, "./preload.js"),
			enableRemoteModule: true,
		},
	});

	mainWindow.setMenu(null);
	mainWindow.maximize();
	mainWindow.loadURL('http://localhost:3000');
	mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

ipcMain.on("message", (event, message) => {
	console.log("message:", message);
	const url = "http://localhost:3000/receiveMessage";

	axios
		.post(url, { message, user: "Schleimfresse", channel: 101010 })
		.then((res) => {
			console.log("Success");
		})
		.catch((error) => {
			console.error("Error:", error);
		});
});

// electron-packager . NexusChat --overwrite --out=./bin
