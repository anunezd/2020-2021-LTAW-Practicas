const electron = require('electron');
const qrcode = require("qrcode-terminal");
var ip = require("ip");

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info5 = document.getElementById("info5");
const info6 = document.getElementById("info6");
const info7 = document.getElementById("info7");
const n_users = document.getElementById("n_users");
const msg = document.getElementById("msg");
const info8 = document.getElementById("info8");



//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.versions.node;
info2.textContent = process.versions.chrome;
info3.textContent = process.versions.electron;
info5.textContent = process.arch;
info6.textContent = process.platform;
info7.textContent = process.cwd();
info8.textContent = ip.address() + ":8080/chat.html";

btn_test.onclick = () => {
    display.innerHTML = "Mesaje de prueba! " + '<br>' + display.innerHTML;
    console.log("Botón apretado!");
    
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Boton apretado");
}

//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('n_users', (event, message) => {
    n_users.textContent = message;
});

//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('msg', (event, text) => {
    msg.textContent = '# ' + text + '<br>' + display.innerHTML;
    display.innerHTML = msg.textContent;
});