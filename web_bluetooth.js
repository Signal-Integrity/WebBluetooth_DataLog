//microbit Bluetooth UUID
const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const UART_SERVICE_CHARACTERISTICS_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

async function connect()
{
    navigator.bluetooth.requestDevice({
        acceptAllDevices : true,
        optionalservices : [UART_SERVICE_UUID]
    }) .then (
        device => {
            console.log ("> Connectiong Device ...")
            console.log ("> Unique Name : " + device.name);
            console.log ("> ID : " + device.id)
            return device.gatt.connect();
        }
    ) .then (
        server => {
            console.log ("> Getting Server ...");
            console.log ("> Server : " + server);
            return server.getPrimaryService (UART_SERVICE_UUID);
        }
    ) .then (
        service => {
            console.log ("> Getting Service ...");
            console.log ("> Service : " + service);
            return service.getCharacteristic (`UART_SERVICE_CHARACTERISTICS_UUID`);
        }
    ) .then (
        chara => {
            console.log ("> Characteristic : " + chara);
            alert ("Connection Completed");
        }
    ).catch (
        error => {
            console.log (`error`);
        }
    );
}

function disconnect()
{
    if (!bluetoothDevice || !bluetoothDevice.gatt.connected) return ;
    bluetoothDevice.gatt.disconnect();
    alert("Disconnected")
}

function read() 
{
    if (!bluetoothDevice || !bluetoothDevice.gatt.connected || !characteristic) return ;
    characteristic.writeValue(new Uint8Array(new TextEncoder().encode(test.msg.value)))
    alert(test.msg.value);
}

function read () {
    characteristic.readValue()
    .then (
        response => {
            var num = getUintN(response);
            console.log ("> " + num);
        }
    ) .catch (
        error => {
            console.log (error);
        }
    )
    const getUintN = (dataView) => {
        switch (dataView.byteLength) {
            case 0:
                return 0
            case 1:
                return dataView.getUint8(0)
            case 2:
                return dataView.getUint16(0)
            case 4:
                return dataView.getUint32(0)
            case 8: {
                const top = dataView.getUint32(0) * Math.pow(2, 32)
                const bottom = dataView.getUint32(4)
                return top + bottom
            }
            default:
                return 0
        }
    }
}
