// script.js

import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let isPlantingMode = true;
const loader = new GLTFLoader();

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
  const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
  const baseplate = new THREE.Mesh(baseGeometry, baseMaterial);
  baseplate.rotation.x = -Math.PI / 2;
  baseplate.position.y = 0;
  scene.add(baseplate);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enabled = false;

  document.getElementById('toggleView').addEventListener('click', toggleViewMode);
  window.addEventListener('click', onCanvasClick);

  renderer.setAnimationLoop(render);
}

function onCanvasClick(event) {
  if (!isPlantingMode) return;

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    const plantType = document.getElementById('plantSelect').value;

    createPlant(plantType, intersect.point);
  }
}

function createPlant(type, position) {
  if (type === 'lowpoly_tree') {
    loader.load('models/lowpoly_tree/scene.gltf', (gltf) => {
      const plant = gltf.scene;
      plant.position.copy(position);
      plant.position.y += 4.5;
      scene.add(plant);
    }, undefined, (error) => {
      console.error('An error occurred while loading the model:', error);
    });
  } else if (type === 'bush') {
    loader.load('models/sth.gltf', (gltf) => {
      const plant = gltf.scene;
      plant.position.copy(position);
      plant.position.y += 0.5;
      scene.add(plant);
    }, undefined, (error) => {
      console.error('An error occurred while loading the model:', error);
    });
  }
}

function toggleViewMode() {
  isPlantingMode = !isPlantingMode;
  controls.enabled = !isPlantingMode;

  document.getElementById('toggleView').textContent = isPlantingMode ? 'Switch to View Mode' : 'Switch to Planting Mode';
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}

init();
