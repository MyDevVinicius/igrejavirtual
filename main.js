const { app, BrowserWindow, session } = require("electron");
const path = require("path");

async function createWindow() {
  const isDev = await import("electron-is-dev").then(
    (module) => module.default
  );

  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    frame: false, // Remove a barra de título
    icon: path.join(__dirname, "assets/icons/icon.png"), // Define o ícone personalizado
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: true,
    },
  });

  // Criar uma sessão personalizada
  const ses = session.fromPartition("persist:mySession");
  mainWindow.webContents.session = ses;

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
