let altMax = new WebSocket("ws://localhost:8000/ws/graph/");

altMax.onmessage = function(e){
    let djangoDataAltMax = JSON.parse(e.data);
    
    // console.log(djangoDataAltMax)

    // imprime la altura en la pagina web pero como numeros, los valores del json
    
    document.querySelector('#app2').innerText = djangoDataAltMax.Altmax;
    max = parseFloat(djangoDataAltMax.Altmax);
    altDes = max/2;
    document.querySelector('#app3').innerText = altDes;
}