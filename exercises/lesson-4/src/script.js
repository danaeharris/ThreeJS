import "./style.css";
import * as THREE from "three";

// Create our scene
// https://threejs.org/docs/index.html#api/en/scenes/Scene
const scene = new THREE.Scene();

// Cube
// https://threejs.org/docs/index.html#api/en/geometries/BoxGeometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// material is what the object looks like
// ox is like # for ThreeJS colors
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// create the mesh
// https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial
const mesh = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(mesh);

// Create a camera
// https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera
// perspective camera makes objects look big up close and small in the distance
// two parameters: field of view, aspect ratio
// if field of view is too big, the objects will be distorted (45-55 degrees)
// aspect ratio is width / height

const sceneSize = {
  width: 800,
  height: 600,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sceneSize.width / sceneSize.height
);

// move the camera to not be inside the cube
camera.position.z = 3;
// camera.position.x = 2;
// camera.position.y = 1;

// add the camera to the scene
scene.add(camera);

// get the html canvas element
const canvas = document.querySelector(".webgl");

// Create a renderer
// https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer
// the scene is what the camera sees
// we created the canvas in the html
//
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
console.log({ canvas });
renderer.setSize(sceneSize.width, sceneSize.height);

renderer.render(scene, camera);
