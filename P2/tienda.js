const http = require('http')
const fs = require('fs')
const url = require('url')
const PUERTO = 9000

console.log("Arrancando servidor...")

//-- Leer fichero JSON con los productos
const PRODUCTOS_JSON = fs.readFileSync('tienda.json');

//-- Nombre del fichero JSON de salida
const PRODUCTOS_JSON_OUT = "tienda_pedidos.json";

//-- Obtener el array de la tienda
let tienda = JSON.parse(PRODUCTOS_JSON);
// console.log(productos)

//-- Obtener el array de productos
let productos = JSON.parse(PRODUCTOS_JSON).productos;
// console.log(productos)

//-- Obtener el array de usuarios
let usuarios = JSON.parse(PRODUCTOS_JSON).usuarios;
// console.log(usuarios)

//-- Recorrer el array de usuarios
usuarios.forEach((element, index)=>{
  console.log("Usuario: " + (index + 1) + ": " + element.nick + " || Nombre: " + element.real);
});

//-- Obtener el array de pedidios
let pedidos = JSON.parse(PRODUCTOS_JSON).pedidos;

//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  var q = url.parse(req.url, true)
  let cookie = req.headers.cookie

  // Cuando no gestionamos peticiones
  if (q.pathname != "/myquery") {

    if (q.pathname == "/" ) {

      filename = "/portada.html"

      fs.readFile("." + filename, (err, data) => {

        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'})
          return res.end("404 Not Found")
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'})
          res.write(data)
          return res.end()
        }
    })

    // Para gestionar las busquedas que vienen por formulario
    } else if (q.pathname == "/search") {

        if (req.method === 'POST') {

        req.on('data', chunk => {

          //-- Leer los datos (convertir el buffer a cadena)
          data = chunk.toString()

          //-- Añadir los datos a la respuesta
          content = data.split("=")[1].toLowerCase()

          //-- Mostrar los datos en la consola del servidor
          console.log("Datos recibidos: " + content)

          switch (content) {
            case "dji+fpv":
              content = "dji_fpv.html"
            break;

            case "dji+mavic+air+2":
              content = "dji_mavic_air_2.html"
            break;

            case "dji+mavic+mini+2":
              content = "dji_mavic_mini_2.html"
            break;

            case "fimi+x8+mini":
              content = "fimi_x8_mini.html"
            break;

            case "fimi+x8c+2020":
              content = "fimi_x8_2020.html"
            break;

            default:
              content = ""
          }
        })

        req.on('end', ()=> {

          fs.readFile(content, (err, data) => {

            if (err) {
              res.writeHead(404, {'Content-Type': 'text/html'})
              return res.end("404 Not Found")
            } else {
              res.writeHead(200, {'Content-Type': 'text/html'})
              res.write(data)
              return res.end()
            }
          })
        })
        return
      } 
    // Gestiona el logueo del usuario
    } else if (q.pathname == "/login") {

      if (req.method == 'POST') {

        req.on('data', chunk => {

          // Recogemos los datos
          data = chunk.toString()

          let id = data.split("&")[0].split("=")[1]
          let pass = data.split("&")[1].split("=")[1]
          let login = false

          console.log("Nick: " + id)
          console.log("Password: " + pass)

          usuarios.forEach((element, index)=>{
            if (element.nick == id) {
              if (element.pass == pass){
                login = true;
                console.log(login);
                // Guardando cookie
                {res.setHeader('Set-cookie', id + "=" + pass)}
              }
            }
          });


          // Vemos si esta registrado
          if (cookie){
            for (let valor in cookie.split("; ")) {
              console.log("Cookie: " + cookie.split("; ")[valor])
              if (cookie.split("; ")[valor].split("=")[0] == id) {
              }
            }
          }

          if (!login) {
          
            req.on('end', ()=> {

              fs.readFile("./portada_login_error.html", (err, data) => {

                if (err) {
                  res.writeHead(404, {'Content-Type': 'text/html'})
                  return res.end("404 Not Found")
                } else {
                  res.writeHead(200, {'Content-Type': 'text/html'})
                  res.write(data)
                  return res.end()
                }
              })
            })
          }

          if (login){
            req.on('end', ()=> {

              fs.readFile("./portada_registrado.html", (err, data) => {

                if (err) {
                  res.writeHead(404, {'Content-Type': 'text/html'})
                  return res.end("404 Not Found")
                } else {
                  res.writeHead(200, {'Content-Type': 'text/html'})
                  res.write(data)
                  return res.end()
                }
              })
            })
          }
          return
        })
      }  
    
    } else if (q.pathname == "/carrito") {

      req.on('data', chunk => {

        // Recogemos los datos
        data = chunk.toString()

        name_producto = data.split("=")[0]

        console.log("Producto añadido al carrito: " + name_producto)

        // Vemos si esta registrado
        if (cookie){
          for (let valor in cookie.split("; ")) {
            id = cookie.split("; ")[valor].split("=")[0]
            pass = cookie.split("; ")[valor].split("=")[1]
          }
          // Añadimos el producto en el valor de la cookie
          res.setHeader('Set-cookie', id + "=" + pass + "/" + name_producto)

          req.on('end', ()=> {

            fs.readFile("./portada_registrado.html", (err, data) => {

              if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'})
                return res.end("404 Not Found")
              } else {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data)
                return res.end()
              }
            })
          })
        } else{
          req.on('end', ()=> {

            fs.readFile("./portada_login_error.html", (err, data) => {

              if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'})
                return res.end("404 Not Found")
              } else {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data)
                return res.end()
              }
            })
          })
        }
        return
      })
    } else if (q.pathname == "/factura") {
        req.on('data', chunk => {
          // Recogemos los datos
          data = chunk.toString()
          let direccion = data.split("&")[0].split("=")[1]
          let tarjeta = data.split("&")[1].split("=")[1]
          console.log(id + "//" + name_producto + "//" + direccion + "//" + tarjeta);
          //-- Recorrer el array de pedidos y añadir nueva información
          pedidos.forEach((element, index)=>{
            element.usuario = id;
            element.direccion = direccion;
            element.tarjeta = tarjeta;
            element.producto = name_producto;
          });
          //-- Convertir la variable a cadena JSON
          let myJSON = JSON.stringify(pedidos);
          //-- Guardarla en el fichero destino
          fs.writeFileSync(PRODUCTOS_JSON_OUT, myJSON);
        })
        req.on('end', ()=> {

          fs.readFile("./portada_registrado.html", (err, data) => {

            if (err) {
              res.writeHead(404, {'Content-Type': 'text/html'})
              return res.end("404 Not Found")
            } else {
              res.writeHead(200, {'Content-Type': 'text/html'})
              res.write(data)
              return res.end()
            }
          })
        })

    // Para gestionar las peticiones  
    } else {  

    filename = q.pathname

    let ext = filename.split(".")[-1]
    let mime = ""
    
    if (ext == "png" || ext == "jpg"){
      mime = "image/" + ext
    }
  
    if (ext == "html" || ext == "css"){
      mime = "text/" + ext
    }
    if (ext == "js"){
      mime = "application/javascript"
    }
    
    //-- Peticion recibida
    // console.log("Peticion recibida: " + q.pathname)
  
    //-- Crear mensaje de respuesta o error
      fs.readFile("." + filename, (err, data) => {
    
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'})
          return res.end("404 Not Found")
        } else {
          res.writeHead(200, {'Content-Type': mime})
          res.write(data)
          return res.end()
        }
      })
    }
    
  //-- Leer los parámetros recibidos en la peticion del buscador
  } else {

  const params = q.query
  let parametro1 = params.param1.toLowerCase()

  console.log("Parametros: " + parametro1)

  let busqueda = ""

  if (params.param1.length > 2) {
    for (var i = 0; i < productos.length; i++) {
      if (productos[i].nombre.toLowerCase().indexOf(parametro1) != -1) {
          busqueda += productos[i].nombre;
      }
    }
  }
  //-- El array de productos lo pasamos a una cadena de texto, en formato JSON
  busqueda = JSON.stringify(busqueda)
  res.setHeader('Content-Type', 'application/json')
  res.write(busqueda)
  return res.end()
  }
})

server.listen(PUERTO)

console.log("Server listo!. Escuchando en puerto: " + PUERTO)