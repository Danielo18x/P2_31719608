document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('busqueda');
    const filas = document.querySelectorAll('#tabla-contactos tr');

    input.addEventListener('input', () => {
        const filtro = input.value.toLowerCase();

        filas.forEach(fila => {
        const nombre = fila.cells[1].textContent.toLowerCase();
        const email = fila.cells[2].textContent.toLowerCase();
        const coincide = nombre.includes(filtro) || email.includes(filtro);
        fila.style.display = coincide ? '' : 'none';
        });
    });
});

function mostrarServicio() {
    const checkbox = document.getElementById("check-servicio");
    const inputExtra = document.getElementById("input-servicio");

    inputExtra.style.display = checkbox.checked ? "block" : "none";
}

function mostrarFecha() {
    const checkbox = document.getElementById("fecha");
    const inputExtra = document.getElementById("input-fecha");

    inputExtra.style.display = checkbox.checked ? "block" : "none";
}

function mostrarEstado() {
    const checkbox = document.getElementById("estado");
    const inputExtra = document.getElementById("input-estado");

    inputExtra.style.display = checkbox.checked ? "block" : "none";
}

function normalizar(texto) {
    return texto?.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

document.addEventListener('DOMContentLoaded', () => {
    const servicioCheckbox = document.getElementById('check-servicio');
    console.log(servicioCheckbox)
    const fechaCheckbox = document.getElementById('fecha');
    const estadoCheckbox = document.getElementById('estado');

    const servicioSelect = document.getElementById('select-servicio');
    console.log(servicioSelect)
    const fechaInput = document.getElementById('fechas');
    const estadoSelect = document.getElementById('estados');

    const filas = document.querySelectorAll('#tabla-pagos tr');

    



    const aplicarFiltros = () => {
        const servicioFiltro = servicioCheckbox.checked ? normalizar(servicioSelect.value) : '';
        console.log(servicioFiltro)
        const fechaFiltro = fechaCheckbox.checked ? fechaInput.value.trim() : '';
        const estadoFiltro = estadoCheckbox.checked ?  normalizar(estadoSelect.value) : '';

        filas.forEach(fila => {
        const servicio = normalizar(fila.cells[1].textContent);
        const fecha = fila.cells[4].textContent.trim();
        const estado = normalizar(fila.cells[5].textContent);

        const coincideServicio = !servicioFiltro || servicio === servicioFiltro;
        const coincideFecha = !fechaFiltro || fecha === fechaFiltro;
        const coincideEstado = !estadoFiltro || estado === estadoFiltro;

        const mostrar = coincideServicio && coincideFecha && coincideEstado;
        fila.style.display = mostrar ? '' : 'none';
        });
    };

    //Escucha los cambios en los filtros
    servicioSelect.addEventListener('change', aplicarFiltros);
    fechaInput.addEventListener('input', aplicarFiltros);
    estadoSelect.addEventListener('change', aplicarFiltros);

    servicioCheckbox.addEventListener('change', aplicarFiltros);
    fechaCheckbox.addEventListener('change', aplicarFiltros);
    estadoCheckbox.addEventListener('change', aplicarFiltros);

    console.log("servicio:", servicio, "fecha:", fecha, "estado:", estado);


});
