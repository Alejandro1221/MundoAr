import { db } from "./firebase.js";
import { collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Referencias a los elementos HTML
const listaJuegos = document.getElementById('listaJuegos');
const crearJuegoForm = document.getElementById('crearJuegoForm');

// Cargar los juegos creados desde Firestore
const cargarJuegos = async () => {
    try {
        const juegosSnapshot = await getDocs(collection(db, "juegos"));
        listaJuegos.innerHTML = ''; // Limpiar la lista

        if (juegosSnapshot.empty) {
            listaJuegos.innerHTML = '<p>No hay juegos creados aún.</p>';
            return;
        }

        juegosSnapshot.forEach((doc) => {
            const juego = doc.data();

            // Crear elemento visual para cada juego
            const juegoDiv = document.createElement('div');
            juegoDiv.className = 'juego';

            const nombreDiv = document.createElement('span');
            nombreDiv.textContent = juego.nombre;

            const btnConfigurar = document.createElement('button');
            btnConfigurar.textContent = 'Configurar';
            btnConfigurar.className = 'submit-btn';
            btnConfigurar.addEventListener('click', () => {
                window.location.href = `configurarTablero.html?juegoId=${doc.id}`;
            });

            juegoDiv.appendChild(nombreDiv);
            juegoDiv.appendChild(btnConfigurar);
            listaJuegos.appendChild(juegoDiv);
        });
    } catch (error) {
        console.error("Error al cargar los juegos:", error);
        listaJuegos.innerHTML = '<p>Error al cargar los juegos.</p>';
    }
};

// Crear un nuevo juego
crearJuegoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombreJuego = document.getElementById('nombreJuego').value;
    if (!nombreJuego) {
        alert('El nombre del juego es obligatorio.');
        return;
    }

    try {
        const nuevoJuego = {
            nombre: nombreJuego,
            casillas: Array(30).fill({ configuracion: null }),
            creadoPor: "docenteId", // Cambia esto por el UID del docente autenticado
            fechaCreacion: new Date(),
        };

        await setDoc(doc(db, "juegos", nombreJuego), nuevoJuego);

        alert(`Juego "${nombreJuego}" creado exitosamente.`);
        crearJuegoForm.reset();
        cargarJuegos(); // Recargar la lista de juegos
    } catch (error) {
        console.error("Error al crear el juego:", error);
        alert("Hubo un error al crear el juego.");
    }
});

// Cargar los juegos al iniciar
cargarJuegos();