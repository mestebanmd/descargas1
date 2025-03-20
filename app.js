document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();
    cargarDescargas(); // Cargar descargas guardadas al iniciar la página
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
    let fotoURL = "";
    if (fotoInput.files.length > 0) {
        fotoURL = URL.createObjectURL(fotoInput.files[0]);
        const img = document.createElement("img");
        img.src = fotoURL;
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

    guardarDescarga({ fecha, hora, turno, numDescarga, fotoURL });

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

// FUNCIONES PARA GUARDAR EN LOCALSTORAGE

// Guardar cada descarga en localStorage
function guardarDescarga(descarga) {
    let descargas = JSON.parse(localStorage.getItem("descargas")) || [];
    descargas.push(descarga);
    localStorage.setItem("descargas", JSON.stringify(descargas));
}

// Cargar las descargas guardadas en la tabla
function cargarDescargas() {
    let descargas = JSON.parse(localStorage.getItem("descargas")) || [];
    const tabla = document.getElementById("tablaDescargas").querySelector("tbody");
    descargas.forEach(({ fecha, hora, turno, numDescarga, fotoURL }) => {
        const fila = tabla.insertRow();
        fila.insertCell(0).textContent = fecha;
        fila.insertCell(1).textContent = hora;
        fila.insertCell(2).textContent = turno;
        fila.insertCell(3).textContent = numDescarga;

        const cellFoto = fila.insertCell(4);
        if (fotoURL) {
            const img = document.createElement("img");
            img.src = fotoURL;
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
    });
}

// Borrar descargas y limpiar localStorage
// 🚀 Limpiar solo la tabla sin borrar del localStorage
function limpiarTabla() {
    document.getElementById("tablaDescargas").querySelector("tbody").innerHTML = "";
}

// 🚀 Borrar todo, incluyendo localStorage
function borrarDescargas() {
    limpiarTabla();
    localStorage.removeItem("descargas");
}

// Agregar eventos a los botones
document.getElementById("btnLimpiar").addEventListener("click", limpiarTabla);
document.getElementById("btnBorrar").addEventListener("click", borrarDescargas);



document.getElementById("btnBorrar").addEventListener("click", borrarDescargas);

function exportarExcel() {
    const tabla = document.getElementById("tablaDescargas");
    const ws = XLSX.utils.table_to_sheet(tabla);
    delete ws["E1"]; // Eliminar encabezado de imagen
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Descargas");
    XLSX.writeFile(wb, "Descargas_PTAR.xlsx");
}

