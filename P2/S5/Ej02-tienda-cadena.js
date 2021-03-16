//-- Cadena con la estructura de la tienda en JSON
const tienda_json = `[
    {
      "nombre": "Fimi X8",
      "descripcion": "Dron Plegable Fimi",
      "stock": 13
    },
    {
      "nombre": "Mavic Air 2",
      "descripcion": "Dron Plegable DJI",
      "stock": 20
    }
  ]`
  
  //-- Crear la estructura tienda a partir de la cadena en json
  const tienda = JSON.parse(tienda_json);
  
  //-- Mostrar informacion sobre la tienda
  console.log("Productos en la tienda: " + tienda.length);
  
  //-- Recorrer el array de productos
  tienda.forEach((element, index)=>{
    console.log("Producto: " + (index + 1) + ": " + element["nombre"] + " || Stock: " + element.stock);
  });