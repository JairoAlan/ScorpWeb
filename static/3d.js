// Servidor
let ratotacion = new WebSocket("ws://localhost:8000/ws/graph/");

// Variables para la rotacion, que deben de ser en radianes
let girosX = 0;
let girosY = 0;
let girosZ = 0;

// Tamaño fijo para el renderizador del container de 3D!!
var container = document.getElementById('container');
var width = 400;  // Ancho fijo
var height = 250; // Alto fijo

// Escena, cámara y renderizador
var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Luz
var light = new THREE.PointLight(0xffffff);
light.position.set(10, 10, 10);
scene.add(light);

// Geometría y material del cilindro
var geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
var cylinder = new THREE.Mesh(geometry, material);

// Añadir el cilindro a la escena
scene.add(cylinder);

// Posicionar la cámara
camera.position.z = 25;

// Se obtiene los mensajes del JSON que vienen del servidor
ratotacion.onmessage = function(e){
  let djangoDataRotacion = JSON.parse(e.data);
  
  // guarda los valores en las variables, los valores del json
  girosX = djangoDataRotacion.gyX
  girosY = djangoDataRotacion.gyY
  girosZ = djangoDataRotacion.gyZ

}

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar el cilindro
    cylinder.rotation.x = girosX ;
    cylinder.rotation.y = girosY ;
    cylinder.rotation.z = girosZ ;

    renderer.render(scene, camera);
}



// Iniciar la animación
animate();