//-- Crear la variable tienda, que es una estructura formada
//-- por dos productos
const tienda = [
    {
      nombre: "Fimi X8",
      descripcion: "Dron Plegable Fimi",
      stock: 8
    },
    {
      nombre: "Mavic Air 2",
      descripcion: "Dron Plegable DJI",
      stock: 12
    }
  ];
  
  //-- Mostrar informacion sobre la tienda
  console.log("Productos en la tienda: " + tienda.length);
  
  //-- Recorrer el array de productos
  tienda.forEach((element, index)=>{
    console.log("Producto: " + (index + 1) + ": " + element.nombre + " || Stock: " + element.stock);
  });