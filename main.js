import {sun as sunModel, imageData, mercuryImage, moonImage} from "./constants.js";

let scene, camera, render, container;
let width, height;
width = parseInt(document.body.clientWidth);
height = parseInt(document.body.clientHeight);

container = document.createElement("div");
document.body.appendChild(container);

camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

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
	opacity: 0.6,
	size: 1,
	sizeAttenuation: false
});
let stars;

for (let i = 0; i < 15000; i++) {
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
let sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
sunTexture = new THREE.SphereGeometry(1030, 80, 50);
let sun = new THREE.Mesh(sunTexture, sunMaterial);
scene.add(sun);

// Земля
let earthTexture = new THREE.TextureLoader().load(imageData);
let earthMaterial = new THREE.MeshLambertMaterial({map: earthTexture});
earthTexture = new THREE.SphereGeometry(100, 20, 20);
let earth = new THREE.Mesh(earthTexture, earthMaterial);
// earth.castShadow = true;
scene.add(earth);

let mercuryTexture = new THREE.TextureLoader().load(mercuryImage);
let mercuryMaterial = new THREE.MeshBasicMaterial({map: mercuryTexture});
mercuryTexture = new THREE.SphereGeometry(60, 20, 20);
let mercury = new THREE.Mesh(mercuryTexture, mercuryMaterial);
scene.add(mercury);

let moonTexture = new THREE.TextureLoader().load(moonImage);
let moonMaterial = new THREE.MeshLambertMaterial({map: moonTexture});
moonTexture = new THREE.SphereGeometry(60, 20, 20);
let moon = new THREE.Mesh(moonTexture, moonMaterial);
scene.add(moon);

// сдвиг Земли по оси Х справа
// earth.position.x = 1000;

render = window.WebGLRenderingContext
	? new THREE.WebGLRenderer()
	: new THREE.CanvasRenderer();
render.setSize(width, height);
container.appendChild(render.domElement);

let t = 0;
let y = 0;
animate();

document.addEventListener("mousemove", e => {
	// y = parseInt(event.offsetY);
});

function animate() {
	requestAnimationFrame(animate);
	sun.rotation.y += 0.001;

	//   2000 - радиус вращения
	earth.position.x = Math.sin(t * 0.1) * 2500;
	earth.position.z = Math.cos(t * 0.1) * 2500;

	moon.position.x = earth.position.x + Math.sin(t * 0.5) * 500;
	moon.position.z = earth.position.z + Math.cos(t * 0.5) * 500;

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
