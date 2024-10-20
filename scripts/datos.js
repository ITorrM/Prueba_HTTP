var formulario = document.querySelector("#datosPersonales");

formulario.addEventListener("submit", function(event) {

    var nombre = document.querySelector("#nombre").value;
    var email = document.querySelector("#email").value;

    if (validarEmail(email)) {
        alert("Datos correctos.\nNombre: " + nombre + "\nEmail: " + email);
        fname=nombre;
        localStorage.setItem("fname", nombre);
    } else {
        alert("Por favor, ingrese un correo electrónico válido.");
    }
});
function validarEmail(email) {
    // Expresión regular para validar el formato del correo electrónico
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}