import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls;
let isPlantingMode = true;
let baseplate;
const loader = new GLTFLoader();
const placedObjects = [];
let ghostModel = null;
let currentRotationY = 0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let currentMode = 'place';
const modes = ['rotate3d', 'move', 'place', 'delete'];

const modelsData = {
//   oak_tree: { path: '../models/dab/scene.gltf', displayName: 'Oak Tree', realHeight: 15 },
//   tall_bush: { path: '../models/tall_bush/scene.gltf', displayName: 'Tall Bush', realHeight: 2 },
  thuya: { path: '../models/tuja/scene.gltf', displayName: 'Tuja', realHeight: 3.5 },
  buxus: { path: '../models/bukszpan/scene.gltf', displayName: 'Bukszpan', realHeight: 1 },
  bench: { path: '../models/lawka/scene.gltf', displayName: 'Ławka', realHeight: 0.9 }
};

let plannerContainer;

// Add these functions to handle the toolbar
function initToolbar() {
  // Mode buttons
  modes.forEach(mode => {
      const button = document.getElementById(`${mode}-mode`);
      button.addEventListener('click', () => setMode(mode));
  });

  // Rotation buttons
  document.getElementById('rotate-left').addEventListener('click', () => handleRotate('left'));
  document.getElementById('rotate-right').addEventListener('click', () => handleRotate('right'));

  // Menu button
  document.getElementById('menu-toggle').addEventListener('click', toggleMenu);
  document.getElementById('close-menu').addEventListener('click', toggleMenu);
}

function setMode(mode) {
    currentMode = mode;

    // Update button states
    modes.forEach(m => {
        const button = document.getElementById(`${m}-mode`);
        button.classList.toggle('active', m === mode);
    });

    // Always hide ghost model by default
    if (ghostModel) {
        ghostModel.visible = false;
    }

    // Update mode-specific settings
    switch(mode) {
        case 'rotate3d':
            renderer.domElement.style.cursor = 'grab';
            controls.enabled = true;
            controls.enableRotate = true;
            controls.enablePan = false;
            controls.enableZoom = true;
            controls.mouseButtons = {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.ROTATE
            };
            break;
        case 'move':
            renderer.domElement.style.cursor = 'move';
            controls.enabled = true;
            controls.enableRotate = false;
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.mouseButtons = {
                LEFT: THREE.MOUSE.PAN,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.PAN
            };
            break;
        case 'place':
            renderer.domElement.style.cursor = 'crosshair';
            controls.enabled = true;
            controls.enableRotate = false;
            controls.enablePan = false;
            controls.enableZoom = true;
            if (ghostModel) {
                ghostModel.visible = true;
            }
            controls.mouseButtons = {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.ROTATE
            };
            break;
        case 'delete':
            renderer.domElement.style.cursor = 'pointer';
            controls.enabled = true;
            controls.enableRotate = false;
            controls.enablePan = false;
            controls.enableZoom = true;
            controls.mouseButtons = {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.ROTATE
            };
            break;
    }
}

function handleRotate(direction) {
  if (!ghostModel || currentMode !== 'place') return;
  
  const rotationStep = Math.PI / 16;
  if (direction === 'left') currentRotationY -= rotationStep;
  if (direction === 'right') currentRotationY += rotationStep;
  
  ghostModel.rotation.y = currentRotationY;
}

function toggleMenu() {
  const menu = document.getElementById('side-menu');
  menu.classList.toggle('open');
}

function init() {
  plannerContainer = document.getElementById('planner');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0c8ff);

  camera = new THREE.PerspectiveCamera(45, plannerContainer.clientWidth / plannerContainer.clientHeight, 0.1, 1000);
  camera.position.set(30, 15, 20);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(plannerContainer.clientWidth, plannerContainer.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  plannerContainer.appendChild(renderer.domElement);

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
    // Change mouse buttons configuration
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,    // For rotate mode
        MIDDLE: THREE.MOUSE.DOLLY,   // Keep middle mouse for zoom if needed
        RIGHT: THREE.MOUSE.ROTATE    // Make right do the same as left for convenience
    };

  populateDropdown();
  loadGhostModel(document.getElementById('plantSelect').value);

  document.getElementById("exportFile").addEventListener('click', exportGardenArrangement);
  document.getElementById("importFile").addEventListener('change', importGardenArrangement);
  document.getElementById('plantSelect').addEventListener('change', onPlantChange);

  window.addEventListener('click', onLeftClick);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keydown', onRotateKeyPress);

  // Prevent context menu from appearing
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  renderer.setAnimationLoop(render);
    initToolbar();
    setMode('place'); // Set initial mod
}

