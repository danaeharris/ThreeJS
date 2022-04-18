import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

console.log(gsap);
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// animations

// dealing with fps option 1
// old time
let time = Date.now();

const tick1 = () => {
  // time
  const currentTime = Date.now();
  const delta = currentTime - time;
  time = currentTime;
  console.log(delta);

  //   update objects
  mesh.rotation.y -= 0.001 * delta;
  //   mesh.position.y += 0.1;
  //   render
  renderer.render(scene, camera);
  //   pass this function to the requestAnimationFrame
  window.requestAnimationFrame(tick1);
};
// tick1();

// dealing with fps option 2

// built in Threejs function clock
const clock = new THREE.Clock();

const tick2 = () => {
  // time
  const elapsed = clock.getElapsedTime();
  //   update objects
  //   mesh.position.y = elapsed;
  //   if you want the object to go up and down
  mesh.position.y = Math.sin(elapsed);
  mesh.position.x = Math.cos(elapsed);

  camera.lookAt(mesh.position);
  //   camera.position.y = Math.sin(elapsed);
  //   camera.position.x = Math.cos(elapsed);

  //   if you want one rotation per second
  //   mesh.rotation.y = elapsed * (Math.PI * 2);
  //   mesh.position.y += 0.1;
  //   render
  renderer.render(scene, camera);
  //   pass this function to the requestAnimationFrame
  window.requestAnimationFrame(tick2);
};
// tick2();

// using gsap
gsap.to(mesh.position, { duration: 1, delay: 1.2, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });
const tick3 = () => {
  renderer.render(scene, camera);
  //   pass this function to the requestAnimationFrame
  window.requestAnimationFrame(tick3);
};
tick3();
