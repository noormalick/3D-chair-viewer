import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 📌 Scene & Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 📌 Lighting
const light = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 📌 Orbit Controls for Zoom & Rotation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;

// 📌 Load 3D Model
const loader = new GLTFLoader();
let chairModel = null;

loader.load(
  "./models/CHAIR.glb",
  function (gltf) {
    console.log("✅ Model Loaded:", gltf.scene);
    chairModel = gltf.scene;

    // ✅ Adjust Position & Scale
    chairModel.scale.set(3, 3, 3);
    chairModel.position.set(0, -0.5, 0); // Moved Up

    scene.add(chairModel);
    chairModel.traverse((child) => {
      if (child.isMesh) {
        console.log("✅ Mesh Found:", child);
      }
    });
  },
  undefined,
  function (error) {
    console.error("❌ Error loading the model:", error);
  }
);

// 📌 Camera Position (Fix Zoom)
camera.position.set(0, 1.5, 6); // Adjusted height slightly
camera.lookAt(0, 0, 0);

// 📌 Render Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 📌 Handle Window Resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// 📌 Change Color Function
export function changeColor(color) {
  if (chairModel) {
    chairModel.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(color);
      }
    });
  } else {
    console.warn("⏳ Model not loaded yet!");
  }
}
window.changeColor = changeColor;
