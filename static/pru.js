
let giroAce = new WebSocket("ws://localhost:8000/ws/graph/");

giroAce.onmessage = function(e){
    let djangoDataGiroAce = JSON.parse(e.data);
    // console.log(djangoDataGiroAce)

    // imprime la altura en la pagina web pero como numeros, los valores del json
    document.querySelector('#gyroX').innerText = djangoDataGiroAce.gyX
    document.querySelector('#gyroY').innerText = djangoDataGiroAce.gyY
    document.querySelector('#gyroZ').innerText = djangoDataGiroAce.gyZ

    document.querySelector('#accX').innerText = djangoDataGiroAce.acX;
    document.querySelector('#accY').innerText = djangoDataGiroAce.acY;
    document.querySelector('#accZ').innerText = djangoDataGiroAce.acZ;

    document.querySelector('#tempe').innerText = djangoDataGiroAce.temperature;
}