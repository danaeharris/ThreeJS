import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Textures

//Image loading
//  option 1: use a callback
// const image = new Image();

// // convert the image to a texture
// // https://threejs.org/docs/index.html#api/en/textures/Texture
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   //   tell the texture to reload the image
//   texture.needsUpdate = true;
// };
// image.src = "/textures/door/color.jpg";

// option 2: use a loader
// create a loading manager
// https://threejs.org/docs/#api/en/loaders/LoadingManager
const loadingManager = new THREE.LoadingManager();

// get info about loading progress
// loadingManager.onStart = (item, loaded, total) => {
//   console.log(`Started loading ${item}`);
// };
// loadingManager.onProgress = (item, loaded, total) => {
//   console.log(`loading ${item}`);
// };
// loadingManager.onLoad = (item, loaded, total) => {
//   console.log(`${item} loaded`);
// };
// loadingManager.onError = (item, loaded, total) => {
//   console.log(`Error loading ${item}`);
// };

// create a texture loader
const textureLoader = new THREE.TextureLoader(loadingManager);
// const colorTexture = textureLoader.load("/textures/door/color.jpg");
// const colorTexture = textureLoader.load("/textures/checkerboard-8x8.png");
const colorTexture = textureLoader.load("/textures/minecraft.png");
// const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const heightTexture = textureLoader.load("/textures/door/height.jpg");
// const normalTexture = textureLoader.load("/textures/door/normal.jpg");
// const ambientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// you can do this with callbacks if you can't get something to load
// const texture = textureLoader.load(
//   "/textures/door/color.jpg",
//   // load function
//   () => {
//     console.log("loaded");
//   },
//   // progress function
//   () => {
//     console.log("progress");
//   },
//   // error function
//   () => {
//     console.log("error");
//   }
// );

// You can repeat a texture
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;

// wrap along the x axis
// colorTexture.wrapS = THREE.RepeatWrapping;
// wrap along the y axis
// colorTexture.wrapT = THREE.RepeatWrapping;

// you can mirror wrap the texture
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// rotate the texture
// colorTexture.rotation = 1;
// colorTexture.rotation = Math.PI / 4;

// // Make the center of each plane the origin
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

// Using NearestFilter gives you better performance
// if it's in the difference
// You don't need the minmap filter if you're using nearest with minFilter
// you can deactivate it
colorTexture.generateMipmaps = false;

colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
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
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
