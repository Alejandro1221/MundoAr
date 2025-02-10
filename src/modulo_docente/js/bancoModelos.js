import { db } from "../../app/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const listaModelos = document.getElementById("listaModelos");
const filtroCategoria = document.getElementById("filtroCategoria");

const btnVolver = document.getElementById("btnVolver");

// Función para cargar todas las categorías únicas desde Firestore
const cargarCategorias = async () => {
    try {
        const modelosSnapshot = await getDocs(collection(db, "modelos3d"));
        const categoriasSet = new Set();

        modelosSnapshot.forEach((doc) => {
            const modelo = doc.data();
            if (modelo.categoria) {
                categoriasSet.add(modelo.categoria);
            }
        });

        // Agregar categorías al filtro
        filtroCategoria.innerHTML = `<option value="Todos">Todos</option>`;
        categoriasSet.forEach((categoria) => {
            filtroCategoria.innerHTML += `<option value="${categoria}">${categoria}</option>`;
        });

    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
};

// Función para cargar modelos y filtrarlos por categoría
const cargarModelos3D = async (categoriaSeleccionada = "Todos") => {
    listaModelos.innerHTML = "<p>Cargando modelos...</p>";

    try {
        const modelosSnapshot = await getDocs(collection(db, "modelos3D"));
        listaModelos.innerHTML = "";

        modelosSnapshot.forEach((doc) => {
            const modelo = doc.data();

            // Si el filtro está activo y la categoría no coincide, no lo mostramos
            if (categoriaSeleccionada !== "Todos" && modelo.categoria !== categoriaSeleccionada) {
                return;
            }

            // Crear una tarjeta para cada modelo
            const modeloDiv = document.createElement("div");
            modeloDiv.className = "modelo-item";
            modeloDiv.innerHTML = `
                <img src="${modelo.miniatura}" alt="${modelo.nombre}" class="modelo-img">
                <p>${modelo.nombre}</p>
                <p><strong>Categoría:</strong> ${modelo.categoria}</p>
                <button class="ver-modelo" data-url="${modelo.modelo_url}">👀 Ver</button>
            `;

            // Evento para ver el modelo en 3D
            modeloDiv.querySelector(".ver-modelo").addEventListener("click", () => {
                window.open(modelo.modelo_url, "_blank");
            });

            listaModelos.appendChild(modeloDiv);
        });

    } catch (error) {
        console.error("Error al cargar los modelos:", error);
        listaModelos.innerHTML = "<p>Error al cargar modelos.</p>";
    }
};

// Evento para filtrar modelos cuando se elige una categoría
filtroCategoria.addEventListener("change", () => {
    const categoriaSeleccionada = filtroCategoria.value;
    cargarModelos3D(categoriaSeleccionada);
});

// Botón para volver
btnVolver.addEventListener("click", () => {
    window.location.href = "../html/gestionarJuegos.html";
});

// Cargar categorías y modelos al iniciar
cargarCategorias();
cargarModelos3D();
