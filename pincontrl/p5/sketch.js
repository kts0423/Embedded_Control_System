let port;
let brightnessDisplay, modeDisplay, taskDisplay;
let redSlider, yellowSlider, greenSlider;
let redLabel, yellowLabel, greenLabel;
let connectBtn, disconnectBtn;
let redTime = 2000, yellowTime = 500, greenTime = 2000;
let lastTask = "None";

function setup() {
    noCanvas();  // 캔버스를 생성하지 않음 (UI만 활용)

    port = createSerial();

    // HTML 요소 가져오기
    connectBtn = select("#connectBtn");
    disconnectBtn = select("#disconnectBtn");
    brightnessDisplay = select("#brightnessDisplay");
    modeDisplay = select("#modeDisplay");
    taskDisplay = select("#taskDisplay");

    redSlider = select("#redSlider");
    yellowSlider = select("#yellowSlider");
    greenSlider = select("#greenSlider");

    redLabel = select("#redLabel");
    yellowLabel = select("#yellowLabel");
    greenLabel = select("#greenLabel");

    // 버튼 이벤트 추가
    connectBtn.mousePressed(connectPort);
    disconnectBtn.mousePressed(disconnectPort);

    // 슬라이더 값 변경 시 업데이트
    redSlider.input(updateRedLabel);
    yellowSlider.input(updateYellowLabel);
    greenSlider.input(updateGreenLabel);
}

function draw() {
    if (port.available() > 0) {
        let str = port.readUntil("\n").trim();
        console.log("Received: ", str);

        if (str.startsWith("BRIGHTNESS:")) {
            let brightVal = parseInt(str.split(":")[1].trim());
            brightnessDisplay.html("Brightness: " + brightVal);
        } 
        else if (str.startsWith("MODE:")) {
            let modeVal = str.split(":")[1].trim();
            modeDisplay.html("Mode: " + modeVal);
        } 
        else if (str.startsWith("TASK:")) {
            let taskVal = str.split(":")[1].trim();
            if (taskVal !== lastTask) {
                lastTask = taskVal;
                taskDisplay.html("Task: " + taskVal);
                taskDisplay.style("background-color", "red"); 
            }
        }
    }
}

// ✅ 아두이노 연결 함수 (포트 선택 기능 추가)
function connectPort() {
    if (!port.opened()) {
        port.requestPort() // 사용자에게 포트 선택 요청
            .then(() => port.open(9600))
            .then(() => console.log("✅ Serial Port Opened Successfully!"))
            .catch(err => console.error("❌ Error opening port: ", err));
    } else {
        console.log("⚠️ Port is already open.");
    }
}

// ✅ 아두이노 해제 함수
function disconnectPort() {
    if (port.opened()) {
        port.close()
            .then(() => console.log("✅ Serial Port Closed Successfully!"))
            .catch(err => console.error("❌ Error closing port: ", err));
    } else {
        console.log("⚠️ No port is currently open.");
    }
}

// ✅ 슬라이더 업데이트 함수 (빨강)
function updateRedLabel() {
    redTime = redSlider.value();
    redLabel.html("Red Time: " + redTime + " ms");
    sendSignalTime();
}

// ✅ 슬라이더 업데이트 함수 (노랑)
function updateYellowLabel() {
    yellowTime = yellowSlider.value();
    yellowLabel.html("Yellow Time: " + yellowTime + " ms");
    sendSignalTime();
}

// ✅ 슬라이더 업데이트 함수 (초록)
function updateGreenLabel() {
    greenTime = greenSlider.value();
    greenLabel.html("Green Time: " + greenTime + " ms");
    sendSignalTime();
}

// ✅ 아두이노로 신호 시간 전송
function sendSignalTime() {
    let signalData = `TIME:${redTime},${yellowTime},${greenTime}\n`;
    if (port.opened()) {
        port.write(signalData);
        console.log("📡 Sent Signal Data: ", signalData);
    } else {
        console.log("⚠️ Port is not open. Cannot send data.");
    }
}
