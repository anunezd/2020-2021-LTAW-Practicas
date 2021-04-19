const http = require('http')
const fs = require('fs')
const url = require('url')
const PUERTO = 9000

console.log("Arrancando servidor...")

//-- Leer fichero JSON con los productos
const PRODUCTOS_JSON = fs.readFileSync('tienda.json');

//-- Obtener el array de productos
let productos = JSON.parse(PRODUCTOS_JSON).productos;
console.log(productos)

//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {
  var q = url.parse(req.url, true)

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
          case "fpv":
            content = "dji_fpv.html"
          break;

          case "mavic+air+2":
            content = "dji_mavic_air_2.html"
          break;

          case "dji+mavic+mini+2":
            content = "dji_mavic_mini_2.html"
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
  } else {

    let filename = q.pathname

      if (req.url == "/" ){
        filename = "/portada.html"  //--Página principal
      }  else {
        filename = req.url
      }
    
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
      console.log("Peticion recibida!")
      console.log("Recurso (URL): " + req.url)
    
      //-- Crear mensaje de respuesta o error
    
      console.log()
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
        if (productos[i].toLowerCase().indexOf(parametro1) != -1) {
            busqueda += productos[i];
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