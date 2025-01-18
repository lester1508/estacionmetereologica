import { db } from '../configuracion/configuracion.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Función para obtener datos de Firebase
async function obtenerDatos() {
    try {
        const datosRef = collection(db, "datos_metereologicos");
        const snapshot = await getDocs(datosRef);
        
        let windSpeedData = [];
        let rainCountData = [];
        let datosArray = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            windSpeedData.push(data.vel_viento);
            rainCountData.push(data.mm_agua);
            datosArray.push({
                ...data,
                fecha: new Date(data.fecha) // Convertir a objeto Date
            });
        });

        // Ordenar por fecha
        datosArray.sort((a, b) => a.fecha - b.fecha);

        // Mostrar los datos en la interfaz
        mostrarDatos(datosArray);

        return { windSpeedData, rainCountData };
    } catch (error) {
        console.error('Error al obtener datos de Firestore:', error);
        throw error;
    }
}

// Función para mostrar los datos
function mostrarDatos(datos) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores

    datos.forEach(dato => {
        const fechaFormateada = dato.fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Formato de 24 horas
        });

        const elemento = document.createElement('p');
        elemento.textContent = `Fecha: ${fechaFormateada}, Velocidad del Viento: ${dato.vel_viento} m/s, Cantidad de Lluvia: ${dato.mm_agua} mm`;
        resultadosDiv.appendChild(elemento);
    });
}

// Función para enviar datos a tu servidor MySQL
async function enviarDatosAFirebase(vel_viento, mm_agua) {
    try {
        const response = await fetch('http://localhost:3000/api/datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vel_viento,
                mm_agua,
                fecha: new Date().toISOString(), // Fecha actual en formato ISO
            }),
        });

        if (!response.ok) {
            console.error('Error al enviar datos a MySQL:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar datos a MySQL:', error);
    }
}

// Función para crear gráficos
async function crearGraficos() {
    try {
        const { windSpeedData, rainCountData } = await obtenerDatos();

        // Actualizar el valor mostrado
        document.getElementById('windSpeedResult').innerText = `${windSpeedData[windSpeedData.length - 1] || 0} m/s`;
        document.getElementById('rainCountResult').innerText = `${rainCountData[rainCountData.length - 1] || 0} mm`;

        // Enviar datos a MySQL
        if (windSpeedData.length > 0 && rainCountData.length > 0) {
            await enviarDatosAFirebase(windSpeedData[windSpeedData.length - 1], rainCountData[rainCountData.length - 1]);
        }

        // Configuración del gráfico de velocidad del viento
        const windSpeedCtx = document.getElementById('windSpeedChart').getContext('2d');
        new Chart(windSpeedCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: windSpeedData.length }, (_, i) => `Día ${i + 1}`),
                datasets: [{
                    label: 'Velocidad del Viento (m/s)',
                    data: windSpeedData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Días'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Velocidad (m/s)'
                        }
                    }
                }
            }
        });

        // Configuración del gráfico de cantidad de lluvia
        const rainCountCtx = document.getElementById('rainCountChart').getContext('2d');
        new Chart(rainCountCtx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: rainCountData.length }, (_, i) => `Día ${i + 1}`),
                datasets: [{
                    label: 'Cantidad de Lluvia (mm)',
                    data: rainCountData,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Días'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Cantidad (mm)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al crear gráficos:', error);
    }
}

// Llamar a la función para crear gráficos cuando se carga la página
window.onload = crearGraficos;
