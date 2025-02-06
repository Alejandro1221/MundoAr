// Importar funciones necesarias de Firebase
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Obtener el formulario de login
const login = document.querySelector('#loginDocente');

// Agregar el evento de submit al formulario
login.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario de login
    const email = login['email_docente_login'].value;
    const password = login['contras_docente_login'].value;

    try {
       
        const usuarioAuth = await signInWithEmailAndPassword(auth, email, password);

        
        console.log("Usuario autenticado:", usuarioAuth.user);

        alert("¡Inicio de sesión exitoso!");
         window.location.href = "gestionarjuegos.html"



    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Error: " + error.message);
    }
});