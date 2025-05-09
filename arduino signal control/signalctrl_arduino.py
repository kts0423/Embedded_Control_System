#include <math.h>
#include <Arduino.h>

int ch1Pin = 2;  // CH1 → D2(밝기조절)
int ch2Pin = 3;  // CH2 → D3 (On/Off)
int ch3Pin = 4; // CH3 -> D4(삼색led)

int ledPins[3] = {9, 10, 11}; //led on/off 및 밝기 조절용
int rgbPins[3] = {5,6,7}; //삼색led색상용

void setup() {
  Serial.begin(9600);
  pinMode(ch1Pin, INPUT);
  pinMode(ch2Pin, INPUT);
  pinMode(ch3Pin, INPUT);
  for (int i = 0; i < 3; i++) {
    pinMode(ledPins[i], OUTPUT);  //밝기조절 on/off
    pinMode(rgbPins[i], OUTPUT);  //삼색led
  }
}

void loop() {
  int pwmVal = pulseIn(ch1Pin, HIGH, 25000);  // 밝기용
  int switchVal = pulseIn(ch2Pin, HIGH, 25000);  // On/Off용
  int pwm3 = pulseIn(ch3Pin, HIGH, 25000);  //삼색 led

  // 밝기 계산
  int brightness = map(pwmVal, 1000, 2000, 0, 255);
  brightness = constrain(brightness, 0, 255);

  // 스위치 기준값: 1400 기준 (3단 스위치면 1000/1500/2000)
  bool ledOn = switchVal > 1400;

  float hue = map(pwm3, 1000, 2000, 0, 180); //0~180도 범위
  float r, g, b;

  hsvToRgb(hue, 1.0, 1.0, &r, &g, &b);  // HSV → RGB 변환

  for (int i = 0; i < 3; i++) {
    analogWrite(ledPins[i], ledOn ? brightness : 0);  // Off 시 밝기 0
  }

  //삼색 led 조절
  // RGB 값 0~255로 변환하고 밝기 적용
  analogWrite(rgbPins[0], ledOn ? int(r * brightness) : 0);
  analogWrite(rgbPins[1], ledOn ? int(g * brightness) : 0);
  analogWrite(rgbPins[2], ledOn ? int(b * brightness) : 0);

  // // 시리얼 출력
  // Serial.print("CH1 PWM: "); Serial.print(pwmVal);
  // Serial.print(" (Brightness: "); Serial.print(brightness); Serial.print(") | ");

  // Serial.print("CH2 PWM: "); Serial.print(switchVal);
  // Serial.print(" (LED: "); Serial.println(ledOn ? "ON" : "OFF");

  
  // 디버깅 출력
  Serial.print("Hue: "); Serial.print(hue);
  Serial.print(" | RGB: "); Serial.print(int(r * brightness)); Serial.print(", ");
  Serial.print(int(g * brightness)); Serial.print(", ");
  Serial.println(int(b * brightness));

  delay(100);
}



// HSV to RGB 변환 함수
void hsvToRgb(float h, float s, float v, float* r, float* g, float* b) {
  int i = int(h / 60.0) % 6;
  float f = h / 60.0 - i;
  float p = v * (1 - s);
  float q = v * (1 - f * s);
  float t = v * (1 - (1 - f) * s);

  switch(i) {
    case 0: *r = v; *g = t; *b = p; break;
    case 1: *r = q; *g = v; *b = p; break;
    case 2: *r = p; *g = v; *b = t; break;
    case 3: *r = p; *g = q; *b = v; break;
    case 4: *r = t; *g = p; *b = v; break;
    case 5: *r = v; *g = p; *b = q; break;
  }
}
