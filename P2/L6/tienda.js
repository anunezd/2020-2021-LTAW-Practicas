const http = require('http')
const fs = require('fs')
const url = require('url')
const PUERTO = 9000

console.log("Arrancando servidor...")

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Nombre del fichero JSON de salida
const FICHERO_JSON_OUT = "tienda_mod.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Mostrar informacion sobre la tienda
console.log("Usuarios en la tienda: " + tienda.usuarios.length);

//-- Recorrer el array de usuarios
tienda.usuarios.forEach((element, index)=>{
  console.log("Usuario: " + (index + 1) + ": " + element.nick + " || Nombre: " + element.real);
});

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
    console.log(" Nombre: " + nombre);

    if (myURL.pathname == '/login') {

        //-- HTML de la página de respuesta
        const RESPUESTA = fs.readFileSync('login_respuesta.html', 'utf-8');

        //-- Por defecto entregar formulario
        let content_type = "text/html";

        //-- Reemplazar las palabras claves por su valores
        //-- en la plantilla HTML
        content = RESPUESTA.replace("NOMBRE", nombre);

        //-- Recorrer el array de usuarios
        tienda.usuarios.forEach((element, index)=>{
              if (element.nick == nombre) {
                  //-- Enviar la respuesta
                  res.setHeader('Content-Type', content_type);
                  res.write(content);
                  res.end()
                  filename = "login_respuesta.html";
              }
        });
    }

    if (myURL.pathname == '/tarjeta') {

      //-- HTML de la página de respuesta
      const RESPUESTA = fs.readFileSync('tarjeta_respuesta.html', 'utf-8');

      //-- Por defecto entregar formulario
      let content_type = "text/html";

      //-- Reemplazar las palabras claves por su valores
      //-- en la plantilla HTML
      content = RESPUESTA.replace("DIRECCION", direccion);
      content = content.replace("TARJETA", tarjeta);

      //-- Recorrer el array de usuarios
      tienda.pedidos.forEach((element, index)=>{
            if (element.direccion == null || element.tarjeta == null) {
              element.direccion = direccion
              element.tarjeta = tarjeta
                //-- Enviar la respuesta
                res.setHeader('Content-Type', content_type);
                res.write(content);
                res.end()
                filename = "login_respuesta.html";
            }
      });
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