import { sun as sunModel, imageData, mercuryTexture } from "./constants.js";

var scene, camera, render, container;
let width, height;
width = parseInt(document.body.clientWidth);
height = parseInt(document.body.clientHeight);

container = document.createElement("div");
document.body.appendChild(container);

camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

// Высота камеры
camera.position.z = 8000;
scene = new THREE.Scene();

// Звёзды
let starsGeometry = new THREE.Geometry();
let starsMaterial = new THREE.PointsMaterial({
  color: 0xbbbbbb,
  opacity: 0.6,
  size: 1,
  sizeAttenuation: false
});
let stars;

for (let i = 0; i < 15000; i++) {
  var vertex = new THREE.Vector3();
  vertex.x = Math.random() * 2 - 1;
  vertex.y = Math.random() * 2 - 1;
  vertex.z = Math.random() * 2 - 1;
  vertex.multiplyScalar(6000);
  starsGeometry.vertices.push(vertex);
}

stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// var light = new THREE.AmbientLight(0x404040);
// scene.add(light);

// Солнце
let texture = new THREE.TextureLoader().load(sunModel);
var material = new THREE.MeshBasicMaterial({ map: texture });
texture = new THREE.SphereGeometry(1030, 80, 50);
var sun = new THREE.Mesh(texture, material);
scene.add(sun);

// Земля
var earthTexture = new THREE.TextureLoader().load(imageData);
var material = new THREE.MeshBasicMaterial({ map: earthTexture });
earthTexture = new THREE.SphereGeometry(100, 20, 20);
var earth = new THREE.Mesh(earthTexture, material);
scene.add(earth);

var mercuryText = new THREE.TextureLoader().load(mercuryTexture);
var mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryText });
mercuryText = new THREE.SphereGeometry(60, 20, 20);
var mercury = new THREE.Mesh(mercuryText, mercuryMaterial);
scene.add(mercury);

// сдвиг Земли по оси Х справа
// earth.position.x = 1000;

render = window.WebGLRenderingContext
  ? new THREE.WebGLRenderer()
  : new THREE.CanvasRenderer();
render.setSize(width, height);
container.appendChild(render.domElement);

var t = 0;
var y = 0;
animate();

document.addEventListener("mousemove", e => {
  //   y = parseInt(event.offsetY);
});

function animate() {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.001;

  //   2000 - радиус вращения
  earth.position.x = Math.sin(t * 0.1) * 4500;
  earth.position.z = Math.cos(t * 0.1) * 4500;

  camera.position.y = y * 3;
  //  смотрим на Солнце со стороны Земли
  //   camera.position.x = earth.position.x;
  //   camera.position.z = earth.position.z;

  //   смотрим на Землю со стороны Cолнца
  //   camera.position.x = sun.position.x;
  //   camera.position.z = sun.position.z;

  // камера следует за Землёй
  //   camera.position.z = earth.position.z + 200;
  //   camera.lookAt(earth.position);

  mercury.position.x = Math.sin(t * 0.3) * 1500;
  mercury.position.z = Math.cos(t * 0.3) * 1500;
  t += (Math.PI / 180) * 2;
  render.render(scene, camera);
}
