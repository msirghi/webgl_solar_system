import {
  sun as sunModel,
  imageData,
  mercuryImage,
  moonImage
} from "./constants.js";

let scene, camera, render, container;
let width, height;
width = parseInt(document.body.clientWidth);
height = parseInt(document.body.clientHeight);

container = document.createElement("div");
document.body.appendChild(container);

camera = new THREE.PerspectiveCamera(95, width / height, 1, 10000);

// Высота камеры
camera.position.z = 8000;
// Поворот камеры
camera.rotation.z = -Math.PI / 20;
scene = new THREE.Scene();

// Освещение
let light = new THREE.PointLight(0xffffff);
light.position.y = 1.5;
light.intensity = 2;
scene.add(light);

// Звёзды
let starsGeometry = new THREE.Geometry();
let starsMaterial = new THREE.PointsMaterial({
  color: 0xbbbbbb,
  opacity: 0.3,
  size: 1,
  sizeAttenuation: false
});
let stars;

for (let i = 0; i < 5000; i++) {
  let vertex = new THREE.Vector3();
  vertex.x = Math.random() * 2 - 1;
  vertex.y = Math.random() * 2 - 1;
  vertex.z = Math.random() * 2 - 1;
  vertex.multiplyScalar(6000);
  starsGeometry.vertices.push(vertex);
}

stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Солнце
let sunTexture = new THREE.TextureLoader().load(sunModel);
let sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
sunTexture = new THREE.SphereGeometry(1030, 80, 50);
let sun = new THREE.Mesh(sunTexture, sunMaterial);

var sunGlow1Sphere = new THREE.SphereGeometry(1100, 80, 50);
var sunGlow1Material = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.2
});
sunGlow1Material.color = new THREE.Color("rgb(255, 190, 0)");

var sunGlow1 = new THREE.Mesh(sunGlow1Sphere, sunGlow1Material);
sunGlow1.position.set(0, 0, 0);
sun.add(sunGlow1);
scene.add(sun);

// Земля
let earthTexture = new THREE.TextureLoader().load(imageData);
let earthMaterial = new THREE.MeshLambertMaterial({ map: earthTexture });
earthTexture = new THREE.SphereGeometry(100, 20, 20);
let earth = new THREE.Mesh(earthTexture, earthMaterial);
scene.add(earth);

let mercuryTexture = new THREE.TextureLoader().load(mercuryImage);
let mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryTexture });
mercuryTexture = new THREE.SphereGeometry(60, 20, 20);
let mercury = new THREE.Mesh(mercuryTexture, mercuryMaterial);
scene.add(mercury);

let moonTexture = new THREE.TextureLoader().load(moonImage);
let moonMaterial = new THREE.MeshLambertMaterial({ map: moonTexture });
moonTexture = new THREE.SphereGeometry(60, 20, 20);
let moon = new THREE.Mesh(moonTexture, moonMaterial);
scene.add(moon);

let skybox_group = new THREE.Object3D();
let SkyboxMesh = CreateSphere("eso_dark.jpg", 6500, 0, "Skybox", true);
SkyboxMesh.material.side = THREE.BackSide;
SkyboxMesh.rotation.x = (Math.PI / 180) * 63;
skybox_group.add(SkyboxMesh);

scene.add(skybox_group);

function CreateSphere(texture_u, radius, polygon_count, name, basic) {
  let manager = new THREE.LoadingManager();
  let sphere_loader = new THREE.TextureLoader(manager);
  let sphere_texture = sphere_loader.load(texture_u);
  let sphere_geometry = new THREE.SphereGeometry(
    radius,
    polygon_count,
    polygon_count
  );
  if (basic == true) {
    var sphere_material = new THREE.MeshBasicMaterial({ map: sphere_texture });
  } else {
    var sphere_material = new THREE.MeshLambertMaterial({
      map: sphere_texture
    });
  }
  let sphere_mesh = new THREE.Mesh(sphere_geometry, sphere_material);
  sphere_mesh.name = name;
  return sphere_mesh;
}

render = window.WebGLRenderingContext
  ? new THREE.WebGLRenderer()
  : new THREE.CanvasRenderer();
render.setSize(width, height);
container.appendChild(render.domElement);

let controls = new THREE.OrbitControls(camera, render.domElement);

let t = 0;
animate();

// document.addEventListener("mousemove", e => {
//   // y = parseInt(event.offsetY);
// });

function animate() {
  requestAnimationFrame(animate);
  //   sun.rotation.y += 0.001;

  //   2000 - радиус вращения
  earth.position.x = Math.sin(t * 0.1) * 2500;
  earth.position.z = Math.cos(t * 0.1) * 2500;

  sun.rotation.y += 0.002;

  moon.position.x = earth.position.x + Math.sin(t * 0.5) * 500;
  moon.position.z = earth.position.z + Math.cos(t * 0.5) * 500;

  //   camera.position.y = y * 3;
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
  .addEventListener("click", () =>
    toggleMercuryPerpective(mercuryPerpectiveMode)
  );

document
  .getElementById("resetButton")
  .addEventListener("click", () => resetCamera());

function resetCamera() {
  //   cancelAnimationFrame(mercuryAnimationFrame);
  //   cancelAnimationFrame(earthAnimationFrame);
  earthPerpectiveMode = false;
  mercuryPerpectiveMode = false;
  // camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  //   camera.position.z = 5000;
  //   mercuryPerpectiveMode = false;
  //   camera.rotation.z = -Math.PI / 20;
  //   render.render(scene, camera);
  //   camera.position.set(100, 10.9, 121);

  // Высота камеры
  camera.position.z = 5000;
  // Поворот камеры
  controls.update();
}

// camera.rotation.z = -Math.PI / 20;
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
