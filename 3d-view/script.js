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
const scaleFactors = { oak_tree: 1, tall_bush: 0.5 };

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0c8ff);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(30, 15, 20);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  const baseGeometry = new THREE.PlaneGeometry(20, 20);
  const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x382014 });
  baseplate = new THREE.Mesh(baseGeometry, baseMaterial);
  baseplate.rotation.x = -Math.PI / 2;
  scene.add(baseplate);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enabled = false;

  document.getElementById('toggleView').addEventListener('click', toggleViewMode);
  document.getElementById('backButton').addEventListener('click', backButtonWorkPls);
  document.getElementById('plantSelect').addEventListener('change', onPlantChange);
  
  window.addEventListener('click', onLeftClick);
  window.addEventListener('contextmenu', onRightClick);
  window.addEventListener('mousemove', onMouseMove);

  loadGhostModel(document.getElementById('plantSelect').value);
  renderer.setAnimationLoop(render);
}

function loadGhostModel(type) {
  if (ghostModel) {
    scene.remove(ghostModel);
    ghostModel = null;
  }

  const modelPath = type === 'oak_tree' ? '../models/oak_tree/scene.gltf' : '../models/tall_bush/scene.gltf';
  const scaleFactor = scaleFactors[type];

  loader.load(modelPath, (gltf) => {
    ghostModel = gltf.scene;
    ghostModel.traverse((node) => {
      if (node.isMesh) {
        node.material = node.material.clone();
        node.material.transparent = true;
        node.material.opacity = 0.5;
      }
    });
    ghostModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
    if (isPlantingMode) scene.add(ghostModel); // Only add if in planting mode
  });
}

function onPlantChange() {
  const selectedPlantType = document.getElementById('plantSelect').value;
  loadGhostModel(selectedPlantType);
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
    ghostModel.visible = true; // Make sure the ghost model is visible while on baseplate
  } else {
    ghostModel.visible = false; // Hide ghost model when off the baseplate
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
  const modelPath = type === 'oak_tree' ? '../models/oak_tree/scene.gltf' : '../models/tall_bush/scene.gltf';
  const scaleFactor = scaleFactors[type];

  loader.load(modelPath, (gltf) => {
    const plant = gltf.scene;
    plant.position.copy(position);
    plant.scale.set(scaleFactor, scaleFactor, scaleFactor);
    scene.add(plant);
    placedObjects.push(plant);
  });
}

function toggleViewMode() {
  isPlantingMode = !isPlantingMode;
  controls.enabled = !isPlantingMode;

  if (ghostModel) ghostModel.visible = isPlantingMode; // Show ghost only in planting mode
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
