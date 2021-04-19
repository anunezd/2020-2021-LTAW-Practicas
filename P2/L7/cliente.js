//-- Obtener el botón de VER del DOM
const ver = document.getElementById('ver')

//-- Obtener el párrafo del DOM donde mostrar el resultado
const resultado = document.getElementById('resultado');

//-- Cuando el usuario escribe ver los productos (+ de 3 letras)
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

       //-- Borrar el resultado anterior
       resultado.innerHTML = "";

       //-- Recorrer los productos del objeto JSON
       for (let i=0; i < productos.length; i++) {
         resultado.innerHTML += productos[i].nombre;
       }
     }
   }
   //-- Enviar la petición!
   m.send();
}