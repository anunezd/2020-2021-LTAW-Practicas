//-- Crear una variable con la estructura definida
//-- en un fichero JSON

const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Nombre del fichero JSON de salida
const FICHERO_JSON_OUT = "tienda_mod.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Mostrar informacion sobre la tienda
console.log("Productos en la tienda: " + tienda.productos.length);
console.log("Usuarios en la tienda: " + tienda.usuarios.length);
console.log("Pedidios en la tienda: " + tienda.pedidos.length);

//-- Recorrer el array de productos
tienda.productos.forEach((element, index)=>{
    console.log("Producto: " + (index + 1) + ": " + element.nombre + " || Precio: " + element.precio + " || Stock: " + element.stock);
});

//-- Recorrer el array de usuarios
tienda.usuarios.forEach((element, index)=>{
    console.log("Usuario: " + (index + 1) + ": " + element.nick + " || Nombre: " + element.real);
});

//-- Recorrer el array de pedidos
tienda.pedidos.forEach((element, index)=>{
    console.log("Pedidos: " + (index + 1) + ": " + element.fecha + " || Concepto: " + element.concepto);
});

//-- Recorrer el array de productos y sumar 1 de stock
tienda.productos.forEach((element, index)=>{
    element.stock++;
});

//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda.productos);

//-- Guardarla en el fichero destino
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON_OUT);