function onWindowResize() {
renderer.setSize(plannerContainer.clientWidth, plannerContainer.clientHeight);
camera.aspect = plannerContainer.clientWidth / plannerContainer.clientHeight;
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

function getRelativeMouse(event) {
const rect = plannerContainer.getBoundingClientRect();
return new THREE.Vector2(
  ((event.clientX - rect.left) / rect.width) * 2 - 1,
  -((event.clientY - rect.top) / rect.height) * 2 + 1
);
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

      const boundingBox = new THREE.Box3().setFromObject(ghostModel);
      const modelHeight = boundingBox.max.y - boundingBox.min.y;
      const scaleFactor = modelInfo.realHeight / modelHeight;
      ghostModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
      ghostModel.rotation.y = currentRotationY;
      
      // Only show ghost model if in place mode
      ghostModel.visible = (currentMode === 'place');
      scene.add(ghostModel);
  });
}

function onPlantChange() {
loadGhostModel(document.getElementById('plantSelect').value);
}

function onRotateKeyPress(event) {
if (!isPlantingMode || !ghostModel) return;

const rotationStep = Math.PI / 16;
if (event.key === 'ArrowLeft') currentRotationY -= rotationStep;
if (event.key === 'ArrowRight') currentRotationY += rotationStep;

ghostModel.rotation.y = currentRotationY;
}

function onMouseMove(event) {
  // Only handle ghost model in place mode
  if (currentMode === 'place' && ghostModel) {
      const mouse = getRelativeMouse(event);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([baseplate]);
      if (intersects.length > 0) {
          ghostModel.position.copy(intersects[0].point);
          ghostModel.position.y += 0.01;
          ghostModel.visible = true;
      } else {
          ghostModel.visible = false;
      }
  }
}
function onMouseDown(event) {
  if (currentMode === 'move') {
      isDragging = true;
      previousMousePosition = {
          x: event.clientX,
          y: event.clientY
      };
      renderer.domElement.style.cursor = 'grabbing';
  }
}
function onMouseUp() {
  isDragging = false;
  if (currentMode === 'move') {
      renderer.domElement.style.cursor = 'move';
  }
}

function onLeftClick(event) {
  const mouse = getRelativeMouse(event);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  switch (currentMode) {
      case 'place':
          // Handle placing objects
          if (!ghostModel) return;
          const placeIntersects = raycaster.intersectObjects([baseplate]);
          if (placeIntersects.length > 0) {
              createPlant(document.getElementById('plantSelect').value, placeIntersects[0].point);
          }
          break;

      case 'delete':
          // Handle deletion
          const meshesToTest = [];
          placedObjects.forEach(object => {
              object.traverse((child) => {
                  if (child.isMesh) {
                      meshesToTest.push(child);
                  }
              });
          });

          const deleteIntersects = raycaster.intersectObjects(meshesToTest, false);
          if (deleteIntersects.length > 0) {
              let objectToDelete = deleteIntersects[0].object;
              
              // Find the root object (the one in placedObjects array)
              while (objectToDelete.parent && !placedObjects.includes(objectToDelete)) {
                  objectToDelete = objectToDelete.parent;
              }

              if (placedObjects.includes(objectToDelete)) {
                  const objectIndex = placedObjects.indexOf(objectToDelete);
                  scene.remove(objectToDelete);
                  placedObjects.splice(objectIndex, 1);
              }
          }
          break;

      case 'move':
          // This is handled by OrbitControls pan
          break;

      case 'rotate3d':
          // This is handled by OrbitControls rotate
          break;
  }
}

