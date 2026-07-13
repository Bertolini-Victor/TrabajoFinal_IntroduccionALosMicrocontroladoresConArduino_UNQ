/*
  ============================================================
    Sensor de Estacionamiento IoT / API REST 
    Victor H. Bertolini Agaras
  ============================================================
*/

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "esp_camera.h"
#include "esp_http_server.h"

// ---------- Pines de la cámara ----------
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22
httpd_handle_t stream_httpd = NULL;

// ---------- Configuración de Red (Modo AP) ----------
const char* ssid = "Sensor_Auto";
const char* password = "password123";

WebServer server(80);

// ---------- Pines del Hardware ----------
const int TRIG_PIN = 12; 
const int ECHO_PIN_1 = 13; // Izquierda
const int ECHO_PIN_2 = 14; // Centro
const int ECHO_PIN_3 = 15; // Derecha
const int BUZZER_PIN = 2; 

// ---------- Marcas de distancias (cm) ----------
const int SAFE_DIST    = 40;   
const int CAUTION_DIST = 20;   
const int DANGER_DIST  = 10;   

// ---------- Variables Globales de Estado ----------
long distLeft = 200;
long distCenter = 200;
long distRight = 200;
long closestDist = 200;
String statusLabel = "Seguro";

// ---------- Variables de Tiempo ----------
unsigned long lastBeepTime = 0;
int beepInterval = 500;        
unsigned long lastSensorRead = 0;
const int SENSOR_INTERVAL = 50; 

void setup() {
  // Apagar el detector de caídas de voltaje
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

  Serial.begin(115200); 

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN_1, INPUT);
  pinMode(ECHO_PIN_2, INPUT);
  pinMode(ECHO_PIN_3, INPUT);

  // Dar tiempo a los capacitores para estabilizarse
  delay(2000);

  // Iniciar Wi-Fi con potencia mínima controlada
  Serial.println("\nIniciando red Wi-Fi (Modo Bajo Consumo)...");
  WiFi.mode(WIFI_AP);
  WiFi.setTxPower(WIFI_POWER_2dBm); 
  WiFi.softAP(ssid, password);
  
  Serial.print("Red creada! IP para el fetch: ");
  Serial.println(WiFi.softAPIP());

  // Configurar la ruta de la API
  server.on("/api/sensores", HTTP_GET, handleGetSensors);
  server.begin();
  Serial.println("Servidor HTTP iniciado.");

  delay(1000);

  // --- CONFIGURACIÓN DE LA CÁMARA ---
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_VGA; 
  config.jpeg_quality = 12; 
  config.fb_count = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Error al iniciar la camara: 0x%x", err);
  } else {
    Serial.println("Cámara inicializada correctamente.");
    startCameraServer();
  }
}

void loop() {
  server.handleClient();

  unsigned long currentTime = millis();

  // Lectura fluida de sensores
  if (currentTime - lastSensorRead >= SENSOR_INTERVAL) {
    lastSensorRead = currentTime;

    distLeft = getDistance(ECHO_PIN_1);
    distCenter = getDistance(ECHO_PIN_2);
    distRight = getDistance(ECHO_PIN_3);

    closestDist = min(distLeft, min(distCenter, distRight));

    if (closestDist <= DANGER_DIST) {
      statusLabel = "Peligro";
    } else if (closestDist <= CAUTION_DIST) {
      statusLabel = "Precaucion";
    } else {
      statusLabel = "Seguro";
    }

    updateBuzzer(closestDist);
  }
}

// FUNCIONES AUXILIARES
void handleGetSensors() {
  JsonDocument doc;

  doc["sensores"]["izquierdo"] = distLeft;
  doc["sensores"]["central"] = distCenter;
  doc["sensores"]["derecho"] = distRight;
  doc["sistema"]["mas_cercano"] = closestDist;
  doc["sistema"]["estado"] = statusLabel;

  String jsonOutput;
  serializeJson(doc, jsonOutput);

  // Cabeceras CORS esenciales para conectar con tu interfaz web
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  server.send(200, "application/json", jsonOutput);
}

long getDistance(int echoPin) {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000); 
  long distance = duration * 0.0343 / 2;

  if (distance == 0 || distance > 200) distance = 200;

  return distance;
}

void updateBuzzer(long distance) {
  if (distance > SAFE_DIST) {
    noTone(BUZZER_PIN);
    return;
  }

  if (distance > CAUTION_DIST) {
    beepInterval = 600;
  } else if (distance > DANGER_DIST) {
    beepInterval = 250;
  } else {
    beepInterval = 80;
  }

  unsigned long currentTime = millis();
  if (currentTime - lastBeepTime >= beepInterval) {
    lastBeepTime = currentTime;
    tone(BUZZER_PIN, 1000, 50);  
  }
}


// FUNCIONES DEL STREAM DE VIDEO (MJPEG)
#define PART_BOUNDARY "123456789000000000000987654321"
static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* _STREAM_BOUNDARY = "\r\n--" PART_BOUNDARY "\r\n";
static const char* _STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";

esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t * _jpg_buf = NULL;
  char * part_buf[64];

  res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
  if(res != ESP_OK){ return res; }

  // Bucle infinito que transmite cuadro por cuadro
  while(true){
    fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("Fallo al capturar frame");
      res = ESP_FAIL;
    } else {
      _jpg_buf_len = fb->len;
      _jpg_buf = fb->buf;
    }
    if(res == ESP_OK){
      size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);
      res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
    }
    if(res == ESP_OK){
      res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
    }
    if(res == ESP_OK){
      res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
    }
    if(fb){
      esp_camera_fb_return(fb);
      fb = NULL;
      _jpg_buf = NULL;
    }
    if(res != ESP_OK){ break; }
  }
  return res;
}

void startCameraServer(){
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 81;

  httpd_uri_t stream_uri = {
    .uri       = "/stream",
    .method    = HTTP_GET,
    .handler   = stream_handler,
    .user_ctx  = NULL
  };

  if (httpd_start(&stream_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(stream_httpd, &stream_uri);
    Serial.println("Servidor de video activo en puerto 81");
  }
}
