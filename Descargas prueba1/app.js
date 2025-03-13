document.addEventListener('DOMContentLoaded', async () => {
    // Ensure XLSX library is loaded
    if (typeof XLSX === 'undefined') {
        await loadXLSXLibrary();
    }
    const descargaForm = document.getElementById('descargaForm');
    const tablaDescargas = document.getElementById('tablaDescargas').getElementsByTagName('tbody')[0];
    const exportarExcelBtn = document.getElementById('exportarExcel');

    let descargas = [];

    // Función para agregar una descarga a la tabla y al array
    function agregarDescarga(descarga) {
        // Validar que el número de descarga no se repita en el mismo turno
        const existeDescarga = descargas.some(d => 
            d.numeroDescarga === descarga.numeroDescarga && d.turno === descarga.turno
        );

        if (existeDescarga) {
            alert('Error: El número de descarga ya existe para este turno.');
            return;
        }

        // Agregar la descarga al array
        descargas.push(descarga);

        // Agregar la descarga a la tabla
        const row = tablaDescargas.insertRow();
        row.innerHTML = `
            <td>${descarga.fecha}</td>
            <td>${descarga.hora}</td>
            <td>${descarga.turno}</td>
            <td>${descarga.numeroDescarga}</td>
            <td>${descarga.foto ? `<img src="${descarga.foto}" alt="Foto de descarga" style="max-width: 100px;">` : 'Sin foto'}</td>
        `;
    }

    // Evento para enviar el formulario
    descargaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const turno = document.getElementById('turno').value;
        const numeroDescarga = document.getElementById('numeroDescarga').value;
        const foto = document.getElementById('foto').files[0];

        // Crear objeto de descarga
        const descarga = {
            fecha,
            hora,
            turno,
            numeroDescarga,
            foto: foto ? URL.createObjectURL(foto) : null
        };

        // Agregar la descarga
    });
    
    // Function to dynamically load the XLSX library
    function loadXLSXLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

        // Limpiar el formulario
        descargaForm.reset();
    });

    // Evento para exportar a Excel
    exportarExcelBtn.addEventListener('click', () => {
        if (descargas.length === 0) {
            alert('No hay descargas para exportar.');
            return;
        }

        // Crear datos para Excel
        const wsData = descargas.map(descarga => ({
            Fecha: descarga.fecha,
            Hora: descarga.hora,
            Turno: descarga.turno,
            'Número de Descarga': descarga.numeroDescarga
        }));

        // Crear hoja de cálculo
        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Descargas');

        // Exportar a Excel
        XLSX.writeFile(wb, 'descargas.xlsx');
    });
