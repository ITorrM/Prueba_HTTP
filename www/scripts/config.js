//Acceso a los nodos hijo para la funcion calcularDiferencia()
var temperaturaMinInput = document.querySelector('#temperaturaMin');
var temperaturaMaxInput = document.querySelector('#temperaturaMax');
var diferenciaOutput = document.querySelector('#diferencia');
//Acceso a los nodos hijo para la fucnion verificarClave()
var passwordInput = document.querySelector('#pswd');
//Acceso a todos los nodos con clase styleCheckbox
var checkboxes = document.querySelectorAll('.contenedor-opciones input[type="checkbox"]');
//Escucha activa a la introduccion de la password
passwordInput.addEventListener('input', verificarClave);
//Acceso a los nodos del div password y mara url
var gpsInput = document.querySelector("#gps");
var urlInput = document.querySelector("#url");
//Escucha activa de los elementos de temperatura
temperaturaMinInput.addEventListener('input', calcularDiferencia);
temperaturaMaxInput.addEventListener('input', calcularDiferencia);
//Seleccion jQuery del campo Ciudad


function envioDatos()
{
    var country = countryInput.value; //Valor del input
    var opcionesPaises = document.getElementById("country").getElementsByTagName("option");
    var paisesPermitidos = []; //Array para rellenar con los valores de datalist
    // Construir un array con los países permitidos del datalist
    for (var i = 0; i < opcionesPaises.length; i++) {
        //Rellenamos nuestro array con las opciones del datalist
        paisesPermitidos.push(opcionesPaises[i].value.toUpperCase()); 
    }
    // Verificación para el campo COUNTRY
    if (!paisesPermitidos.includes(country.toUpperCase())) {
        abrirAlerta("El país ingresado no es válido. Por favor, elige un país de la lista.");
    }
}
function calcularDiferencia() {
    var temperaturaMin = parseFloat(temperaturaMinInput.value);
    var temperaturaMax = parseFloat(temperaturaMaxInput.value);

    // Calcular la diferencia de temperatura
    var diferencia = temperaturaMax - temperaturaMin;

    // Mostrar la diferencia de temperatura
    diferenciaOutput.textContent = diferencia;

    // Cambiar el color del texto a rojo si la diferencia está fuera del rango de 22 a 26
    if(temperaturaMax >= 26.0 || temperaturaMax < 22.0 && temperaturaMin <= 22.0 || temperaturaMin > 26.0){
        if ((diferencia < 0 || diferencia > 4)) {
            diferenciaOutput.style.color = 'red';
            temperaturaMaxInput.style.color='red';
            temperaturaMinInput.style.color='red';
        } else {
            // Restaurar el color predeterminado si está dentro del rango
            diferenciaOutput.style.color = '';
            temperaturaMaxInput.style.color='';
            temperaturaMinInput.style.color=''; 
        }
    }
}
function verificarClave() {
    var clave = passwordInput.value;
    var mensaje = document.getElementById("pswdStrong");
    var regexPswd =/^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

    if(regexPswd.test(clave)==true){
        mensaje.textContent="Clave segura";
        mensaje.style.color="green";
        passwordInput.style.color="green";
    }
    else if(clave.length >6 && regexPswd.test(clave)==false){
        mensaje.textContent="Clave debil (debe contener al menos un número, una mayúscula y un carácter especial)";
        mensaje.style.color="yellow";
        passwordInput.style.color="yellow";
    }
    else{
        mensaje.textContent="Debe introducir al menos 6 digitos";
        mensaje.style.color="red";
        passwordInput.style.color="red";
    }
}
//Evento activo (evitamos el uso del envio del formulario)
gpsInput.addEventListener("input", function() {
    // Obtener el valor de las coordenadas
    var gpsValue = gpsInput.value;

    // Lógica para generar el enlace si las coordenadas son válidas
    var enlaceGenerado = generarEnlace(gpsValue);
    // Establecer el enlace generado en el campo de URL
    urlInput.value = enlaceGenerado;
});
function generarEnlace(coordenadas) {
    //Expresión regex que verifica nuestra cadena de coordenadas
    var regexCoordenadas = /^([NS]) (\d{1,2})º (\d{1,2})' (\d{1,2}\.\d{2})\", ([EO]) (\d{1,2})º (\d{1,2})' (\d{1,2}\.\d{2})\"$/;
    //Verificamos si nuestras coordenadas son correctas
    if (coordenadas.match(regexCoordenadas)) {
        var latitudSigno = (coordenadas.match(regexCoordenadas)[1] === "S") ? "-" : "+";
        var longitudSigno = (coordenadas.match(regexCoordenadas)[5] === "O") ? "-" : "+";

        var gradosLatitud = parseFloat(coordenadas.match(regexCoordenadas)[2]);
        var minutosLatitud = parseFloat(coordenadas.match(regexCoordenadas)[3]);
        var segundosLatitud = parseFloat(coordenadas.match(regexCoordenadas)[4]);
        var gradosLongitud = parseFloat(coordenadas.match(regexCoordenadas)[6]);
        var minutosLongitud = parseFloat(coordenadas.match(regexCoordenadas)[7]);
        var segundosLongitud = parseFloat(coordenadas.match(regexCoordenadas)[8]);

        var latitud = `${latitudSigno}${gradosLatitud}º${minutosLatitud}’${segundosLatitud}”`;
        var longitud = `${longitudSigno}${gradosLongitud}º${minutosLongitud}’${segundosLongitud}”`;

        return `https://maps.google.com/maps?q=${latitud},+${longitud}`;
    } else {
        return "Coordenadas inválidas";
    }
}
function abrirAlerta(texto) {
    var alerta = document.getElementById("alerta");
    var mensaje = document.getElementById("mensajeAlerta");
    
    // Establece el mensaje
    mensaje.textContent = texto;
    
    // Muestra la ventana de alerta personalizada
    alerta.style.display = "block";
}  
function cerrarAlerta() {
    var alerta = document.getElementById("alerta");
    
    // Oculta la ventana de alerta personalizada
    alerta.style.display = "none";
}
document.addEventListener("DOMContentLoaded", function() {
    
    // Función para manejar el evento de cambio en las casillas de verificación
    function cambioCheckbox(event) {
        var checkbox = event.target;
        var estado = checkbox.checked ? 'Activo' : 'Inactivo';
        var tipo = checkbox.name + 'Estado';
        localStorage.setItem(tipo, estado);
    }
    // Envento de escucha para que se mantengan las checkbox activas en LocalStorage
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', cambioCheckbox);
        // Obtener el estado de localStorage y marcar las casillas de verificación
        var tipo = checkbox.name + 'Estado';
        var estado = localStorage.getItem(tipo);
        if (estado === 'Activo') {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
});
$(document).ready(function () {
    $("#countryInput").change(function () {
        var selectedCountry = $(this).val();
        // Eliminamos datalist existente
        $("#citiesDatalist").remove();
        $.ajax({
            type: "GET",
            url: "xml/ciudades.xml",
            dataType: "xml",
            success: function (xml) {
                var datalist = $("<datalist>");
                datalist.attr("id", "citiesDatalist");
                $(xml).find('pais[nombre="' + selectedCountry + '"] ciudad').each(function () {
                    var city = $(this).text();
                    datalist.append("<option value='" + city + "'>" + city + "</option>");
                });
                // Agregamos el datalist al div
                $("#city").append(datalist);
                // Asignamos el datalist al input
                $("#city").attr("list", "citiesDatalist");
            },
            error: function (error) {
                console.log("Error al cargar el archivo XML: " + error);
            }
        });
    });
    $("#imagen").change(function(event) {
        //C
        const input = event.target;
        if (input.files) {
            const lectura = new FileReader();

            lectura.onload = function (event) {
                const imagenBlob = new Blob([event.target.result], { type: input.files[0].type });

                // Instancia base64 para almacenar el contenido del blob
                const lecturaBase64 = new FileReader();
                lecturaBase64.onload = function (base64Event) {
                    const imagenBase64 = base64Event.target.result;

                    // Guardamos la imagen como cadena base64 en el localStorage
                    localStorage.setItem("imagenBase64", imagenBase64);
                };
                lecturaBase64.readAsDataURL(imagenBlob);
            };
            lectura.readAsArrayBuffer(input.files[0]);
        }
    });
});

