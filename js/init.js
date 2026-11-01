import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export let controls;

// Наш массив для хранения материалов футболки (чтобы менять цвет)
export let jerseyMaterials = [];

export function initBase() {
    scene.background = new THREE.Color(0xdddddd); 
    camera.position.set(0, 0, 5); 

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;

    setupLighting();
    setupFloor();

    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement); 
    }
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 5);
    
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
}

function setupFloor() {
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2; 
    floor.receiveShadow = true;
    scene.add(floor);
}