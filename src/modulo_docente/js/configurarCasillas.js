import { db } from "../../app/firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Obtener referencias del DOM
const tableroContainer = document.getElementById("tableroContainer");
const modal = document.getElementById("modalConfig");
const cerrarModal = document.getElementById("cerrarModal");
const plantillaSelect = document.getElementById("plantillaSelect");
const guardarCambiosBtn = document.getElementById("guardarCambios");
const btnVolver = document.getElementById("btnVolver");

let casillaSeleccionada = null;

// Obtener el ID del juego desde la URL
const urlParams = new URLSearchParams(window.location.search);
const juegoId = urlParams.get("juegoId");

if (!juegoId) {
    alert("Error: No se encontró el juego.");
    window.location.href = "../html/gestionarJuegos.html";
}

// Función para cargar las casillas desde Firestore
const cargarCasillas = async () => {
    try {
        const juegoRef = doc(db, "juegos", juegoId);
        const juegoSnap = await getDoc(juegoRef);

        if (!juegoSnap.exists()) {
            alert("El juego no existe.");
            return;
        }

        const juegoData = juegoSnap.data();
        tableroContainer.innerHTML = ""; // Limpiar antes de cargar

        for (let i = 0; i < 30; i++) {
            const casilla = document.createElement("div");
            casilla.classList.add("casilla");
            casilla.textContent = i + 1;

            // Si ya hay una plantilla asignada, mostrarla
            if (juegoData.casillas && juegoData.casillas[i]?.plantilla) {
                casilla.textContent += ` (${juegoData.casillas[i].plantilla})`;
                casilla.style.backgroundColor = "#4CAF50"; // Color indicando que tiene plantilla
            }

            casilla.addEventListener("click", () => abrirModal(i));
            tableroContainer.appendChild(casilla);
        }
    } catch (error) {
        console.error("Error al cargar las casillas:", error);
        alert("Hubo un error al cargar las casillas.");
    }
};

// Función para abrir el modal de selección de plantilla
const abrirModal = (indice) => {
    casillaSeleccionada = indice;
    modal.style.display = "block";
};

// Cerrar modal
cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Guardar la plantilla seleccionada en Firestore
guardarCambiosBtn.addEventListener("click", async () => {
    if (casillaSeleccionada === null) return;

    try {
        const plantilla = plantillaSelect.value;
        const juegoRef = doc(db, "juegos", juegoId);
        const juegoSnap = await getDoc(juegoRef);

        if (!juegoSnap.exists()) {
            alert("Error: No se encontró el juego.");
            return;
        }

        let casillasActualizadas = juegoSnap.data().casillas || [];
        casillasActualizadas[casillaSeleccionada] = { plantilla: plantilla };

        await updateDoc(juegoRef, { casillas: casillasActualizadas });

        alert(`Plantilla "${plantilla}" asignada a la casilla ${casillaSeleccionada + 1}`);
        modal.style.display = "none";
        cargarCasillas(); // Recargar casillas para ver los cambios
    } catch (error) {
        console.error("Error al guardar la plantilla:", error);
        alert("Hubo un error al guardar la plantilla.");
    }
});

// Botón para volver
btnVolver.addEventListener("click", () => {
    window.location.href = "../html/gestionarJuegos.html";
});

// ✅ Cargar las casillas al iniciar la página
cargarCasillas();

