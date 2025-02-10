import { db } from "../../app/firebase.js";
import { collection, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Obtener referencias del DOM
const abrirModalSonidos = document.getElementById("abrirModalSonidos");
const cerrarModalSonidos = document.getElementById("cerrarModalSonidos");
const modalSonidos = document.getElementById("modalSonidos");
const listaSonidos = document.getElementById("listaSonidos");
const sonidoSeleccionadoTexto = document.getElementById("sonidoSeleccionado");
const listaModelos = document.getElementById("listaModelos");
const guardarConfiguracion = document.getElementById("guardarConfiguracion");

// Variables para almacenar el sonido seleccionado
let sonidoSeleccionado = null;

// Abrir la ventana modal
abrirModalSonidos.addEventListener("click", () => {
    modalSonidos.style.display = "flex";
    cargarSonidos();
});

// Cerrar la ventana modal
cerrarModalSonidos.addEventListener("click", () => {
    modalSonidos.style.display = "none";
});

// Cargar sonidos desde Firestore
const cargarSonidos = async () => {
    listaSonidos.innerHTML = "<p>Cargando sonidos...</p>";

    try {
        const sonidosSnapshot = await getDocs(collection(db, "sonidos"));
        listaSonidos.innerHTML = "";

        sonidosSnapshot.forEach((doc) => {
            const sonido = doc.data();

            const sonidoDiv = document.createElement("div");
            sonidoDiv.className = "sonido-item";
            sonidoDiv.innerHTML = `
                <span>${sonido.nombre}</span>
                <button class="reproducir-sonido" data-url="${sonido.url}">🔊</button>
                <button class="seleccionar-sonido" data-nombre="${sonido.nombre}" data-url="${sonido.url}">✔️</button>
            `;

            listaSonidos.appendChild(sonidoDiv);
        });

        // Agregar eventos a los botones dentro de la lista
        document.querySelectorAll(".reproducir-sonido").forEach(button => {
            button.addEventListener("click", () => {
                const audio = new Audio(button.dataset.url);
                audio.play();
            });
        });

        document.querySelectorAll(".seleccionar-sonido").forEach(button => {
            button.addEventListener("click", () => {
                sonidoSeleccionado = button.dataset.url;
                sonidoSeleccionadoTexto.textContent = `🎵 ${button.dataset.nombre}`;
                modalSonidos.style.display = "none"; // Cerrar la ventana modal
            });
        });

    } catch (error) {
        console.error("Error al cargar los sonidos:", error);
        listaSonidos.innerHTML = "<p>Error al cargar sonidos.</p>";
    }
};

// Cargar modelos desde Firestore
const cargarModelos3D = async () => {
    listaModelos.innerHTML = "<p>Cargando modelos...</p>";

    try {
        const modelosSnapshot = await getDocs(collection(db, "modelos3D"));
        listaModelos.innerHTML = "";

        modelosSnapshot.forEach((doc) => {
            const modelo = doc.data();

            const modeloDiv = document.createElement("div");
            modeloDiv.className = "modelo-item";
            modeloDiv.innerHTML = `
                <img src="${modelo.miniatura}" alt="${modelo.nombre}" class="modelo-img">
                <p>${modelo.nombre}</p>
                <input type="checkbox" class="seleccionar-modelo" data-modelo-id="${doc.id}">
            `;

            listaModelos.appendChild(modeloDiv);
        });

    } catch (error) {
        console.error("Error al cargar los modelos:", error);
        listaModelos.innerHTML = "<p>Error al cargar modelos.</p>";
    }
};

// Guardar la configuración en Firestore
guardarConfiguracion.addEventListener("click", async () => {
    if (!sonidoSeleccionado) {
        alert("Selecciona un sonido antes de guardar.");
        return;
    }

    const modelosSeleccionados = document.querySelectorAll(".seleccionar-modelo:checked");
    if (modelosSeleccionados.length === 0) {
        alert("Selecciona al menos un modelo antes de guardar.");
        return;
    }

    const modelosIds = Array.from(modelosSeleccionados).map(input => input.dataset.modeloId);

    try {
        const juegoRef = doc(db, "juegos", juegoId);
        const juegoSnap = await getDoc(juegoRef);

        if (!juegoSnap.exists()) {
            alert("Error: No se encontró el juego.");
            return;
        }

        let casillasActualizadas = juegoSnap.data().casillas || [];
        casillasActualizadas[casillaId] = {
            plantilla: "sonido-modelo",
            sonido: sonidoSeleccionado,
            modelos: modelosIds
        };

        await updateDoc(juegoRef, { casillas: casillasActualizadas });

        alert("Configuración guardada con éxito.");
        window.close();
    } catch (error) {
        console.error("Error al guardar la configuración:", error);
        alert("Hubo un error al guardar la configuración.");
    }
});

// Cargar modelos al iniciar
cargarModelos3D();
