// tablas.js
const datosPagina4 = [
    { Ciudad: 'Bilbao', Temperatura: 25, Humedad: 60, Ruido: 30, NivelLuz: 'Alto', Iluminacion: 'Rojo' },
    { Ciudad: 'Caceres', Temperatura: 22, Humedad: 55, Ruido: 35, NivelLuz: 'Medio', Iluminacion: 'Amarillo' },
    { Ciudad: 'Benidorm', Temperatura: 22, Humedad: 55, Ruido: 35, NivelLuz: 'Medio', Iluminacion: 'Amarillo' },
    { Ciudad: 'Melilla', Temperatura: 22, Humedad: 55, Ruido: 35, NivelLuz: 'Medio', Iluminacion: 'Amarillo' },
    { Ciudad: 'Ceuta', Temperatura: 22, Humedad: 55, Ruido: 35, NivelLuz: 'Medio', Iluminacion: 'Amarillo' }
];
$(document).ready(function () {
    // Manejar clics en los enlaces de paginación
    $(".pagina-enlace").click(function (event) {

        // Obtener el número de página desde el atributo de datos
        var pagina = $(this).data("pagina");
        var histogramContainer = $(".histogram-container");
        histogramContainer.hide();

        // Ocultar todos los contenedores de tablas
        $(".contenedor-tablas").hide();

        // Vaciar los contenedores de tablas de las páginas anteriores
        $(".contenedor-tablas").empty();

        // Realizar solicitud AJAX para cargar el archivo XML
        if(pagina==1 || pagina==2){
            $.ajax({
                type: "GET",
                url: "xml/datos.xml",
                dataType: "xml",
                success: function (xml) {
                    // Llamada a la función procesarDatosXML
                    procesarDatosXML(xml, pagina);

                    // Mostrar el contenido de la página seleccionada
                    $("#pagina" + pagina).show();

                    $('.checkbox-columna').on('change', function () {
                        var columna = $(this).data('columna');

                        var titulo = columna; 
                        histogramContainer.append('<h1>Histograma de ' + titulo + '</h1>');
                        
                        if(this.checked){
                            $(xml).find('pagina[num="' + pagina + '"] ciudad').each(function () {
                                var ciudad = $(this).text();
                    
                                // Creamos la barra en el histograma para la columna seleccionada
                                switch (columna) {
                                case 'temperatura':
                                    var temperatura = parseInt($(this).siblings('temperatura').text());
                                    crearBarra(ciudad, columna, temperatura);
                                    break;
                                case 'humedad':
                                    var humedad = parseInt($(this).siblings('humedad').text());
                                    crearBarra(ciudad, columna, humedad);
                                    break;
                                case 'ruido':
                                    var ruido = getRuidoValue($(this).siblings('ruido').text());
                                    crearBarra(ciudad, columna, ruido);
                                    break;
                                case 'nivel de luz':
                                    var nivelLuz=parseInt($(this).siblings('nivelLuz').text());
                                    crearBarra(ciudad, columna, nivelLuz);
                                    break;
                                }
                            });
                            histogramContainer.show();
                        }
                        else{
                            histogramContainer.hide();
                            histogramContainer.empty();
                        }
                    });
                },
                error: function (error) {
                    console.log("Error en la solicitud AJAX: " + error);
                }
            });
        }
        // Realizar solicitud AJAX para cargar el archivo JSON
        if(pagina==3){
            $.ajax({
                type: "GET",
                url: "json/datos.json",
                dataType: "json",
                success: function (data) {
                    // Llamada a la función procesarDatosJSON
                    procesarDatosJSON(data, pagina);
    
                    // Mostrar el contenido de la pagina seleccionada
                    $("#pagina" + pagina).show();

                    $('.checkbox-columna').on('change', function () {
                        var columna = $(this).data('columna');

                        var titulo = columna; 
                        histogramContainer.append('<h1>Histograma de ' + titulo + '</h1>');
                        
                        if(this.checked){
                            data.filter(item => item.pagina == pagina).forEach(item => {
                                var ciudad = item.ciudad;
                                // Creamos la barra en el histograma para la columna seleccionada
                                switch (columna) {
                                    case 'temperatura':
                                    var temperatura = parseInt(item.temperatura);
                                    crearBarra(ciudad, columna, temperatura);
                                    break;
                                    case 'humedad':
                                    var humedad = parseInt(item.humedad);
                                    crearBarra(ciudad, columna, humedad);
                                    break;
                                    case 'ruido':
                                    var ruido = getRuidoValue(item.ruido);
                                    crearBarra(ciudad, columna, ruido);
                                    break;
                                }
                            });
                            histogramContainer.show();
                        }
                        else{
                            histogramContainer.hide();
                            histogramContainer.empty();
                        }
                    });
                },
                error: function (error) {
                    console.log("Error en la solicitud AJAX: " + error);
                }
            });
        }
        if(pagina==4){
            $("#pagina" + pagina).html(generarTabla(datosPagina4));
            $("#pagina" + pagina).show();
        }
    });
});
function procesarDatosXML(xml, pagina) {
    var tabla = "<table><thead><tr><th>Ciudad</th><th>Temperatura<input type='checkbox' class='checkbox-columna' data-columna='temperatura'></th><th>Humedad<input type='checkbox' class='checkbox-columna' data-columna='humedad'></th><th>Ruido<input type='checkbox' class='checkbox-columna' data-columna='ruido'></th><th>Nivel de luz<input type='checkbox' class='checkbox-columna' data-columna='nivel de luz'></th><th>Color de iluminación</th></tr></thead><tbody>";
    // Sacamos para la pagina los campos del fichero xml
    $(xml).find("pagina[num='" + pagina + "']").each(function () {
        tabla += "<tr>";
        tabla += "<td>" + $(this).find("ciudad").text() + "</td>";
        tabla += "<td>" + $(this).find("temperatura").text() + "</td>";
        tabla += "<td>" + $(this).find("humedad").text() + "</td>";
        tabla += "<td>" + $(this).find("ruido").text() + "</td>";
        tabla += "<td>" + $(this).find("nivelLuz").text() + "</td>";
        tabla += "<td>" + $(this).find("colorIluminacion").text() + "</td>";
        tabla += "</tr>";
    });

    //Cierre de nuestra tabla
    tabla += "</tbody></table>";

    // Agregamos la tabla al contenedor
    $("#pagina" + pagina).html(tabla);
    
}
function procesarDatosJSON(data, pagina) {
    var tabla = "<table><thead><tr><th>Ciudad</th><th>Temperatura<input type='checkbox' class='checkbox-columna' data-columna='temperatura'></th><th>Humedad<input type='checkbox' class='checkbox-columna' data-columna='humedad'></th><th>Ruido<input type='checkbox' class='checkbox-columna' data-columna='ruido'></th><th>Nivel de luz<input type='checkbox' class='checkbox-columna' data-columna='nivel de luz'></th><th>Color de iluminación</th></tr></thead><tbody>";

    // Sacamos para la página los campos del fichero json
    $.each(data, function (index, fila) {
        if (fila.pagina == pagina) {
            tabla += "<tr>";
            tabla += "<td>" + fila.ciudad + "</td>";
            tabla += "<td>" + fila.temperatura + "</td>";
            tabla += "<td>" + fila.humedad + "</td>";
            tabla += "<td>" + fila.ruido + "</td>";
            tabla += "<td>" + fila.nivelLuz + "</td>";
            tabla += "<td>" + fila.colorIluminacion + "</td>";
            tabla += "</tr>";
        }
    });
    //Cierre de la tabla
    tabla += "</tbody></table>";
    // Agregamos la tabla al contenedor
    $("#pagina" + pagina).html(tabla);
}
function generarTabla(datosPagina) {
    // Inicializar la cadena de la tabla con los encabezados
    var tabla=" ";
    tabla += "<table class='contenedor-tablas'><thead><tr><th>Ciudad</th><th>Temperatura<input type='checkbox' class='checkbox-columna' data-columna='temperatura' name='temperatura'></th><th>Humedad<input type='checkbox' class='checkbox-columna' data-columna='humedad' name='humedad'></label></th><th>Ruido<label><input type='checkbox' class='checkbox-columna' data-columna='ruido' name='ruido'></label></th><th>Nivel de luz<label><input type='checkbox' class='checkbox-columna' data-columna='nivelLuz' name='nivelLuz'></label></th><th>Color de iluminación</th></tr></thead><tbody>";

    // Inicializar el cuerpo de la tabla
    tabla += "<tbody>";

    // Construir filas de la tabla a partir de cada fila
    for (var i = 0; i < datosPagina.length; i++) {
        const fila = datosPagina[i];
        tabla += "<tr>";
        tabla += "<td>" + fila.Ciudad + "</td>";
        tabla += "<td>" + fila.Temperatura + "</td>";
        tabla += "<td>" + fila.Humedad + "</td>";
        tabla += "<td>" + fila.Ruido + "</td>";
        tabla += "<td>" + fila.NivelLuz + "</td>";
        tabla += "<td>" + fila.Iluminacion + "</td>";
        tabla += "</tr>";
    }

    // Cerramos el cuerpo de la tabla y la etiqueta de la tabla
    tabla += "</tbody></table>";

    return tabla;
}
// Función para crear una barra en el histograma
function crearBarra(ciudad, columna, valor) {
    var histogramContainer = $(".histogram-container");

    var $bar = $('<div class="bar">');
    $bar.append('<label>' + ciudad + ':</label>');

    var $barContainer = $('<div class="bar-container">');
    var $barValue = $('<div class="bar-value">');
    $barValue.css('width', valor + '%');
    $barContainer.append($barValue);

    $bar.append($barContainer);
    histogramContainer.append($bar);
}

function getRuidoValue(ruido) {
    switch (ruido.toLowerCase()) {
        case 'alto':
            return 80;
        case 'moderado':
            return 50;
        case 'bajo':
            return 20;
        default:
            return 0;
    }
}

