const http = require('http')
const fs = require('fs')
const url = require('url')

const PUERTO = 9000

console.log("Arrancando servidor...")

//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

    let filename = ""

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
})

server.listen(PUERTO)

console.log("Server listo!. Escuchando en puerto: " + PUERTO)