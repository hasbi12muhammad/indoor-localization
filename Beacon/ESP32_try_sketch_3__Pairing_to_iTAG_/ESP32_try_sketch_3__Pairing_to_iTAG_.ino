#include <BLEDevice.h>

#define ADDRESS "FF:FF:C2:0F:ED:8D" //Endereço do iTag, conseguido pelo próprio scan

BLEScan* pBLEScan; //Variável que irá guardar o scan
boolean found = false; //Se encontrou o iTag no último scan
int rssi = 0;

//Callback das chamadas ao scan
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks
{
    void onResult(BLEAdvertisedDevice advertisedDevice)
    {
      //Sempre que um dispositivo for encontrado ele é mostrado aqui
      //        Serial.print("Device found: ");
      //        Serial.println(advertisedDevice.toString().c_str());
      rssi = advertisedDevice.getRSSI();

      if (advertisedDevice.getAddress().toString() == "FF:FF:C2:0F:ED:8D")
      {
        found = true;
        advertisedDevice.getScan()->stop();
      }
    }
};

void setup()
{
  Serial.begin(115200);
  
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);

}

void loop()
{
  pBLEScan->start(1);
  Serial.print("RSSI: ");
  Serial.println(rssi);
  pBLEScan->clearResults();
  rssi=0;
}
