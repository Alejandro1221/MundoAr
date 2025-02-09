// Importar funciones necesarias de Firebase
import { auth } from "../app/firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Obtener el formulario de login
const login = document.querySelector("#loginDocente");

login.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = login["email_docente_login"].value.trim(); // Eliminar espacios en blanco
    const password = login["contras_docente_login"].value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const usuarioAuth = userCredential.user;

        console.log("✅ Usuario autenticado:", usuarioAuth);
        alert("¡Inicio de sesión exitoso!");

        // Redirección corregida con ruta absoluta relativa
        window.location.href = "../html/gestionarJuegos.html";
    } catch (error) {
        console.error("❌ Error durante el inicio de sesión:", error);

        // Manejo de errores con mensajes más claros
        let mensajeError = "Error al iniciar sesión.";

        switch (error.code) {
            case "auth/wrong-password":
                mensajeError = "❌ Contraseña incorrecta. Intenta de nuevo.";
                break;
            case "auth/user-not-found":
                mensajeError = "⚠️ No se encontró una cuenta con este correo.";
                break;
            case "auth/invalid-email":
                mensajeError = "⚠️ El formato del correo es inválido.";
                break;
            default:
                mensajeError = "⚠️ Ocurrió un error inesperado. Inténtalo más tarde.";
        }

        alert(mensajeError);
    }
});