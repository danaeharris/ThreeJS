import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

// set up Debug GUI
const gui = new GUI({ width: 300 });
// start gui out as closed.
gui.close();

// create a parameters object to store all the data we need to pass to the GUI and to the objects.
// If we had multiply objects, we might want to structure the data differently.
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, {
      y: mesh.rotation.y + 10,
      duration: 1
    });
  }
};

// listen for 'h' keypress to toggle the debug GUI
document.addEventListener("keypress", event => {
  if (event.key === "h") {
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

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
const material = new THREE.MeshBasicMaterial({ color: parameters.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Add to the debug UI

// option 1:
// Five variables
// the object you want to watch,
// the specific property you want to watch,
// the minimum value,
// The accuracy of the value,
// gui.add(mesh.position, "y", -3, 3, 0.01);

// option 2:
gui
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("red cube elevation");

gui.add(mesh, "visible").name("red cube visibility");

gui.add(material, "wireframe").name("red cube wireframe");

gui
  .addColor(parameters, "color")
  .onChange(() => {
    material.color.set(parameters.color);
  })
  .name("red cube color");

gui.add(parameters, "spin").name("spin red cube");

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
camera.position.z = 3;
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
