#include <WiFi.h>
#include <FirebaseESP32.h>

// Reemplaza con tus credenciales de WiFi
const char* ssid = "TU_SSID";
const char* password = "TU_PASSWORD";

// Configuración de Firebase
#define FIREBASE_HOST "tu-proyecto.firebaseio.com"
#define FIREBASE_AUTH "tu_token_de_autenticacion"

FirebaseData firebaseData;

// Pines de los sensores
int hallSensorPin = 34; // Sensor de efecto Hall
int anemometroPin = 35; // Pin para el anemómetro
int pluvioMetroPin = 32; // Pin para el pluviómetro

int pulseCount = 0;
float velocidadViento = 0; // Velocidad del viento en m/s
float cantidadLluvia = 0; // Cantidad de lluvia en mm

void setup() {
    Serial.begin(115200);
    pinMode(hallSensorPin, INPUT);
    pinMode(anemometroPin, INPUT);
    pinMode(pluvioMetroPin, INPUT);
    
    // Conectar a WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println("Conectado
