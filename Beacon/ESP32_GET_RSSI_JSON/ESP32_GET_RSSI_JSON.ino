#include <BLEDevice.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define ADDRESS  "CC:9F:7A:7A:CF:35"// "FF:FF:C2:0F:ED:8D"

const char* ssid = "Nokia 3";
const char* password = "hasbi1202";

BLEScan* pBLEScan; //Variável que irá guardar o scan
boolean found = false; //Se encontrou o iTag no último scan
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
        rssi = advertisedDevice.getRSSI();
        found = true;
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
//  HTTPClient http;
//
//  http.begin("http://192.168.43.242:8080/tahap1");  //Specify destination for HTTP request
//  http.addHeader("Content-Type", "application/json");             //Specify content-type header

  String postMessage;

  json["mac"] = mac;
  json["rssi"] = rssi;
  
  serializeJson(json, postMessage);
  serializeJson(json, Serial);

  // int httpResponseCode = http.POST(postMessage); //Send the actual POST request

  // http.end();
  
  // Serial.print("RSSI: ");
  Serial.println();
  
  pBLEScan->clearResults();
  json.JsonDocument::clear();
  rssi = 0;
}
