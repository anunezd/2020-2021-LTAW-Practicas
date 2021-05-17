function init () {
    $(document).ready(function () {
      $('.container').hide()
    })
  }

const display = document.getElementById('display');
const msg = document.getElementById('msg');
const name = document.getElementById('name');
const register = document.getElementById('register');
const send = document.getElementById('send');
const line = document.getElementById('line');
const socket = io();
  
register.onclick = () => {
    if (name.value) {
      socket.emit('hello', name.value);
    }
}
  
name.onkeydown = (ev) => {
    switch (ev.keyCode) {
      case 13: // enter
        if (name.value) {
          socket.emit('hello', name.value);
        }
        break;
    }
}
  
socket.on('used', (msg) => {
    line.innerHTML = msg;
})
  
socket.on('welcome', (msg) => {
    $(document).ready(function () {
      $('#register-panel').hide();
      $('#line').hide();
      $('.container').show();
    })
    display.innerHTML = '# ' + msg;
})
  
socket.on('msg', (msg) => {
    content = '# ' + msg + '<br>' + display.innerHTML;
    display.innerHTML = content;
})

socket.on('message', (msg) => {
  content = msg + '<br>' + display.innerHTML;
  display.innerHTML = content;
})
  
send.onclick = () => {
    if (msg.value){
        if (msg.value[0] == '/') {
          socket.emit('cmd', msg.value);
        } else {
          socket.emit('msg', msg.value);
        }
      }
      msg.value = '';
}
  
msg.onkeydown = (ev) => {
    switch (ev.keyCode) {
      case 13: // enter
        if (msg.value){
          if (msg.value[0] == '/') {
            socket.emit('cmd', msg.value);
          } else {
            socket.emit('msg', msg.value);
          }
        }
        msg.value = '';
      break;
    }
}
  