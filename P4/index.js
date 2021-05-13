const electron = require('electron');
var ip = require("ip");
console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const n_users = document.getElementById("n_users");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.versions.node;
info2.textContent = process.versions.chrome;
info3.textContent = process.versions.electron;
info4.textContent = ip.address();

btn_test.onclick = () => {
    display.innerHTML += "TEST! ";
    console.log("Botón apretado!");
}

//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('n_users', (event, message) => {
    console.log("Recibido: " + message);
    n_users.textContent = message;
});