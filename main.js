import { sun as sunModel, imageData, mercuryTexture } from "./constants.js";

var scene, camera, render, container;
let width = parseInt(document.body.clientWidth);
let height = parseInt(document.body.clientHeight);

container = document.createElement("div");
document.body.appendChild(container);

camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

// Высота камеры
camera.position.z = 5000;
// Поворот камеры
camera.rotation.z = -Math.PI / 20;
scene = new THREE.Scene();

// Освещение
var light = new THREE.PointLight(0xffffff);

light.position.y = 1.5;
light.intensity = 2;
scene.add(light);

// Звёзды
let starsGeometry = new THREE.Geometry();
let starsMaterial = new THREE.PointsMaterial({
  color: 0xbbbbbb,
  opacity: 0.6,
  size: 1,
  sizeAttenuation: false
});

for (let i = 0; i < 15000; i++) {
  let vertex = new THREE.Vector3();
  vertex.x = Math.random() * 2 - 1;
  vertex.y = Math.random() * 2 - 1;
  vertex.z = Math.random() * 2 - 1;
  vertex.multiplyScalar(6000);
  starsGeometry.vertices.push(vertex);
}

let stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Солнце
let texture = new THREE.TextureLoader().load("sun.jpg");
const material = new THREE.MeshBasicMaterial({ map: texture });
texture = new THREE.SphereGeometry(1030, 80, 50);
const sun = new THREE.Mesh(texture, material);
scene.add(sun);

// Земля
let earthTexture = new THREE.TextureLoader().load(imageData);
const earthMaterial = new THREE.MeshLambertMaterial({ map: earthTexture });
earthTexture = new THREE.SphereGeometry(100, 20, 20);
const earth = new THREE.Mesh(earthTexture, earthMaterial);
scene.add(earth);

// Меркурий
let mercuryText = new THREE.TextureLoader().load(mercuryTexture);
const mercuryMaterial = new THREE.MeshLambertMaterial({ map: mercuryText });
mercuryText = new THREE.SphereGeometry(60, 20, 20);
const mercury = new THREE.Mesh(mercuryText, mercuryMaterial);
scene.add(mercury);

// сдвиг Земли по оси Х справа
// earth.position.x = 1000;

render = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
render.setSize(width, height);
container.appendChild(render.domElement);

var t = 0;
var y = 0;
animate();

document.addEventListener("mousemove", e => {
  // y = parseInt(event.offsetY);
});

function animate() {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.01;

  //   2500 - радиус вращения
  earth.position.x = Math.sin(t * 0.1) * 2500;
  earth.position.z = Math.cos(t * 0.1) * 2500;

  camera.position.y = y * 3;
  mercury.position.x = Math.sin(t * 0.3) * 1500;
  mercury.position.z = Math.cos(t * 0.3) * 1500;
  t += (Math.PI / 180) * 2;
  render.render(scene, camera);
}

let earthPerpectiveMode = false;
let mercuryPerpectiveMode = false;
let earthAnimationFrame = null;
let mercuryAnimationFrame = null;

document
  .getElementById("earthPerspective")
  .addEventListener("click", () => toggleEarthPerspective(earthPerpectiveMode));

document
  .getElementById("mercuryPerspective")
  .addEventListener("click", () => toggleMercuryPerpective(mercuryPerpectiveMode));

document.getElementById("resetButton").addEventListener("click", () => resetCamera());

function resetCamera() {
  cancelAnimationFrame(mercuryAnimationFrame);
  cancelAnimationFrame(earthAnimationFrame);
  earthPerpectiveMode = false;
  mercuryPerpectiveMode = false;
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.z = 5000;
  mercuryPerpectiveMode = false;
  camera.rotation.z = -Math.PI / 20;
  render.render(scene, camera);
}

function toggleMercuryPerpective(isEnabled) {
  if (!isEnabled) {
    mercuryRotationFollowingCamera();
    mercuryPerpectiveMode = true;
    return;
  }

  cancelAnimationFrame(mercuryAnimationFrame);
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.z = 5000;
  mercuryPerpectiveMode = false;
  camera.rotation.z = -Math.PI / 20;
  render.render(scene, camera);
  return;
}

function mercuryRotationFollowingCamera() {
  mercuryAnimationFrame = requestAnimationFrame(mercuryRotationFollowingCamera);
  camera.position.z = earth.position.z + 200;
  camera.lookAt(mercury.position);
  render.render(scene, camera);
  return;
}

function toggleEarthPerspective(isEnabled) {
  if (!isEnabled) {
    earthRotationFollowingCamera();
    earthPerpectiveMode = true;
    mercuryPerpectiveMode = false;
    return;
  }

  cancelAnimationFrame(earthAnimationFrame);
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.z = 5000;
  earthPerpectiveMode = false;
  camera.rotation.z = -Math.PI / 20;
  render.render(scene, camera);
  return;
}

function earthRotationFollowingCamera() {
  earthAnimationFrame = requestAnimationFrame(earthRotationFollowingCamera);
  camera.position.z = earth.position.z + 200;
  camera.lookAt(earth.position);
  render.render(scene, camera);
  return;
}
