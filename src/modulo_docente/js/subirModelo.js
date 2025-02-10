import { db } from "../../app/firebase.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const modalSubida = document.getElementById("modalSubida");
    const abrirFormulario = document.getElementById("abrirFormulario");
    const cerrarFormulario = document.getElementById("cerrarFormulario");
    const subirModeloBtn = document.getElementById("subirModelo");

    const nombreModelo = document.getElementById("nombreModelo");
    const categoriaModelo = document.getElementById("categoriaModelo");
    const nuevaCategoria = document.getElementById("nuevaCategoria");
    const imagenModelo = document.getElementById("imagenModelo");
    const archivoModelo = document.getElementById("archivoModelo");
    const vistaPreviaImagen = document.getElementById("vistaPreviaImagen");

    // Mostrar campo de nueva categoría si elige "Nueva Categoría"
    categoriaModelo.addEventListener("change", () => {
        nuevaCategoria.style.display = categoriaModelo.value === "nueva" ? "block" : "none";
    });

    // Abrir y cerrar formulario
    abrirFormulario.addEventListener("click", () => {
        modalSubida.style.display = "flex";
    });

    cerrarFormulario.addEventListener("click", () => {
        modalSubida.style.display = "none";
    });

    // Mostrar vista previa de la imagen antes de subir
    imagenModelo.addEventListener("change", (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = (e) => {
                vistaPreviaImagen.innerHTML = `<img src="${e.target.result}" alt="Vista previa" style="max-width: 150px; max-height: 150px; border-radius: 10px;">`;
            };
            reader.readAsDataURL(archivo);
        } else {
            vistaPreviaImagen.innerHTML = "";
        }
    });

    // Validación de archivos
    const validarArchivos = () => {
        const archivoImagen = imagenModelo.files[0];
        const archivo3D = archivoModelo.files[0];

        if (archivoImagen) {
            const formatosImagen = ["image/jpeg", "image/png"];
            if (!formatosImagen.includes(archivoImagen.type)) {
                alert("⚠️ Solo se permiten imágenes en formato JPG o PNG.");
                return false;
            }
        }

        if (archivo3D) {
            const formatos3D = ["model/gltf-binary", "model/gltf+json", "application/octet-stream"];
            if (!formatos3D.includes(archivo3D.type)) {
                alert("⚠️ Solo se permiten modelos 3D en formato GLB o GLTF.");
                return false;
            }
        }

        return true;
    };

    // Subir Modelo 3D a Firebase
    subirModeloBtn.addEventListener("click", async () => {
        if (!nombreModelo.value || !imagenModelo.files[0] || !archivoModelo.files[0]) {
            alert("⚠️ Por favor, completa todos los campos.");
            return;
        }

        if (!validarArchivos()) return;

        let categoriaFinal = categoriaModelo.value;
        if (categoriaFinal === "nueva") {
            if (!nuevaCategoria.value.trim()) {
                alert("⚠️ Escribe un nombre para la nueva categoría.");
                return;
            }
            categoriaFinal = nuevaCategoria.value.trim();
        }

        try {
            const storage = getStorage();

            // Subir imagen de vista previa
            const imagenRef = ref(storage, `modelos3D/${imagenModelo.files[0].name}`);
            await uploadBytes(imagenRef, imagenModelo.files[0]);
            const urlImagen = await getDownloadURL(imagenRef);

            // Subir archivo 3D
            const modeloRef = ref(storage, `modelos3D/${archivoModelo.files[0].name}`);
            await uploadBytes(modeloRef, archivoModelo.files[0]);
            const urlModelo = await getDownloadURL(modeloRef);

            // Guardar en Firestore
            await addDoc(collection(db, "modelos3D"), {
                nombre: nombreModelo.value,
                miniatura: urlImagen,
                modelo_url: urlModelo,
                categoria: categoriaFinal
            });

            alert("✅ Modelo subido con éxito 🎉");
            modalSubida.style.display = "none";
            window.location.reload();

        } catch (error) {
            console.error("❌ Error al subir el modelo:", error);
            alert("Hubo un error al subir el modelo.");
        }
    });

});
