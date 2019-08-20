#include <BLEDevice.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Sakinah Mart";
const char* password = "113333555555";

BLEScan* pBLEScan; //Variável que irá guardar o scan
boolean found = false; //Se encontrou o iTag no último scan
int rssi = 0;
//String mac = "3C:71:BF:C4:E1:F4"; //String(WiFi.macAddress());
String mac;
StaticJsonDocument<200> json;

//Callback das chamadas ao scan
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks
{
    void onResult(BLEAdvertisedDevice advertisedDevice)
    {
      //Sempre que um dispositivo for encontrado ele é mostrado aqui
      //        Serial.print("Device found: ");
      //Serial.println(advertisedDevice.toString().c_str());

      if (advertisedDevice.getAddress().toString() == "FF:FF:C2:0F:ED:8D")
      {
        found = true;
        rssi = advertisedDevice.getRSSI();
        advertisedDevice.getScan()->stop();
        Serial.println(advertisedDevice.toString().c_str());
        Serial.println(rssi);
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

  //WiFi.mode(WIFI_MODE_STA);

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

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin("http://192.168.100.4:8080/tahap1");  //Specify destination for HTTP request
    http.addHeader("Content-Type", "application/json");             //Specify content-type header

    String postMessage;

    json["mac"] = mac;
    json["rssi"] = rssi;
    serializeJson(json, Serial);
    serializeJson(json, postMessage);

    int httpResponseCode = http.POST(postMessage); //Send the actual POST request

    http.end();  //Free resources
  }
  pBLEScan->clearResults();
  rssi = 0;
  json.JsonDocument::clear();
}
