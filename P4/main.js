//-- Cargar el módulo de electron
const electron = require('electron');
//-- Cargar las dependencias
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const colors = require('colors');
const PUERTO = 8080;

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Crear las variables
var users = 0;
var names = {};
var days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
              'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var ip = require("ip");

console.log("Arrancando electron...");

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {

//-- Imprimir por terminal              
http.listen(PUERTO, () => {
    console.log('Entra al chat en: '+ ip.address() + ':' + PUERTO + '/chat.html')
});

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi chat web
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connection', (socket) => {
    
    //-- Evento hola
    socket.on('hello', (msg) => {
      if (isAccepted(msg)) {
        console.log(msg.red + ' se ha unido al chat'.green);
        io.emit('msg','<strong>server</strong>: ' + msg + ' se ha unido al chat');
        users += 1;
        //-- Enviar un mensaje al proceso de renderizado para que lo saque
        //-- por la interfaz gráfica
        win.webContents.send('n_users', users);
        names[socket.id] = msg;
        socket.emit('welcome', '<strong>server</strong>: bienvenido, ' + msg);
      } else {
        console.log('usuario ' + msg.red + ' no aceptado, el nick ya esta en uso'.green);
        socket.emit('used', 'Usuario ' + msg + ' no aceptado, el nick ya esta en uso');
      }
    })

    //-- Evento de mensaje recibido: Reenviarlo a todos los clientes conectados
    socket.on('msg', (msg) => {
      console.log(names[socket.id].red + ": " + msg.blue);
      win.webContents.send('msg', msg);
      //-- Reenviarlo a todos los clientes conectados
      io.emit('msg', '<strong>' + names[socket.id] + '</strong>: ' + msg);
    });

    // Eventos de la cmd
    socket.on('cmd', (msg) => {
      console.log(names[socket.id].red + ': ' + msg.yellow)
      let cmd = ''
      switch (msg) {
        case '/help':
          cmd += 'puedes usar estos comandos:'
          cmd += '<ul><li>\'/list\': número de usuarios conectados</li>'
          cmd += '<li>\'/hello\': saludos desde el servidor</li>'
          cmd += '<li>\'/date\': mostrar fecha</li>'
          cmd += '<li>\'/usr-online\': mostrar usuarios conectados</li></ul>'
          break
        case '/list':
          cmd += users.toString() + ' usarios conectados'
          break
        case '/hello':
          cmd = 'Valar Morghulis, ' + names[socket.id]
          break
        case '/date':
          let date = new Date()
          cmd += days[date.getDay()] + ' ' + date.getDate() + ' de ' + months[date.getMonth()] + ' de ' + date.getFullYear()
          break;
        case '/usr-online':
          cmd += '<ul>'
          for (let id in names) {
            cmd += '<li>' + names[id] + '</li>'
          }
          cmd += '</ul>'
          break
        default:
          cmd = 'comando\'' + msg + '\' no detectado'
      }
      socket.emit('msg', '<strong>server</strong>: ' + cmd)
    });

    //-- Evento de desconexión
    socket.on('disconnect', function(){
      console.log(names[socket.id].red + ' ha dejado el chat'.green);
      users -= 1;
      io.emit('msg', '<strong>server</strong>: ' + names[socket.id] + ' ha dejado el chat');
      delete names[socket.id];
    });

});

function isAccepted(nick) {
  let accepted = true;
  for (let id in names) {
    if (nick.toLowerCase() == names[id].toLowerCase()) {
      accepted = false;
    }
  }
  return accepted;
}

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,   //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });

  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");



});