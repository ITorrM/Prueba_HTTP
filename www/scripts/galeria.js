$(document).ready(function() {
    const galeriaBody = $("#galeria-body");
    const cuadroInformacion = $(".cuadro-informacion");

    const imagenes = [
        "scripts/galeria/imagen1.jpg",
        "scripts/galeria/imagen2.jpg",
        "scripts/galeria/imagen3.jpg",
        "scripts/galeria/imagen4.jpg",
        "scripts/galeria/imagen5.jpg",
    ];

    // Indexamos las imagenes en nuestro contenedor junto a la clase pertinente para sus estilos
    imagenes.forEach(function(imagenSrc, index) {
        const imagen = $("<div>").addClass("imagen-pequena");
        const imagenElement = $("<img>")
            .attr("src", imagenSrc)
            .data("nombre", `Imagen ${index + 1}`);

        imagen.append(imagenElement);
        galeriaBody.append(imagen);
    });

    cuadroInformacion.hide();
    // Evento que se inicia al poner el raton encima de una imagen con la clase "imagen-pequeña"
    galeriaBody.on("mouseenter", ".imagen-pequena", function() {
        const imagenSrc = $(this).find("img").attr("src");
        const nombreImagen = $(this).find("img").data("nombre");

        $("#imagen-ampliada").attr("src", imagenSrc);
        $("#nombre-imagen").text(nombreImagen);

        cuadroInformacion.show();
    });

    //Evento que esconde el cuadro de información al sacar el raton fuera de las imagenes
    galeriaBody.on("mouseleave", ".imagen-pequena", function() {
        cuadroInformacion.hide();
    });

    // Botones de flecha para desplazar las imagenes de la galería
    $(".flecha").on("click", function() {
        const scrollAmount = 200; // Valor constante de dezplazamiento

        if ($(this).attr("id") === "izquierda") {
            galeriaBody.scrollAmount(galeriaBody.scrollLeft() - scrollAmount);
        } else {
            galeriaBody.scrollLeft(galeriaBody.scrollLeft() + scrollAmount);
        }
    });
    // Obtenemos la imagen almacenada en localStorage
    const imagenBase64 = localStorage.getItem("imagenBase64");

    // Validamos que se haya cargado la imagen
    if (imagenBase64) {
        // Indexamos el elemento de manera similar al anterior script de carga de imagenes
        const nuevaImagen = $("<div>").addClass("imagen-pequena");
        const imagenElement = $("<img>")
            .attr("src", imagenBase64)
            .data("nombre", "Nueva Imagen");

        nuevaImagen.append(imagenElement);

        // Append para la imagen cargada desde config.html
        $("#galeria-body").append(nuevaImagen);

        // Borramos la imagen de localStorage, al recargar la página no existirá
        localStorage.removeItem("imagenBase64");
    }
});