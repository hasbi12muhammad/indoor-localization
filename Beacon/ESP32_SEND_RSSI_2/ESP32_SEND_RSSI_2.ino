#include <BLEDevice.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define ADDRESS "FF:FF:C2:0F:ED:8D" 

const char* ssid = "Nokia 3";
const char* password = "hasbi1202";

BLEScan* pBLEScan; //VariÃ¡vel que irÃ¡ guardar o scan
boolean found = false; //Se encontrou o iTag no Ãºltimo scan
int rssi = 0;
String mac;
StaticJsonDocument<200> json;

//Callback das chamadas ao scan
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks
{
    void onResult(BLEAdvertisedDevice advertisedDevice)
    {
      if (advertisedDevice.getAddress().toString() == ADDRESS)
      {
        found = true;
        rssi = advertisedDevice.getRSSI();
        advertisedDevice.getScan()->stop();
        
      }
    }
};

void setup()
{
  Serial.begin(115200);
  delay(4000);   //Delay needed before calling the WiFi.begin

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the WiFi network");

  Serial.println(WiFi.macAddress());
  mac = String(WiFi.macAddress());

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);

}

void loop()
{
  pBLEScan->start(1);
  HTTPClient http;

  http.begin("http://192.168.43.242:8080/tahap1");  //Specify destination for HTTP request
  http.addHeader("Content-Type", "application/json");             //Specify content-type header
  http.setTimeout(500);
  String postMessage;

  json["mac"] = mac;
  json["rssi"] = rssi;

  serializeJson(json, postMessage);

  int httpResponseCode = http.POST(postMessage); //Send the actual POST request

  http.end();

  Serial.print("RSSI: ");
  Serial.println(rssi);

  pBLEScan->clearResults();
  json.JsonDocument::clear();
  rssi = 0;
}
