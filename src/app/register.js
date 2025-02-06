import { auth,db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const registro = document.querySelector('#registroDocente');

registro.addEventListener('submit', async (e) => { // Agrega "async" aquí
    e.preventDefault();

    const nombre = document.querySelector('#nombre_docente').value; // Corregir acceso al campo
    const email = document.querySelector('#email_docente').value;
    const password = document.querySelector('#contras_docente').value;

    try {
        // Crear usuario en Firebase Authentication
        const usuarioAuth = await createUserWithEmailAndPassword(auth, email, password);
        
        // Agregar los datos del usuario a Firestore
        await setDoc(doc(db, "docentes", usuarioAuth.user.uid), {
            nombre: nombre,
            email: email,
        });

        console.log("Usuario registrado:", usuarioAuth.user);
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");

        // Limpiar los campos del formulario
        registro.reset();
        
    } catch (error) {
        console.error("Error durante el registro:", error);
        alert("Error: " + error.message);
    }
});
