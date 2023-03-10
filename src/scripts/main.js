import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45, 
  sizes.width / sizes.height, 
  0.1, 
  100
);
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({canvas});
const loader = new THREE.TextureLoader();
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const sunLight = new THREE.PointLight(0xffffff, 2, 300);
const controls = new OrbitControls(camera, canvas);
const tl = gsap.timeline({defaults: {duration: 1}});

const sunGeo = new THREE.SphereGeometry(3, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({
	map: loader.load("../src/assets/sun.jpg")
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
const planet1Mesh = makePlanetMesh([0.5, 64, 64], "../src/assets/planet1.jpg");
const planet2Mesh = makePlanetMesh([1, 64, 64], "../src/assets/planet2.jpg");
const planet3Mesh = makePlanetMesh([0.8, 64, 64], "../src/assets/planet3.jpg");

controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
camera.position.z = 20;
scene.add(ambient, sunLight);
scene.add(camera);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

tl.fromTo("h1", {y: "-100%"}, {y: "20%"});

function makePlanetMesh (geoArr, src) {
	const planetGeo = new THREE.SphereGeometry(geoArr[0], geoArr[1], geoArr[2]);
	const planetMat = new THREE.MeshBasicMaterial({map: loader.load(src)});
	const planetMesh = new THREE.Mesh(planetGeo, planetMat);
	return planetMesh;
};

const makePlanet = (sunMesh, planetMesh, posArr) => {
	planetMesh.position.set()
	planetMesh.position.set(posArr[0], posArr[1], posArr[2]);
	sunMesh.add(planetMesh);
	tl.fromTo(planetMesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1});
};

const addSun = () => {
	sunMesh.position.set(0, 0, 0);
	scene.add(sunMesh);
	tl.fromTo(sunMesh.scale, {z: 0, x: 0, y: 0}, {z: 1, x: 1, y: 1});
};

const loop = () => {
	controls.update();
	sunMesh.rotateY(0.005);
	planet1Mesh.rotateY(-0.002);
	planet2Mesh.rotateY(0.004);
	planet3Mesh.rotateY(0.006);
    renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
};

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.updateProjectionMatrix();
    camera.aspect = sizes.width / sizes.height;
    renderer.setSize(sizes.width, sizes.height);
});

addSun();
makePlanet(sunMesh, planet1Mesh, [5, -2, 0]);
makePlanet(sunMesh, planet2Mesh, [8, 1, 0]);
makePlanet(sunMesh, planet3Mesh, [-5, 3, 0]);
loop();