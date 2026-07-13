# Radar IoT: Sistema de Asistencia de Estacionamiento Avanzado

Sistema de asistencia de estacionamiento IoT con ESP32-CAM (sensores ultrasónicos + video en vivo) y un dashboard web en React.

Este repositorio contiene el código fuente completo de un sistema de asistencia de estacionamiento en tiempo real inspirado en vehículos modernos. El proyecto combina hardware de bajo nivel con una interfaz web moderna, utilizando un microcontrolador ESP32-CAM y un dashboard en React.js.

## Arquitectura del Proyecto

El repositorio está dividido en dos carpetas principales, separando claramente el backend (hardware) del frontend (cliente):

- `/Sketch_sensor_proximidad_v1` - Contiene el código fuente en C++ para el microcontrolador ESP32-CAM. Gestiona la lectura no bloqueante de múltiples sensores ultrasónicos, el streaming de video MJPEG, la lógica de alertas sonoras y levanta una red Wi-Fi (Access Point) con una API REST en formato JSON.
- `/radar-front` - Contiene la aplicación web desarrollada con React.js y Vite. Actúa como el "tablero del vehículo", consumiendo la API de la ESP32-CAM para mostrar la telemetría, el estado de los sensores y la cámara de reversa en tiempo real con latencia ultra baja.

## Hardware Necesario

Para replicar el entorno físico de este proyecto, se requiere:

- 1x Módulo ESP32-CAM (AI-Thinker)
- 3x Sensores Ultrasónicos HC-SR04 (Izquierdo, Central, Derecho)
- 1x Buzzer Activo (5V)
- 1x Fuente de alimentación robusta (5V, mínimo 2A)

## Instalación y Puesta en Marcha

Para ejecutar el proyecto, debes levantar ambas partes (Hardware y Software).

### Paso 1: Configurar el Hardware (ESP32-CAM)

1. Abre la carpeta `/arduino` con Arduino IDE.
2. Asegúrate de tener instalada la placa ESP32 en el gestor de tarjetas y la librería ArduinoJson (v6+).
3. Conecta la ESP32-CAM a tu computadora (usando un módulo FTDI/MB temporal) y sube el código.
4. Desconecta el módulo de programación y alimenta la placa con tu fuente de 5V/2A.
5. El sistema creará automáticamente una red Wi-Fi llamada `Sensor_Auto_Victor` (Contraseña: `password123`).

### Paso 2: Configurar el Dashboard (Frontend)

1. Conecta tu computadora (o teléfono móvil) a la red Wi-Fi `Sensor_Auto_Victor` emitida por la placa.
2. Abre una terminal, navega a la carpeta `/front` e instala las dependencias:

```bash
cd front
npm install
```

3. Inicia el servidor de desarrollo en tu red local:

```bash
npm run dev -- --host
```

4. Abre tu navegador e ingresa a la IP local que te devuelva la terminal (usualmente `http://localhost:5173` o la IP de tu red `192.168.x.x`).

## Características Principales

- **Arreglo Multisensor Secuencial:** Evita interferencias (crosstalk) entre las ondas de sonido de los 3 sensores ultrasónicos.
- **Video en Vivo (MJPEG):** Transmisión continua del entorno trasero del vehículo.
- **Diseño Resiliente:** El dashboard detecta pérdidas de paquetes o apagones de la placa (mediante `AbortController`) y actualiza la interfaz alertando la desconexión al instante.
- **UI/UX Responsiva:** Panel de instrumentos modo oscuro, optimizado para ser visualizado en pantallas de PC y dispositivos móviles.

## Autor y contexto

**Autor:** Víctor H. Bertolini Agaras

**Contexto:** Trabajo Práctico Final - Introducción a la programación de microcontroladores con Arduino - UNQ.
