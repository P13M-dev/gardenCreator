// script.js

import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let isPlantingMode = true;
let baseplate;
const loader = new GLTFLoader();
const placedObjects = []; // Array to store references to root objects of placed models
const scaleFactor = 1; // Scale factor for real-world scaling

function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0c8ff);

  // Camera setup
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(30, 15, 20);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  // Baseplate setup
  const baseGeometry = new THREE.PlaneGeometry(20, 20);
  const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x382014 });
  baseplate = new THREE.Mesh(baseGeometry, baseMaterial);
  baseplate.rotation.x = -Math.PI / 2;
  scene.add(baseplate);

  // Orbit controls setup
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enabled = false;

  // Event listeners
  document.getElementById('toggleView').addEventListener('click', toggleViewMode);
  document.getElementById('backButton').addEventListener('click', backButtonWorkPls);

  window.addEventListener('click', onLeftClick);
  window.addEventListener('contextmenu', onRightClick);

  // Start render loop
  renderer.setAnimationLoop(render);
}

// Left-click function to add a plant
function onLeftClick(event) {
  if (!isPlantingMode) return;

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([baseplate]);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    const plantType = document.getElementById('plantSelect').value;

    createPlant(plantType, intersect.point);
  }
}

// Right-click function to delete a plant
function onRightClick(event) {
  if (!isPlantingMode) return;
  event.preventDefault();  // Prevent the context menu from opening

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Raycast to find intersected objects
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    // Find the root object to remove
    let intersectedObject = intersects[0].object;

    // Traverse up to the root (to ensure we delete the entire model)
    while (intersectedObject.parent && intersectedObject.parent !== scene) {
      intersectedObject = intersectedObject.parent;
    }

    // Check if the object is part of the placedObjects array
    const objectIndex = placedObjects.indexOf(intersectedObject);
    if (objectIndex !== -1) {
      scene.remove(intersectedObject); // Remove from scene
      placedObjects.splice(objectIndex, 1); // Remove from tracking array
      console.log('Object removed:', intersectedObject); // Debugging
    } else {
      console.log('Clicked on baseplate or untracked object, no deletion'); // Debugging
    }
  } else {
    console.log('No object detected to delete'); // Debugging
  }
}

// Function to create and place a plant
function createPlant(type, position) {
  if (type === 'oak_tree') {
    loader.load('../models/oak_tree/scene.gltf', (gltf) => {
      const plant = gltf.scene;
      plant.position.copy(position);
      plant.scale.set(scaleFactor, scaleFactor, scaleFactor); // Apply scale factor uniformly
      scene.add(plant);
      placedObjects.push(plant); // Track the model root
    });
  } else if (type === 'tall_bush') {
    loader.load('../models/tall_bush/scene.gltf', (gltf) => {
      const plant = gltf.scene;
      plant.position.copy(position);
      plant.scale.set(0.5 * scaleFactor, 0.5 * scaleFactor, 0.5 * scaleFactor); // Apply scale factor
      scene.add(plant);
      placedObjects.push(plant); // Track the model root
    });
  }
}

function toggleViewMode() {
  isPlantingMode = !isPlantingMode;
  controls.enabled = !isPlantingMode;
  document.getElementById('toggleView').textContent = isPlantingMode ? 'Switch to View Mode' : 'Switch to Planting Mode';
}

function backButtonWorkPls() {
  window.location.replace("../index.html");
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}

init();
