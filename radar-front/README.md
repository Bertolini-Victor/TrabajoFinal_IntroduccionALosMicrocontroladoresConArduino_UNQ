# Dashboard Frontend - Radar IoT

Este directorio contiene la interfaz de usuario para el Sistema de Asistencia de Estacionamiento Avanzado. Fue inicializado con Vite y construido con React.js. Actúa como la pantalla del vehículo, conectándose a la red Wi-Fi generada por la placa ESP32-CAM para consumir telemetría en tiempo real y visualizar el video de la cámara de reversa.

## Contenido del directorio

- Código fuente de la aplicación React y configuración de Vite.
- Context API para la gestión global del estado y la conexión con el hardware.
- Componentes que muestran telemetría, estado de sensores y el stream MJPEG.

## Scripts disponibles

Dentro de este directorio puedes ejecutar los siguientes comandos en la terminal.

### Instalar dependencias

Instala todas las dependencias necesarias (node_modules). Ejecutar la primera vez tras clonar o descargar el repositorio.

```bash
npm install
```

### Ejecutar en modo desarrollo

Ejecuta la aplicación en modo desarrollo y la expone en la red local gracias al flag `--host`. La terminal devolverá una dirección IP que puedes abrir desde un navegador en tu computadora o teléfono.

```bash
npm run dev -- --host
```

### Construir para producción

Construye la aplicación optimizada para producción en la carpeta `dist`.

```bash
npm run build
```

## Conexión con el hardware

La aplicación está configurada mediante `SensorContext.tsx` para buscar el hardware del auto en la dirección IP estática asignada al modo AP de la ESP32.

- Datos de sensores (JSON): `http://192.168.4.1/api/sensores`
- Stream de video MJPEG: `http://192.168.4.1:81/stream`

**Importante:** Para que la aplicación muestre el estado correcto y no aparezca como desconectada, el dispositivo donde la ejecutes debe estar conectado a la red Wi-Fi del auto `Sensor_Auto_Victor`.

## Características del frontend

- Consumo en tiempo real de telemetría desde la ESP32-CAM.
- Reproducción MJPEG de baja latencia para la cámara de reversa.
- Manejo de desconexiones y pérdidas de paquetes mediante AbortController y lógica de reintento.
- UI responsiva optimizada para pantallas de escritorio y móviles en modo oscuro.
- Context API para centralizar la lógica de conexión y el estado de sensores.

## Tecnologías utilizadas

- React 18
- Vite
- CSS para diseño responsivo y modo oscuro

## Recomendaciones de uso

- Conecta tu dispositivo a la red Wi-Fi emitida por la ESP32 antes de iniciar la aplicación.
- Si el stream MJPEG no carga, verifica que el puerto 81 esté accesible desde tu dispositivo y que la ESP32 esté alimentada correctamente.
- Para pruebas locales en la misma máquina, `http://localhost:5173` suele funcionar cuando el servidor de desarrollo está activo.

## Autor y contexto

**Autor:** Víctor H. Bertolini Agaras

**Contexto:** Trabajo Práctico Final - Introducción a la programación de microcontroladores con Arduino - UNQ.
