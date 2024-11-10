// script.js

import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let isPlantingMode = true;
let baseplate;
const loader = new GLTFLoader();
const placedObjects = [];
let ghostModel = null;
let currentRotationY = 0; // Track the Y-axis rotation angle of the model

// Models data with real-world sizes in meters
const modelsData = {
  oak_tree: { path: '../models/oak_tree/scene.gltf', displayName: 'Dąb', realHeight: 15 },
  tall_bush: { path: '../models/tall_bush/scene.gltf', displayName: 'Bukszpan', realHeight: 2 },
  thuya: { path: '../models/thuya/scene.gltf', displayName: 'Tuja (Arborvitae)', realHeight: 3.5 },
  buxus: { path: '../models/buxus/scene.gltf', displayName: 'Bukszpan (Buxus)', realHeight: 1 }
};

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0c8ff);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(30, 15, 20);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  const baseGeometry = new THREE.PlaneGeometry(20, 20);
  const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x382014, side: THREE.DoubleSide });
  baseplate = new THREE.Mesh(baseGeometry, baseMaterial);
  baseplate.rotation.x = -Math.PI / 2;
  scene.add(baseplate);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enabled = false;

  populateDropdown();
  loadGhostModel(document.getElementById('plantSelect').value);

  document.getElementById('toggleView').addEventListener('click', toggleViewMode);
  document.getElementById('backButton').addEventListener('click', backButtonWorkPls);
  document.getElementById('plantSelect').addEventListener('change', onPlantChange);

  window.addEventListener('click', onLeftClick);
  window.addEventListener('contextmenu', onRightClick);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keydown', onRotateKeyPress); // New event for rotation control

  renderer.setAnimationLoop(render);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  controls.update();
}

function populateDropdown() {
  const selectElement = document.getElementById('plantSelect');
  selectElement.innerHTML = '';

  for (const modelKey in modelsData) {
    const option = document.createElement('option');
    option.value = modelKey;
    option.textContent = modelsData[modelKey].displayName;
    selectElement.appendChild(option);
  }
}

function loadGhostModel(type) {
  if (ghostModel) {
    scene.remove(ghostModel);
    ghostModel = null;
  }

  const modelInfo = modelsData[type];
  if (!modelInfo) return;

  loader.load(modelInfo.path, (gltf) => {
    ghostModel = gltf.scene;
    ghostModel.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        node.material.transparent = true;
        node.material.opacity = 0.5;
      }
    });

    // Apply scale based on real-world height
    const boundingBox = new THREE.Box3().setFromObject(ghostModel);
    const modelHeight = boundingBox.max.y - boundingBox.min.y;
    const scaleFactor = modelInfo.realHeight / modelHeight;
    ghostModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

    ghostModel.rotation.y = currentRotationY; // Apply the current rotation to the ghost model
    if (isPlantingMode) scene.add(ghostModel);
  });
}

function onPlantChange() {
  const selectedPlantType = document.getElementById('plantSelect').value;
  loadGhostModel(selectedPlantType);
}

function onRotateKeyPress(event) {
  if (!isPlantingMode || !ghostModel) return;

  const rotationStep = Math.PI / 16; // 11.25 degrees per key press

  if (event.key === 'ArrowLeft') {
    currentRotationY -= rotationStep; // Rotate left
  } else if (event.key === 'ArrowRight') {
    currentRotationY += rotationStep; // Rotate right
  }

  // Apply the updated rotation to the ghost model
  ghostModel.rotation.y = currentRotationY;
}

function onMouseMove(event) {
  if (!isPlantingMode || !ghostModel) return;

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([baseplate]);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    ghostModel.position.copy(intersect.point);
    ghostModel.position.y += 0.01;
    ghostModel.visible = true;
  } else {
    ghostModel.visible = false;
  }
}

function onLeftClick(event) {
  if (!isPlantingMode || !ghostModel) return;

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
function onRightClick(event) {
  if (!isPlantingMode) return;
  event.preventDefault();

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    let intersectedObject = intersects[0].object;

    while (intersectedObject.parent && intersectedObject.parent !== scene) {
      intersectedObject = intersectedObject.parent;
    }

    const objectIndex = placedObjects.indexOf(intersectedObject);
    if (objectIndex !== -1) {
      scene.remove(intersectedObject);
      placedObjects.splice(objectIndex, 1);
    }
  }
}

function createPlant(type, position) {
  const modelInfo = modelsData[type];
  if (!modelInfo) return;

  loader.load(modelInfo.path, (gltf) => {
    const plant = gltf.scene;

    // Apply scale based on real-world height
    const boundingBox = new THREE.Box3().setFromObject(plant);
    const modelHeight = boundingBox.max.y - boundingBox.min.y;
    const scaleFactor = modelInfo.realHeight / modelHeight;
    plant.scale.set(scaleFactor, scaleFactor, scaleFactor);

    plant.position.copy(position);
    plant.rotation.y = currentRotationY; // Apply the current rotation to the placed model
    scene.add(plant);
    placedObjects.push(plant);
  });
}

function toggleViewMode() {
  isPlantingMode = !isPlantingMode;
  controls.enabled = !isPlantingMode;

  if (ghostModel) {
    if (isPlantingMode) {
      scene.add(ghostModel);
      ghostModel.visible = true;
    } else {
      ghostModel.visible = false;
    }
  }

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
