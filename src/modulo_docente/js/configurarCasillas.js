import { db } from "../../app/firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Obtener referencia al contenedor de casillas y botón de guardar
const tableroContainer = document.getElementById("tableroContainer");
const guardarCambiosBtn = document.getElementById("guardarCambios");

// Obtener el ID del juego desde la URL
const urlParams = new URLSearchParams(window.location.search);
const juegoId = urlParams.get("juegoId");

if (!juegoId) {
    alert("Error: No se encontró el juego.");
    window.location.href = "../html/gestionarJuegos.html";
}

// Función para cargar las casillas del juego desde Firestore
const cargarCasillas = async () => {
    try {
        const juegoRef = doc(db, "juegos", juegoId);
        const juegoSnap = await getDoc(juegoRef);

        if (!juegoSnap.exists()) {
            alert("El juego no existe.");
            return;
        }

        const juegoData = juegoSnap.data();
        tableroContainer.innerHTML = ""; // Limpiar cualquier contenido previo

        for (let i = 0; i < 30; i++) {
            const casilla = document.createElement("div");
            casilla.className = "casilla";
            casilla.textContent = i + 1;

            // Si ya hay configuración guardada, mostrarla
            if (juegoData.casillas[i]?.configuracion) {
                casilla.style.backgroundColor = "#4CAF50"; // Color para indicar que ya tiene configuración
            }

            casilla.addEventListener("click", () => {
                configurarCasilla(i);
            });

            tableroContainer.appendChild(casilla);
        }
    } catch (error) {
        console.error("Error al cargar las casillas:", error);
        alert("Hubo un error al cargar las casillas.");
    }
};

// Función para configurar una casilla (por ahora solo cambiar color y mostrar alerta)
const configurarCasilla = (indice) => {
    alert(`Configurar Casilla #${indice + 1}`);

    // Aquí luego permitiremos elegir plantillas o subir modelos 3D
    document.querySelectorAll(".casilla")[indice].style.backgroundColor = "#FFD700"; // Amarillo como indicador
};

// Evento para guardar cambios en Firestore
guardarCambiosBtn.addEventListener("click", async () => {
    try {
        const casillas = document.querySelectorAll(".casilla");
        const nuevasConfiguraciones = [];

        casillas.forEach((casilla, index) => {
            nuevasConfiguraciones.push({
                configuracion: casilla.style.backgroundColor === "rgb(255, 215, 0)" ? "configurada" : null
            });
        });

        const juegoRef = doc(db, "juegos", juegoId);
        await updateDoc(juegoRef, { casillas: nuevasConfiguraciones });

        alert("¡Cambios guardados con éxito!");
    } catch (error) {
        console.error("Error al guardar las configuraciones:", error);
        alert("Hubo un error al guardar los cambios.");
    }
});

// Referencia al botón de volver
const btnVolver = document.getElementById("btnVolver");

btnVolver.addEventListener("click", () => {
    window.location.href = "../html/gestionarJuegos.html"; // Redirige a la gestión de juegos
});

// Cargar las casillas al iniciar la página
cargarCasillas();


