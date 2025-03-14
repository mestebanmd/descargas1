document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();
});

function registrarDescarga() {
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const numDescarga = document.getElementById("numDescarga").value;
    const fotoInput = document.getElementById("foto");
    const turno = determinarTurno(hora);
    const tabla = document.getElementById("tablaDescargas").querySelector("tbody");
    
    if (!fecha || !hora || !numDescarga) {
        alert("Por favor, complete todos los campos.");
        return;
    }
    
    if (descargaDuplicada(turno, numDescarga)) {
        alert("El número de descarga ya ha sido registrado en este turno.");
        return;
    }
    
    const fila = tabla.insertRow();
    
    fila.insertCell(0).textContent = fecha;
    fila.insertCell(1).textContent = hora;
    fila.insertCell(2).textContent = turno;
    fila.insertCell(3).textContent = numDescarga;
    
    const cellFoto = fila.insertCell(4);
    if (fotoInput.files.length > 0) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(fotoInput.files[0]);
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.objectFit = "cover";
        img.onclick = function () {
            window.open(img.src, "_blank");
        };
        cellFoto.appendChild(img);
    } else {
        cellFoto.textContent = "No disponible";
    }
    
    document.getElementById("numDescarga").value = "";
    document.getElementById("foto").value = "";
}

document.getElementById("btnAgregar").addEventListener("click", registrarDescarga);

function determinarTurno(hora) {
    const [h, m] = hora.split(":").map(Number);
    return (h >= 6 && h < 18) ? "Diurno" : "Nocturno";
}

function descargaDuplicada(turno, numDescarga) {
    const filas = document.getElementById("tablaDescargas").querySelector("tbody").rows;
    for (let fila of filas) {
        if (fila.cells[2].textContent === turno && fila.cells[3].textContent === numDescarga) {
            return true;
        }
    }
    return false;
}

function exportarExcel() {
    const tabla = document.getElementById("tablaDescargas");
    const ws = XLSX.utils.table_to_sheet(tabla);
    delete ws["E1"]; // Eliminar encabezado de imagen
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Descargas");
    XLSX.writeFile(wb, "Descargas_PTAR.xlsx");
}
