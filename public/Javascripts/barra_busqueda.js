document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('busqueda');
    const filas = document.querySelectorAll('#tabla-contactos tr');

    input.addEventListener('input', () => {
        const filtro = input.value.toLowerCase();

        filas.forEach(fila => {
        const nombre = fila.cells[0].textContent.toLowerCase();
        const email = fila.cells[2].textContent.toLowerCase();
        const coincide = nombre.includes(filtro) || email.includes(filtro);
        fila.style.display = coincide ? '' : 'none';
        });
    });
});

