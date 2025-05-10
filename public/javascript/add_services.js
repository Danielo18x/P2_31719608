document.addEventListener("DOMContentLoaded", function() {
    console.log("El DOM ha cargado correctamente.");

    const params = new URLSearchParams(window.location.search);
    const servicioInput = document.getElementById("servicio");

    if (servicioInput) {
        servicioInput.value = params.get("servicio") || "";
    } else {
        console.error("Error: No se encontraron los elementos 'servicio' o 'monto'.");
    }
});