// function onRightClick(event) {
//   if (currentMode !== 'delete') return;
//   event.preventDefault();

//   const mouse = getRelativeMouse(event);
//   const raycaster = new THREE.Raycaster();
//   raycaster.setFromCamera(mouse, camera);

//   // Get all meshes from placed objects for intersection testing
//   const meshesToTest = [];
//   placedObjects.forEach(object => {
//       object.traverse((child) => {
//           if (child.isMesh) {
//               meshesToTest.push(child);
//           }
//       });
//   });

//   const intersects = raycaster.intersectObjects(meshesToTest, false);
//   if (intersects.length > 0) {
//       let objectToDelete = intersects[0].object;
      
//       // Find the root object (the one in placedObjects array)
//       while (objectToDelete.parent && !placedObjects.includes(objectToDelete)) {
//           objectToDelete = objectToDelete.parent;
//       }

//       if (placedObjects.includes(objectToDelete)) {
//           const objectIndex = placedObjects.indexOf(objectToDelete);
//           scene.remove(objectToDelete);
//           placedObjects.splice(objectIndex, 1);
//       }
//   }
// }

function createPlant(type, position) {
    const modelInfo = modelsData[type];
    if (!modelInfo) return;

    loader.load(modelInfo.path, (gltf) => {
        const plant = gltf.scene;

        const boundingBox = new THREE.Box3().setFromObject(plant);
        const modelHeight = boundingBox.max.y - boundingBox.min.y;
        const scaleFactor = modelInfo.realHeight / modelHeight;
        plant.scale.set(scaleFactor, scaleFactor, scaleFactor);

        plant.position.copy(position);
        plant.rotation.y = currentRotationY;

        plant.userData.modelType = type;

        scene.add(plant);
        placedObjects.push(plant);
    });
}


function toggleViewMode() {
isPlantingMode = !isPlantingMode;
controls.enabled = !isPlantingMode;

if (ghostModel) ghostModel.visible = isPlantingMode;
document.getElementById('toggleView').textContent = isPlantingMode ? 'Switch to View Mode' : 'Switch to Planting Mode';
}

function exportGardenArrangement() {
    // Gather data for each placed object
    const arrangementData = placedObjects.map((object) => {
        const modelType = object.userData.modelType; // Store model type in userData when placing
        return {
            modelType,
            position: {
                x: object.position.x,
                y: object.position.y,
                z: object.position.z,
            },
            rotationY: object.rotation.y
        };
    });

    // Convert the data to JSON format
    const jsonData = JSON.stringify(arrangementData, null, 2);

    // Create a downloadable blob from JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'garden-arrangement.json';
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
}

function importGardenArrangement(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const arrangementData = JSON.parse(e.target.result);
            loadGardenArrangement(arrangementData);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Invalid file format. Please upload a valid garden arrangement JSON.");
        }
    };
    reader.readAsText(file);
}

function loadGardenArrangement(arrangementData) {
    // Clear existing objects before loading new arrangement
    placedObjects.forEach((object) => scene.remove(object));
    placedObjects.length = 0;

    // Iterate over each object in the JSON data and recreate it in the scene
    arrangementData.forEach((data) => {
        const { modelType, position, rotationY } = data;
        
        // Load the model and set its position and rotation as per the saved data
        loader.load(modelsData[modelType].path, (gltf) => {
            const plant = gltf.scene;

            // Apply scaling based on the original model's real height
            const modelInfo = modelsData[modelType];
            const boundingBox = new THREE.Box3().setFromObject(plant);
            const modelHeight = boundingBox.max.y - boundingBox.min.y;
            const scaleFactor = modelInfo.realHeight / modelHeight;
            plant.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Set position and rotation from the imported data
            plant.position.set(position.x, position.y, position.z);
            plant.rotation.y = rotationY;

            // Store model type in userData for export
            plant.userData.modelType = modelType;

            // Add the plant to the scene and to placedObjects array
            scene.add(plant);
            placedObjects.push(plant);
        });
    });
}

function backButtonWorkPls() {
window.location.replace("../index.html");
}

function render() {
controls.update();
renderer.render(scene, camera);
}

init();