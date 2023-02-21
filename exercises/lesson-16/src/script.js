import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// load our textures
const textureLoader = new THREE.TextureLoader();
// const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);

// Adjust the near and far of the shadow's camera
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
// Adjust how far the shadow's camera can see on each side,
// so we can have a more detailed shadow
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

// changing the shadow.radius will cause a general blur to the shadow, and it will not take into account which parts should be sharp and which parts should be blurred
// directionalLight.shadow.radius = 10;

gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

scene.add(directionalLight);

// spotlight
const spotlight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotlight.castShadow = false;
spotlight.position.set(0, 2, 2);

spotlight.shadow.mapSize.width = 1024;
spotlight.shadow.mapSize.height = 1024;
// change the shadow camera's field of view
// Try to find an angle as small as possible without having the shadows cropped:
spotlight.shadow.camera.fov = 30;

// adjust the near and far of the shadow's camera
spotlight.shadow.camera.near = 1;
spotlight.shadow.camera.far = 6;

scene.add(spotlight);
scene.add(spotlight.target);

// spotlight camera helper
const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera);
scene.add(spotlightCameraHelper);
spotlightCameraHelper.visible = false;
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

// adding a baked shadow directly to the plane
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({ map: bakedShadow })
// );

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

// can your sphere cast shadows? (yes)
// can your sphere receive shadows? (no, it's the only object on the plane)
sphere.castShadow = true;

// can you plane cast shadows? (no, it's underneath all the lights)
// can you plane receive shadows? (yes, it will receive shadows from the sphere)
plane.receiveShadow = true;

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);
sphereShadow.rotation.x = -Math.PI / 2;
// the + 0.01 is to avoid z-fighting
sphereShadow.position.y = plane.position.y + 0.01;

// add sphere, shadow, and plane to the scene
scene.add(sphere, sphereShadow, plane);

// Tell the lights to cast shadows
directionalLight.castShadow = false;

// optimize the shadows
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// Near and far
// add a camera helper to help us find the right near and far values.
// the camera helper will show us an outline of the camera's view
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);

// scene.add(directionalLightCameraHelper);

// point light
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = false;
pointLight.position.set(-1, 1, 0);

// add the map size (how big the picture we make our shadows from is)
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

// how close is the camera and how far does it extend?
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

scene.add(pointLight);

// add the point light helper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightCameraHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// un-enable the shadow map
renderer.shadowMap.enabled = false;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update the sphere's position
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  // make it bounce
  // (use Math.abs() to make the number always positive)
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  // update our shadow
  sphereShadow.position.x = sphere.position.x;
  // connect the opacity to the sphere's position in order to make the shadow more realistic
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;
  sphereShadow.position.z = sphere.position.z;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
