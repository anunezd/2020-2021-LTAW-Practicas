const http = require('http')
const fs = require('fs')
const url = require('url')
const PUERTO = 9000

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('login_formulario.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('login_respuesta.html', 'utf-8');

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

    if (ext == "css" || ext == "html" || ext == "txt"){
      mime = "text/" + ext
    }

    if (ext == "js"){
      mime = "application/javascript"
    }

    //-- Construir el objeto url con la url de la solicitud
    const myURL = new URL(req.url, 'http://' + req.headers['host']);

    //-- Leer los parámetros
    let nombre = myURL.searchParams.get('nombre');
    let apellidos = myURL.searchParams.get('apellidos');
    console.log(" Nombre: " + nombre);
    console.log(" Apellidos: " + apellidos);

     //-- Por defecto entregar formulario
    // let content_type = "text/html";
    // let content = FORMULARIO;

    if (myURL.pathname == '/procesar') {
        content_type = "text/html";

        //-- Reemplazar las palabras claves por su valores
        //-- en la plantilla HTML
        content = RESPUESTA.replace("NOMBRE", nombre);
        content = content.replace("APELLIDOS", apellidos); 
    }
    
    //-- Enviar la respuesta
    // res.setHeader('Content-Type', content_type);
    // res.write(content);
    // res.end()

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