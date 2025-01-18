import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";




// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCeNF-TXX4gVVTiMBifRHvA-6S-K16kF2g",
    authDomain: "estacion-metereologica-dfadb.firebaseapp.com",
    databaseURL: "https://estacion-metereologica-dfadb-default-rtdb.firebaseio.com",
    projectId: "estacion-metereologica-dfadb",
    storageBucket: "estacion-metereologica-dfadb.firebasestorage.app",
    messagingSenderId: "325677630931",
    appId: "1:325677630931:web:366864c1d9c3260ecd5b26"
  };

  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Función para obtener datos de Firestore
  async function obtenerDatos() {
    const datosRef = collection(db, "datos"); // Cambia "datos" por el nombre de tu colección
    const snapshot = await getDocs(datosRef);
    
    let datosArray = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        datosArray.push(data);
    });

    mostrarDatos(datosArray);
  }

  // Función para mostrar los datos
  function mostrarDatos(datos) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores

    datos.forEach(dato => {
        const elemento = document.createElement('p');
        elemento.textContent = `Datos: ${JSON.stringify(dato)}`; // Ajusta esto según tus datos
        resultadosDiv.appendChild(elemento);
    });
  }

  // Llamar a la función para obtener datos al cargar la página
  window.onload = obtenerDatos;

<div id="resultados"></div>