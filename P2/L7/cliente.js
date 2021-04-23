//-- Obtener el botón de VER del DOM
const ver = document.getElementById('ver')

//-- Obtener el párrafo del DOM donde mostrar el resultado
const resultado = document.getElementById('resultado');

//-- Cuando el usuario escribe ver los productos (2 letras min)
ver.onkeyup = ()=>{

  //-- Crear objeto para hacer peticiones AJAX
  const m = new XMLHttpRequest();

  //-- Configurar la petición
  m.open("GET","http://localhost:9000/myquery?param1="+ver.value, true);

  m.onreadystatechange=function(){
     //-- Petición enviada y recibida. Todo OK!
     if (m.readyState==4 && m.status==200){

       //-- La respuesta es un objeto JSON
       let productos = JSON.parse(m.responseText)
       console.log(productos);

       //-- Borrar el resultado anterior
       resultado.innerHTML = "";

       //-- Recorrer los productos del objeto JSON
       for (let i=0; i < productos.length; i++) {
        //-- Añadir cada producto al párrafo de visualización 
        resultado.innerHTML += productos[i];
       }
     }
   }
   //-- Enviar la petición!
   m.send();
}