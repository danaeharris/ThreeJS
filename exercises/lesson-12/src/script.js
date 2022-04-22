import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

// debug
const gui = new GUI({ width: 300 });
gui.close();
// listen for 'h' keypress to toggle the debug GUI
document.addEventListener("keypress", (event) => {
  if (event.key === "h") {
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

// Textures
const textureLoader = new THREE.TextureLoader();
// https://threejs.org/docs/#api/en/loaders/CubeTextureLoader
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughTexture = textureLoader.load("/textures/door/roughness.jpg");

const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

// EnvironmentMap
// use the CubeTextureLoader to load the environment map
// params: positive x image path, negative x image path, positive y image path, negative y image path, positive z image path, negative z image path
// https://threejs.org/docs/#api/en/loaders/CubeTextureLoader
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/3/px.jpg",
  "/textures/environmentMaps/3/nx.jpg",
  "/textures/environmentMaps/3/py.jpg",
  "/textures/environmentMaps/3/ny.jpg",
  "/textures/environmentMaps/3/pz.jpg",
  "/textures/environmentMaps/3/nz.jpg",
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// objects

// MeshBasicMaterial
// https://threejs.org/docs/#api/en/materials/MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// // material.color.set("yellow");
// // material.color = new THREE.Color("lime");
// // material.wireframe = true;

// // the next two have to be together
// // material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// material.side = THREE.DoubleSide;

// MeshNormalMaterial
// https://threejs.org/docs/#api/en/materials/MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;

// MeshMatcapMaterial
// https://threejs.org/docs/#api/en/materials/MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// MeshDepthMaterial
// https://threejs.org/docs/#api/en/materials/MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();
// material.wireframe = true;

// MeshLambertMaterial
// https://threejs.org/docs/#api/en/materials/MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();

// MeshPhongMaterial
// https://threejs.org/docs/#api/en/materials/MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color("blue");

// MeshToonMaterial
// https://threejs.org/docs/#api/en/materials/MeshToonMaterial
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// MeshStandardMaterial
// https://threejs.org/docs/#api/en/materials/MeshStandardMaterial
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
// add the door color texture to the material
// material.map = doorColorTexture;
// material.aoMap = doorAmbientTexture;
// change the intensity
material.aoMapIntensity = 1;

// height map
// this looks weird, but we'll fix it.
// material.displacementMap = doorHeightTexture;
// displacement scale
// material.displacementScale = 0.1;

// metalness material
// material.metalnessMap = doorMetalTexture;

// roughness material
// material.roughnessMap = doorRoughTexture;
// material.normalMap = doorNormalTexture;
// control the normal map
// material.normalScale.set(0.5, 0.5);

// add the alpha map to the material
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

gui.add(material, "metalness").min(0).max(1).step(0.0001).name("metalness");
gui.add(material, "roughness").min(0).max(1).step(0.0001).name("roughness");
// gui
//   .add(material, "aoMapIntensity")
//   .min(0)
//   .max(10)
//   .step(0.0001)
//   .name("ambient occlusion intensity");
// gui
//   .add(material, "displacementScale")
//   .min(0)
//   .max(10)
//   .step(0.0001)
//   .name("Height displacement scale");

//add environment map
material.envMap = environmentMapTexture;

// create sphere
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;
// duplicate the sphere's uv coordinates
sphere.geometry.setAttribute(
  "uv2",
  //   https://threejs.org/docs/#api/en/core/BufferAttribute
  // 2 is how many vertices per coordinate
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

// create plane
// https://threejs.org/docs/#api/en/geometries/PlaneGeometry
// params width, height, widthSegments, heightSegments
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

// duplicate the plane's uv coordinates
plane.geometry.setAttribute(
  "uv2",
  //   https://threejs.org/docs/#api/en/core/BufferAttribute
  // 2 is how many vertices per coordinate
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

// create a torus
// https://threejs.org/docs/#api/en/geometries/TorusGeometry
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);

// duplicate the torus's uv coordinates
torus.geometry.setAttribute(
  "uv2",
  //   https://threejs.org/docs/#api/en/core/BufferAttribute
  // 2 is how many vertices per coordinate
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

torus.position.x = 1.5;

scene.add(sphere, plane, torus);

// Lights

// ambient light
// https://threejs.org/docs/#api/en/lights/AmbientLight
// color and intensity
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// point light
// https://threejs.org/docs/#api/en/lights/PointLight
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(ambientLight, pointLight);

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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   update objects
  sphere.rotation.y = 0.1 * elapsedTime;

  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;

  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
