import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// create the group
// https://threejs.org/docs/#api/en/objects/Group
const group = new THREE.Group();

const cube1 = new THREE.Mesh(
  // add the geometry inside the mesh
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

const cube2 = new THREE.Mesh(
  // add the geometry inside the mesh
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.set(-2, 0, 0);

const cube3 = new THREE.Mesh(
  // add the geometry inside the mesh
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.set(2, 0, 0);

group.add(cube1, cube2, cube3);

group.position.y = 1;
group.scale.y = 2;
group.rotation.y = 1;

scene.add(group);

/**
 * Axes Helper
 * https://threejs.org/docs/#api/helpers/AxesHelper
 * Helps to visualize the coordinate system
 * Takes an optional size parameter
 */
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.z = 3;

// look at the mesh
// camera.lookAt(mesh.position);

scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
