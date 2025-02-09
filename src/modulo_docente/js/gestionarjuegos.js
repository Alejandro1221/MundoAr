import { db } from "../../app/firebase.js";
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Referencias a los elementos HTML
const listaJuegos = document.getElementById("listaJuegos");
const crearJuegoForm = document.getElementById("crearJuegoForm");
const usuarioNombre = document.getElementById("usuarioNombre"); 
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

const auth = getAuth();
let usuarioActual = null; // Guardamos la referencia del usuario autenticado

// Detectar usuario autenticado y cargar su información
onAuthStateChanged(auth, async (user) => {
    if (user) {
        usuarioActual = user; // Guardamos el usuario en la variable global

        // Obtener el nombre del docente desde Firestore
        const usuarioRef = doc(db, "docentes", user.uid);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
            usuarioNombre.textContent = `Bienvenido, ${usuarioSnap.data().nombre}`;
        } else {
            usuarioNombre.textContent = `Bienvenido, ${user.email}`;
        }

        // Cargar los juegos del usuario autenticado
        cargarJuegos(user.uid);
    } else {
        // Si no está autenticado, redirigir a login
        window.location.href = "docente_login.html";
    }
});

// Verificar que el botón existe antes de asignarle el evento
if (!btnCerrarSesion) {
    console.error("El botón de cerrar sesión no se encontró en el DOM.");
} else {
    btnCerrarSesion.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "docente_login.html"; // Redirigir a la pantalla de inicio de sesión
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("Hubo un problema al cerrar sesión.");
        }
    });
}

// Cargar juegos creados por el docente autenticado
const cargarJuegos = async (uid) => {
    try {
        const juegosQuery = query(collection(db, "juegos"), where("creadoPor", "==", uid));
        const juegosSnapshot = await getDocs(juegosQuery);

        listaJuegos.innerHTML = "";

        if (juegosSnapshot.empty) {
            listaJuegos.innerHTML = "<p>No tienes juegos creados aún.</p>";
            return;
        }

        juegosSnapshot.forEach((doc) => {
            const juego = doc.data();

            const juegoDiv = document.createElement("div");
            juegoDiv.className = "juego";

            const nombreDiv = document.createElement("span");
            nombreDiv.textContent = juego.nombre;

            const btnConfigurar = document.createElement("button");
            btnConfigurar.textContent = "Configurar";
            btnConfigurar.className = "submit-btn";
            btnConfigurar.addEventListener("click", () => {
                window.location.href = `../html/configurarCasillas.html?juegoId=${doc.id}`;
            });

            juegoDiv.appendChild(nombreDiv);
            juegoDiv.appendChild(btnConfigurar);
            listaJuegos.appendChild(juegoDiv);
        });
    } catch (error) {
        console.error("Error al cargar los juegos:", error);
        listaJuegos.innerHTML = "<p>Error al cargar los juegos.</p>";
    }
};

// Evento para crear un nuevo juego
crearJuegoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!usuarioActual) { 
        alert("Error: No se pudo identificar al usuario. Recarga la página e intenta de nuevo.");
        return;
    }

    const nombreJuego = document.getElementById("nombreJuego").value;

    if (!nombreJuego) {
        alert("El nombre del juego es obligatorio.");
        return;
    }

    try {
        const nuevoJuego = {
            nombre: nombreJuego,
            casillas: Array(30).fill({ configuracion: null }),
            creadoPor: usuarioActual.uid, // Ahora usamos la variable global
            fechaCreacion: new Date(),
        };

        await setDoc(doc(db, "juegos", nombreJuego), nuevoJuego);

        alert(`Juego "${nombreJuego}" creado exitosamente.`);
        crearJuegoForm.reset();
        cargarJuegos(usuarioActual.uid);
    } catch (error) {
        console.error("Error al crear el juego:", error);
        alert("Hubo un error al crear el juego.");
    }
});
