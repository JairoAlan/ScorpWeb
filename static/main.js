
// Grafica de altitud
// Obtiene el id dpnde se obtendra la grafica
const ctx = document.getElementById('myChart');
// Crea la grafica y sus parametros
let graphData =  {
  type: 'line',
  data: {
    labels: ['0','1','2','3','4','5'],
    datasets: [{
      label: 'Altitud',
      data: [0,0,0,0,0,0],
      backgroundColor:[
        'rgba(73,198,230,0.5)',
      ],
      borderWidth: 1
    }]
  },
  options: { 
    
  }
};

let myChart = new Chart(ctx, graphData);


let socket = new WebSocket("ws://localhost:8000/ws/graph/");

socket.onmessage = function(e){
    let djangoData = JSON.parse(e.data);
    console.log(djangoData)

    // imprime la altura en la pagina web pero como numeros, los valores del json
    document.querySelector('#app').innerText = djangoData.value

    // crea un nuevo array con los datos de la grafica y los actualiza
    let newGraphData = graphData.data.datasets[0].data;
    newGraphData.shift();
    newGraphData.push(djangoData.value);
    graphData.data.datasets[0].data = newGraphData;

    myChart.update();

}

// Grafica de Temperatura
const ctxT = document.getElementById('temp');

let graphDataT =  {
  type: 'line',
  data: {
    labels: ['0','1','2','3','4','5'],
    datasets: [{
      label: 'Temp',
      data: [0,0,0,0,0,0],
      backgroundColor:[
        'rgba(217, 24, 62, 0.8)',
      ],
      borderWidth: 1
    }]
  },
  options: { 
    
  }
};

let temp = new Chart(ctxT, graphDataT);
let socket2 = new WebSocket("ws://localhost:8000/ws/graph/");
socket2.onmessage = function(e){
    let djangoData2 = JSON.parse(e.data);
    console.log(djangoData2);

    let newGraphDataT = graphDataT.data.datasets[0].data;
    newGraphDataT.shift();
    newGraphDataT.push(djangoData2.temperature);
    graphDataT.data.datasets[0].data = newGraphDataT;

    temp.update();
    
}

// Grafica de velocidad

const ctxV = document.getElementById('velo');

let graphDataV =  {
  type: 'line',
  data: {
    labels: ['0','1','2','3','4','5'],
    datasets: [{
      label: 'Velocidad',
      data: [0,0,0,0,0,0],
      backgroundColor:[
        'rgba(135, 48, 159, 0.8)',
      ],
      borderWidth: 1
    }]
  },
  options: { 
    
  }
};

let velo = new Chart(ctxV, graphDataV);
let socket3 = new WebSocket("ws://localhost:8000/ws/graph/");
socket3.onmessage = function(e){
    let djangoData3 = JSON.parse(e.data);
    console.log(djangoData3);

    let newGraphDataV = graphDataV.data.datasets[0].data;
    newGraphDataV.shift();
    newGraphDataV.push(djangoData3.velocidad);
    graphDataV.data.datasets[0].data = newGraphDataV;

    velo.update();
    
}

// Grafica de Aceleracion

const ctxA = document.getElementById('acel');

let graphDataA =  {
  type: 'line',
  data: {
    labels: ['0','1','2','3','4','5'],
    datasets: [{
      label: 'Aceleracion',
      data: [0,0,0,0,0,0],
      backgroundColor:[
        'rgba(107, 235, 28, 0.8)',
      ],
      borderWidth: 1
    }]
  },
  options: { 
    
  }
};

let acel = new Chart(ctxA, graphDataA);
let socket4 = new WebSocket("ws://localhost:8000/ws/graph/");
socket4.onmessage = function(e){
    let djangoData4 = JSON.parse(e.data);
    console.log(djangoData4);

    let newGraphDataA = graphDataA.data.datasets[0].data;
    newGraphDataA.shift();
    newGraphDataA.push(djangoData4.aceleracion);
    graphDataA.data.datasets[0].data = newGraphDataA;

    acel.update();
    
}

// Grafica de Presion

const ctxP = document.getElementById('pres');

let graphDataP =  {
  type: 'line',
  data: {
    labels: ['0','1','2','3','4','5'],
    datasets: [{
      label: 'Presion',
      data: [0,0,0,0,0,0],
      backgroundColor:[
        'rgba(176, 170, 45, 0.8)',
      ],
      borderWidth: 1
    }]
  },
  options: { 
    
  }
};

let pres = new Chart(ctxP, graphDataP);
let socket5 = new WebSocket("ws://localhost:8000/ws/graph/");
socket5.onmessage = function(e){
    let djangoData5 = JSON.parse(e.data);
    console.log(djangoData5);

    let newGraphDataP = graphDataP.data.datasets[0].data;
    newGraphDataP.shift();
    newGraphDataP.push(djangoData5.presion);
    graphDataP.data.datasets[0].data = newGraphDataP;

    pres.update();
    
}

