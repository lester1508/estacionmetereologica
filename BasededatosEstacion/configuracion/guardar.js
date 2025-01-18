import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { db } from './configuracion.js';

// Función para guardar datos en Firestore
export const guardarDatos = async (nombre, apellido, pulsos, velocidadViento, cantidadLluvia) => {
    try {
        const docRef = await addDoc(collection(db, "usuarios"), {
            nombre: nombre,
            apellido: apellido,
            pulsos: pulsos,
            velocidadViento: velocidadViento,
            cantidadLluvia: cantidadLluvia
        });
        console.log("Documento escrito con ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error al agregar el documento: ", e);
        throw e;
    }
};
 
/*
// Inicializar Firestore
const db = getFirestore(app);

// Función para obtener datos de Firebase
async function obtenerDatos() {
    const docRef = doc(db, "sensores", "datos"); // Cambia "datos" si usas otro nombre de documento
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("pulsos").querySelector("span").innerText = data.pulsos;
        document.getElementById("velocidadViento").querySelector("span").innerText = data.velocidadViento;
        document.getElementById("cantidadLluvia").querySelector("span").innerText = data.cantidadLluvia;
    } else {
        console.log("No hay datos disponibles");
    }
}

// Llamar a la función para obtener datos al cargar la página
window.onload = obtenerDatos;*/