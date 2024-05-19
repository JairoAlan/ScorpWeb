// Tamaño fijo para el renderizador
var container = document.getElementById('container');
var width = 400;  // Ancho fijo
var height = 300; // Alto fijo

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
camera.position.z = 50;

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar el cilindro
    cylinder.rotation.x += 0.01;
    cylinder.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// Iniciar la animación
animate();